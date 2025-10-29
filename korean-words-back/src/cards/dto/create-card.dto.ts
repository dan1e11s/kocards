import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreateCardDto {
  @IsString()
  front: string;

  @IsString()
  back: string;

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

  @IsUUID()
  deckId: string;
}
