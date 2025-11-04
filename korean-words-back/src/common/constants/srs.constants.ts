import { Difficulty } from '@prisma/client';

/**
 * Spaced Repetition System (SRS) Configuration
 * Based on SuperMemo SM-2 algorithm
 */
export const SRS_CONFIG = {
  /**
   * Interval multipliers for each difficulty level
   * EASY: Review in 4 days
   * NORMAL: Review in 2 days
   * HARD: Review in 1 day
   */
  INTERVALS: {
    [Difficulty.EASY]: 4,
    [Difficulty.NORMAL]: 2,
    [Difficulty.HARD]: 1,
  },

  /**
   * Maximum interval in days (cap at 180 days = 6 months)
   */
  MAX_INTERVAL_DAYS: 180,

  /**
   * Minimum interval in days
   */
  MIN_INTERVAL_DAYS: 1,

  /**
   * Interval multiplier for each successful review
   */
  EASE_FACTOR: 1.5,
} as const;
