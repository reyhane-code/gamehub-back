import { Expose, Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
} from '../../custom-validator';
import { Role } from 'src/enums/database.enum';

export class AdminCreateUserDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @Expose()
  @IsString()
  @IsOptional()
  username?: string;

  @Expose()
  @IsOptional()
  @IsEmail()
  @IsString()
  email?: string

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


  constructor(partial: Partial<AdminCreateUserDto>) {
    Object.assign(this, partial);
  }
}
