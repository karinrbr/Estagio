import { Controller, Request, Get, Body, Post, UseGuards, HttpCode, UsePipes, HttpStatus, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiProperty,
  ApiCookieAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { JoiValidationPipe } from '../../shared/infra/postgres/joi.pipe';
import { userChangePasswordSchema, userEmailSchema, userPasswordSchema } from '../user/user.schema';
import * as _ from 'lodash';

class ResetPasswordSendEmailDTO {
  @ApiProperty({ example: 'john@doe.com' })
  email: string;
}

class ResetPasswordValidateDTO {
  @ApiProperty({ example: 'secret' })
  password: string;
}

class changePasswordDTO {
  @ApiProperty({ example: 'secret' })
  currentPassword: string;

  @ApiProperty({ example: 'secret' })
  newPassword: string;
}

class LoginDTO {
  @ApiProperty({ example: 'john@doe.com' })
  username: string;

  @ApiProperty({ example: 'secret' })
  password: string;
}

@ApiTags('Authentication')
@Controller('api/v0/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(200)
  async login(@Request() req, @Body() body: LoginDTO): Promise<User> {
    const { accessToken, refreshToken, accessTokenCookie, refreshTokenCookie, user } = await this.authService.login(
      body,
    );
    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    return this.authService.setCurrentRefreshToken(user.id, refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  async logout(@Request() req): Promise<void> {
    const { accessTokenCookie, refreshTokenCookie } = await this.authService.logout();
    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
    return;
  }

  @UseGuards(AuthGuard('jwt-access-token'))
  @Post('change-password')
  @HttpCode(200)
  @UsePipes(new JoiValidationPipe(userChangePasswordSchema))
  async changePassword(@Request() req, @Body() body: changePasswordDTO): Promise<User> {
    return await this.authService.changePassword(req.user.id, body.currentPassword, body.newPassword);
  }

  //   @Post('reset-password/send-email')
  //   @HttpCode(200)
  //   @ApiOkResponse({ description: 'Recover password email send sucessfully.' })
  //   @ApiNotFoundResponse({ description: 'The user does not exist.' })
  //   @UsePipes(new JoiValidationPipe(userEmailSchema))
  //   async resetPasswordSendEmail(@Body() body: ResetPasswordSendEmailDTO): Promise<void> {
  //     await this.authService.sendResetPasswordEmail(body.email);
  //     return;
  //   }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt-reset-password-token'))
  @Post('reset-password/validate')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Recover password email send sucessfully.' })
  @ApiNotFoundResponse({ description: 'The user does not exist.' })
  @UsePipes(new JoiValidationPipe(userPasswordSchema))
  async resetPasswordValidate(@Request() req, @Body() body: ResetPasswordValidateDTO): Promise<any> {
    return await this.userService.changePassword(req.user.id, body.password);
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard('jwt-refresh-token'))
  @Get('jwt/refresh')
  async refresh(@Request() req): Promise<User> {
    const accessToken = await this.authService.generateAccessToken(req.user.id, {});
    req.res.setHeader('Set-Cookie', accessToken.cookie);
    return req.user;
  }

  @ApiCookieAuth()
  @UseGuards(AuthGuard('jwt-access-token'))
  @Get('jwt/me')
  async fetchLocalUser(@Request() req): Promise<User> {
    return await this.userService.fetchUser(req.user.id, { relations: [] });
  }

  //   @Get('facebook')
  //   @UseGuards(AuthGuard('facebook'))
  //   async facebookLogin(): Promise<any> {
  //     return HttpStatus.OK;
  //   }

  //   @ApiOkResponse({ description: 'OAuth Facebook login sucessfull.' })
  //   @ApiCreatedResponse({ description: 'OAuth Facebook register sucessfull.' })
  //   @Post('facebook/redirect')
  //   @UseGuards(AuthGuard('facebook'))
  //   async facebookLoginRedirect(@Request() req): Promise<User> {
  //     const { accessToken, refreshToken, accessTokenCookie, refreshTokenCookie, user, newUser } =
  //       await this.authService.loginFacebook(req.user);
  //     req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

  //     const response = await this.authService.setCurrentRefreshToken(user.id, refreshToken);

  //     if (newUser || !user.role) {
  //       req.res.status(HttpStatus.CREATED);
  //     } else {
  //       req.res.status(HttpStatus.OK);
  //     }
  //     return response;
  //   }

  //   @Get('linkedin')
  //   @UseGuards(AuthGuard('linkedin'))
  //   async linkedinLogin(): Promise<any> {
  //     return HttpStatus.OK;
  //   }

  //   @ApiOkResponse({ description: 'OAuth Linkedin login sucessfull.' })
  //   @ApiCreatedResponse({ description: 'OAuth Linkedin register sucessfull.' })
  //   @Get('linkedin/redirect')
  //   @UseGuards(AuthGuard('linkedin'))
  //   async linkedinLoginRedirect(@Request() req): Promise<User> {
  //     const { accessToken, refreshToken, accessTokenCookie, refreshTokenCookie, user, newUser } =
  //       await this.authService.loginLinkedin(req.user);
  //     req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

  //     const response = await this.authService.setCurrentRefreshToken(user.id, refreshToken);

  //     if (newUser || !user.role) {
  //       req.res.status(HttpStatus.CREATED);
  //     } else {
  //       req.res.status(HttpStatus.OK);
  //     }
  //     return response;
  //   }
}
