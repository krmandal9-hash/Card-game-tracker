import React from 'react';
import { NavTab } from '../types';
import { Trophy, History, Settings, Undo2, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onTriggerUndo: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onTriggerUndo,
}) => {
  const { history, isDoublePrice, totalGamesPlayed } = useGame();

  return (
    <>
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 bg-[#1D1B20]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 shadow-sm">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D0BCFF] to-[#381E72] flex items-center justify-center text-[#141218] font-bold shadow-md">
              <Trophy className="w-5 h-5 text-[#381E72]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#E6E0E9] leading-tight tracking-wide">
                Card Game Tracker
              </h1>
              <div className="flex items-center gap-2 text-xs text-[#CAC4D0]">
                <span>{totalGamesPlayed} rounds played</span>
                {isDoublePrice && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold text-[10px] border border-amber-500/30">
                    <Zap className="w-3 h-3 fill-amber-300" />
                    2X DOUBLE
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {history.length > 0 && (
              <button
                id="top-bar-undo-btn"
                onClick={onTriggerUndo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#36343B] hover:bg-[#49454F] text-[#E6E0E9] text-xs font-medium transition-all active:scale-95 border border-white/10"
                title="Undo last recorded round"
              >
                <Undo2 className="w-3.5 h-3.5 text-[#D0BCFF]" />
                <span>Undo</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#1D1B20] border-t border-white/10 px-4 py-2">
        <div className="max-w-xl mx-auto flex items-center justify-around">
          {/* Home Tab */}
          <button
            id="nav-tab-home"
            onClick={() => onSelectTab('home')}
            className="flex flex-col items-center gap-1 group py-1 px-4 rounded-full transition-all"
          >
            <div
              className={`px-5 py-1.5 rounded-full transition-all flex items-center justify-center ${
                activeTab === 'home'
                  ? 'bg-[#EADDFF] text-[#21005D] shadow-sm'
                  : 'text-[#CAC4D0] hover:text-[#E6E0E9] hover:bg-[#2B2930]'
              }`}
            >
              <Trophy className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                activeTab === 'home' ? 'text-[#E6E0E9] font-semibold' : 'text-[#CAC4D0]'
              }`}
            >
              Players
            </span>
          </button>

          {/* History Tab */}
          <button
            id="nav-tab-history"
            onClick={() => onSelectTab('history')}
            className="flex flex-col items-center gap-1 group py-1 px-4 rounded-full transition-all relative"
          >
            <div
              className={`px-5 py-1.5 rounded-full transition-all flex items-center justify-center ${
                activeTab === 'history'
                  ? 'bg-[#EADDFF] text-[#21005D] shadow-sm'
                  : 'text-[#CAC4D0] hover:text-[#E6E0E9] hover:bg-[#2B2930]'
              }`}
            >
              <History className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                activeTab === 'history' ? 'text-[#E6E0E9] font-semibold' : 'text-[#CAC4D0]'
              }`}
            >
              History ({history.length})
            </span>
          </button>

          {/* Settings Tab */}
          <button
            id="nav-tab-settings"
            onClick={() => onSelectTab('settings')}
            className="flex flex-col items-center gap-1 group py-1 px-4 rounded-full transition-all"
          >
            <div
              className={`px-5 py-1.5 rounded-full transition-all flex items-center justify-center ${
                activeTab === 'settings'
                  ? 'bg-[#EADDFF] text-[#21005D] shadow-sm'
                  : 'text-[#CAC4D0] hover:text-[#E6E0E9] hover:bg-[#2B2930]'
              }`}
            >
              <Settings className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                activeTab === 'settings' ? 'text-[#E6E0E9] font-semibold' : 'text-[#CAC4D0]'
              }`}
            >
              Settings
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
