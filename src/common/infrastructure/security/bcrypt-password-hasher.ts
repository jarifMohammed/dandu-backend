import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IPasswordHasher } from '../../domain/interfaces/password-hasher.interface';

@Injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
  hash(plainText: string, saltRounds = 12): Promise<string> {
    return bcrypt.hash(plainText, saltRounds);
  }

  compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
