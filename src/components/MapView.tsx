import React from 'react';
import { motion } from 'motion/react';
import { Navigation, Tent, Backpack, Users } from 'lucide-react';
import { GameState } from '../services/geminiService';
import { LOCATIONS } from '../constants';
import { GameMap3D } from './GameMap3D';

interface MapViewProps {
  gameState: GameState;
  onAction: (action: string) => void;
  isTyping: boolean;
}

const getLocationColor = (type: string) => {
  switch (type) {
    case 'safe_hub': return 'bg-emerald-500';
    case 'risk_zone': return 'bg-rose-500';
    case 'route': return 'bg-indigo-500';
    default: return 'bg-zinc-500';
  }
};

export const MapView: React.FC<MapViewProps> = ({ gameState, onAction, isTyping }) => {
  const currentLocationData = LOCATIONS[gameState.location as keyof typeof LOCATIONS];

  return (
    <motion.div 
      key="map"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 overflow-hidden flex flex-col h-full"
    >
      {/* 3D Map Area */}
      <div className="relative w-full flex-1 bg-zinc-900 border-b border-zinc-800 min-h-[300px]">
        <GameMap3D gameState={gameState} onAction={onAction} isTyping={isTyping} />
        
        {/* Overlay UI */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <div className="bg-zinc-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-zinc-700 text-xs font-mono inline-block">
            <span className="text-zinc-400">LOC: </span>
            <span className="text-emerald-400 font-bold">{gameState.location.toUpperCase()}</span>
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4 pointer-events-none">
           <div className="text-[10px] text-zinc-500 font-mono bg-black/50 px-2 py-1 rounded">
             LMB: Rotate | Scroll: Zoom
           </div>
        </div>
      </div>

      {/* Actions Panel (Bottom Sheet style) */}
      <div className="p-4 bg-zinc-950 border-t border-zinc-900 h-auto max-h-[40%] overflow-y-auto">
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-4">
          <h3 className="font-bold text-lg text-white mb-1">{gameState.location}</h3>
          <p className="text-sm text-zinc-400 mb-4">{currentLocationData.description}</p>
          
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => onAction('Scavenge for resources')}
              disabled={isTyping}
              className="bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-white"
            >
              <Backpack size={16} className="text-amber-400"/> Scavenge
            </button>
            <button 
              onClick={() => onAction('Rest and recover energy')}
              disabled={isTyping}
              className="bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-white"
            >
              <Tent size={16} className="text-emerald-400"/> Rest
            </button>
          </div>
          
          {gameState.location === "Haven's Rest" && (
            <button 
              onClick={() => onAction('Trade with the passing Caravan')}
              disabled={isTyping}
              className="w-full mt-2 bg-indigo-900/30 hover:bg-indigo-900/50 border border-indigo-500/30 py-3 rounded-lg text-sm font-medium text-indigo-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Users size={16}/> Trade with Caravan
            </button>
          )}
        </div>

        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider px-1 mb-2">Travel Routes</h3>
        <div className="space-y-2">
          {currentLocationData.routes.map(route => (
            <button 
              key={route}
              onClick={() => onAction(`Travel to ${route}`)}
              disabled={isTyping}
              className="w-full text-left bg-zinc-900 hover:bg-zinc-800 p-3 rounded-xl border border-zinc-800 transition-colors disabled:opacity-50 flex justify-between items-center group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${getLocationColor(LOCATIONS[route as keyof typeof LOCATIONS].type)}`}></div>
                <div>
                  <div className="font-medium text-zinc-200 text-sm">{route}</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{LOCATIONS[route as keyof typeof LOCATIONS].type.replace('_', ' ')}</div>
                </div>
              </div>
              <Navigation size={16} className="text-zinc-600 group-hover:text-white transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

