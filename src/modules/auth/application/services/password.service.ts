import AppError from '../../../../common/errors/app.error';
import type { IActivityRecorder } from '../../../../common/domain/interfaces/activity-recorder.interface';
import type { IAppConfig } from '../../../../common/domain/interfaces/app-config.interface';
import type { ICacheStore } from '../../../../common/domain/interfaces/cache-store.interface';
import type { IEmailSender } from '../../../../common/domain/interfaces/email-sender.interface';
import type { ILogger } from '../../../../common/domain/interfaces/logger.interface';
import type { IPasswordHasher } from '../../../../common/domain/interfaces/password-hasher.interface';
import type { IUnitOfWork } from '../../../../common/domain/interfaces/unit-of-work.interface';
import type { IAuthSecurityRepository } from '../../domain/repositories/auth-security.repository.interface';
import type { IAuthUserRepository } from '../../domain/repositories/auth-user.repository.interface';
import type { IEmailHistoryRepository } from '../../domain/repositories/email-history.repository.interface';
import type { ILoginResponse } from '../../interfaces/auth.interface';
import { AUTH_POLICY } from '../policies/auth.policy';
import { AuthUtilsService } from './auth-utils.service';
import { TokenService } from './token.service';

type RequestMeta = {
  ip: string;
  userAgent: string;
  device?: string;
  requestId?: string;
};

type PasswordResetData = {
  code: string;
  userId: string;
  email: string;
  expiresAt: string;
};

type PasswordResetGrant = {
  userId: string;
  email: string;
  createdAt: string;
};

export class PasswordService {
  constructor(
    private readonly authUtilsService: AuthUtilsService,
    private readonly activityRecorder: IActivityRecorder,
    private readonly appConfig: IAppConfig,
    private readonly customLogger: ILogger,
    private readonly cacheStore: ICacheStore,
    private readonly emailSender: IEmailSender,
    private readonly passwordHasher: IPasswordHasher,
    private readonly authUserRepo: IAuthUserRepository,
    private readonly authSecurityRepo: IAuthSecurityRepository,
    private readonly emailHistoryRepo: IEmailHistoryRepository,
    private readonly unitOfWork: IUnitOfWork,
    private readonly tokenService: TokenService,
  ) {}

  async forgotPassword(
    email: string,
    meta: RequestMeta,
  ): Promise<{ message: string }> {
    const normalizedEmail = email.toLowerCase();
    const { PASSWORD_RESET_MAX_ATTEMPTS, PASSWORD_RESET_WINDOW_MS } =
      AUTH_POLICY.RATE_LIMIT;

    await Promise.all([
      this.authUtilsService.checkRateLimit(
        `forgot-password:email:${normalizedEmail}`,
        PASSWORD_RESET_MAX_ATTEMPTS,
        PASSWORD_RESET_WINDOW_MS,
      ),
      this.authUtilsService.checkRateLimit(
        `forgot-password:ip:${meta.ip}`,
        PASSWORD_RESET_MAX_ATTEMPTS,
        PASSWORD_RESET_WINDOW_MS,
      ),
    ]);

    const genericMessage =
      'If an account exists for this email, a password reset OTP has been sent.';
    const user = await this.authUserRepo.findByEmail(normalizedEmail);

    if (!user || user.provider !== 'local' || user.status !== 'ACTIVE') {
      return { message: genericMessage };
    }

    const resetCode = this.authUtilsService.generateVerificationCode();
    const expiresAt = new Date(
      Date.now() +
        this.authUtilsService.parseExpiryToSeconds(
          AUTH_POLICY.TOKEN_EXPIRY.PASSWORD_RESET,
        ) *
          1000,
    );
    const ttlSeconds = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
    const resetKey = this.passwordResetKey(normalizedEmail);

    await this.cacheStore.set<PasswordResetData>(
      resetKey,
      {
        code: resetCode,
        userId: user.id as string,
        email: normalizedEmail,
        expiresAt: expiresAt.toISOString(),
      },
      ttlSeconds,
    );

    await this.emailHistoryRepo.create({
      authId: user.id as string,
      emailTo: normalizedEmail,
      emailType: 'password_reset',
      subject: 'Reset your password',
      messageId: `password-reset-${user.id}-${Date.now()}`,
      emailStatus: 'pending',
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
    });

    try {
      await this.emailSender.sendPasswordResetEmail(
        normalizedEmail,
        user.username,
        resetCode,
        user.id as string,
      );
    } catch (error) {
      this.customLogger.error(
        `Failed to queue password reset email for ${normalizedEmail}`,
        error instanceof Error ? error.stack : undefined,
        'PasswordService',
      );
      await this.emailHistoryRepo.updateStatusByAuth(
        user.id as string,
        'password_reset',
        'pending',
        'failed',
        error instanceof Error ? error.message : 'Failed to queue email',
      );
    }

    return { message: genericMessage };
  }

  async resendPasswordResetOtp(
    email: string,
    meta: RequestMeta,
  ): Promise<{ message: string }> {
    return this.forgotPassword(email, meta);
  }

