import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import api from './axios';
import { User } from './types';
import { authApi } from './api';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

interface RegisterData {
  username: string;
  name: string;
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  name: string;
  roles: string[];
}

type AuthPersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState, Pick<AuthState, 'token'>>
) => StateCreator<AuthState>;

export const useAuth = create<AuthState>()(
  (persist as AuthPersist)(
    (set: (state: Partial<AuthState>) => void) => ({
      user: null,
      token: null,
      setUser: (user: User | null) => set({ user }),
      login: async (username: string, password: string) => {
        try {
          const response = await authApi.login(username, password);
          const { token, ...userData } = response.data as LoginResponse;
          
          localStorage.setItem('token', token);
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          
          set({ user: userData as User, token });
        } catch (error) {
          localStorage.removeItem('token');
          set({ user: null, token: null });
          throw error;
        }
      },
      register: async (data: RegisterData) => {
        const response = await authApi.register(data);
        const { token, ...userData } = response.data as LoginResponse;
        
        localStorage.setItem('token', token);
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        
        set({ user: userData as User, token });
      },
      logout: () => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common.Authorization;
        set({ user: null, token: null });
      },
      forgotPassword: async (email: string) => {
        await authApi.forgotPassword(email);
      },
      resetPassword: async (token: string, newPassword: string) => {
        await authApi.resetPassword(token, newPassword);
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state: AuthState) => ({ token: state.token }),
    }
  )
);

if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    api.get<User>('/users/me')
      .then((response: { data: User }) => {
        useAuth.getState().setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem('token');
        delete api.defaults.headers.common.Authorization;
      });
  }
}