/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../modules/user/user.service';
import { Request } from 'express';

@Injectable()
export class JwtResetPasswordTokenStrategy extends PassportStrategy(Strategy, 'jwt-reset-password-token') {
  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(token: any) {
    const { sub, iat, exp, iss, jti } = token;
    if (iss !== this.configService.get('MICROSERVICE_IDENTIFIER')) return null;

    const user = await this.userService.fetchUser(sub);
    if (user.resetPasswordToken !== jti) return null;

    return user;
  }
}
