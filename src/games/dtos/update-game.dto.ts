import { Expose } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'src/custom-validator';

export class UpdateGameDto {
  @Expose()
  @IsString()
  @IsOptional()
  name?: string;

  @Expose()
  @IsString()
  @IsOptional()
  description?: string;

  @Expose()
  @IsString()
  @IsOptional()
  background_image?: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  rating_top?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  metacritic?: number;

  constructor(partial: Partial<UpdateGameDto>) {
    Object.assign(this, partial);
  }
}
