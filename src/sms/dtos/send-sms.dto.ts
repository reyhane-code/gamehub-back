import { IsOptional, IsString, IsNotEmpty } from "src/custom-validator";
import { SmsSenderNumbers } from "../enum/sms.enum";
import { Expose } from "class-transformer";

export class SendSmsDto {

  @Expose()
  @IsString()
  @IsNotEmpty()
  message: string
  
  @Expose()
  @IsString()
  @IsOptional()
  senderNumber?: SmsSenderNumbers
  
  @Expose()
  @IsString()
  @IsOptional()
  recipientList?: string[]

  constructor(partial: Partial<SendSmsDto>) {
    Object.assign(this, partial);
  }
}
