// src/store/taskSlice.ts — async thunks для API, без дубликатов экспорта.

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Task {
  id: string;  // String = _id from backend (уникальный).
  text: string;
  done: boolean;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// Async thunk для GET /tasks (загрузка из DB).
export const fetchTasks = createAsyncThunk(  // Уже экспортирован здесь!
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`);
      return response.data.map((t: any) => ({ ...t, id: t._id }));  // id = _id string.
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Fetch failed');
    }
  }
);

// Async thunk для POST /tasks (добавление).
export const addTaskAsync = createAsyncThunk(  // Уже экспортирован здесь!
  'tasks/addTaskAsync',
  async (taskData: Omit<Task, 'id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, taskData);
      return { ...response.data, id: response.data._id };  // id = _id string.
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Add failed');
    }
  }
);

// Slice.
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    toggleTask: (state, action: PayloadAction<string>) => {  // id: string.
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) task.done = !task.done;
    },
    removeTask: (state, action: PayloadAction<string>) => {  // id: string.
      state.tasks = state.tasks.filter(t => t.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch handling.
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add handling.
      .addCase(addTaskAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTaskAsync.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(addTaskAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Экспорт только локальных actions (thunks уже экспортированы выше).
export const { toggleTask, removeTask } = taskSlice.actions;
export default taskSlice.reducer;