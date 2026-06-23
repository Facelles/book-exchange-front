'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Book } from '@/types';
import {
  ArrowLeft,
  User,
  BookOpen,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, token } = useAuthStore();

  const [book, setBook] = useState<Book | null>(null);
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [offeredBookId, setOfferedBookId] = useState<number | ''>('');

  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [exchangeSuccess, setExchangeSuccess] = useState(false);
  const [exchangeError, setExchangeError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiFetch<Book>(`/api/books/${id}`);
        setBook(data);

        if (useAuthStore.getState().token) {
          const myBooksData = await apiFetch<Book[]>('/api/me/books', { auth: true });
          setMyBooks(myBooksData);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load book.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleExchange = async () => {
    if (!token) {
      router.push('/login');
      return;
    }
    setExchangeLoading(true);
    setExchangeError(null);
    setExchangeSuccess(false);
    try {
      await apiFetch(`/api/books/${id}/exchange`, {
        method: 'POST',
        auth: true,
        body: JSON.stringify({ offeredBookId: offeredBookId ? Number(offeredBookId) : undefined }),
      });
      setExchangeSuccess(true);
    } catch (err: unknown) {
      setExchangeError(err instanceof Error ? err.message : 'Exchange request failed.');
    } finally {
      setExchangeLoading(false);
    }
  };

  const isOwner = user && book && user.id === book.ownerId;

  /* ─── Loading skeleton ─── */
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-pulse">
        <div className="h-5 w-28 bg-slate-800 rounded-lg mb-8" />
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-72 h-96 bg-slate-800 rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-4 mt-2">
            <div className="h-8 bg-slate-800 rounded-lg w-3/4" />
            <div className="h-5 bg-slate-800 rounded-lg w-1/2" />
            <div className="h-4 bg-slate-800 rounded-lg w-1/3 mt-6" />
            <div className="h-12 bg-slate-800 rounded-xl w-48 mt-8" />
          </div>
        </div>
      </div>
    );
  }

  /* ─── Error state ─── */
  if (error || !book) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
        <p className="text-red-400 text-lg mb-4">{error ?? 'Book not found.'}</p>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm text-white transition"
        >
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Back link */}
      <Link
        href="/books"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition mb-8 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Catalog
      </Link>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Cover */}
        <div className="flex-shrink-0 w-full md:w-72">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-800 border border-white/10 shadow-2xl shadow-black/50">
            {book.photoUrl && book.photoUrl.startsWith('http') && !imgError ? (
              <Image
                src={book.photoUrl}
                alt={book.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 288px"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
                <div className="w-20 h-20 rounded-3xl bg-slate-800 border border-white/5 flex items-center justify-center mb-4 shadow-inner">
                  <BookOpen size={36} className="text-slate-500" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">No Cover</span>
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-medium mb-4">
            <BookOpen size={12} /> Available for Exchange
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            {book.name}
          </h1>
          <p className="mt-2 text-xl text-slate-400 italic">{book.author}</p>

          {book.owner && (
            <div className="mt-6 flex items-center gap-2.5 text-sm text-slate-400">
              <div className="w-8 h-8 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center">
                <User size={14} className="text-slate-300" />
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Listed by</p>
                <p className="text-slate-300 font-medium">{book.owner.email}</p>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="my-8 border-t border-white/10" />

          {/* Exchange section */}
          {isOwner ? (
            <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-4 text-sm text-amber-400">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <p>This is your own book. You cannot request an exchange for it.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-white font-semibold text-lg mb-1">Interested in this book?</h2>
                <p className="text-slate-400 text-sm">
                  Click the button below to notify the owner — they&apos;ll receive an email about your request.
                </p>
              </div>

              {exchangeSuccess && (
                <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-5 py-4 text-sm text-green-400">
                  <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
                  <p>Exchange request sent! The owner has been notified by email.</p>
                </div>
              )}

              {exchangeError && (
                <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-4 text-sm text-red-400">
                  <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                  <p>{exchangeError}</p>
                </div>
              )}

              {token && !exchangeSuccess && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-400 mb-2">Offer a book in exchange (Optional)</label>
                  <select
                    value={offeredBookId}
                    onChange={(e) => setOfferedBookId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
                  >
                    <option value="">No book, just requesting</option>
                    {myBooks.map((mb) => (
                      <option key={mb.id} value={mb.id}>
                        {mb.name} (by {mb.author})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                id="request-exchange-btn"
                onClick={handleExchange}
                disabled={exchangeLoading || exchangeSuccess}
                className="flex items-center gap-2.5 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25"
              >
                {exchangeLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : exchangeSuccess ? (
                  <CheckCircle size={18} />
                ) : (
                  <RefreshCw size={18} />
                )}
                {exchangeSuccess ? 'Request Sent' : 'Request Exchange'}
              </button>

              {!token && (
                <p className="text-xs text-slate-500">
                  You&apos;ll be redirected to login if not signed in.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
