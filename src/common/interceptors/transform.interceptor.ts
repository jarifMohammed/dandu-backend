import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { map, Observable, tap } from 'rxjs';
import { Logger } from 'winston';

type ResponseMeta = {
  timestamp: string;
  path: string;
  method: string;
  requestId?: string;
};

type TransformedResponse = {
  success: true;
  statusCode: number;
  message: string;
  data: unknown;
  meta: ResponseMeta;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  T | TransformedResponse
> {
  private readonly defaultMessage = 'Success';
  private readonly defaultStatusCode = 200;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T | TransformedResponse> {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.url;
    const method = request.method;
    const startTime = Date.now();

    // Skip transformation for metrics endpoint (needs raw Prometheus format)
    if (path === '/metrics' || path.startsWith('/metrics?')) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.info('Request processed', {
          context: 'TransformInterceptor',
          method,
          path,
          duration,
        });
      }),
      map((data) => {
        const response = context.switchToHttp().getResponse<Response>();

        const statusCode = response.statusCode ?? this.defaultStatusCode;
        const requestId =
          request.headers?.['x-request-id'] ??
          request.headers?.['x-correlation-id'];
        const message = this.resolveMessage(data);
        const payload = this.resolveData(data);

        return {
          success: true,
          statusCode,
          message,
          data: payload,
          meta: {
            timestamp: new Date().toISOString(),
            path,
            method,
            requestId: Array.isArray(requestId) ? requestId[0] : requestId,
          },
        };
      }),
    );
  }

  private resolveMessage(data: unknown): string {
    if (
      isRecord(data) &&
      'message' in data &&
      typeof data.message === 'string'
    ) {
      return data.message;
    }

    return this.defaultMessage;
  }

  private resolveData(data: unknown): unknown {
    if (data === undefined) {
      return null;
    }

    if (!isRecord(data)) {
      return data;
    }

    if ('data' in data) {
      return data.data ?? null;
    }

    const payload = Object.fromEntries(
      Object.entries(data).filter(
        ([key]) => key !== 'message' && key !== 'success',
      ),
    );

    return Object.keys(payload).length > 0 ? payload : null;
  }
}
