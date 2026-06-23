'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Mounts once at the root layout to rehydrate auth state from localStorage.
 * Must be a Client Component so it runs in the browser.
 */
export default function AuthInitializer() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return null;
}
