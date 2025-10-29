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
} from '@nestjs/common';
import { DecksService } from './decks.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('decks')
@UseGuards(JwtAuthGuard)
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  create(@Request() req, @Body() createDeckDto: CreateDeckDto) {
    return this.decksService.create(req.user.id, createDeckDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.decksService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.decksService.findOne(req.user.id, id);
  }

  @Get(':id/stats')
  getStats(@Request() req, @Param('id') id: string) {
    return this.decksService.getDeckStats(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDeckDto: UpdateDeckDto,
  ) {
    return this.decksService.update(req.user.id, id, updateDeckDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.decksService.remove(req.user.id, id);
  }
}
