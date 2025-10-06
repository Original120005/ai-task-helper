'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { toggleTask, removeTask, fetchTasks, addTaskAsync, type Task } from '@/store/taskSlice';
import { login, register, logout, setCredentials } from '@/store/authSlice';
import Login from '@/components/Login';
import Register from '@/components/Register';
import axios from 'axios';

const Home: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [activeForm, setActiveForm] = useState<'login' | 'register'>('login');
  const { tasks, loading: taskLoading, error: taskError } = useSelector((state: RootState) => state.tasks);
  const { user, token, loading: authLoading, error: authError } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken && !token) {
      dispatch(setCredentials({ token: savedToken, user: { id: 'temp_from_token', email: 'temp_email' } }));
    }
    if (token) {
      dispatch(fetchTasks());
    }
  }, [dispatch, token]);

  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    return () => axios.interceptors.request.eject(interceptor);
  }, [token]);

  const handleAddTask = (): void => {
    if (input.trim()) {
      const taskData = { text: input, done: false };
      dispatch(addTaskAsync(taskData));
      setInput('');
    }
  };

  const handleToggleTask = (id: string): void => {  // id: string.
    dispatch(toggleTask(id));
  };

  const handleRemoveTask = (id: string): void => {  // id: string.
    dispatch(removeTask(id));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') handleAddTask();
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  if (authLoading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Загрузка...</div>;

  if (user && token) {
    return (
      <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ color: '#4a5568' }}>AI Task Helper</h1>
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px' }}>
            Выйти ({user.email})
          </button>
        </div>
        {authError && <p style={{ color: 'red', textAlign: 'center' }}>{authError}</p>}
        {taskLoading && <div style={{ textAlign: 'center' }}>Загрузка задач...</div>}
        {taskError && <div style={{ color: 'red', textAlign: 'center' }}>Ошибка: {taskError}</div>}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input 
            type="text"
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={handleKeyPress}
            placeholder="Введи задачу..." 
            style={{ flex: 1, padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <button onClick={handleAddTask} style={{ padding: '0.75rem 1.5rem', background: '#4299e1', color: 'white', border: 'none', borderRadius: '4px' }}>
            Добавить
          </button>
        </div>
        <ul style={{ listStyle: 'none' }}>
          {tasks.map((task: Task) => (
            <li key={task.id} style={{ padding: '0.5rem', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" checked={task.done} onChange={() => handleToggleTask(task.id)} style={{ marginRight: '0.5rem' }} />
                <span style={{ textDecoration: task.done ? 'line-through' : 'none', opacity: task.done ? 0.6 : 1 }}>{task.text}</span>
              </div>
              <button onClick={() => handleRemoveTask(task.id)} style={{ color: 'red', background: 'none', border: 'none' }}>Удалить</button>
            </li>
          ))}
        </ul>
        {tasks.length === 0 && <p style={{ color: '#a0aec0', textAlign: 'center' }}>Нет задач.</p>}
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#4a5568', marginBottom: '2rem' }}>AI Task Helper</h1>
      {authError && <p style={{ color: 'red', textAlign: 'center' }}>{authError}</p>}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => setActiveForm('login')} style={{ flex: 1, padding: '0.5rem', background: activeForm === 'login' ? '#4299e1' : 'transparent', color: activeForm === 'login' ? 'white' : '#333' }}>
          Войти
        </button>
        <button onClick={() => setActiveForm('register')} style={{ flex: 1, padding: '0.5rem', background: activeForm === 'register' ? '#4299e1' : 'transparent', color: activeForm === 'register' ? 'white' : '#333' }}>
          Регистрация
        </button>
      </div>
      {activeForm === 'login' ? <Login /> : <Register />}
    </main>
  );
};

export default Home;