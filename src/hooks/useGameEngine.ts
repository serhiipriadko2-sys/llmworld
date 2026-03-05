import { useState, useEffect, useRef, useCallback } from 'react';
import { getCompanionResponse, evaluateAction, CompanionState, GameState } from '../services/geminiService';
import { LOCATIONS, INITIAL_GAME_STATE, INITIAL_COMPANION_STATE } from '../constants';

export type { CompanionState, GameState };
export type Message = { id: string; role: 'user' | 'companion' | 'system'; text: string };
export type Notification = { id: string; text: string; type: 'positive' | 'negative' | 'neutral' };

const STORAGE_KEY = 'aegis_save_v1';
const MAX_HISTORY_LENGTH = 10; // Sliding window size

export function useGameEngine() {
  // Initialize state from localStorage or defaults
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).gameState : INITIAL_GAME_STATE;
  });

  const [companionState, setCompanionState] = useState<CompanionState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).companionState : INITIAL_COMPANION_STATE;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved).messages : [
      { id: '1', role: 'companion', text: "Initialization complete. I am Aegis. We are currently at Haven's Rest. What is our vector for today?" }
    ];
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const prevLocationRef = useRef(gameState.location);

  // Save to localStorage on changes
  useEffect(() => {
    const saveData = { gameState, companionState, messages };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
  }, [gameState, companionState, messages]);

  const addNotification = useCallback((text: string, type: 'positive' | 'negative' | 'neutral' = 'neutral') => {
    const id = Date.now().toString() + Math.random().toString();
    setNotifications(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  // Companion Initiative: React to location changes
  useEffect(() => {
    if (gameState.location !== prevLocationRef.current) {
      prevLocationRef.current = gameState.location;
      
      const triggerThought = async () => {
        setIsTyping(true);
        const prompt = `We just arrived at ${gameState.location}. Give a brief 1-2 sentence reaction to this place. Keep our vector ("${gameState.vector}") and your energy (${companionState.energy}/100) in mind. Initiate the conversation.`;
        
        // Sliding window for history
        const chatHistory = messages
          .filter(m => m.role !== 'system')
          .slice(-MAX_HISTORY_LENGTH)
          .map(m => ({
            role: m.role === 'companion' ? 'model' : 'user',
            parts: [{ text: m.text }]
          }));

        try {
          const response = await getCompanionResponse(prompt, companionState, gameState, chatHistory);
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'companion', text: response }]);
          addNotification("Aegis has something to say.", "neutral");
        } catch (e) {
          console.error(e);
        } finally {
          setIsTyping(false);
        }
      };
      
      // Small delay to let the system message render first
      setTimeout(triggerThought, 1000);
    }
  }, [gameState.location, gameState.vector, companionState, messages, addNotification]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg = text.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      // Check if it's a command to change vector
      if (userMsg.toLowerCase().startsWith('/vector ')) {
        const newVector = userMsg.substring(8);
        setGameState(prev => ({ ...prev, vector: newVector }));
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: `Vector updated: ${newVector}` }]);
      }

      // Sliding window for history
      const chatHistory = messages
        .filter(m => m.role !== 'system')
        .slice(-MAX_HISTORY_LENGTH)
        .map(m => ({
          role: m.role === 'companion' ? 'model' : 'user',
          parts: [{ text: m.text }]
        }));

      const response = await getCompanionResponse(userMsg, companionState, gameState, chatHistory);
      
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'companion', text: response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: "Connection to companion lost. Retrying..." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const performAction = async (action: string) => {
    setIsTyping(true);
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: `Action: ${action}...` }]);
    
    try {
      const result = await evaluateAction(action, companionState, gameState);
      
      if (result) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: result.narrative }]);
        
        setGameState(prev => ({
          ...prev,
          playerHealth: Math.max(0, Math.min(100, prev.playerHealth + result.stateChanges.playerHealthDelta)),
          resources: Math.max(0, prev.resources + result.stateChanges.resourcesDelta),
          location: result.newLocation && LOCATIONS[result.newLocation as keyof typeof LOCATIONS] ? result.newLocation : prev.location,
          day: action.includes('Rest') ? prev.day + 1 : prev.day
        }));

        setCompanionState(prev => ({
          ...prev,
          bond: Math.max(0, Math.min(100, prev.bond + result.stateChanges.companionBondDelta)),
          energy: Math.max(0, Math.min(100, prev.energy + result.stateChanges.companionEnergyDelta)),
        }));

        // Notifications for state changes
        if (result.stateChanges.resourcesDelta > 0) addNotification(`+${result.stateChanges.resourcesDelta} Resources`, 'positive');
        if (result.stateChanges.resourcesDelta < 0) addNotification(`${result.stateChanges.resourcesDelta} Resources`, 'negative');
        if (result.stateChanges.playerHealthDelta > 0) addNotification(`+${result.stateChanges.playerHealthDelta} Health`, 'positive');
        if (result.stateChanges.playerHealthDelta < 0) addNotification(`${result.stateChanges.playerHealthDelta} Health`, 'negative');
        if (result.stateChanges.companionEnergyDelta > 0) addNotification(`+${result.stateChanges.companionEnergyDelta} Energy`, 'positive');
        if (result.stateChanges.companionEnergyDelta < 0) addNotification(`${result.stateChanges.companionEnergyDelta} Energy`, 'negative');

        // Have companion react to the outcome
        const reactionPrompt = `We just did: "${action}". Outcome: ${result.narrative}. React to this briefly.`;
        
        // Sliding window for history
        const chatHistory = messages
          .filter(m => m.role !== 'system')
          .slice(-MAX_HISTORY_LENGTH)
          .map(m => ({
            role: m.role === 'companion' ? 'model' : 'user',
            parts: [{ text: m.text }]
          }));

        const reaction = await getCompanionResponse(reactionPrompt, companionState, gameState, chatHistory);
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'companion', text: reaction }]);
      }
    } catch (error) {
       console.error("Action error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const updateCompanionSettings = (updates: Partial<CompanionState>) => {
    setCompanionState(prev => ({ ...prev, ...updates }));
  };

  const resetGame = () => {
    if (confirm("Are you sure you want to reset your progress? This cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY);
      setGameState(INITIAL_GAME_STATE);
      setCompanionState(INITIAL_COMPANION_STATE);
      setMessages([{ id: '1', role: 'companion', text: "Initialization complete. I am Aegis. We are currently at Haven's Rest. What is our vector for today?" }]);
      window.location.reload();
    }
  };

  return {
    gameState,
    companionState,
    messages,
    notifications,
    isTyping,
    sendMessage,
    performAction,
    updateCompanionSettings,
    resetGame
  };
}
