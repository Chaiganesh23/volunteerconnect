// authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  uid: string;
  name: string;
  email: string;
  role?: 'volunteer' | 'organization'; // ✅ Make optional
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => {
        console.log('[Zustand] User set:', user);
        set({ user, isAuthenticated: !!user });
      },

      clearAuth: () => {
        console.log('[Zustand] User cleared');
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);