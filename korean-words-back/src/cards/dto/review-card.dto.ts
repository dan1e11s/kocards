import { IsEnum } from 'class-validator';
import { Difficulty } from '@prisma/client';

export class ReviewCardDto {
  @IsEnum(Difficulty)
  difficulty: Difficulty;
}
