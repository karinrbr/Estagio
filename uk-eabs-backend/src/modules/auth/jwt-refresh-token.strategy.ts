import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
// import TokenPayload from './tokenPayload.interface';
import { UserService } from '../../modules/user/user.service';
import { PasswordService } from './password.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, token: any) {
    const refreshToken = req.cookies?.Refresh;
    const { sub, iat, exp, iss, jti } = token;

    // const hashToken = await this.passwordService.getHash();
    // const user = await this.userService.fetchUser(sub);

    if (iss !== this.configService.get('MICROSERVICE_IDENTIFIER')) return null;
    // return { tokenId: jti, userId: sub };

    return this.userService.getUserIfRefreshTokenMatches(refreshToken, sub);
  }
}
