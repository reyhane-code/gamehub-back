import { Expose, Transform } from 'class-transformer';

export class UserIdentityDto {

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
  @Transform(({ obj }) => !!obj.password) // Transform based on the presence of password
  hasPassword: boolean;

  @Expose()
  @Transform(({ obj }) => !!obj.username || !!(obj.first_name && obj.last_name)) // Transform based on the presence of username or name
  isInfoCompleted: boolean;
}

