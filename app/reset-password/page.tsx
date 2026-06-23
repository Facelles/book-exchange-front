'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token');

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !token) return;

    setLoading(true);
    setError(null);

    try {
      await apiFetch('/api/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword: password }),
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid or expired token.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
        <AlertCircle size={32} className="text-red-400 mx-auto mb-3" />
        <h3 className="text-white font-medium mb-2">Invalid Link</h3>
        <p className="text-slate-400 text-sm mb-4">
          The password reset link is missing or invalid.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block bg-white/10 hover:bg-white/20 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Request new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={24} />
        </div>
        <h3 className="text-white font-medium mb-2">Password Reset Successful</h3>
        <p className="text-slate-400 text-sm mb-4">
          Your password has been successfully updated.
        </p>
        <p className="text-slate-500 text-xs">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-400 mb-2">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            className="w-full bg-slate-800 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
            required
            minLength={6}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading || password.length < 6}
        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        Update Password
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-32 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-slate-400 text-sm">
            Enter your new password below.
          </p>
        </div>

        <Suspense fallback={<div className="flex justify-center p-4"><Loader2 className="animate-spin text-amber-500" /></div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
