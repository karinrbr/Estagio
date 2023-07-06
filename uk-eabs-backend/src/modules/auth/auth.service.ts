/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { User } from '../user/user.entity';
import { ConfigService } from '@nestjs/config';
import { Role } from '../user/user.constant';

interface UserLoginDTO {
  accessToken: string;
  accessTokenCookie: string;
  refreshToken: string;
  refreshTokenCookie: string;
  user: User;
}

interface UserCookie {
  token: string;
  cookie: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    await this.passwordService.stallTime();
    const user = await this.userService.fetchUserByEmail(email);
    if (!(user instanceof NotFoundException)) {
      const isValid = await this.passwordService.compareHash(password, user.password);
      return isValid ? user : null;
    }
    return null;
  }

  //   async loginFacebook(req: any): Promise<UserFacebookLoginDTO> {
  //     const jwtid = await this.passwordService.getNonce();
  //     const { user, newUser } = await this.userService.fetchUserByFacebookId(
  //       req.user?.id,
  //       req.user?.name,
  //       req.user?.email,
  //     );

  //     const access = await this.generateAccessToken(user.id, { jwtid });
  //     const refresh = await this.generateRefreshToken(user.id, { jwtid });

  //     return {
  //       accessToken: access.token,
  //       refreshToken: refresh.token,
  //       accessTokenCookie: access.cookie,
  //       refreshTokenCookie: refresh.cookie,
  //       user,
  //       newUser,
  //     };
  //   }

  //   async loginLinkedin(linkedinUser: any): Promise<UserFacebookLoginDTO> {
  //     const jwtid = await this.passwordService.getNonce();

  //     const { user, newUser } = await this.userService.fetchUserByLinkedinId(
  //       linkedinUser.id,
  //       linkedinUser.displayName,
  //       _.get(linkedinUser, 'emails[0].value', null),
  //     );

  //     const access = await this.generateAccessToken(user.id, { jwtid });
  //     const refresh = await this.generateRefreshToken(user.id, { jwtid });

  //     return {
  //       accessToken: access.token,
  //       refreshToken: refresh.token,
  //       accessTokenCookie: access.cookie,
  //       refreshTokenCookie: refresh.cookie,
  //       user,
  //       newUser,
  //     };
  //   }

  async login(req: any): Promise<UserLoginDTO> {
    const jwtid = await this.passwordService.getNonce();
    const user = await this.userService.fetchUserByEmail(req.username);

    // const token = await this.jwtService.signAsync({ sub: user.id }, { jwtid });

    const access = await this.generateAccessToken(user.id, { jwtid });
    const refresh = await this.generateRefreshToken(user.id, { jwtid });

    return {
      accessToken: access.token,
      refreshToken: refresh.token,
      accessTokenCookie: access.cookie,
      refreshTokenCookie: refresh.cookie,
      user,
    };
  }

  async logout(): Promise<{ accessTokenCookie: string; refreshTokenCookie: string }> {
    return {
      accessTokenCookie: `Authentication=deleted; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
      refreshTokenCookie: `Refresh=deleted; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    };
  }

  async generateAccessToken(userId: string, jwtSignOptions: JwtSignOptions): Promise<UserCookie> {
    const jwt = await this.jwtService.signAsync({ sub: userId }, jwtSignOptions);
    const ttl = this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME');
    return { token: jwt, cookie: `Authentication=${jwt}; HttpOnly; Path=/; Max-Age=${ttl}` };
  }

  async generateRefreshToken(userId: string, jwtSignOptions: JwtSignOptions): Promise<UserCookie> {
    const jwt = await this.jwtService.signAsync(
      { sub: userId },
      Object.assign({}, jwtSignOptions, {
        expiresIn: parseInt(this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')),
      }),
    );
    const ttl = this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
    return { token: jwt, cookie: `Refresh=${jwt}; HttpOnly; Path=/; Max-Age=${ttl}` };
  }

  async setCurrentRefreshToken(userId: string, refreshToken: string): Promise<User> {
    return await this.userService.updateUser(userId, { refreshToken });
  }

  //   async sendResetPasswordEmail(email: string): Promise<boolean> {
  //     const user = await this.userService.fetchUserByEmail(email);

  //     // Generate JWT token
  //     const tokenId = uuidv4();
  //     const jwtOptions = {
  //       expiresIn: 86400, // 24h => 3600 * 24
  //     };
  //     const jwt = await this.jwtService.signAsync({ sub: user.id, jti: tokenId }, jwtOptions);

  //     // Save Reset Password Token into user data model
  //     const userUpdated = await this.userService.updateUser(user.id, { resetPasswordToken: tokenId });

  //     if (!userUpdated || userUpdated.resetPasswordToken !== tokenId) {
  //       throw new BadRequestException('Ocorreu um erro! Por favor, tente novamente mais tarde.');
  //     }

  //     // Generate email
  //     const emailTemplate = _.template(
  //       fs.readFileSync('./static/recover-password.html', { encoding: 'utf8', flag: 'r' }),
  //     );

  //     // Dispatch email
  //     const emailResponse = await this.emailService.sendMail({
  //       to: email,
  //       subject: 'DSS | Recuperação da palavra-passe',
  //       html: emailTemplate({
  //         projectName: 'DSS',
  //         userName: user.name,
  //         actionUrl: `${this.configService.get('SMTP_REDIRECT_DOMAIN')}/reset-password?rp=${jwt}`,
  //       }),
  //     });
  //     console.log(`recoverUserPassword => email: ${email} response: ${JSON.stringify(emailResponse)}`);
  //     return _.isUndefined(emailResponse) ? false : true;
  //   }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.userService.fetchUser(userId, { select: ['id', 'password'] });

    const checkPassword = await this.passwordService.compareHash(oldPassword, user.password);
    if (!checkPassword) {
      throw new ForbiddenException('Ocorreu um erro! Por favor, tente novamente mais tarde.');
    }

    return await this.userService.changePassword(user.id, newPassword);
  }
}
