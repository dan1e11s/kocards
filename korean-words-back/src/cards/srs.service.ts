import { Injectable, Logger } from '@nestjs/common';
import { Difficulty } from '@prisma/client';
import { SRS_CONFIG } from '../common/constants';

/**
 * Spaced Repetition System (SRS) Service
 * Implements SuperMemo SM-2 algorithm for optimal card review scheduling
 */
@Injectable()
export class SrsService {
  private readonly logger = new Logger(SrsService.name);

  /**
   * Calculate next review date based on difficulty and review history
   * @param difficulty - User's rating of card difficulty (EASY, NORMAL, HARD)
   * @param reviewCount - Number of times the card has been reviewed
   * @returns Date object for next review
   */
  calculateNextReview(difficulty: Difficulty, reviewCount: number): Date {
    const daysToAdd = this.calculateInterval(difficulty, reviewCount);
    const nextReviewDate = this.addDaysToDate(new Date(), daysToAdd);

    this.logger.debug(
      `Next review calculated: difficulty=${difficulty}, reviewCount=${reviewCount}, interval=${daysToAdd} days`,
    );

    return nextReviewDate;
  }

  /**
   * Calculate interval in days for next review
   * @param difficulty - Card difficulty rating
   * @param reviewCount - Number of previous reviews
   * @returns Number of days until next review
   */
  private calculateInterval(difficulty: Difficulty, reviewCount: number): number {
    // Get base interval from configuration
    const baseInterval = SRS_CONFIG.INTERVALS[difficulty];

    // For first review, use base interval
    if (reviewCount === 0) {
      return baseInterval;
    }

    // Apply exponential multiplier for subsequent reviews
    const multiplier = Math.pow(SRS_CONFIG.EASE_FACTOR, reviewCount);
    let interval = Math.floor(baseInterval * multiplier);

    // Cap interval at maximum
    interval = Math.min(interval, SRS_CONFIG.MAX_INTERVAL_DAYS);

    // Ensure minimum interval
    interval = Math.max(interval, SRS_CONFIG.MIN_INTERVAL_DAYS);

    return interval;
  }

  /**
   * Add days to a date
   * @param date - Starting date
   * @param days - Number of days to add
   * @returns New date with days added
   */
  private addDaysToDate(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Get filter for querying cards due for review
   * @param deckId - ID of the deck
   * @returns Prisma where filter object
   */
  getDueCardsFilter(deckId: string) {
    return {
      deckId,
      nextReviewAt: {
        lte: new Date(),
      },
    };
  }

  /**
   * Check if a card is due for review
   * @param nextReviewAt - Scheduled review date
   * @returns True if card is due
   */
  isCardDue(nextReviewAt: Date): boolean {
    return nextReviewAt <= new Date();
  }

  /**
   * Get statistics about review intervals
   * @param difficulty - Difficulty level
   * @param maxReviews - Maximum number of reviews to calculate
   * @returns Array of intervals for each review number
   */
  getIntervalStats(
    difficulty: Difficulty,
    maxReviews: number = 10,
  ): Array<{ reviewNumber: number; intervalDays: number }> {
    return Array.from({ length: maxReviews }, (_, i) => ({
      reviewNumber: i + 1,
      intervalDays: this.calculateInterval(difficulty, i),
    }));
  }
}
