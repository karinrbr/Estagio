import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PasswordService } from '../auth/password.service';
import { CaslModule } from '../../shared/policies/casl.module';
import { MulterModule } from '@nestjs/platform-express';
import { UserImage } from './user-image.file.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserImage]), CaslModule, MulterModule, ConfigModule],
  controllers: [UserController],
  providers: [
    UserService,
    PasswordService,
    // FirestoreService,
  ],
  exports: [UserService],
})
export class UserModule {}
