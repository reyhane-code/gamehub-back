import { Expose, Transform } from 'class-transformer';
import {
  IsString, IsOptional
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
  image?: string;

  @Expose()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  rating_top?: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  metacritic?: number;

  constructor(partial: Partial<UpdateGameDto>) {
    Object.assign(this, partial);
  }
}
