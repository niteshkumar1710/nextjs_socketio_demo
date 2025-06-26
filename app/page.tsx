'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket: any;

export default function HomePage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket = io();

    socket.on('connect', () => {
      console.log('✅ Connected:', socket.id);
    });

    socket.on('message', (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('message', input);
      setInput('');
    }
  };

  return (
    <main style={{ padding: 30 }}>
      <h2>💬 Socket.IO Chat</h2>
      <div>
        {messages.map((msg, i) => (
          <p key={i}>📩 {msg}</p>
        ))}
      </div>
      <input
        placeholder="Type a message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage} style={{ marginLeft: 8 }}>
        Send
      </button>
    </main>
  );
}
