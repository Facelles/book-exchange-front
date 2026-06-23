'use client';

import { useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await apiFetch('/api/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      // Always show success to prevent email enumeration
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-32 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none" />

        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
          <p className="text-slate-400 text-sm">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={24} />
            </div>
            <h3 className="text-white font-medium mb-2">Check your email</h3>
            <p className="text-slate-400 text-sm">
              If an account exists for {email}, you will receive a password reset link shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                  required
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
              disabled={loading || !email}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
