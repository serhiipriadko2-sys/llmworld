import React from 'react';
import { Map as MapIcon } from 'lucide-react';
import { GameState } from '../services/geminiService';

interface HeaderProps {
  gameState: GameState;
}

export const Header: React.FC<HeaderProps> = ({ gameState }) => {
  return (
    <header className="flex-none p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center z-10">
      <div>
        <h1 className="text-lg font-bold tracking-tight text-zinc-100">Project Aegis</h1>
        <div className="text-xs text-zinc-400 flex items-center gap-2">
          <MapIcon size={12} /> {gameState.location} • Day {gameState.day}
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col items-end">
           <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Vector</span>
           <span className="text-xs text-emerald-400 truncate max-w-[100px]">{gameState.vector}</span>
        </div>
      </div>
    </header>
  );
};
