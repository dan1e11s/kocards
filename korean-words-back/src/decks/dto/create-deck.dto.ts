import { IsString, IsOptional } from 'class-validator';

export class CreateDeckDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
