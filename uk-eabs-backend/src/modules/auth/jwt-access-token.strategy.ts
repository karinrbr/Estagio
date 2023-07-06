import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
// import TokenPayload from './tokenPayload.interface';
import { UserService } from '../../modules/user/user.service';
import { PasswordService } from './password.service';
import { User } from '../../modules/user/user.entity';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access-token') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      passReqToCallback: false,
    });
  }

  async validate(token: any): Promise<User> {
    const { sub, iat, exp, iss, jti } = token;

    if (iss !== this.configService.get('MICROSERVICE_IDENTIFIER')) return null;
    // return { tokenId: jti, userId: sub };

    return this.userService.fetchUser(sub);
  }
}
