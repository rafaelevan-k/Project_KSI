import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
  security_level: 'low' | 'normal';
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  updateSecurityLevel: (level: 'low' | 'normal') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('auth_token'),
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
  setToken: (token) => {
    localStorage.setItem('auth_token', token || '');
    set({ token });
  },
  updateSecurityLevel: (level) => {
    set((state) => {
      if (state.user) {
        const newUser = { ...state.user, security_level: level };
        localStorage.setItem('user', JSON.stringify(newUser));
        return { user: newUser };
      }
      return state;
    });
  },
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    set({ user: null, token: null });
  },
}));
