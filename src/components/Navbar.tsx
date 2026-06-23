'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { BookOpen, Library, ShieldCheck, LogOut, LogIn, UserPlus, Menu, X, UserCircle } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/books');
    setMenuOpen(false);
  };

  const navLink =
    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200';

  const guestLinks = (
    <>
      <Link href="/books" className={navLink} onClick={() => setMenuOpen(false)}>
        <BookOpen size={16} /> All Books
      </Link>
      <Link href="/login" className={navLink} onClick={() => setMenuOpen(false)}>
        <LogIn size={16} /> Login
      </Link>
      <Link
        href="/register"
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200"
        onClick={() => setMenuOpen(false)}
      >
        <UserPlus size={16} /> Register
      </Link>
    </>
  );

  const userLinks = (
    <>
      <Link href="/books" className={navLink} onClick={() => setMenuOpen(false)}>
        <BookOpen size={16} /> All Books
      </Link>
      <Link href="/me/books" className={navLink} onClick={() => setMenuOpen(false)}>
        <Library size={16} /> My Books
      </Link>
      {user?.role === 'ADMIN' && (
        <Link href="/admin" className={navLink} onClick={() => setMenuOpen(false)}>
          <ShieldCheck size={16} /> Admin Panel
        </Link>
      )}
      <Link
        href="/profile"
        className={navLink}
        onClick={() => setMenuOpen(false)}
      >
        {user?.avatarUrl ? (
          <div className="w-5 h-5 rounded-full relative overflow-hidden">
            <Image src={user.avatarUrl} alt="Avatar" fill className="object-cover" />
          </div>
        ) : (
          <UserCircle size={18} />
        )}
        {user?.name || user?.email?.split('@')[0]}
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
      >
        <LogOut size={16} /> Logout
      </button>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/books" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
              <BookOpen size={18} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">BookSwap</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {user ? userLinks : guestLinks}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1 bg-slate-900/95">
          {user ? userLinks : guestLinks}
        </div>
      )}
    </nav>
  );
}
