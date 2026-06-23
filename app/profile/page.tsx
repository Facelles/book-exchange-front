'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { ExchangeRequest } from '@/types';
import {
  UserCircle,
  Mail,
  Camera,
  BookOpen,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowRightLeft,
  Clock
} from 'lucide-react';

interface ProfileData {
  id: number;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
  bookCount: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isInitialized, updateUser } = useAuthStore();
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [requests, setRequests] = useState<ExchangeRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const [profileData, requestsData] = await Promise.all([
          apiFetch<ProfileData>('/api/profile', { auth: true }),
          apiFetch<ExchangeRequest[]>('/api/profile/exchange-requests', { auth: true }),
        ]);

        setProfile(profileData);
        setRequests(requestsData);
        
        setName(profileData.name || '');
        setEmail(profileData.email || '');
        setAvatarUrl(profileData.avatarUrl || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, isInitialized, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedUser = await apiFetch<ProfileData>('/api/profile', {
        method: 'PUT',
        auth: true,
        body: JSON.stringify({ name, email, avatarUrl }),
      });
      
      setProfile((prev) => prev ? { ...prev, ...updatedUser } : null);
      updateUser({ name: updatedUser.name || undefined, avatarUrl: updatedUser.avatarUrl || undefined, email: updatedUser.email });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isInitialized || loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-amber-500" size={32} />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-slate-400">Manage your personal information and exchange requests.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Edit Profile & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Stats Card */}
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Books Owned</p>
                <p className="text-2xl font-bold text-white">{profile.bookCount}</p>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Personal Info</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex justify-center mb-6">
                <div className="relative w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden flex items-center justify-center">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <UserCircle size={48} className="text-slate-500" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Avatar URL</label>
                <div className="relative">
                  <Camera size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Name</label>
                <div className="relative">
                  <UserCircle size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-green-400 text-xs">
                  <CheckCircle size={14} />
                  <p>Profile updated successfully!</p>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save Changes
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Exchange Requests */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <ArrowRightLeft size={20} />
              </div>
              <h2 className="text-xl font-semibold text-white">Incoming Exchange Requests</h2>
            </div>

            {requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-500">
                  <ArrowRightLeft size={24} />
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No requests yet</h3>
                <p className="text-slate-400 text-sm max-w-sm">
                  When someone wants to exchange a book with you, their requests will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((req) => (
                  <div key={req.id} className="bg-slate-800/50 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* Book Image */}
                    {req.book?.photoUrl ? (
                      <div className="w-16 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={req.book.photoUrl} alt={req.book.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-20 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <BookOpen size={24} className="text-slate-500" />
                      </div>
                    )}
                    
                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {req.status}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock size={12} />
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-white font-medium text-base mb-0.5">
                        {req.book?.name}
                      </h4>
                      <p className="text-sm text-slate-400 mb-2">
                        by {req.book?.author}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        {req.sender?.avatarUrl ? (
                           <div className="w-6 h-6 rounded-full relative overflow-hidden">
                             <Image src={req.sender.avatarUrl} alt="User" fill className="object-cover" />
                           </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
                            {req.sender?.name?.[0]?.toUpperCase() || req.sender?.email[0].toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm text-slate-300">
                          <span className="text-slate-500">Requested by:</span> {req.sender?.name || req.sender?.email}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
