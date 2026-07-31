import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navigation } from './components/Navigation';
import { HomeScreen } from './components/HomeScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { NavTab } from './types';
import { CheckCircle2, RotateCcw } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { undoLastGame } = useGame();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTriggerUndo = () => {
    const success = undoLastGame();
    if (success) {
      showToast('Undid last game round. Player balances restored.');
    } else {
      showToast('No game history to undo.');
    }
  };

  return (
    <div className="min-h-screen bg-[#141218] text-[#E6E0E9] flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top App Bar Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onTriggerUndo={handleTriggerUndo}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 pt-4">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'history' && (
          <HistoryScreen onTriggerUndo={handleTriggerUndo} />
        )}
        {activeTab === 'settings' && <SettingsScreen />}
      </main>

      {/* Global SnackBar Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-bounce-short">
          <div className="bg-[#2B2930] text-[#E6E0E9] border border-[#D0BCFF]/30 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainAppContent />
    </GameProvider>
  );
}
