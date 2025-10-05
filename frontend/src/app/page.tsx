'use client';

import { useState } from 'react';

// Простой интерфейс для задачи (расширим позже для Redux/Mongo)
interface Task {
  id: number;
  text: string;
  done: boolean;
}

const Home: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState<string>('');

  const addTask = (): void => {
    if (input.trim()) {
      setTasks([...tasks, { id: Date.now(), text: input, done: false }]);
      setInput('');
    }
  };

  const toggleTask = (id: number): void => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, done: !task.done } : task
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1rem', color: '#4a5568' }}>AI Task Helper</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <input 
          type="text"
          value={input} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)} 
          onKeyDown={handleKeyPress}
          placeholder="Введи задачу или NLP-команду (e.g. 'Добавь пробежку завтра в 7')" 
          style={{ 
            flex: 1, 
            padding: '0.75rem', 
            border: '1px solid #ddd', 
            borderRadius: '4px' 
          }}
        />
        <button 
          onClick={addTask} 
          style={{ 
            padding: '0.75rem 1.5rem', 
            background: '#4299e1', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Добавить
        </button>
      </div>
      <ul style={{ listStyle: 'none' }}>
        {tasks.map((task: Task) => (
          <li 
            key={task.id} 
            style={{ 
              padding: '0.5rem', 
              borderBottom: '1px solid #eee', 
              display: 'flex', 
              alignItems: 'center',
              textDecoration: task.done ? 'line-through' : 'none',
              opacity: task.done ? 0.6 : 1
            }}
          >
            <input 
              type="checkbox" 
              checked={task.done}
              onChange={() => toggleTask(task.id)} 
              style={{ marginRight: '0.5rem' }} 
            />
            <span>{task.text}</span>
          </li>
        ))}
      </ul>
      {tasks.length === 0 && (
        <p style={{ color: '#a0aec0', textAlign: 'center', fontStyle: 'italic' }}>
          Нет задач. Добавь первую!
        </p>
      )}
    </main>
  );
};

export default Home;