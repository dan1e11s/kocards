import { IsString, IsOptional } from 'class-validator';

export class UpdateDeckDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
