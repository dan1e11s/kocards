import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { HiPlus, HiTrash, HiLogout, HiBookOpen, HiCollection } from 'react-icons/hi';
import { decksApi } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../hooks';
import { ToastContainer, ConfirmModal } from '../components/ui';
import type { CreateDeckDto } from '../types/index.js';

export default function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteDeckId, setDeleteDeckId] = useState<string | null>(null);
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');

  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data: decks, isLoading } = useQuery({
    queryKey: ['decks'],
    queryFn: decksApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateDeckDto) => decksApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks'] });
      setShowCreateModal(false);
      setDeckName('');
      setDeckDescription('');
      toast.success('Deck created successfully! ✅');
    },
    onError: () => {
      toast.error('Failed to create deck');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => decksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decks'] });
      toast.success('Deck deleted');
      setDeleteDeckId(null);
    },
    onError: () => {
      toast.error('Failed to delete deck');
      setDeleteDeckId(null);
    },
  });

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ name: deckName, description: deckDescription });
  };

  const handleDeleteDeck = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteDeckId(id);
  };

  const confirmDelete = () => {
    if (deleteDeckId) {
      deleteMutation.mutate(deleteDeckId);
    }
  };

  return (
    <div className="min-h-screen">
      <ToastContainer toasts={toast.toasts} onClose={toast.close} />

      <ConfirmModal
        isOpen={deleteDeckId !== null}
        title="Delete deck?"
        message="Are you sure you want to delete this deck and all its cards? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDeckId(null)}
      />
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HiCollection className="text-2xl sm:text-3xl text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              KoCards
            </h1>
          </div>
          <button onClick={logout} className="btn-icon text-gray-600" title="Logout">
            <HiLogout className="text-2xl" />
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">My Decks</h2>
            <p className="text-sm sm:text-base text-gray-600">
              {decks?.length || 0} {decks?.length === 1 ? 'deck' : 'decks'} total
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <HiPlus className="text-xl" />
            <span>New Deck</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12 sm:py-20">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : decks && decks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {decks.map((deck) => (
              <Link key={deck.id} to={`/decks/${deck.id}`}>
                <div className="card-interactive group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-md flex-shrink-0">
                        <HiBookOpen className="text-xl sm:text-2xl text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors truncate">
                          {deck.name}
                        </h3>
                        {deck.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{deck.description}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteDeck(e, deck.id)}
                      className="btn-icon-danger sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
                      title="Delete deck"
                    >
                      <HiTrash className="text-lg sm:text-xl" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                    <span className="text-sm font-semibold text-gray-600">
                      {deck._count?.cards || 0} cards
                    </span>
                    <span className="text-sm text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform">
                      Open →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mb-6">
              <HiCollection className="text-4xl text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No decks yet</h3>
            <p className="text-gray-600 mb-6">Create your first deck to get started!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <HiPlus className="text-xl" />
              Create Deck
            </button>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Create New Deck</h3>
            <form onSubmit={handleCreateDeck} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Deck Name
                </label>
                <input
                  type="text"
                  value={deckName}
                  onChange={(e) => setDeckName(e.target.value)}
                  className="input"
                  placeholder="e.g., Basic Korean Words"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Description (optional)
                </label>
                <textarea
                  value={deckDescription}
                  onChange={(e) => setDeckDescription(e.target.value)}
                  className="input resize-none"
                  rows={3}
                  placeholder="What will you learn in this deck?"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn btn-primary flex-1" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Deck'}
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
