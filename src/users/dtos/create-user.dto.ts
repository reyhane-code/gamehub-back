import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsNotEmpty,
  MinLength
} from 'src/custom-validator'

export class CreateUserDto {

  @Expose()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string

  @Expose()
  @IsString()
  @IsOptional()
  @MinLength(3)
  username?: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
  }

}