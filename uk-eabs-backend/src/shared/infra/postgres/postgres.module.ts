import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Credits to https://wanago.io/2020/05/18/api-nestjs-postgresql-typeorm/
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: 5432,
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        synchronize: configService.get('POSTGRES_SYNCHRONIZE') == 'true',
        dropSchema: configService.get('POSTGRES_DROP_SCHEMA') == 'true',
        logging: configService.get('POSTGRES_LOGGING') == 'true',
        entities: [
          // __dirname + '/src/**/*.entity.ts',
          // __dirname + '/dist/**/*.entity{.ts,.js}',
          // __dirname + '/../**/*.entity{.ts,.js}',
          'dist/**/**/*.entity.js',
        ],
        migrations: [
          // 'migrations/**/*.ts'
          'dist/migration/**/*.js',
        ],
        subscribers: ['subscriber/**/*.ts', 'dist/subscriber/**/.js'],
        cli: {
          entitiesDir: 'src',
          migrationsDir: 'migrations',
          subscribersDir: 'subscriber',
        },
      }),
    }),
  ],
})
export class PostgresModule {}