  async verifyPasswordResetOtp(
    email: string,
    code: string,
    meta: RequestMeta,
  ): Promise<{ message: string; resetToken: string }> {
    const normalizedEmail = email.toLowerCase();

    await this.authUtilsService.checkRateLimit(
      `verify-password-reset:${normalizedEmail}`,
      5,
      15 * 60 * 1000,
    );

    const resetKey = this.passwordResetKey(normalizedEmail);
    const resetData = await this.cacheStore.get<PasswordResetData>(resetKey);

    if (!resetData || resetData.code !== code) {
      throw AppError.badRequest('Invalid or expired OTP');
    }

    const user = await this.authUserRepo.findByEmail(normalizedEmail);

    if (!user || user.id !== resetData.userId || user.provider !== 'local') {
      throw AppError.badRequest('Invalid or expired OTP');
    }

    const resetToken = this.authUtilsService.generateSecureId();
    const grantKey = this.passwordResetGrantKey(resetToken);
    await this.cacheStore.set<PasswordResetGrant>(
      grantKey,
      {
        userId: user.id,
        email: normalizedEmail,
        createdAt: new Date().toISOString(),
      },
      10 * 60,
    );
    await this.cacheStore.del(resetKey);

    this.customLogger.log(
      `Password reset OTP verified for ${normalizedEmail} from ${meta.ip}`,
      'PasswordService',
    );

    return {
      message: 'OTP verified successfully',
      resetToken,
    };
  }

  async changePassword(
    payload: {
      currentPassword?: string;
      resetToken?: string;
      newPassword: string;
    },
    meta: RequestMeta,
    authenticatedUserId?: string,
  ): Promise<{ message: string; data: ILoginResponse }> {
    if (!this.authUtilsService.validatePassword(payload.newPassword)) {
      throw AppError.badRequest('Password does not meet security requirements');
    }

    const user = payload.resetToken
      ? await this.getUserFromResetToken(payload.resetToken)
      : await this.getUserFromCurrentPasswordFlow(
          authenticatedUserId,
          payload.currentPassword,
        );

    if (user.provider !== 'local') {
      throw AppError.badRequest(
        `Password changes are not available for ${user.provider} accounts`,
      );
    }

    const hashedPassword = await this.passwordHasher.hash(
      payload.newPassword,
      12,
    );

    await this.unitOfWork.execute(async (ctx) => {
      await this.authUserRepo.updatePassword(
        user.id as string,
        hashedPassword,
        ctx,
      );
      await this.authSecurityRepo.updateLastPasswordChange(
        user.id as string,
        new Date(),
        ctx,
      );
      await this.activityRecorder.logCustomEvent(
        'authUser',
        user.id as string,
        'password_change',
        {
          ip: meta.ip,
          userAgent: meta.userAgent,
          actionedBy: user.id as string,
          device: meta.device,
          requestId: meta.requestId,
        },
        [],
        ctx,
      );
    });

    await this.tokenService.revokeAllUserTokens(user.id as string);

    if (payload.resetToken) {
      await this.cacheStore.del(this.passwordResetGrantKey(payload.resetToken));
    }

    const updatedUser = await this.authUserRepo.findByIdSelect(
      user.id as string,
      {
        email: true,
        username: true,
        role: true,
        status: true,
        tokenVersion: true,
      },
    );

    if (!updatedUser || updatedUser.status !== 'ACTIVE') {
      throw AppError.unauthorized('User account is not active');
    }

    const session = await this.tokenService.createSession(
      {
        id: user.id as string,
        email: updatedUser.email as string,
        username: updatedUser.username as string,
        role: updatedUser.role,
        tokenVersion: updatedUser.tokenVersion ?? 0,
      },
      { ip: meta.ip, userAgent: meta.userAgent, device: meta.device },
    );

    return { message: 'Password changed successfully', data: session };
  }

  private async getUserFromResetToken(resetToken: string) {
    const grant = await this.cacheStore.get<PasswordResetGrant>(
      this.passwordResetGrantKey(resetToken),
    );

    if (!grant) {
      throw AppError.badRequest('Invalid or expired reset token');
    }

    const user = await this.authUserRepo.findById(grant.userId);

    if (!user || user.email !== grant.email || user.status !== 'ACTIVE') {
      throw AppError.badRequest('Invalid or expired reset token');
    }

    return user;
  }

  private async getUserFromCurrentPasswordFlow(
    authenticatedUserId?: string,
    currentPassword?: string,
  ) {
    if (!authenticatedUserId || !currentPassword) {
      throw AppError.unauthorized(
        'Current password or reset token is required',
      );
    }

    const user = await this.authUserRepo.findById(authenticatedUserId);

    if (!user || user.status !== 'ACTIVE') {
      throw AppError.unauthorized('User account is not active');
    }

    const isPasswordValid = await this.passwordHasher.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw AppError.unauthorized('Current password is incorrect');
    }

    return user;
  }

  private passwordResetKey(email: string): string {
    return `${this.appConfig.redis_cache_key_prefix}:${AUTH_POLICY.CACHE_PREFIXES.PASSWORD_RESET_TOKEN}:${email}`;
  }

  private passwordResetGrantKey(resetToken: string): string {
    return `${this.appConfig.redis_cache_key_prefix}:${AUTH_POLICY.CACHE_PREFIXES.PASSWORD_RESET_TOKEN}:grant:${this.authUtilsService.hashToken(resetToken)}`;
  }
}
