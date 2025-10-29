import axios from 'axios';
import type {
  AuthResponse,
  RegisterDto,
  LoginDto,
  Deck,
  CreateDeckDto,
  UpdateDeckDto,
  Card,
  CreateCardDto,
  UpdateCardDto,
  ReviewCardDto,
  User,
} from '../types/index.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  // Get token from localStorage (zustand persist stores it there)
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (e) {
      console.error('Failed to parse auth storage', e);
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: RegisterDto) =>
    api.post<AuthResponse>('/auth/register', data).then((res) => res.data),

  login: (data: LoginDto) =>
    api.post<AuthResponse>('/auth/login', data).then((res) => res.data),
};

// Users API
export const usersApi = {
  getProfile: () => api.get<User>('/users/profile').then((res) => res.data),
};

// Decks API
export const decksApi = {
  getAll: () => api.get<Deck[]>('/decks').then((res) => res.data),

  getOne: (id: string) => api.get<Deck>(`/decks/${id}`).then((res) => res.data),

  getStats: (id: string) =>
    api
      .get<{ totalCards: number; dueCards: number }>(`/decks/${id}/stats`)
      .then((res) => res.data),

  create: (data: CreateDeckDto) =>
    api.post<Deck>('/decks', data).then((res) => res.data),

  update: (id: string, data: UpdateDeckDto) =>
    api.patch<Deck>(`/decks/${id}`, data).then((res) => res.data),

  delete: (id: string) =>
    api.delete(`/decks/${id}`).then((res) => res.data),
};

// Cards API
export const cardsApi = {
  getAll: (deckId?: string) => {
    const params = deckId ? { deckId } : {};
    return api.get<Card[]>('/cards', { params }).then((res) => res.data);
  },

  getOne: (id: string) => api.get<Card>(`/cards/${id}`).then((res) => res.data),

  getDueCards: (deckId: string) =>
    api.get<Card[]>(`/cards/due/${deckId}`).then((res) => res.data),

  create: (data: CreateCardDto) =>
    api.post<Card>('/cards', data).then((res) => res.data),

  update: (id: string, data: UpdateCardDto) =>
    api.patch<Card>(`/cards/${id}`, data).then((res) => res.data),

  delete: (id: string) =>
    api.delete(`/cards/${id}`).then((res) => res.data),

  review: (id: string, data: ReviewCardDto) =>
    api.post<Card>(`/cards/${id}/review`, data).then((res) => res.data),
};

export default api;
