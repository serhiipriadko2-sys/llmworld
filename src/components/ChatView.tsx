import React, { useRef, useEffect, useState } from 'react';
import { Send, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import { Message } from '../hooks/useGameEngine';

interface ChatViewProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  onAction: (action: string) => void;
  companionName: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ messages, isTyping, onSendMessage, onAction, companionName }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <motion.div 
      key="chat"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex-1 overflow-y-auto p-4 space-y-4 pb-32 relative h-full flex flex-col"
    >
      <div className="flex-1 space-y-4">
        {messages.map((msg) => {
          const suggestMatch = msg.text.match(/\[Suggest:\s*(.+?)\]/i);
          const cleanText = msg.text.replace(/\[Suggest:\s*(.+?)\]/gi, '').trim();

          return (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : msg.role === 'system' ? 'items-center' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 
                msg.role === 'system' ? 'bg-zinc-800/50 text-zinc-400 text-xs italic rounded-full px-4 py-1' :
                'bg-zinc-800 text-zinc-200 rounded-tl-sm border border-zinc-700/50'
              }`}>
                {msg.role === 'companion' && <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 font-bold">{companionName}</div>}
                {cleanText}
              </div>
              {msg.role === 'companion' && suggestMatch && !isTyping && (
                <button 
                  onClick={() => onAction(suggestMatch[1])}
                  className="mt-2 ml-2 bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 text-emerald-300 text-xs py-1.5 px-3 rounded-full transition-colors flex items-center gap-1"
                >
                  <Navigation size={12} /> Execute: {suggestMatch[1]}
                </button>
              )}
            </div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 text-zinc-400 rounded-2xl rounded-tl-sm p-3 text-sm border border-zinc-700/50 flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pt-10">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Talk to ${companionName} or type /vector [goal]...`}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-full py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600 text-white"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-full transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
