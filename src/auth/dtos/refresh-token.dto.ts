import { Expose } from "class-transformer";
import { IsString } from "src/custom-validator";

export class RefreshTokenDto {

  @Expose()
  @IsString()
  refreshToken: string

  constructor(partial: Partial<RefreshTokenDto>) {
    Object.assign(this, partial);
  }
}