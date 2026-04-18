import React from 'react';
import {
  Compass,
  MessageSquareMore,
  Settings,
  Shield,
} from 'lucide-react';

interface NavigationProps {
  activeTab: 'chat' | 'map' | 'stats' | 'settings';
  setActiveTab: (tab: 'chat' | 'map' | 'stats' | 'settings') => void;
}

const tabs = [
  { id: 'chat', label: 'Comms', icon: MessageSquareMore, accent: 'text-[var(--accent-cyan)]' },
  { id: 'map', label: 'Terrain', icon: Compass, accent: 'text-[var(--accent-emerald)]' },
  { id: 'stats', label: 'Vitals', icon: Shield, accent: 'text-[var(--accent-amber)]' },
  { id: 'settings', label: 'Setup', icon: Settings, accent: 'text-[var(--accent-indigo)]' },
] as const;

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="nav-dock rounded-[24px] border border-white/8 p-2 shadow-[0_18px_40px_rgba(0,0,0,0.24)]">
      <div className="grid grid-cols-4 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-[18px] border px-2 py-3 transition-all sm:px-3 ${
                isActive
                  ? 'border-white/12 bg-white/8 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                  : 'border-transparent bg-transparent hover:border-white/8 hover:bg-white/4'
              }`}
            >
              <span className="flex flex-col items-center gap-1.5">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
                    isActive
                      ? 'border-white/10 bg-black/18'
                      : 'border-white/6 bg-black/12'
                  } ${tab.accent}`}
                >
                  <Icon size={18} />
                </span>
                <span className="text-[11px] font-medium tracking-[0.18em] text-[var(--text-muted)] uppercase">
                  {tab.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
