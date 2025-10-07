'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/store/authSlice';
import type { AppDispatch } from '@/store';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    setLoading(true);
    setError(null);
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      console.log('Logged in successfully');
    } else {
      setError(result.payload as string || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '300px', margin: '0 auto', padding: '1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Login</h2>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Email" 
        required 
        style={{ display: 'block', margin: '0.5rem 0', padding: '0.5rem', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="Password" 
        required 
        style={{ display: 'block', margin: '0.5rem 0', padding: '0.5rem', width: '100%', border: '1px solid #ddd', borderRadius: '4px' }} 
      />
      <button 
        type="submit" 
        disabled={loading} 
        style={{ padding: '0.75rem', width: '100%', background: '#4299e1', color: 'white', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default Login;