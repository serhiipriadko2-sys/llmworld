import React from 'react';
import { Send, Map as MapIcon, Shield, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: 'chat' | 'map' | 'stats' | 'settings';
  setActiveTab: (tab: 'chat' | 'map' | 'stats' | 'settings') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="flex-none bg-zinc-900 border-t border-zinc-800 flex justify-around p-2 pb-safe">
      <button 
        onClick={() => setActiveTab('chat')}
        className={`flex flex-col items-center p-2 rounded-lg min-w-[64px] transition-colors ${activeTab === 'chat' ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}
      >
        <Send size={20} className="mb-1" />
        <span className="text-[10px] font-medium">Comms</span>
      </button>
      <button 
        onClick={() => setActiveTab('map')}
        className={`flex flex-col items-center p-2 rounded-lg min-w-[64px] transition-colors ${activeTab === 'map' ? 'text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
      >
        <MapIcon size={20} className="mb-1" />
        <span className="text-[10px] font-medium">Nav</span>
      </button>
      <button 
        onClick={() => setActiveTab('stats')}
        className={`flex flex-col items-center p-2 rounded-lg min-w-[64px] transition-colors ${activeTab === 'stats' ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
      >
        <Shield size={20} className="mb-1" />
        <span className="text-[10px] font-medium">Status</span>
      </button>
      <button 
        onClick={() => setActiveTab('settings')}
        className={`flex flex-col items-center p-2 rounded-lg min-w-[64px] transition-colors ${activeTab === 'settings' ? 'text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'}`}
      >
        <Settings size={20} className="mb-1" />
        <span className="text-[10px] font-medium">Setup</span>
      </button>
    </nav>
  );
};
