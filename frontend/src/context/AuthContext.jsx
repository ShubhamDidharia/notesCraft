import { createContext, useContext, useMemo, useState } from 'react';

import { api } from '../api/client';

const AuthContext = createContext(null);
const STORAGE_KEY = 'notecraft-auth';

const getStoredAuth = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { token: '', user: null };
  }

  try {
    return JSON.parse(raw);
  } catch (_error) {
    return { token: '', user: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getStoredAuth);

  const persist = (nextAuth) => {
    setAuth(nextAuth);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
  };

  const clear = () => {
    const empty = { token: '', user: null };
    setAuth(empty);
    localStorage.removeItem(STORAGE_KEY);
  };

  const signIn = async (payload) => {
    const data = await api.signIn(payload);
    persist({ token: data.token, user: data.user });
    return data;
  };

  const signUp = async (payload) => {
    const data = await api.signUp(payload);
    persist({ token: data.token, user: data.user });
    return data;
  };

  const refreshUser = async () => {
    if (!auth.token) {
      return;
    }

    const user = await api.me(auth.token);
    persist({ token: auth.token, user });
  };

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      isAuthenticated: Boolean(auth.token),
      signIn,
      signUp,
      refreshUser,
      logout: clear,
    }),
    [auth.token, auth.user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
