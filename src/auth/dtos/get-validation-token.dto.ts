import { Expose } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from "src/custom-validator";

const phoneReg = new RegExp(
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
);

export class GetValidationTokenDto {

  @Expose()
  @Matches(phoneReg)
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
