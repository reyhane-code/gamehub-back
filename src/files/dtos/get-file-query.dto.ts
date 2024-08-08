import { Expose } from "class-transformer";
import { IsOptional, IsString, IsNumber, Min, Max, IsEnum, IsNotEmpty } from "../../custom-validator";
import { ImageFormat } from "../enums/image-format";

export class GetFileQueryDto {

  @Expose()
  @IsString()
  @IsNotEmpty()
  hashKey: string;
  
  @Expose()
  @IsNumber()
  @IsOptional()
  width?: number;
  
  @Expose()
  @IsNumber()
  @IsOptional()
  height?: number;
  
  @Expose()
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  quality?: number;
  
  @Expose()
  @IsEnum(ImageFormat)
  @IsOptional()
  format?: ImageFormat;

  constructor(partial: Partial<GetFileQueryDto>) {
    Object.assign(this, partial);
  }
}
