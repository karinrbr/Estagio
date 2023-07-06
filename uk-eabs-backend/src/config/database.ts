import * as dotenv from "dotenv";

dotenv.config();

export default () => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: process.env.POSTGRES_SYNCHRONIZE == 'true',
  dropSchema: process.env.POSTGRES_DROP_SCHEMA == 'true',
  logging: process.env.POSTGRES_LOGGING == 'true',
  entities: [
    // __dirname + '/src/**/*.entity.ts',
    // __dirname + '/dist/**/*.entity{.ts,.js}',
    __dirname + '/../**/*.entity{.ts,.js}',
  ],
  migrations: ['migrations/**/*.ts'],
  subscribers: ['subscriber/**/*.ts', 'dist/subscriber/**/.js'],
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'migrations',
    subscribersDir: 'subscriber',
  },
});
