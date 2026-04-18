---
name: aegis-game-logic
description: Patterns for game state, actions, and logic in this project (useGameEngine.ts, constants.ts). Use whenever touching game state mutations, performAction, sendMessage, /vector command, day counter, localStorage persistence, companion mood, or adding new game mechanics. Also trigger when the user asks to add new actions, fix game balance, write tests for game logic, or extract logic from the hook.
---

# Aegis Game Logic — Project Patterns

## Core Principle: Logic Belongs in Pure Functions

All game state mutations should be extractable as pure functions — inputs in, new state out, no side effects. This makes them testable without React or the Gemini API.

When adding or modifying game mechanics, extract the logic first:

```ts
// src/lib/gameLogic.ts — pure, testable
export function applyActionResult(
  gameState: GameState,
  companionState: CompanionState,
  result: ActionResult,
  action: string
): { gameState: GameState; companionState: CompanionState } {
  return {
    gameState: {
      ...gameState,
      playerHealth: clamp(gameState.playerHealth + result.stateChanges.playerHealthDelta, 0, 100),
      resources: Math.max(0, gameState.resources + result.stateChanges.resourcesDelta),
      location: isValidLocation(result.newLocation) ? result.newLocation! : gameState.location,
      day: isRestAction(action) ? gameState.day + 1 : gameState.day,
    },
    companionState: {
      ...companionState,
      bond: clamp(companionState.bond + result.stateChanges.companionBondDelta, 0, 100),
      energy: clamp(companionState.energy + result.stateChanges.companionEnergyDelta, 0, 100),
      mood: result.newMood ?? companionState.mood,
    },
  };
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const isValidLocation = (loc: string | null | undefined): loc is string =>
  !!loc && loc in LOCATIONS;
const isRestAction = (action: string) =>
  action.toLowerCase().includes('rest');
```

Then the hook just calls this function and `setState`.

## /vector Command — Early Return Pattern

The `/vector` command must return early after processing — it must not reach `getCompanionResponse` with the raw slash command:

```ts
const sendMessage = async (text: string) => {
  const userMsg = text.trim();
  if (!userMsg || isTyping) return;

  setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userMsg }]);
  setIsTyping(true);

  try {
    if (userMsg.toLowerCase().startsWith('/vector ')) {
      const newVector = userMsg.substring(8).trim();
      setGameState(prev => ({ ...prev, vector: newVector }));
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: `Vector updated: "${newVector}"` }]);
      return; // ← critical: stop here, don't call LLM
    }

    // Only reaches here for real chat messages
    const chatHistory = buildChatHistory(messages);
    const response = await getCompanionResponse(userMsg, companionState, gameState, chatHistory);
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'companion', text: response }]);
  } catch (error) {
    console.error("Chat error:", error);
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'system', text: "Connection to Aegis lost. Retrying..." }]);
  } finally {
    setIsTyping(false);
  }
};
```

## Chat History Builder — Extract Once

The chatHistory construction is identical in three places. Extract it:

```ts
// Inside useGameEngine
const buildChatHistory = useCallback((msgs: Message[]) =>
  msgs
    .filter(m => m.role !== 'system')
    .slice(-MAX_HISTORY_LENGTH)
    .map(m => ({
      role: m.role === 'companion' ? 'model' : 'user',
      parts: [{ text: m.text }],
    })),
[]);
```

Use `buildChatHistory(messages)` in all three callsites (sendMessage, performAction, location effect).

## localStorage — Debounce Writes

`localStorage.setItem` is synchronous and blocks the main thread. Messages change on every interaction — without debouncing, every keystroke or message triggers a full JSON serialization.

```ts
// Debounce saves by 1.5s — reads happen only on init so this is safe
useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ gameState, companionState, messages }));
  }, 1500);
  return () => clearTimeout(timer);
}, [gameState, companionState, messages]);
```

This reduces I/O by ~90% during active play with no risk of data loss.

## localStorage Init — Parse Once

The save key is read three times in the current init. Parse once:

```ts
const [gameState, setGameState] = useState<GameState>(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    return saved?.gameState ?? INITIAL_GAME_STATE;
  } catch {
    return INITIAL_GAME_STATE;
  }
});
// Same pattern for companionState and messages, reusing parsed value
// or extract to a helper that returns { gameState, companionState, messages }
```

Always wrap `JSON.parse` in try/catch — corrupted localStorage data will crash the app without it.

## Location Change Effect — Stale Closure Fix

`messages` must NOT be in the dependency array of the location change effect. It causes the effect to re-register on every new message, which can double-fire the companion's location reaction.

```ts
const messagesRef = useRef(messages);
useEffect(() => { messagesRef.current = messages; }, [messages]);

useEffect(() => {
  if (gameState.location === prevLocationRef.current) return;
  prevLocationRef.current = gameState.location;

  const triggerThought = async () => {
    setIsTyping(true);
    const chatHistory = buildChatHistory(messagesRef.current); // ← ref, not closure
    try {
      const response = await getCompanionResponse(prompt, companionState, gameState, chatHistory);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'companion', text: response }]);
    } finally {
      setIsTyping(false);
    }
  };

  const timer = setTimeout(triggerThought, 1000);
  return () => clearTimeout(timer); // ← cleanup prevents double-fire
}, [gameState.location]); // ← only location, not messages or companionState
```

## Day Counter — Robust Pattern

Avoid `action.includes('Rest')` for game mechanics — it matches unintended strings.

```ts
// In pure function or constants
export const REST_ACTIONS = ['Rest and recover energy', 'Rest'];
const isRestAction = (action: string) =>
  REST_ACTIONS.some(r => action.toLowerCase().startsWith(r.toLowerCase()));
```

## Type Ownership

`GameState` and `CompanionState` types belong in `src/types.ts` (or `src/constants.ts`), not in `geminiService.ts`. Services should import types, not define them. When refactoring, move types first, then update imports.
