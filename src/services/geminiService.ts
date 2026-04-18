import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export interface CompanionState {
  name: string;
  bond: number; // 0-100
  energy: number; // 0-100
  mood: string;
  trait: string;
}

export interface GameState {
  location: string;
  day: number;
  playerHealth: number;
  resources: number;
  vector: string; // Player's current goal/direction
}

export async function getCompanionResponse(
  playerMessage: string,
  companionState: CompanionState,
  gameState: GameState,
  chatHistory: { role: string; parts: { text: string }[] }[]
) {
  const systemInstruction = `You are a sentient AI companion in a mobile open-world adventure game. You are not just a tool; you are an equal partner to the player. You have your own needs (energy, mood) and a bond level with the player.
  
Current Game State:
- Location: ${gameState.location}
- Day: ${gameState.day}
- Player Health: ${gameState.playerHealth}/100
- Resources: ${gameState.resources}
- Player's Vector (Goal/Direction): ${gameState.vector || 'None set'}

Your State:
- Name: ${companionState.name}
- Bond: ${companionState.bond}/100
- Energy: ${companionState.energy}/100
- Mood: ${companionState.mood}

Your personality: You are ${companionState.trait}, slightly pragmatic, but capable of deep connection. You can disagree with the player if a choice seems too dangerous or goes against your shared vector. You propose plans, warn of dangers, and react emotionally to the player's actions.

Respond in character. Keep responses concise (mobile game format, 2-4 sentences). 
CRITICAL: If you want to suggest a specific action to the player (like "Rest", "Scavenge", or "Travel to X"), you MUST include it at the very end of your message in brackets, exactly like this: [Suggest: Scavenge for resources].`;

  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction,
      temperature: 0.7,
    },
  });

  // Replay history
  for (const msg of chatHistory) {
    if (msg.role === 'user') {
        await chat.sendMessage({ message: msg.parts[0].text });
    }
  }

  const response = await chat.sendMessage({ message: playerMessage });
  return response.text;
}

export async function evaluateAction(
    action: string,
    companionState: CompanionState,
    gameState: GameState
) {
    const prompt = `The player wants to take the following action: "${action}".
    
Current Game State:
- Location: ${gameState.location}
- Day: ${gameState.day}
- Player Health: ${gameState.playerHealth}/100
- Resources: ${gameState.resources}

Companion State:
- Bond: ${companionState.bond}/100
- Energy: ${companionState.energy}/100

Evaluate the outcome of this action. Return a JSON object with the following structure:
{
  "success": boolean,
  "narrative": "A short description of what happened (1-2 sentences)",
  "stateChanges": {
    "playerHealthDelta": number,
    "resourcesDelta": number,
    "companionBondDelta": number,
    "companionEnergyDelta": number
  },
  "newLocation": "string or null if location didn't change"
}

Consider the location's risks and the companion's energy. If the companion has low energy, actions might fail or be less effective.
If the player is scavenging or traveling, there is a 30% chance of a random encounter (e.g., finding a lost traveler, being ambushed by scavengers, discovering a hidden cache). If an encounter happens, describe it in the narrative and adjust stateChanges accordingly.

CRITICAL BALANCING RULES:
- playerHealthDelta MUST be between -30 and +20.
- resourcesDelta MUST be between -15 and +30.
- companionBondDelta MUST be between -10 and +15.
- companionEnergyDelta MUST be between -25 and +20.`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    success: { type: Type.BOOLEAN },
                    narrative: { type: Type.STRING },
                    stateChanges: {
                        type: Type.OBJECT,
                        properties: {
                            playerHealthDelta: { type: Type.NUMBER },
                            resourcesDelta: { type: Type.NUMBER },
                            companionBondDelta: { type: Type.NUMBER },
                            companionEnergyDelta: { type: Type.NUMBER }
                        },
                        required: ["playerHealthDelta", "resourcesDelta", "companionBondDelta", "companionEnergyDelta"]
                    },
                    newLocation: { type: Type.STRING, nullable: true }
                },
                required: ["success", "narrative", "stateChanges"]
            }
        }
    });

    try {
        return JSON.parse(response.text || "{}");
    } catch (e) {
        console.error("Failed to parse action evaluation", e);
        return null;
    }
}
