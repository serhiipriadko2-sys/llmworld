import React from 'react';
import { motion } from 'motion/react';
import {
  Backpack,
  Compass,
  Navigation,
  Tent,
  Users,
} from 'lucide-react';
import { LOCATIONS } from '../constants';
import { GameState } from '../services/geminiService';
import { GameMap3D } from './GameMap3D';

interface MapViewProps {
  gameState: GameState;
  onAction: (action: string) => void;
  isTyping: boolean;
}

const getLocationColor = (type: string) => {
  switch (type) {
    case 'safe_hub':
      return 'bg-[var(--accent-emerald)]';
    case 'risk_zone':
      return 'bg-[var(--accent-rose)]';
    case 'route':
      return 'bg-[var(--accent-indigo)]';
    default:
      return 'bg-[var(--text-dim)]';
  }
};

const getLocationLabel = (type: string) => {
  switch (type) {
    case 'safe_hub':
      return 'Safe Hub';
    case 'risk_zone':
      return 'Hazard Zone';
    case 'route':
      return 'Transit Route';
    default:
      return type;
  }
};

export const MapView: React.FC<MapViewProps> = ({ gameState, onAction, isTyping }) => {
  const currentLocationData = LOCATIONS[gameState.location as keyof typeof LOCATIONS];

  return (
    <motion.section
      key="map"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex min-h-0 flex-1 flex-col p-3 sm:p-4"
    >
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="section-eyebrow">Terrain Console</div>
          <h2 className="mt-2 font-[var(--font-display)] text-3xl leading-none text-[var(--text-primary)]">
            {gameState.location}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
            Scout the route network, read the weather, and commit the next field action from a single tactical surface.
          </p>
        </div>
        <span className="status-chip self-start sm:self-auto">
          {isTyping ? 'Map Locked' : 'Map Ready'}
        </span>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.92fr)]">
        <div className="relative min-h-[340px] overflow-hidden rounded-[26px] border border-white/8 bg-black/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <GameMap3D gameState={gameState} onAction={onAction} isTyping={isTyping} />

          <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-2">
            <div className="rounded-full border border-white/10 bg-[rgba(7,17,22,0.82)] px-3 py-1.5 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Terrain Feed
            </div>
            <div className="rounded-full border border-white/10 bg-[rgba(7,17,22,0.82)] px-3 py-1.5 text-sm text-[var(--text-primary)]">
              {gameState.location}
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-4 right-4 rounded-2xl border border-white/10 bg-[rgba(7,17,22,0.74)] px-3 py-2 text-[11px] font-[var(--font-mono)] uppercase tracking-[0.2em] text-[var(--text-dim)]">
            Rotate + Zoom
          </div>
        </div>

        <div className="flex min-h-0 flex-col gap-4">
          <div className="panel rounded-[24px] border border-white/8 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="section-eyebrow">Current Sector</span>
              <span className="rounded-full border border-white/10 bg-white/4 px-3 py-1 text-[10px] font-[var(--font-mono)] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                {getLocationLabel(currentLocationData.type)}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
              {currentLocationData.description}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <button
                onClick={() => onAction('Scavenge for resources')}
                disabled={isTyping}
                className="flex items-center justify-between rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] px-4 py-3 text-left text-[var(--text-primary)] transition-colors hover:bg-[rgba(255,255,255,0.06)] disabled:opacity-50"
              >
                <span>
                  <span className="section-eyebrow block">Action</span>
                  <span className="mt-2 block text-sm font-medium">Scavenge</span>
                </span>
                <Backpack size={18} className="text-[var(--accent-amber)]" />
              </button>

              <button
                onClick={() => onAction('Rest and recover energy')}
                disabled={isTyping}
                className="flex items-center justify-between rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] px-4 py-3 text-left text-[var(--text-primary)] transition-colors hover:bg-[rgba(255,255,255,0.06)] disabled:opacity-50"
              >
                <span>
                  <span className="section-eyebrow block">Action</span>
                  <span className="mt-2 block text-sm font-medium">Rest</span>
                </span>
                <Tent size={18} className="text-[var(--accent-emerald)]" />
              </button>
            </div>

            {gameState.location === "Haven's Rest" && (
              <button
                onClick={() => onAction('Trade with the passing Caravan')}
                disabled={isTyping}
                className="mt-3 flex w-full items-center justify-between rounded-[20px] border border-[rgba(142,149,255,0.22)] bg-[rgba(142,149,255,0.08)] px-4 py-3 text-left text-[var(--text-primary)] transition-colors hover:bg-[rgba(142,149,255,0.12)] disabled:opacity-50"
              >
                <span>
                  <span className="section-eyebrow block">Local Event</span>
                  <span className="mt-2 block text-sm font-medium">Trade with Caravan</span>
                </span>
                <Users size={18} className="text-[var(--accent-indigo)]" />
              </button>
            )}
          </div>

          <div className="panel flex min-h-0 flex-1 flex-col rounded-[24px] border border-white/8 p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="section-eyebrow">Travel Routes</div>
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  Available paths from the current position.
                </p>
              </div>
              <Compass size={18} className="text-[var(--accent-cyan)]" />
            </div>

            <div className="mt-4 min-h-0 space-y-3 overflow-y-auto pr-1">
              {currentLocationData.routes.map((route) => (
                <button
                  key={route}
                  onClick={() => onAction(`Travel to ${route}`)}
                  disabled={isTyping}
                  className="flex w-full items-center justify-between rounded-[20px] border border-white/8 bg-[rgba(255,255,255,0.03)] px-4 py-3 text-left transition-colors hover:bg-[rgba(255,255,255,0.06)] disabled:opacity-50"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${getLocationColor(
                        LOCATIONS[route as keyof typeof LOCATIONS].type,
                      )}`}
                    />
                    <span>
                      <span className="block text-sm font-medium text-[var(--text-primary)]">
                        {route}
                      </span>
                      <span className="mt-1 block text-[11px] font-[var(--font-mono)] uppercase tracking-[0.2em] text-[var(--text-dim)]">
                        {getLocationLabel(LOCATIONS[route as keyof typeof LOCATIONS].type)}
                      </span>
                    </span>
                  </span>
                  <Navigation size={16} className="text-[var(--text-muted)]" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
