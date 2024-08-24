import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Exclude() // This property will be excluded from the response
  password: string;

  @Expose()
  email: string;
}