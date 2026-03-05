import React from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { CompanionState } from '../services/geminiService';

interface SettingsViewProps {
  companionState: CompanionState;
  onUpdateSettings: (updates: Partial<CompanionState>) => void;
  onResetGame: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ companionState, onUpdateSettings, onResetGame }) => {
  return (
    <motion.div 
      key="settings"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 overflow-y-auto p-4 pb-32 space-y-6"
    >
      <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-white"><Settings className="text-zinc-400"/> Companion Setup</h2>
      
      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-4">
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Companion Name</label>
          <input 
            type="text" 
            value={companionState.name}
            onChange={(e) => onUpdateSettings({ name: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-zinc-200"
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Core Trait</label>
          <select 
            value={companionState.trait}
            onChange={(e) => onUpdateSettings({ trait: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-zinc-200 appearance-none"
          >
            <option value="Protective">Protective (Focuses on safety)</option>
            <option value="Aggressive">Aggressive (Prefers combat/risk)</option>
            <option value="Cautious">Cautious (Avoids danger, saves resources)</option>
            <option value="Curious">Curious (Wants to explore everything)</option>
            <option value="Sarcastic">Sarcastic (Mocks the player's choices)</option>
          </select>
        </div>
        
        <div className="pt-2">
          <p className="text-xs text-zinc-500 leading-relaxed">
            The core trait directly affects how the LLM model responds to your actions and what plans it suggests. 
            Changes take effect immediately in the next message.
          </p>
        </div>
      </div>

      <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 space-y-4">
        <h3 className="text-sm font-bold text-rose-500 uppercase tracking-wider">Danger Zone</h3>
        <button 
          onClick={onResetGame}
          className="w-full bg-rose-900/20 hover:bg-rose-900/40 border border-rose-500/30 text-rose-400 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 size={16} /> Reset Progress
        </button>
      </div>
    </motion.div>
  );
};
