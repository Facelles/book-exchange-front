'use client';

import { X, ImageIcon, AlertCircle, CheckCircle, Loader2, Plus } from 'lucide-react';
import { AddBookForm } from '@/types';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: AddBookForm;
  setForm: React.Dispatch<React.SetStateAction<AddBookForm>>;
  onSubmit: (e: React.FormEvent) => void;
  formError: string | null;
  formLoading: boolean;
  formSuccess: boolean;
}

export default function AddBookModal({
  isOpen,
  onClose,
  form,
  setForm,
  onSubmit,
  formError,
  formLoading,
  formSuccess,
}: AddBookModalProps) {
  if (!isOpen) return null;

  const inputClass =
    'w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl shadow-2xl shadow-black/60 p-7">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <h2 id="modal-title" className="text-xl font-bold text-white mb-6">
          Add New Book
        </h2>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="add-book-name">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="add-book-name"
              type="text"
              placeholder="e.g. The Great Gatsby"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="add-book-author">
              Author <span className="text-red-400">*</span>
            </label>
            <input
              id="add-book-author"
              type="text"
              placeholder="e.g. F. Scott Fitzgerald"
              value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5" htmlFor="add-book-photo">
              <span className="flex items-center gap-1.5">
                <ImageIcon size={12} /> Photo URL <span className="text-slate-600">(optional)</span>
              </span>
            </label>
            <input
              id="add-book-photo"
              type="url"
              placeholder="https://example.com/cover.jpg"
              value={form.photoUrl}
              onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))}
              className={inputClass}
            />
          </div>

          {formError && (
            <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="flex items-center gap-2.5 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-sm text-green-400">
              <CheckCircle size={16} />
              <span>Book added successfully!</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 transition"
            >
              Cancel
            </button>
            <button
              id="add-book-submit"
              type="submit"
              disabled={formLoading || formSuccess}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white transition flex items-center justify-center gap-2"
            >
              {formLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : formSuccess ? (
                <CheckCircle size={16} />
              ) : (
                <Plus size={16} />
              )}
              {formSuccess ? 'Added!' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
