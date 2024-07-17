import { Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
} from 'src/custom-validator';

export class AddGenreDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;
  constructor(partial: Partial<AddGenreDto>) {
    Object.assign(this, partial);
  }
}
