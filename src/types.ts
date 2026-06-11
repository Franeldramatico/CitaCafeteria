export interface GameStats {
  affinity: number;       // Afinidad
  trust: number;          // Confianza
  romance: number;        // Atracción Romántica
  comfort: number;        // Comodidad
  mutualInterest: number; // Interés Mutuo
  curiosity: number;      // Curiosidad
}

export interface Choice {
  id: string;
  text: string;
  consequenceText: string;
  statsModifiers: Partial<GameStats>; // how it changes the stats
  nextSceneId: string;
}

export type SceneLighting = 'golden' | 'sunset' | 'dust' | 'night_warm';

export interface Scene {
  id: string;
  title?: string;
  characterExpression: 'mysterious' | 'smiling' | 'none';
  text: string;
  dialogueSpeaker?: string;
  lighting: SceneLighting;
  choices: Choice[];
}

export interface Ending {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  illustrationType: 'love_true' | 'perfect_date' | 'numbers' | 'friends_potential' | 'unforgettable' | 'shy' | 'missed' | 'misunderstanding' | 'sweet_goodbye' | 'uncertain';
  poeticText: string;
  statsRequirementMessage: string;
  minStats?: Partial<GameStats>;
}

export interface SavedGame {
  currentSceneId: string;
  stats: GameStats;
  history: string[];
  choicesHistory: { sceneId: string; choiceText: string; consequence: string }[];
  unlockedEndings: string[];
  aranzaName: string;
  isPlaying: boolean;
  isPrologue: boolean;
  prologueIndex: number;
}
