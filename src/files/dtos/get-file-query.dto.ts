import { IsOptional, IsString, IsNumber, Min, Max, IsEnum } from "../../custom-validator";
import { ImageFormat } from "../enums/image-format";

export class GetFileQueryDto {

  @IsString()
  hashKey: string;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  quality?: number;

  @IsEnum(ImageFormat)
  @IsOptional()
  format?: ImageFormat;
}
