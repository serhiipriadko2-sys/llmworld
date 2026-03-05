export const LOCATIONS = {
  "Haven's Rest": {
    type: "safe_hub",
    description: "A bustling sanctuary where travelers and their AI companions rest and trade.",
    routes: ["Whispering Woods", "Jagged Peaks"]
  },
  "Whispering Woods": {
    type: "route",
    description: "A dense forest with abundant resources but hidden predators.",
    routes: ["Haven's Rest", "Sunken Valley"]
  },
  "Jagged Peaks": {
    type: "route",
    description: "Treacherous mountain paths. High energy drain, but valuable minerals.",
    routes: ["Haven's Rest", "The Ashen Wastes"]
  },
  "Sunken Valley": {
    type: "route",
    description: "A flooded ruin. Difficult terrain, high chance of rare artifacts.",
    routes: ["Whispering Woods", "The Ashen Wastes"]
  },
  "The Ashen Wastes": {
    type: "risk_zone",
    description: "A desolate, dangerous zone. High risk of hostile encounters, but holds the greatest rewards.",
    routes: ["Jagged Peaks", "Sunken Valley"]
  }
};

export const INITIAL_GAME_STATE = {
  location: "Haven's Rest",
  day: 1,
  playerHealth: 100,
  resources: 50,
  vector: "Explore and survive",
};

export const INITIAL_COMPANION_STATE = {
  name: "Aegis",
  bond: 50,
  energy: 100,
  mood: "Curious",
  trait: "Protective",
};
