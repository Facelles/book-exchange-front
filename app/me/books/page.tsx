'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Book, AddBookForm } from '@/types';
import AddBookModal from '@/components/AddBookModal';
import {
  Plus,
  Trash2,
  BookOpen,
  Loader2,
} from 'lucide-react';

export default function MyBooksPage() {
  const router = useRouter();
  const { user, token, isInitialized } = useAuthStore();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<AddBookForm>({ name: '', author: '', photoUrl: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (isInitialized && !token) {
      router.push('/login');
    }
  }, [isInitialized, token, router]);

  const fetchMyBooks = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Book[]>('/api/me/books', { auth: true });
      setBooks(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load your books.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMyBooks();
  }, [fetchMyBooks]);

  const handleDelete = async (bookId: number) => {
    setDeletingId(bookId);
    try {
      await apiFetch(`/api/books/${bookId}`, { method: 'DELETE', auth: true });
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Delete failed.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.name.trim() || !form.author.trim()) {
      setFormError('Title and author are required.');
      return;
    }
    setFormLoading(true);
    try {
      const newBook = await apiFetch<Book>('/api/books', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({
          name: form.name.trim(),
          author: form.author.trim(),
          photoUrl: form.photoUrl.trim() || null,
        }),
      });
      setBooks((prev) => [newBook, ...prev]);
      setFormSuccess(true);
      setTimeout(() => {
        setModalOpen(false);
        setForm({ name: '', author: '', photoUrl: '' });
        setFormSuccess(false);
      }, 1200);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to add book.');
    } finally {
      setFormLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({ name: '', author: '', photoUrl: '' });
    setFormError(null);
    setFormSuccess(false);
  };

  const inputClass =
    'w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all';

  if (!isInitialized || (!token && !user)) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 size={32} className="animate-spin text-slate-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Books</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {user?.email} · {books.length} book{books.length !== 1 ? 's' : ''} listed
          </p>
        </div>
        <button
          id="open-add-book-modal"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/20"
        >
          <Plus size={18} /> Add Book
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-slate-800/40 border border-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-400">{error}</p>
          <button onClick={fetchMyBooks} className="mt-4 px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm text-white transition">
            Retry
          </button>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-24 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center">
            <BookOpen size={28} className="text-slate-500" />
          </div>
          <p className="text-slate-400 text-lg">You haven&apos;t listed any books yet.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition"
          >
            <Plus size={16} /> Add your first book
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex items-center gap-4 bg-slate-800/60 border border-white/10 hover:border-white/20 rounded-2xl px-5 py-4 transition-all duration-200 group"
            >
              {/* Thumbnail */}
              <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0 relative border border-white/10">
                {book.photoUrl ? (
                  <Image
                    src={book.photoUrl}
                    alt={book.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800">
                    <div className="w-7 h-7 rounded bg-slate-800/80 border border-white/5 flex items-center justify-center shadow-inner">
                      <BookOpen size={14} className="text-slate-500" />
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{book.name}</p>
                <p className="text-sm text-slate-400 italic truncate">{book.author}</p>
              </div>

              {/* Delete */}
              <button
                id={`delete-book-${book.id}`}
                onClick={() => handleDelete(book.id)}
                disabled={deletingId === book.id}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-40 transition-all text-sm"
                title="Delete book"
              >
                {deletingId === book.id ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ─── Add Book Modal ─── */}
      <AddBookModal
        isOpen={modalOpen}
        onClose={closeModal}
        form={form}
        setForm={setForm}
        onSubmit={handleAddBook}
        formError={formError}
        formLoading={formLoading}
        formSuccess={formSuccess}
      />
    </div>
  );
}
