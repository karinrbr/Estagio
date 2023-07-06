import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PostgresModule } from './shared/infra/postgres/postgres.module';
import { UserModule } from './modules/user/user.module';
import { BoardModule } from './modules/board/board.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import ConfigAuth from './config/authentication';
import { InvoiceModule } from './modules/invoice/invoice.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [ConfigAuth],
    }),
    PostgresModule,
    AuthModule,
    UserModule,
    BoardModule,
    ScheduleModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
