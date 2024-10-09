import { Expose, Transform } from 'class-transformer';
import { Role } from 'src/enums/database.enum';

export class UserDataDto {

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  phone: string;

  @Expose()
  active: boolean

  @Expose()
  role: Role
}

