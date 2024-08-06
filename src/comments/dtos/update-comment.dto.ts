import { Expose } from 'class-transformer';
import { IsNumber, IsString, IsOptional } from 'src/custom-validator';

export class UpdateCommentDto {
  @Expose()
  @IsString()
  @IsOptional()
  content?: string;

  @Expose()
  @IsNumber()
  @IsOptional()
  rate?: number;

  constructor(partial: Partial<UpdateCommentDto>) {
    Object.assign(this, partial);
  }
}
