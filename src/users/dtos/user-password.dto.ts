import { Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'src/custom-validator';

export class UserPasswordDto {

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
  
  @Expose()
  @IsString()
  @MinLength(6)
  @IsOptional()
  oldPassword?: string;

  constructor(partial: Partial<UserPasswordDto>) {
    Object.assign(this, partial);
  }
}
