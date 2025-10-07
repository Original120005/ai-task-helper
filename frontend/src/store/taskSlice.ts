// src/store/taskSlice.ts — async thunks for API, no duplicate exports.

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Task {
  id: string;  // String = _id from backend (unique).
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

// Async thunk for GET /tasks (load from DB).
export const fetchTasks = createAsyncThunk(
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

// Async thunk for POST /tasks (add).
export const addTaskAsync = createAsyncThunk(
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

// Async thunk for DELETE /tasks/:id (delete from DB).
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`);
      return id;  // Return id to remove from state.
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Delete failed');
    }
  }
);

// Async thunk for NLP parsing (/ai/parse).
export const parseTask = createAsyncThunk(
  'tasks/parseTask',
  async (text: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/ai/parse`, { text });
      return { ...response.data, id: response.data._id };  // id = _id.
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Parse failed');
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
      })
      // Delete handling.
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.tasks = state.tasks.filter(t => t.id !== action.payload);  // Remove from state.
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Parse handling.
      .addCase(parseTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(parseTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(parseTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { toggleTask } = taskSlice.actions;
// No duplicate export for thunks — they are already named exports.
export default taskSlice.reducer;