import { User } from './user.entity';

export enum Role {
  administrator = 'dss-admin',
  agent = 'dss-agent',
  company = 'dss-company',
}

export enum Status {
  approved = 'approved',
  pending = 'pending',
  rejected = 'rejected',
}
