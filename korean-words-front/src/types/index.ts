export type Difficulty = 'HARD' | 'NORMAL' | 'EASY';

export const Difficulty = {
  HARD: 'HARD' as const,
  NORMAL: 'NORMAL' as const,
  EASY: 'EASY' as const,
};

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  cards?: Card[];
  _count?: {
    cards: number;
  };
}

export interface Card {
  id: string;
  front: string;
  back: string;
  pronunciation?: string;
  examples: string[];
  notes?: string;
  difficulty: Difficulty;
  nextReviewAt: string;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  deckId: string;
  deck?: {
    id: string;
    name: string;
  };
}

export interface CreateDeckDto {
  name: string;
  description?: string;
}

export interface UpdateDeckDto {
  name?: string;
  description?: string;
}

export interface CreateCardDto {
  front: string;
  back: string;
  pronunciation?: string;
  examples?: string[];
  notes?: string;
  deckId: string;
}

export interface UpdateCardDto {
  front?: string;
  back?: string;
  pronunciation?: string;
  examples?: string[];
  notes?: string;
}

export interface ReviewCardDto {
  difficulty: Difficulty;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
