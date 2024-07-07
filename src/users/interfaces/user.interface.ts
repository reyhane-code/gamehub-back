export interface UserInterface {
  id: number;
  email: string;
  username?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
