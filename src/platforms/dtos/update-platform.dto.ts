import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'src/custom-validator';

export class UpdatedPlatformDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  name: string;
  constructor(partial: Partial<UpdatedPlatformDto>) {
    Object.assign(this, partial);
  }
}
