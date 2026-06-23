"use client";

import { create } from "zustand";
import { User } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  isInitialized: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  initializeAuth: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isInitialized: false,

  login: (token: string, user: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
    }
    set({ token, user });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
    set({ token: null, user: null });
  },

  initializeAuth: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      const userStr = localStorage.getItem("auth_user");
      if (token && userStr) {
        try {
          const user: User = JSON.parse(userStr);
          set({ token, user, isInitialized: true });
          return;
        } catch {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
        }
      }
    }
    set({ isInitialized: true });
  },

  updateUser: (data: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...data };
      if (typeof window !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    });
  },
}));
