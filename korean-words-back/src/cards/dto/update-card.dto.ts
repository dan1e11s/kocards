import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateCardDto {
  @IsString()
  @IsOptional()
  front?: string;

  @IsString()
  @IsOptional()
  back?: string;

  @IsString()
  @IsOptional()
  pronunciation?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  examples?: string[];

  @IsString()
  @IsOptional()
  notes?: string;
}
