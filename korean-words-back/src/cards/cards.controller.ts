import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ReviewCardDto } from './dto/review-card.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';

/**
 * Cards Controller
 * Handles CRUD operations and review logic for flashcards
 */
@Controller('cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  /**
   * Create a new flashcard
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser('id') userId: string,
    @Body() createCardDto: CreateCardDto,
  ) {
    return this.cardsService.create(userId, createCardDto);
  }

  /**
   * Get all cards for the authenticated user
   * Optionally filter by deckId
   */
  @Get()
  findAll(
    @CurrentUser('id') userId: string,
    @Query('deckId') deckId?: string,
  ) {
    return this.cardsService.findAll(userId, deckId);
  }

  /**
   * Get cards due for review in a specific deck
   */
  @Get('due/:deckId')
  getDueCards(
    @CurrentUser('id') userId: string,
    @Param('deckId') deckId: string,
  ) {
    return this.cardsService.getDueCards(userId, deckId);
  }

  /**
   * Get a single card by ID
   */
  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.cardsService.findOne(userId, id);
  }

  /**
   * Update a card
   */
  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardsService.update(userId, id, updateCardDto);
  }

  /**
   * Delete a card
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.cardsService.remove(userId, id);
  }

  /**
   * Review a card and update SRS scheduling
   */
  @Post(':id/review')
  review(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() reviewCardDto: ReviewCardDto,
  ) {
    return this.cardsService.reviewCard(userId, id, reviewCardDto);
  }
}
