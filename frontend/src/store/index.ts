// src/store/index.ts — фикс RootState типизации.
import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './taskSlice';
import authReducer from './authSlice';
import type { TaskState } from './taskSlice';  // Импорт TaskState.
import type { AuthState } from './authSlice';  // Импорт AuthState.

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

// RootState: явные типы state (не reducer).
export interface RootState {
  tasks: TaskState;  // state.tasks — TaskState.
  auth: AuthState;   // state.auth — AuthState.
}

export type AppDispatch = typeof store.dispatch;