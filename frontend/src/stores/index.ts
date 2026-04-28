import { create } from 'zustand';
import type { ChatMessage } from '../types';

interface UserInfo {
  id: number | null;
  username: string;
  first_name: string;
  last_name: string;
  email?: string;
  is_staff?: boolean;
  is_superuser?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  login: (username: string, tokens: { access: string; refresh: string }) => void;
  logout: () => void;
  setUser: (user: UserInfo) => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: !!localStorage.getItem('access_token'),
  user: localStorage.getItem('user_info') ? JSON.parse(localStorage.getItem('user_info')!) : null,
  login: (_username, tokens) => {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    set({ isAuthenticated: true });
  },
  setUser: (user) => {
    localStorage.setItem('user_info', JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    set({ isAuthenticated: false, user: null });
  },
  isAdmin: () => {
    const user = get().user;
    return !!(user?.is_staff || user?.is_superuser);
  },
}));

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (msg: ChatMessage) => void;
  setLoading: (v: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setLoading: (v) => set({ isLoading: v }),
  clearMessages: () => set({ messages: [] }),
}));

interface SidebarState {
  collapsed: boolean;
  toggle: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: false,
  toggle: () => set((s) => ({ collapsed: !s.collapsed })),
}));
