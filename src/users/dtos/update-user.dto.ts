import { Expose } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEmail
} from '../../custom-validator';

export class UpdateUserDto {
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
  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  constructor(partial: Partial<UpdateUserDto>) {
    Object.assign(this, partial);
  }
}
