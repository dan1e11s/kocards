import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ReviewCardDto } from './dto/review-card.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(@Request() req, @Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(req.user.id, createCardDto);
  }

  @Get()
  findAll(@Request() req, @Query('deckId') deckId?: string) {
    return this.cardsService.findAll(req.user.id, deckId);
  }

  @Get('due/:deckId')
  getDueCards(@Request() req, @Param('deckId') deckId: string) {
    return this.cardsService.getDueCards(req.user.id, deckId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.cardsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardsService.update(req.user.id, id, updateCardDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.cardsService.remove(req.user.id, id);
  }

  @Post(':id/review')
  review(
    @Request() req,
    @Param('id') id: string,
    @Body() reviewCardDto: ReviewCardDto,
  ) {
    return this.cardsService.reviewCard(req.user.id, id, reviewCardDto);
  }
}
