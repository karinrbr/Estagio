import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private saltRounds = 15;

  async getHash(password?: string): Promise<string> {
    if (!password) return null;
    const salt = await bcrypt.genSalt(this.saltRounds);
    if (!salt) return null;
    return bcrypt.hash(password, salt);
  }

  async compareHash(passwordAlice: string | undefined, passwordBob: string | undefined): Promise<boolean> {
    if (!passwordAlice || !passwordBob) {
      return false;
    }
    return await bcrypt.compare(passwordAlice, passwordBob);
  }

  async stallTime(): Promise<string> {
    const nonce = await this.getNonce();
    return this.getHash(nonce);
  }

  private nonceSize = 20;
  private nonceSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  async *nonceGenerator() {
    for (let i = 0; i < this.nonceSize; i++) {
      yield this.nonceSet.charAt(Math.floor(Math.random() * this.nonceSet.length));
    }
  }

  async getNonce(): Promise<string> {
    let result = '';
    for await (const value of this.nonceGenerator()) {
      result += value;
    }
    return result;
  }
}
