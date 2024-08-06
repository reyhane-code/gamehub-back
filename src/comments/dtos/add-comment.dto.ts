import { Expose } from 'class-transformer';
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'src/custom-validator';
import { Rate } from '../enums/rate.enum';

export class AddCommentDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  rate?: Rate;

  @Expose()
  @IsNumber()
  @IsOptional()
  parent_id?: number;

  constructor(partial: Partial<AddCommentDto>) {
    Object.assign(this, partial);
  }
}
