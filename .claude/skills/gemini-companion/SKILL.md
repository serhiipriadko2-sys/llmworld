---
name: gemini-companion
description: Patterns for working with the Google Gemini AI service in this project (src/services/geminiService.ts). Use this skill whenever touching geminiService.ts, chat history, LLM prompts, model names, evaluateAction schema, system instructions, or API key configuration. Also trigger when the user reports companion not responding, wrong model errors, slow responses, or wants to change how Aegis talks.
---

# Gemini Companion Service — Project Patterns

## Model Names (Critical)

Valid model IDs for `@google/genai` SDK v1.x:
- `"gemini-2.5-flash"` — recommended, fast + capable
- `"gemini-2.0-flash"` — stable fallback
- `"gemini-1.5-flash"` — legacy fallback

**Never use** `"gemini-3-flash-preview"` — does not exist, will throw 404.

Always verify the model name is one of the above before writing or accepting code.

## API Key in Vite

```ts
// CORRECT — Vite exposes env vars with VITE_ prefix via import.meta.env
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// WRONG — process.env is Node.js only, undefined in browser
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
```

The `.env.local` file must use `VITE_GEMINI_API_KEY=...` (not `GEMINI_API_KEY`).

## Chat History — The Right Pattern

The SDK supports passing history directly to `chats.create()`. **Never replay history by calling `sendMessage` in a loop** — that causes N+1 API calls and loses model turn context.

```ts
// CORRECT — single API call, full bidirectional context
export async function getCompanionResponse(
  playerMessage: string,
  companionState: CompanionState,
  gameState: GameState,
  chatHistory: { role: string; parts: { text: string }[] }[]
) {
  const chat = ai.chats.create({
    model: "gemini-2.5-flash",
    config: { systemInstruction, temperature: 0.7 },
    history: chatHistory,  // ← pass here, not via loop
  });

  const response = await chat.sendMessage({ message: playerMessage });
  return response.text ?? "";
}
```

History must include **both** user and model turns to preserve context:
```ts
// In useGameEngine — build history with both roles
const chatHistory = messages
  .filter(m => m.role !== 'system')
  .slice(-MAX_HISTORY_LENGTH)
  .map(m => ({
    role: m.role === 'companion' ? 'model' : 'user',
    parts: [{ text: m.text }],
  }));
```

## System Instruction — Game State Injection

Inject `gameState` and `companionState` into the system instruction, not the user message. This keeps game context out of the visible chat history.

The `[Suggest: action]` pattern at end of companion messages is intentional — `ChatView.tsx` parses it to render an action button. Preserve it in system instructions.

## evaluateAction — JSON Schema

`evaluateAction` uses `responseMimeType: "application/json"` with a strict schema. When modifying:

- `stateChanges` fields are required — never make them optional
- `newLocation` must be `nullable: true` (not just `Type.STRING`)
- Balance constraints in the prompt are the source of truth for valid delta ranges:
  - `playerHealthDelta`: -30 to +20
  - `resourcesDelta`: -15 to +30
  - `companionBondDelta`: -10 to +15
  - `companionEnergyDelta`: -25 to +20

Adding `newMood` field (for live mood updates):
```ts
newMood: { type: Type.STRING, nullable: true }
```

## Error Handling

`evaluateAction` returns `null` on parse failure. The caller in `useGameEngine.performAction` must handle this explicitly:

```ts
if (!result) {
  setMessages(prev => [...prev, {
    id: Date.now().toString(),
    role: 'system',
    text: "Aegis couldn't evaluate the outcome. Try again."
  }]);
  return;
}
```

Never silently swallow a null result — the player will see a frozen UI with no feedback.

## Response Safety

Always use `response.text ?? ""` (not `response.text || ""`). The nullish coalescing operator correctly handles empty string responses that are valid (e.g., model returned an empty turn).
