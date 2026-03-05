import React from 'react';
import { Shield, Battery, Heart, Backpack, Zap, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { GameState, CompanionState } from '../services/geminiService';

interface StatsViewProps {
  gameState: GameState;
  companionState: CompanionState;
}

const StatCard = ({ icon: Icon, label, value, max, color, subtext }: any) => (
  <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 relative overflow-hidden">
    <div className={`absolute top-0 right-0 p-2 opacity-10 ${color}`}>
      <Icon size={48} />
    </div>
    <div className="flex justify-between items-center mb-2 relative z-10">
      <div className={`p-2 rounded-lg bg-zinc-950 ${color.replace('text-', 'text-opacity-100 text-')}`}>
        <Icon size={18} />
      </div>
      <span className="text-lg font-mono font-bold text-white">{value}<span className="text-zinc-600 text-sm">/{max}</span></span>
    </div>
    <div className="w-full bg-zinc-950 rounded-full h-2 mb-2">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${(value / max) * 100}%` }}
        className={`h-2 rounded-full ${color.replace('text-', 'bg-')}`}
      />
    </div>
    <div className="flex justify-between items-end">
      <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{label}</span>
      {subtext && <span className="text-[10px] text-zinc-600">{subtext}</span>}
    </div>
  </div>
);

export const StatsView: React.FC<StatsViewProps> = ({ gameState, companionState }) => {
  return (
    <motion.div 
      key="stats"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 overflow-y-auto p-4 pb-32 space-y-6"
    >
      <section>
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-1">Player Vitality</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard 
            icon={Heart} 
            label="Health" 
            value={gameState.playerHealth} 
            max={100} 
            color="text-rose-500" 
            subtext="Physical State"
          />
          <StatCard 
            icon={Backpack} 
            label="Resources" 
            value={gameState.resources} 
            max={100} 
            color="text-amber-500" 
            subtext="Supplies"
          />
        </div>
      </section>

      <section>
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 px-1">Companion Status: {companionState.name}</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <StatCard 
              icon={Battery} 
              label="Energy" 
              value={companionState.energy} 
              max={100} 
              color="text-cyan-500" 
              subtext="Processing Power"
            />
            <StatCard 
              icon={Shield} 
              label="Bond" 
              value={companionState.bond} 
              max={100} 
              color="text-indigo-500" 
              subtext="Trust Level"
            />
          </div>
          
          {/* Mood Card */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-950 text-purple-500">
                <Activity size={18} />
              </div>
              <div>
                <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Current Mood</div>
                <div className="text-lg font-bold text-white">{companionState.mood}</div>
              </div>
            </div>
            <div className="text-xs px-2 py-1 rounded bg-zinc-950 text-zinc-500 border border-zinc-800">
              {companionState.trait} Protocol
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
