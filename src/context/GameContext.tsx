import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Player, GameRecord, PlayerDelta, AppSettings } from '../types';
import { formatDate } from '../utils/formatters';

const STORAGE_KEY = 'card_game_tracker_v1';

const DEFAULT_PLAYERS: Player[] = [
  { id: 'p1', name: 'Player 1', balance: 0, wins: 0, avatarColor: '#D0BCFF' },
  { id: 'p2', name: 'Player 2', balance: 0, wins: 0, avatarColor: '#A8C7FA' },
  { id: 'p3', name: 'Player 3', balance: 0, wins: 0, avatarColor: '#EFB8C8' },
  { id: 'p4', name: 'Player 4', balance: 0, wins: 0, avatarColor: '#81C784' },
  { id: 'p5', name: 'Player 5', balance: 0, wins: 0, avatarColor: '#FFB74D' },
];

const DEFAULT_SETTINGS: AppSettings = {
  baseStake: 300,
  doubleMultiplier: 2,
  enableConfetti: true,
  currencySymbol: '₹',
};

interface GameContextType {
  players: Player[];
  history: GameRecord[];
  isDoublePrice: boolean;
  baseStake: number;
  settings: AppSettings;
  effectiveWinnerPayout: number;
  effectiveLoserLoss: number;
  totalGamesPlayed: number;
  toggleDoublePrice: () => void;
  setBaseStake: (stake: number) => void;
  updatePlayerName: (id: string, name: string) => void;
  recordWin: (winnerId: string) => void;
  undoLastGame: () => boolean;
  resetAllData: (keepNames?: boolean) => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [players, setPlayers] = useState<Player[]>(DEFAULT_PLAYERS);
  const [history, setHistory] = useState<GameRecord[]>([]);
  const [isDoublePrice, setIsDoublePrice] = useState<boolean>(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load state from localStorage on startup
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.players && Array.isArray(parsed.players) && parsed.players.length === 5) {
          setPlayers(parsed.players);
        }
        if (parsed.history && Array.isArray(parsed.history)) {
          setHistory(parsed.history);
        }
        if (typeof parsed.isDoublePrice === 'boolean') {
          setIsDoublePrice(parsed.isDoublePrice);
        }
        if (parsed.settings) {
          setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
        }
      }
    } catch (err) {
      console.error('Failed to load local storage state:', err);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save state to localStorage whenever changed
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const stateToSave = {
        players,
        history,
        isDoublePrice,
        settings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (err) {
      console.error('Failed to save state to localStorage:', err);
    }
  }, [players, history, isDoublePrice, settings, isInitialized]);

  // Derived payout math:
  // Default stake = 300
  // Winner payout = 4 * stake (4 * 300 = 1200)
  // Double ON = winner receives 4 * 600 = 2400, losers lose 600 each
  const baseStake = settings.baseStake || 300;
  const effectiveLoserLoss = useMemo(() => {
    return isDoublePrice ? baseStake * 2 : baseStake;
  }, [isDoublePrice, baseStake]);

  const effectiveWinnerPayout = useMemo(() => {
    return effectiveLoserLoss * (players.length - 1); // 4 * 300 = 1200 or 4 * 600 = 2400
  }, [effectiveLoserLoss, players.length]);

  const toggleDoublePrice = useCallback(() => {
    setIsDoublePrice((prev) => !prev);
  }, []);

  const setBaseStake = useCallback((newStake: number) => {
    setSettings((prev) => ({ ...prev, baseStake: newStake }));
  }, []);

  const updatePlayerName = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: trimmed } : p))
    );
  }, []);

  const recordWin = useCallback(
    (winnerId: string) => {
      const winner = players.find((p) => p.id === winnerId);
      if (!winner) return;

      const payout = effectiveWinnerPayout;
      const loss = effectiveLoserLoss;

      // Update player state
      const nextPlayers = players.map((p) => {
        if (p.id === winnerId) {
          return {
            ...p,
            balance: p.balance + payout,
            wins: p.wins + 1,
          };
        } else {
          return {
            ...p,
            balance: p.balance - loss,
          };
        }
      });

      // Deltas for log
      const playerDeltas: PlayerDelta[] = players.map((p) => ({
        playerId: p.id,
        playerName: p.name,
        amount: p.id === winnerId ? payout : -loss,
      }));

      // Balances snapshot
      const balancesAfterGame: Record<string, number> = {};
      nextPlayers.forEach((p) => {
        balancesAfterGame[p.id] = p.balance;
      });

      const now = new Date();
      const newRecord: GameRecord = {
        id: `game_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        roundNumber: history.length + 1,
        timestamp: now.toISOString(),
        formattedDate: formatDate(now.toISOString()),
        winnerId,
        winnerName: winner.name,
        isDouble: isDoublePrice,
        baseStake,
        winnerPayout: payout,
        loserLoss: loss,
        playerDeltas,
        balancesAfterGame,
      };

      setPlayers(nextPlayers);
      setHistory((prev) => [newRecord, ...prev]);

      // Confetti effect
      if (settings.enableConfetti) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#D0BCFF', '#A8C7FA', '#81C784', '#FFB74D', '#EFB8C8'],
          });
        } catch {
          // ignore if canvas missing
        }
      }
    },
    [players, history.length, isDoublePrice, baseStake, effectiveWinnerPayout, effectiveLoserLoss, settings.enableConfetti]
  );

  const undoLastGame = useCallback(() => {
    if (history.length === 0) return false;

    const lastGame = history[0];
    const { winnerId, winnerPayout, loserLoss } = lastGame;

    // Rollback player balances & wins
    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === winnerId) {
          return {
            ...p,
            balance: p.balance - winnerPayout,
            wins: Math.max(0, p.wins - 1),
          };
        } else {
          return {
            ...p,
            balance: p.balance + loserLoss,
          };
        }
      })
    );

    // Remove from history
    setHistory((prev) => prev.slice(1));
    return true;
  }, [history]);

  const resetAllData = useCallback(
    (keepNames: boolean = true) => {
      setHistory([]);
      setIsDoublePrice(false);
      if (keepNames) {
        setPlayers((prev) =>
          prev.map((p) => ({
            ...p,
            balance: 0,
            wins: 0,
          }))
        );
      } else {
        setPlayers(DEFAULT_PLAYERS);
      }
    },
    []
  );

  const exportData = useCallback(() => {
    return JSON.stringify(
      {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        players,
        history,
        isDoublePrice,
        settings,
      },
      null,
      2
    );
  }, [players, history, isDoublePrice, settings]);

  const importData = useCallback((jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.players && Array.isArray(parsed.players) && parsed.players.length === 5) {
        setPlayers(parsed.players);
        if (Array.isArray(parsed.history)) setHistory(parsed.history);
        if (typeof parsed.isDoublePrice === 'boolean') setIsDoublePrice(parsed.isDoublePrice);
        if (parsed.settings) setSettings(parsed.settings);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  return (
    <GameContext.Provider
      value={{
        players,
        history,
        isDoublePrice,
        baseStake,
        settings,
        effectiveWinnerPayout,
        effectiveLoserLoss,
        totalGamesPlayed: history.length,
        toggleDoublePrice,
        setBaseStake,
        updatePlayerName,
        recordWin,
        undoLastGame,
        resetAllData,
        exportData,
        importData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
