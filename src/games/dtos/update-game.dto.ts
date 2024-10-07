import { Expose } from 'class-transformer';
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


  constructor(partial: Partial<UpdateGameDto>) {
    Object.assign(this, partial);
  }
}
