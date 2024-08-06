import { Expose } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'src/custom-validator';

export class AddGameDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsString()
  @IsOptional()
  description?: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  rating_top?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  metacritic?: number;

  @Expose()
  @IsString()
  @IsNotEmpty()
  platformId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  publisherId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  genreId: string;

  @Expose()
  @IsString()
  @IsOptional()
  image_alt?: string;

  constructor(partial: Partial<AddGameDto>) {
    Object.assign(this, partial);
  }
}
