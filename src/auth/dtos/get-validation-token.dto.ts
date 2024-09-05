import { Expose } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from "src/custom-validator";


export class GetValidationTokenDto {

  @Expose()
  @Matches(/^09[0|1|2|3][0-9]{8}$/)
  @IsString()
  @IsNotEmpty()
  phone: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  forceSendSms?: boolean;

  @Expose()
  @IsNumber()
  @IsOptional()
  tryNumber?: number;

  constructor(partial: Partial<GetValidationTokenDto>) {
    Object.assign(this, partial);
  }
}
