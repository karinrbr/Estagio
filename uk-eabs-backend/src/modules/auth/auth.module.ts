import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PasswordService } from './password.service';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { JwtAccessTokenStrategy } from './jwt-access-token.strategy';
import { JwtResetPasswordTokenStrategy } from './jwt-reset-password-token';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET_KEY'),
        signOptions: {
          algorithm: 'HS512',
          expiresIn: parseInt(config.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')),
          issuer: config.get('MICROSERVICE_IDENTIFIER'),
        },
      }),
    }),
    ConfigModule,
    UserModule,
  ],
  providers: [
    AuthService,
    PasswordService,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    JwtResetPasswordTokenStrategy,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
