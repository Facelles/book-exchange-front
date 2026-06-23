'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthResponse } from '@/types';
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim() || !confirm.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const data = await apiFetch<AuthResponse>('/api/register', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });
      login(data.token, data.user);
      router.push('/books');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all';

  const isStrong = password.length >= 6;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-slate-900/80 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-black/40">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 mb-4">
              <UserPlus size={26} className="text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create account</h1>
            <p className="mt-1 text-sm text-slate-400">Join the BookSwap community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                id="register-email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputClass} pl-10`}
                autoComplete="email"
              />
            </div>

            <div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  id="register-password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pl-10`}
                  autoComplete="new-password"
                />
              </div>
              {password && (
                <div className={`mt-1.5 flex items-center gap-1.5 text-xs ${isStrong ? 'text-green-400' : 'text-amber-400'}`}>
                  {isStrong ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                  {isStrong ? 'Strong password' : 'At least 6 characters required'}
                </div>
              )}
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                id="register-confirm"
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`${inputClass} pl-10`}
                autoComplete="new-password"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus size={16} /> Create Account
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
