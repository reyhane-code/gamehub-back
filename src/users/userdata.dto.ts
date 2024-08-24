import { Exclude, Expose, Type } from 'class-transformer';
import { PaginationData, PaginationDto } from 'src/helpers/dto/pagination.dto';

export class UserResponseDto {
  @Expose()
  id: number | string;

  @Expose()
  username: string;

  @Exclude() // This property will be excluded from the response
  password: string;

  @Expose()
  email: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  active: boolean;

  @Expose()
  role: string;
}
export class UserPaginationResponseDto extends PaginationDto {
  @Expose()
  @Type(() => UserResponseDto)
  items: UserResponseDto[];
}
