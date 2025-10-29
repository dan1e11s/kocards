import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { SrsService } from './srs.service';

@Module({
  controllers: [CardsController],
  providers: [CardsService, SrsService],
})
export class CardsModule {}
