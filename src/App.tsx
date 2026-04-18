import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { useGameEngine } from './hooks/useGameEngine';
import { ChatView } from './components/ChatView';
import { MapView } from './components/MapView';
import { StatsView } from './components/StatsView';
import { SettingsView } from './components/SettingsView';
import { NotificationList } from './components/NotificationList';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';

export default function App() {
  const {
    gameState,
    companionState,
    messages,
    notifications,
    isTyping,
    sendMessage,
    performAction,
    updateCompanionSettings,
    resetGame
  } = useGameEngine();

  const [activeTab, setActiveTab] = useState<'chat' | 'map' | 'stats' | 'settings'>('chat');

  return (
    <div className="relative min-h-[100dvh] overflow-hidden px-3 py-3 text-[var(--text-primary)] sm:px-4 sm:py-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-12%] top-[-10%] h-72 w-72 rounded-full bg-[rgba(79,208,166,0.12)] blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute right-[-8%] top-[8%] h-64 w-64 rounded-full bg-[rgba(142,149,255,0.14)] blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute bottom-[-18%] left-[20%] h-72 w-72 rounded-full bg-[rgba(243,179,91,0.1)] blur-3xl sm:h-[26rem] sm:w-[26rem]" />
      </div>

      <div className="app-shell relative mx-auto flex min-h-[calc(100dvh-1.5rem)] w-full max-w-[1500px] flex-col rounded-[32px] border border-[var(--border-strong)] panel-strong overflow-hidden">
        <NotificationList notifications={notifications} />
        <Header gameState={gameState} />

        <main className="relative flex min-h-0 flex-1 flex-col px-3 pb-3 sm:px-4 sm:pb-4">
          <div className="panel relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[26px] border border-white/6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
            <AnimatePresence mode="wait">
              {activeTab === 'chat' && (
                <ChatView
                  messages={messages}
                  isTyping={isTyping}
                  onSendMessage={sendMessage}
                  onAction={performAction}
                  companionName={companionState.name}
                />
              )}

              {activeTab === 'map' && (
                <MapView
                  gameState={gameState}
                  onAction={performAction}
                  isTyping={isTyping}
                />
              )}

              {activeTab === 'stats' && (
                <StatsView
                  gameState={gameState}
                  companionState={companionState}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsView
                  companionState={companionState}
                  onUpdateSettings={updateCompanionSettings}
                  onResetGame={resetGame}
                />
              )}
            </AnimatePresence>
          </div>
        </main>

        <div className="px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
