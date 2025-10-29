import { Injectable } from '@nestjs/common';
import { Difficulty } from '@prisma/client';

@Injectable()
export class SrsService {
  /**
   * Calculate next review date based on difficulty
   * @param difficulty - User's rating of card difficulty
   * @param reviewCount - Number of times the card has been reviewed
   * @returns Date object for next review
   */
  calculateNextReview(difficulty: Difficulty, reviewCount: number): Date {
    const now = new Date();
    let daysToAdd: number;

    // Base intervals based on difficulty
    const intervals = {
      HARD: 1,
      NORMAL: 3,
      EASY: 7,
    };

    // Get base interval
    daysToAdd = intervals[difficulty];

    // Apply multiplier based on review count (spaced repetition)
    // Each successful review increases the interval
    if (reviewCount > 0) {
      const multiplier = Math.pow(1.5, reviewCount);
      daysToAdd = Math.floor(daysToAdd * multiplier);
    }

    // Cap maximum interval at 180 days (6 months)
    daysToAdd = Math.min(daysToAdd, 180);

    // Calculate next review date
    const nextReviewDate = new Date(now);
    nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);

    return nextReviewDate;
  }

  /**
   * Get cards due for review
   * @param deckId - ID of the deck
   * @returns Filter for Prisma query
   */
  getDueCardsFilter(deckId: string) {
    const now = new Date();

    return {
      deckId,
      nextReviewAt: {
        lte: now,
      },
    };
  }
}
