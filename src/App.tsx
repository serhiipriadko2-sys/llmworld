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
    <div className="flex flex-col h-[100dvh] bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      <NotificationList notifications={notifications} />
      <Header gameState={gameState} />

      <main className="flex-1 relative overflow-hidden flex flex-col">
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
      </main>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
