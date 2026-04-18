import React from 'react';
import { Activity, Backpack, Battery, Heart, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { CompanionState, GameState } from '../services/geminiService';

interface StatsViewProps {
  gameState: GameState;
  companionState: CompanionState;
}

interface StatCardProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  max: number;
  accent: string;
  subtext: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, max, accent, subtext }) => (
  <div className="panel relative overflow-hidden rounded-[24px] border border-white/8 p-5">
    <div className="absolute right-4 top-4 opacity-10">
      <Icon size={48} className={accent} />
    </div>

    <div className="relative z-10 flex items-start justify-between gap-3">
      <div>
        <div className="section-eyebrow">{label}</div>
        <div className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">
          {value}
          <span className="ml-1 text-sm font-medium text-[var(--text-dim)]">/ {max}</span>
        </div>
      </div>

      <div className="rounded-[18px] border border-white/8 bg-black/16 p-3">
        <Icon size={18} className={accent} />
      </div>
    </div>

    <div className="mt-5 h-2.5 rounded-full bg-black/20">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        className={`h-2.5 rounded-full ${accent.replace('text-', 'bg-')}`}
      />
    </div>

    <div className="mt-3 text-xs uppercase tracking-[0.18em] text-[var(--text-dim)]">
      {subtext}
    </div>
  </div>
);

export const StatsView: React.FC<StatsViewProps> = ({ gameState, companionState }) => {
  return (
    <motion.section
      key="stats"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex min-h-0 flex-1 flex-col p-3 sm:p-4"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="section-eyebrow">Vital Readout</div>
          <h2 className="mt-2 font-[var(--font-display)] text-3xl leading-none text-[var(--text-primary)]">
            Status Overview
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            Read the current condition of the expedition pair before committing to the next route or action.
          </p>
        </div>
        <span className="status-chip self-start sm:self-auto">Vitals Online</span>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            icon={Heart}
            label="Health"
            value={gameState.playerHealth}
            max={100}
            accent="text-rose-400"
            subtext="Physical state"
          />
          <StatCard
            icon={Backpack}
            label="Resources"
            value={gameState.resources}
            max={100}
            accent="text-amber-400"
            subtext="Supplies"
          />
          <StatCard
            icon={Battery}
            label="Energy"
            value={companionState.energy}
            max={100}
            accent="text-cyan-400"
            subtext="Processing power"
          />
          <StatCard
            icon={Shield}
            label="Bond"
            value={companionState.bond}
            max={100}
            accent="text-indigo-400"
            subtext="Trust level"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="panel rounded-[24px] border border-white/8 p-5">
            <div className="section-eyebrow">Companion Profile</div>
            <div className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">
              {companionState.name}
            </div>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Trait signature and emotional state shape how Aegis interprets danger, recovery, and long-term intent.
            </p>
          </div>

          <div className="panel rounded-[24px] border border-white/8 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="section-eyebrow">Current Mood</div>
                <div className="mt-3 text-2xl font-semibold text-[var(--text-primary)]">
                  {companionState.mood}
                </div>
              </div>
              <div className="rounded-[18px] border border-white/8 bg-black/16 p-3">
                <Activity size={18} className="text-[var(--accent-emerald)]" />
              </div>
            </div>
            <div className="mt-4 rounded-[18px] border border-white/8 bg-black/16 px-4 py-3 text-sm text-[var(--text-muted)]">
              {companionState.trait} protocol is currently active.
            </div>
          </div>

          <div className="panel rounded-[24px] border border-white/8 p-5">
            <div className="section-eyebrow">Field Notes</div>
            <ul className="mt-4 space-y-3 text-sm text-[var(--text-muted)]">
              <li className="rounded-[18px] border border-white/8 bg-white/3 px-4 py-3">
                High bond makes risky suggestions feel collaborative instead of adversarial.
              </li>
              <li className="rounded-[18px] border border-white/8 bg-white/3 px-4 py-3">
                Energy is the quickest signal for when rest should outrank exploration.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
