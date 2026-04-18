import React from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { CompanionState } from '../services/geminiService';

interface SettingsViewProps {
  companionState: CompanionState;
  onUpdateSettings: (updates: Partial<CompanionState>) => void;
  onResetGame: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  companionState,
  onUpdateSettings,
  onResetGame,
}) => {
  return (
    <motion.section
      key="settings"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex min-h-0 flex-1 flex-col p-3 sm:p-4"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="section-eyebrow">Configuration Deck</div>
          <h2 className="mt-2 flex items-center gap-3 font-[var(--font-display)] text-3xl leading-none text-[var(--text-primary)]">
            <Settings size={24} className="text-[var(--accent-indigo)]" />
            Companion Setup
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            Tune identity and behaviour cues without touching the underlying expedition state.
          </p>
        </div>
        <span className="status-chip self-start sm:self-auto">Profile Mutable</span>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="panel rounded-[24px] border border-white/8 p-5">
          <div className="section-eyebrow">Identity Controls</div>

          <div className="mt-5 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-[var(--text-dim)]">
                Companion Name
              </label>
              <input
                type="text"
                value={companionState.name}
                onChange={(e) => onUpdateSettings({ name: e.target.value })}
                className="field-shell w-full rounded-[18px] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-dim)] focus:border-[rgba(142,149,255,0.25)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium uppercase tracking-[0.22em] text-[var(--text-dim)]">
                Core Trait
              </label>
              <select
                value={companionState.trait}
                onChange={(e) => onUpdateSettings({ trait: e.target.value })}
                className="field-shell w-full rounded-[18px] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[rgba(142,149,255,0.25)]"
              >
                <option value="Protective">Protective</option>
                <option value="Aggressive">Aggressive</option>
                <option value="Cautious">Cautious</option>
                <option value="Curious">Curious</option>
                <option value="Sarcastic">Sarcastic</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="panel rounded-[24px] border border-white/8 p-5">
            <div className="section-eyebrow">Trait Impact</div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
              The selected trait nudges how the companion frames risk, recovery, and ambition in the next generated reply.
            </p>
            <div className="mt-4 rounded-[18px] border border-white/8 bg-black/16 px-4 py-3 text-sm text-[var(--text-primary)]">
              Active profile: <span className="text-[var(--accent-cyan)]">{companionState.trait}</span>
            </div>
          </div>

          <div className="panel rounded-[24px] border border-[rgba(242,139,151,0.18)] p-5">
            <div className="section-eyebrow">Danger Zone</div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
              Reset removes local progress and restarts the current field session from the initial state.
            </p>
            <button
              onClick={onResetGame}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-[18px] border border-[rgba(242,139,151,0.24)] bg-[rgba(242,139,151,0.1)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[rgba(242,139,151,0.14)]"
            >
              <Trash2 size={16} className="text-[var(--accent-rose)]" />
              Reset Progress
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
