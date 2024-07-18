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
  @IsString()
  @IsNotEmpty()
  background_image: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  rating_top?: number;

  @Expose()
  @IsNumber()
  @IsOptional()
  metacritic?: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  platformId: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  publisherId: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  genreId: number;

  constructor(partial: Partial<AddGameDto>) {
    Object.assign(this, partial);
  }
}
