import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'src/custom-validator';

export class LoginOrRegisterDto {

  @Expose()
  @IsString()
  @IsNotEmpty()
  code: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  validationToken: string;

  constructor(partial: Partial<LoginOrRegisterDto>) {
    Object.assign(this, partial);
  }

}
