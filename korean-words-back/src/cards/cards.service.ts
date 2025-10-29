import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SrsService } from './srs.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { ReviewCardDto } from './dto/review-card.dto';

@Injectable()
export class CardsService {
  constructor(
    private prisma: PrismaService,
    private srsService: SrsService,
  ) {}

  async create(userId: string, createCardDto: CreateCardDto) {
    // Verify deck belongs to user
    const deck = await this.prisma.deck.findUnique({
      where: { id: createCardDto.deckId },
    });

    if (!deck) {
      throw new NotFoundException('Deck not found');
    }

    if (deck.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.card.create({
      data: createCardDto,
    });
  }

  async findAll(userId: string, deckId?: string) {
    const where: any = {};

    if (deckId) {
      // Verify deck belongs to user
      const deck = await this.prisma.deck.findUnique({
        where: { id: deckId },
      });

      if (!deck) {
        throw new NotFoundException('Deck not found');
      }

      if (deck.userId !== userId) {
        throw new ForbiddenException('Access denied');
      }

      where.deckId = deckId;
    }

    return this.prisma.card.findMany({
      where,
      include: {
        deck: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: {
        deck: true,
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (card.deck.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return card;
  }

  async update(userId: string, id: string, updateCardDto: UpdateCardDto) {
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: { deck: true },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (card.deck.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.card.update({
      where: { id },
      data: updateCardDto,
    });
  }

  async remove(userId: string, id: string) {
    const card = await this.prisma.card.findUnique({
      where: { id },
      include: { deck: true },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    if (card.deck.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.card.delete({ where: { id } });

    return { message: 'Card deleted successfully' };
  }

  async reviewCard(userId: string, id: string, reviewCardDto: ReviewCardDto) {
    const card = await this.findOne(userId, id);

    const nextReviewAt = this.srsService.calculateNextReview(
      reviewCardDto.difficulty,
      card.reviewCount,
    );

    return this.prisma.card.update({
      where: { id },
      data: {
        difficulty: reviewCardDto.difficulty,
        nextReviewAt,
        reviewCount: card.reviewCount + 1,
      },
    });
  }

  async getDueCards(userId: string, deckId: string) {
    // Verify deck belongs to user
    const deck = await this.prisma.deck.findUnique({
      where: { id: deckId },
    });

    if (!deck) {
      throw new NotFoundException('Deck not found');
    }

    if (deck.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const filter = this.srsService.getDueCardsFilter(deckId);

    return this.prisma.card.findMany({
      where: filter,
      orderBy: { nextReviewAt: 'asc' },
    });
  }
}
