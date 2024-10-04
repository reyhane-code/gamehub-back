import { Expose, Transform } from 'class-transformer';
import {
  IsOptional,
  IsString, Min,
  Max,
  IsEnum,
  IsNotEmpty
} from '../../custom-validator';
import { ImageFormat } from '../enums/image-format';
import { ImageFit } from '../enums/image-fit.enum';

export class GetFileQueryDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  hashKey: string;

  @Expose()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  width?: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  height?: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  @Min(0)
  @Max(100)
  @IsOptional()
  quality?: number;

  @Expose()
  @IsEnum(ImageFormat)
  @IsOptional()
  format?: ImageFormat;

  @Expose()
  @IsEnum(ImageFit)
  @IsOptional()
  fit?: ImageFit;

  constructor(partial: Partial<GetFileQueryDto>) {
    Object.assign(this, partial);
  }
}
