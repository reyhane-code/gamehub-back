import { Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  ValidateIf,
  MinLength,
  IsEmail,
} from 'src/custom-validator';

export class LoginWithPasswordDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @Expose()
  @ValidateIf((object) => !object.username && !object.email)
  @IsNotEmpty()
  @IsString()
  phone?: string;

  @Expose()
  @ValidateIf((object) => !object.phone && !object.email)
  @IsNotEmpty()
  @IsString()
  username?: string;

  @Expose()
  @ValidateIf((object) => !object.phone && !object.username)
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email?: string;

  constructor(partial: Partial<LoginWithPasswordDto>) {
    Object.assign(this, partial);
  }
}
