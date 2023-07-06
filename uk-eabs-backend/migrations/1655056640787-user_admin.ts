import { MigrationInterface, QueryRunner } from 'typeorm';
import { connectionSource } from '../ormconfig';

const adminUser = [
  {
    id: 'c88ac485-f823-4418-b1dd-e0e66a9af631',
    createdAt: '2022-05-22T18:02:49.996Z',
    updatedAt: '2022-05-22T18:02:49.996Z',
    name: 'Company Test',
    email: 'company@test.com',
    password: '$2b$11$Y.IS4gltbeL1f/lsr9B2ZO.FB.VRmMN.sv74PTHVs2FS8Q/fQ6z7C',
    role: 'dss-company',
  },
  {
    id: 'c88ac485-f823-4418-b1dd-e0e66a9af745',
    createdAt: '2022-05-23T18:02:49.996Z',
    updatedAt: '2022-05-23T18:02:49.996Z',
    name: 'Agent Test',
    email: 'agent@test.com',
    password: '$2b$11$Y.IS4gltbeL1f/lsr9B2ZO.FB.VRmMN.sv74PTHVs2FS8Q/fQ6z7C',
    role: 'dss-agent',
  },
  {
    id: 'c88ac485-f823-4418-b1dd-e0e66a9af781',
    createdAt: '2022-05-24T18:02:49.996Z',
    updatedAt: '2022-05-24T18:02:49.996Z',
    name: 'Agent Test 2',
    email: 'agent2@test.com',
    password: '$2b$11$Y.IS4gltbeL1f/lsr9B2ZO.FB.VRmMN.sv74PTHVs2FS8Q/fQ6z7C',
    role: 'dss-agent',
  },
];

export class userAdmin1655056640787 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let res = await connectionSource.getRepository('user').save(adminUser);
    return;
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    let res = await connectionSource.getRepository('user').delete(adminUser[0].id);
    return;
  }
}
