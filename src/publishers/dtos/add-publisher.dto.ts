import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'src/custom-validator';

export class AddPublisherDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;
  constructor(partial: Partial<AddPublisherDto>) {
    Object.assign(this, partial);
  }
}
