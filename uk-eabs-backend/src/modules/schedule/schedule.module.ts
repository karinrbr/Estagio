import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { CaslModule } from 'src/shared/policies/casl.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './schedule.entity';
import { UserModule } from '../user/user.module';
import { BoardModule } from '../board/board.module';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule]), ConfigModule, CaslModule, UserModule, BoardModule],
  providers: [ScheduleService],
  controllers: [ScheduleController]
})
export class ScheduleModule {}
