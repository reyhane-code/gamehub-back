import { Role } from 'src/enums/database.enum';

export interface IUser {
  id: number;
  email: string;
  username?: string;
  phone?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
