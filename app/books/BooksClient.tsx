'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { BooksResponse } from '@/types';
import BookCard from '@/components/BookCard';
import { Search, ChevronLeft, ChevronRight, BookOpen, SortAsc, SortDesc } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function BooksClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [sort, setSort] = useState<'asc' | 'desc'>(
    (searchParams.get('sort') as 'asc' | 'desc') ?? 'asc'
  );
  const [page, setPage] = useState(Number(searchParams.get('page') ?? 1));

  const [data, setData] = useState<BooksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(search);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        ...(search ? { search } : {}),
        sort,
        page: String(page),
        limit: '9',
      });
      const result = await apiFetch<BooksResponse>(`/api/books?${params}`);
      setData(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load books.');
    } finally {
      setLoading(false);
    }
  }, [search, sort, page]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('sort', sort);
    params.set('page', String(page));
    router.replace(`/books?${params}`, { scroll: false });
  }, [search, sort, page, router]);

  const handleSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleSearchKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const toggleSort = () => {
    setSort((s) => (s === 'asc' ? 'desc' : 'asc'));
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
          Book{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Catalog
          </span>
        </h1>
        <p className="text-slate-400 text-lg">Discover books available for exchange in your community</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
          <input
            id="books-search"
            type="text"
            placeholder="Search by title or author…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKey}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>

        <button
          id="books-search-btn"
          onClick={handleSearch}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl transition-all duration-200"
        >
          Search
        </button>

        <button
          id="books-sort-btn"
          onClick={toggleSort}
          className="flex items-center gap-2 px-5 py-3 bg-slate-800/80 border border-slate-700 hover:border-indigo-500/50 text-slate-300 hover:text-white font-medium text-sm rounded-xl transition-all duration-200"
        >
          {sort === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
          {sort === 'asc' ? 'A → Z' : 'Z → A'}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-slate-800/40 border border-white/5 rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-400 text-lg">{error}</p>
          <button
            onClick={fetchBooks}
            className="mt-4 px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm text-white transition"
          >
            Retry
          </button>
        </div>
      ) : data && data.data && data.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {Math.ceil(data.total / data.limit) > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                id="books-prev-page"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 border border-slate-700 hover:border-indigo-500/50 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm text-slate-300 hover:text-white transition-all"
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <span className="text-sm text-slate-400">
                Page{' '}
                <span className="font-semibold text-white">{page}</span> of{' '}
                <span className="font-semibold text-white">{Math.ceil(data.total / data.limit)}</span>
              </span>

              <button
                id="books-next-page"
                onClick={() => setPage((p) => Math.min(p + 1, Math.ceil(data.total / data.limit)))}
                disabled={page >= Math.ceil(data.total / data.limit)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-800 border border-slate-700 hover:border-indigo-500/50 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm text-slate-300 hover:text-white transition-all"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24 flex flex-col items-center gap-4">
          <BookOpen size={48} className="text-slate-600" />
          <p className="text-slate-400 text-lg">No books found.</p>
          {search && (
            <button
              onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm text-white transition"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
}
