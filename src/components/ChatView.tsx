import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { Message } from '../hooks/useGameEngine';

interface ChatViewProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  onAction: (action: string) => void;
  companionName: string;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  isTyping,
  onSendMessage,
  onAction,
  companionName,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <motion.section
      key="chat"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex min-h-0 flex-1 flex-col px-3 py-3 sm:px-4 sm:py-4"
    >
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="section-eyebrow">Primary Channel</div>
          <h2 className="mt-2 font-[var(--font-display)] text-3xl leading-none text-[var(--text-primary)]">
            {companionName}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            Keep the companion thread focused. Vector updates, tactical prompts, and AI suggestions all flow through this deck.
          </p>
        </div>
        <span className="status-chip self-start sm:self-auto">
          {isTyping ? 'Syncing Reply' : 'Link Stable'}
        </span>
      </div>

      <div className="panel flex min-h-0 flex-1 flex-col rounded-[24px] border border-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          <div className="space-y-4">
            {messages.map((msg) => {
              const suggestMatch = msg.text.match(/\[Suggest:\s*(.+?)\]/i);
              const cleanText = msg.text.replace(/\[Suggest:\s*(.+?)\]/gi, '').trim();
              const isUser = msg.role === 'user';
              const isSystem = msg.role === 'system';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isUser ? 'items-end' : isSystem ? 'items-center' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-[22px] px-4 py-3 text-sm leading-relaxed shadow-[0_18px_32px_rgba(0,0,0,0.18)] sm:max-w-[82%] ${
                      isUser
                        ? 'rounded-tr-md border border-[rgba(121,216,208,0.2)] bg-[linear-gradient(135deg,rgba(79,208,166,0.18),rgba(142,149,255,0.16))] text-[var(--text-primary)]'
                        : isSystem
                          ? 'rounded-full border border-white/8 bg-black/18 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[var(--text-dim)]'
                          : 'rounded-tl-md border border-white/8 bg-[rgba(10,23,28,0.92)] text-[var(--text-primary)]'
                    }`}
                  >
                    {!isUser && !isSystem && (
                      <div className="mb-2 text-[10px] font-[var(--font-mono)] uppercase tracking-[0.26em] text-[var(--accent-cyan)]">
                        {companionName}
                      </div>
                    )}
                    {cleanText}
                  </div>

                  {!isSystem && !isUser && suggestMatch && !isTyping && (
                    <button
                      onClick={() => onAction(suggestMatch[1])}
                      className="mt-2 inline-flex items-center gap-2 rounded-full border border-[rgba(79,208,166,0.22)] bg-[rgba(79,208,166,0.1)] px-3 py-2 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[rgba(79,208,166,0.16)]"
                    >
                      <ArrowUpRight size={14} className="text-[var(--accent-emerald)]" />
                      Execute: {suggestMatch[1]}
                    </button>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/8 bg-black/18 px-4 py-3 text-xs text-[var(--text-muted)]">
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-cyan)] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-cyan)] animate-bounce" style={{ animationDelay: '120ms' }} />
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-cyan)] animate-bounce" style={{ animationDelay: '240ms' }} />
                  </div>
                  Aegis is composing a response
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-white/8 bg-[rgba(5,12,15,0.5)] p-3 sm:p-4">
          <div className="field-shell flex items-center gap-3 rounded-[22px] p-2 pl-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Talk to ${companionName} or type /vector [goal]`}
              className="min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-dim)]"
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] border border-[rgba(121,216,208,0.2)] bg-[linear-gradient(135deg,rgba(79,208,166,0.16),rgba(142,149,255,0.18))] text-[var(--text-primary)] transition-opacity disabled:opacity-35"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
