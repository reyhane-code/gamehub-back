import { Expose } from 'class-transformer';
import {
  IsString,
  IsOptional
} from 'src/custom-validator';

export class UpdateArticleDto {
  @Expose()
  @IsOptional()
  @IsString()
  title?: string;

  @Expose()
  @IsOptional()
  @IsString()
  content?: string;

  constructor(partial: Partial<UpdateArticleDto>) {
    Object.assign(this, partial);
  }
}
