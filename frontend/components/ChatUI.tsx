'use client';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2 } from 'lucide-react';

export default function ChatUI() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
  
    try {
      // Use environment variable for API URL with fallback to localhost for development
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await axios.post(`${apiUrl}/chat`, { prompt: input });
      const botMessage = { role: 'assistant', content: res.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error connecting to server:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error: Could not reach the server.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };  

  return (
    <div className="flex flex-col h-[80vh] bg-white rounded-lg shadow-lg">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Bot size={48} className="mb-2" />
            <p>Start a conversation with the Groq chatbot!</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div 
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`flex max-w-[80%] ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div className={`flex items-center justify-center h-8 w-8 rounded-full ${
                msg.role === 'user' ? 'bg-blue-500 ml-2' : 'bg-gray-600 mr-2'
              }`}>
                {msg.role === 'user' ? 
                  <User size={16} className="text-white" /> : 
                  <Bot size={16} className="text-white" />
                }
              </div>
              <div 
                className={`p-3 rounded-lg ${
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-tr-none'
                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-600 mr-2">
                <Bot size={16} className="text-white" />
              </div>
              <div className="p-3 rounded-lg bg-gray-100 rounded-tl-none">
                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-transparent outline-none placeholder-gray-400 text-gray-800 "
            placeholder="Type your message..."
          />
          <button 
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className={`ml-2 p-2 rounded-full ${
              !input.trim() || isLoading
                ? 'bg-gray-300 text-gray-500'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            } transition-colors`}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}