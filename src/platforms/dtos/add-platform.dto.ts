import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'src/custom-validator';

export class AddPlatformDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;
  constructor(partial: Partial<AddPlatformDto>) {
    Object.assign(this, partial);
  }
}
