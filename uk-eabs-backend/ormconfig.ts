import * as _ from 'lodash';
import { DataSource } from 'typeorm';
import Database from 'src/config/database';

let connectionOptions = _.assign({}, Database(), { port: 5432 });

console.log(connectionOptions)

export const connectionSource = new DataSource({
  migrationsTableName: 'migrations',
  type: 'postgres',
  host: connectionOptions.host,
  port: connectionOptions.port,
  username: connectionOptions.username,
  password: connectionOptions.password,
  database: connectionOptions.database,
  logging: connectionOptions.logging,
  synchronize: connectionOptions.synchronize,
  name: 'default',
  entities: connectionOptions.entities,
  migrations: connectionOptions.migrations,
  subscribers: connectionOptions.subscribers,
});
