import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'src/custom-validator';

export class UpdateGenreDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;
  constructor(partial: Partial<UpdateGenreDto>) {
    Object.assign(this, partial);
  }
}
