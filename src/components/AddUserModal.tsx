"use client";

import {
  X,
  Plus,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { AddUserForm } from "@/types";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: AddUserForm;
  setForm: React.Dispatch<React.SetStateAction<AddUserForm>>;
  onSubmit: (e: React.FormEvent) => void;
  formError: string | null;
  formLoading: boolean;
  formSuccess: boolean;
}

export default function AddUserModal({
  isOpen,
  onClose,
  form,
  setForm,
  onSubmit,
  formError,
  formLoading,
  formSuccess,
}: AddUserModalProps) {
  if (!isOpen) return null;

  const inputClass =
    "w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-user-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl shadow-2xl shadow-black/60 p-7">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Plus size={16} className="text-amber-400" />
          </div>
          <h2
            id="add-user-modal-title"
            className="text-xl font-bold text-white"
          >
            Create New User
          </h2>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div>
            <label
              className="block text-xs font-medium text-slate-400 mb-1.5"
              htmlFor="admin-add-email"
            >
              Email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                id="admin-add-email"
                type="email"
                placeholder="user@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className={`${inputClass} pl-10`}
                autoComplete="off"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-medium text-slate-400 mb-1.5"
              htmlFor="admin-add-password"
            >
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
              />
              <input
                id="admin-add-password"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                className={`${inputClass} pl-10`}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-xs font-medium text-slate-400 mb-1.5"
              htmlFor="admin-add-role"
            >
              Role
            </label>
            <select
              id="admin-add-role"
              value={form.role}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  role: e.target.value as "USER" | "ADMIN",
                }))
              }
              className={inputClass}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
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
              <span>User created successfully!</span>
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
              id="admin-add-user-submit"
              type="submit"
              disabled={formLoading || formSuccess}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 transition flex items-center justify-center gap-2"
            >
              {formLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : formSuccess ? (
                <CheckCircle size={16} />
              ) : (
                <Plus size={16} />
              )}
              {formSuccess ? "Created!" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
