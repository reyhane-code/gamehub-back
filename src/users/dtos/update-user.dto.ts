import { Expose } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  IsNumber,
} from '../../custom-validator';

export class UpdateUserDto {
  @Expose()
  @IsString()
  @IsOptional()
  username?: string;

  @Expose()
  @IsString()
  @IsOptional()
  @MinLength(2)
  first_name?: string;

  @Expose()
  @IsString()
  @IsOptional()
  @MinLength(2)
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
