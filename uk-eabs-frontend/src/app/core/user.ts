import { UserRole } from '../auth/session.service';

export interface User {
  id?: string;
  role?: UserRole;

  name?: string;
  email?: string;
  birthdate?: null;
  phone?: string;
  address?: string;

  vatNumber?: string;

  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
