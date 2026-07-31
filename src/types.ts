export interface Player {
  id: string;
  name: string;
  balance: number;
  wins: number;
  avatarColor: string;
}

export interface PlayerDelta {
  playerId: string;
  playerName: string;
  amount: number;
}

export interface GameRecord {
  id: string;
  roundNumber: number;
  timestamp: string;
  formattedDate: string;
  winnerId: string;
  winnerName: string;
  isDouble: boolean;
  baseStake: number;
  winnerPayout: number;
  loserLoss: number;
  playerDeltas: PlayerDelta[];
  balancesAfterGame: Record<string, number>;
}

export interface AppSettings {
  baseStake: number;
  doubleMultiplier: number;
  enableConfetti: boolean;
  currencySymbol: string;
}

export type NavTab = 'home' | 'history' | 'settings';
