import { Expose, Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
} from '../../custom-validator';
import { Role } from 'src/enums/database.enum';

export class AdminUpdateUserDto {
  @Expose()
  @IsString()
  @IsOptional()
  username?: string;

  @Expose()
  @IsString()
  @IsOptional()
  first_name?: string;

  @Expose()
  @IsString()
  @IsOptional()
  last_name?: string;

  @Expose()
  @IsOptional()
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : undefined))
  @IsBoolean()
  active?: boolean

  @Expose()
  @IsString()
  @IsOptional()
  role?: Role;


  constructor(partial: Partial<AdminUpdateUserDto>) {
    Object.assign(this, partial);
  }
}
