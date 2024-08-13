import { Expose } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
  TransformAndValidateNumberArray,
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
  @TransformAndValidateNumberArray()
  platformIds: number[];

  @Expose()
  @TransformAndValidateNumberArray()
  publisherIds: number[];

  @Expose()
  @TransformAndValidateNumberArray()
  genreIds: number[];

  @Expose()
  @IsString()
  @IsOptional()
  image_alt?: string;

  constructor(partial: Partial<AddGameDto>) {
    Object.assign(this, partial);
  }
}
