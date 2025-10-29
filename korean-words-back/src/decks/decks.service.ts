import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeckDto } from './dto/create-deck.dto';
import { UpdateDeckDto } from './dto/update-deck.dto';

@Injectable()
export class DecksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDeckDto: CreateDeckDto) {
    return this.prisma.deck.create({
      data: {
        ...createDeckDto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.deck.findMany({
      where: { userId },
      include: {
        _count: {
          select: { cards: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const deck = await this.prisma.deck.findUnique({
      where: { id },
      include: {
        cards: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { cards: true },
        },
      },
    });

    if (!deck) {
      throw new NotFoundException('Deck not found');
    }

    if (deck.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return deck;
  }

  async update(userId: string, id: string, updateDeckDto: UpdateDeckDto) {
    const deck = await this.prisma.deck.findUnique({ where: { id } });

    if (!deck) {
      throw new NotFoundException('Deck not found');
    }

    if (deck.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.deck.update({
      where: { id },
      data: updateDeckDto,
    });
  }

  async remove(userId: string, id: string) {
    const deck = await this.prisma.deck.findUnique({ where: { id } });

    if (!deck) {
      throw new NotFoundException('Deck not found');
    }

    if (deck.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.deck.delete({ where: { id } });

    return { message: 'Deck deleted successfully' };
  }

  async getDeckStats(userId: string, id: string) {
    const deck = await this.findOne(userId, id);

    const now = new Date();
    const dueCards = await this.prisma.card.count({
      where: {
        deckId: id,
        nextReviewAt: {
          lte: now,
        },
      },
    });

    return {
      totalCards: deck._count.cards,
      dueCards,
    };
  }
}
