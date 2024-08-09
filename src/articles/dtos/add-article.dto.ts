import { Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'src/custom-validator';

export class AddArticleDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  content: string;

  @Expose()
  @IsOptional()
  @IsString()
  imageAlt?: string;

  constructor(partial: Partial<AddArticleDto>) {
    Object.assign(this, partial);
  }
}
