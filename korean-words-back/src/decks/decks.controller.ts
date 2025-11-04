import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators';

/**
 * Decks Controller
 * Manages flashcard decks (collections of cards)
 */
@Controller('decks')
@UseGuards(JwtAuthGuard)
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  /**
   * Create a new deck
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser('id') userId: string,
    @Body() createDeckDto: CreateDeckDto,
  ) {
    return this.decksService.create(userId, createDeckDto);
  }

  /**
   * Get all decks for the authenticated user
   */
  @Get()
  findAll(@CurrentUser('id') userId: string) {
    return this.decksService.findAll(userId);
  }

  /**
   * Get a single deck by ID with its cards
   */
  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.decksService.findOne(userId, id);
  }

  /**
   * Get statistics for a deck (total cards, due cards, etc.)
   */
  @Get(':id/stats')
  getStats(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.decksService.getDeckStats(userId, id);
  }

  /**
   * Update a deck
   */
  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateDeckDto: UpdateDeckDto,
  ) {
    return this.decksService.update(userId, id, updateDeckDto);
  }

  /**
   * Delete a deck (and all its cards via cascade)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.decksService.remove(userId, id);
  }
}
