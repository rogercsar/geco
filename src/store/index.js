import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/authSlice';

// Load persisted auth state from localStorage
const loadAuthState = () => {
  try {
    const serialized = localStorage.getItem('auth');
    if (!serialized) return undefined;
    return { auth: JSON.parse(serialized) };
  } catch {
    return undefined;
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: loadAuthState(),
});

// Persist auth slice to localStorage
store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem('auth', JSON.stringify(state.auth));
  } catch {
    // ignore write errors
  }
});
