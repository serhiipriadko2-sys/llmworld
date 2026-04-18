import React from 'react';
import { Map as MapIcon } from 'lucide-react';
import { GameState } from '../services/geminiService';

interface HeaderProps {
  gameState: GameState;
}

export const Header: React.FC<HeaderProps> = ({ gameState }) => {
  return (
    <header className="relative z-10 flex-none border-b border-white/8 px-4 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[var(--text-dim)]">
            <span className="status-chip">Companion Link</span>
            <span className="rounded-full border border-white/8 bg-white/4 px-3 py-1 font-[var(--font-mono)] text-[10px] tracking-[0.24em] text-[var(--text-muted)]">
              Field Build Alpha
            </span>
          </div>

          <div>
            <h1 className="font-[var(--font-display)] text-[2.1rem] font-semibold leading-none tracking-[0.02em] text-[var(--text-primary)] sm:text-[2.5rem]">
              Project Aegis
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-3 py-1.5">
                <MapIcon size={14} className="text-[var(--accent-cyan)]" />
                <span>{gameState.location}</span>
              </span>
              <span className="inline-flex items-center rounded-full border border-[rgba(243,179,91,0.16)] bg-[rgba(243,179,91,0.08)] px-3 py-1.5 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.24em] text-[var(--accent-amber)]">
                Day {gameState.day}
              </span>
            </div>
          </div>
        </div>

        <div className="panel-soft w-full rounded-[22px] border border-white/8 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:max-w-[320px]">
          <div className="section-eyebrow">Active Vector</div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-primary)] sm:text-[0.95rem]">
            {gameState.vector}
          </p>
        </div>
      </div>
    </header>
  );
};
