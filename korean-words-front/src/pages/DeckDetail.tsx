import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  HiPlus, HiTrash, HiLightningBolt,
  HiClipboardList, HiAcademicCap
} from 'react-icons/hi';
import { decksApi, cardsApi } from '../services/api';
import { useToast } from '../hooks';
import { ToastContainer, ConfirmModal } from '../components/ui';
import type { CreateCardDto } from '../types/index.js';

export default function DeckDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [notes, setNotes] = useState('');

  const toast = useToast();

  const { data: deck, isLoading: deckLoading } = useQuery({
    queryKey: ['deck', id],
    queryFn: () => decksApi.getOne(id!),
    enabled: !!id,
  });

  const { data: stats } = useQuery({
    queryKey: ['deck-stats', id],
    queryFn: () => decksApi.getStats(id!),
    enabled: !!id,
  });

  const createCardMutation = useMutation({
    mutationFn: (data: CreateCardDto) => cardsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deck', id] });
      queryClient.invalidateQueries({ queryKey: ['deck-stats', id] });
      setShowCreateModal(false);
      setFront('');
      setBack('');
      setPronunciation('');
      setNotes('');
      toast.success('Card added successfully! ✅');
    },
    onError: () => {
      toast.error('Failed to create card');
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: (cardId: string) => cardsApi.delete(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deck', id] });
      queryClient.invalidateQueries({ queryKey: ['deck-stats', id] });
      toast.success('Card deleted');
      setDeleteConfirm(null);
    },
    onError: () => {
      toast.error('Failed to delete card');
      setDeleteConfirm(null);
    },
  });

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    createCardMutation.mutate({
      front,
      back,
      pronunciation,
      notes,
      deckId: id,
    });
  };

  const handleDeleteCard = (cardId: string) => {
    setDeleteConfirm(cardId);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteCardMutation.mutate(deleteConfirm);
    }
  };

  if (deckLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!deck) {
    return <div className="p-8 text-center">Deck not found</div>;
  }

  return (
    <div className="min-h-screen">
      <ToastContainer toasts={toast.toasts} onClose={toast.close} />

      <ConfirmModal
        isOpen={deleteConfirm !== null}
        title="Delete card?"
        message="Are you sure you want to delete this card? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
      <nav className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/dashboard" className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{deck.name}</h1>
          {deck.description && (
            <p className="text-gray-600">{deck.description}</p>
          )}
          {stats && (
            <div className="mt-4 flex gap-4">
              <span className="text-sm text-gray-600">
                Total: {stats.totalCards} cards
              </span>
              <span className="text-sm text-blue-600">
                Due: {stats.dueCards} cards
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <HiPlus className="text-xl" />
            <span>Add Card</span>
          </button>
          {/* Always show Practice button */}
          <button
            onClick={() => navigate(`/learn/${id}?mode=practice`)}
            className="btn bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 w-full sm:flex-1 text-lg py-6"
          >
            <HiAcademicCap className="text-2xl" />
            <span>Practice</span>
          </button>

          {/* Show Review button only if there are due cards */}
          {stats && stats.dueCards > 0 && (
            <button
              onClick={() => navigate(`/learn/${id}?mode=review`)}
              className="btn bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 w-full sm:flex-1 text-lg py-6"
            >
              <HiLightningBolt className="text-2xl" />
              <span>Review ({stats.dueCards})</span>
            </button>
          )}
        </div>

        {deck.cards && deck.cards.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cards</h2>
            {deck.cards.map((card) => (
              <div key={card.id} className="card group">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Korean</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-800 break-words">{card.front}</p>
                      {card.pronunciation && (
                        <p className="text-sm text-gray-500 mt-1">[{card.pronunciation}]</p>
                      )}
                    </div>
                    <div className="mt-3 sm:mt-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Translation</p>
                      <p className="text-xl sm:text-2xl font-semibold text-indigo-600 break-words">{card.back}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="btn-icon-danger sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0"
                    title="Delete card"
                  >
                    <HiTrash className="text-lg sm:text-xl" />
                  </button>
                </div>

                {card.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Note:</span> {card.notes}
                    </p>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">Reviews: {card.reviewCount}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    Next: {new Date(card.nextReviewAt).toLocaleDateString()}
                  </span>
                  <span className={`px-2 py-1 rounded font-semibold ${
                    card.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
                    card.difficulty === 'NORMAL' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {card.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-6">
              <HiClipboardList className="text-4xl text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No cards yet</h3>
            <p className="text-gray-600 mb-6">Add your first card to start learning!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <HiPlus className="text-xl" />
              Add Card
            </button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="card max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Add New Card</h3>
            <form onSubmit={handleCreateCard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Korean Word/Phrase
                </label>
                <input
                  type="text"
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Translation
                </label>
                <input
                  type="text"
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Pronunciation (optional)
                </label>
                <input
                  type="text"
                  value={pronunciation}
                  onChange={(e) => setPronunciation(e.target.value)}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1">
                  Add Card
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
