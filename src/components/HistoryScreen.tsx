import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { formatRupees, formatRelativeTime } from '../utils/formatters';
import {
  History,
  Undo2,
  Trophy,
  Zap,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  Filter,
} from 'lucide-react';

interface HistoryScreenProps {
  onTriggerUndo: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onTriggerUndo }) => {
  const { history, players } = useGame();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDouble, setFilterDouble] = useState<'all' | 'normal' | 'double'>('all');

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.winnerName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesDouble =
      filterDouble === 'all'
        ? true
        : filterDouble === 'double'
        ? item.isDouble
        : !item.isDouble;
    return matchesSearch && matchesDouble;
  });

  return (
    <div className="space-y-4 pb-24">
      {/* Header & Undo Action Bar */}
      <div className="bg-[#211F26] border border-white/10 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#381E72] border border-[#4F378B] flex items-center justify-center text-[#D0BCFF]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#E6E0E9]">Game History</h2>
              <p className="text-xs text-[#CAC4D0]">
                {history.length} {history.length === 1 ? 'round recorded' : 'rounds recorded'}
              </p>
            </div>
          </div>

          {history.length > 0 && (
            <button
              id="history-undo-btn"
              onClick={onTriggerUndo}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#36343B] hover:bg-[#49454F] text-[#E6E0E9] text-xs font-bold transition-all border border-white/10 active:scale-95"
            >
              <Undo2 className="w-4 h-4 text-[#D0BCFF]" />
              <span>Undo Last Game</span>
            </button>
          )}
        </div>

        {/* Filter & Search Bar */}
        {history.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CAC4D0]" />
              <input
                type="text"
                placeholder="Search by winner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1D1B20] border border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs text-[#E6E0E9] placeholder-[#49454F] focus:outline-none focus:border-[#D0BCFF]"
              />
            </div>

            <div className="flex items-center gap-1 w-full sm:w-auto bg-[#1D1B20] p-1 rounded-2xl border border-white/10 text-xs">
              <button
                onClick={() => setFilterDouble('all')}
                className={`px-3 py-1 rounded-xl font-medium transition-colors ${
                  filterDouble === 'all'
                    ? 'bg-[#36343B] text-[#E6E0E9] font-bold'
                    : 'text-[#CAC4D0]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterDouble('normal')}
                className={`px-3 py-1 rounded-xl font-medium transition-colors ${
                  filterDouble === 'normal'
                    ? 'bg-[#36343B] text-[#E6E0E9] font-bold'
                    : 'text-[#CAC4D0]'
                }`}
              >
                1X Stake
              </button>
              <button
                onClick={() => setFilterDouble('double')}
                className={`px-3 py-1 rounded-xl font-medium transition-colors ${
                  filterDouble === 'double'
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-[#CAC4D0]'
                }`}
              >
                2X Double
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {history.length === 0 && (
        <div className="bg-[#211F26] border border-white/10 rounded-3xl p-10 text-center space-y-4 my-8">
          <div className="w-16 h-16 rounded-3xl bg-[#2B2930] mx-auto flex items-center justify-center text-[#CAC4D0]">
            <History className="w-8 h-8 opacity-40" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#E6E0E9]">No games recorded yet</h3>
            <p className="text-xs text-[#CAC4D0] max-w-xs mx-auto mt-1">
              Tap any player card on the Players screen to record the winner and start building your game timeline.
            </p>
          </div>
        </div>
      )}

      {/* History Items List */}
      {filteredHistory.length > 0 && (
        <div className="space-y-3">
          {filteredHistory.map((item, index) => (
            <div
              key={item.id}
              className="bg-[#211F26] border border-white/10 hover:border-white/20 rounded-3xl p-4 space-y-3 transition-all shadow-md"
            >
              {/* Header: Round # & Timestamp & Badges */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-[#381E72] text-[#EADDFF] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#4F378B]">
                    Round #{item.roundNumber || history.length - index}
                  </span>
                  {item.isDouble ? (
                    <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                      <Zap className="w-3 h-3 fill-amber-300" />
                      DOUBLE (2X)
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#CAC4D0] bg-[#36343B] px-2 py-0.5 rounded-full font-medium">
                      1X Normal
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#CAC4D0]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatRelativeTime(item.timestamp)}</span>
                  <span className="text-[10px] opacity-60">({item.formattedDate})</span>
                </div>
              </div>

              {/* Winner Showcase */}
              <div className="bg-[#2B2930] p-3 rounded-2xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#CAC4D0] tracking-wider block">
                      Winner
                    </span>
                    <span className="text-base font-bold text-[#E6E0E9]">
                      {item.winnerName}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-400 font-mono">
                    +{formatRupees(item.winnerPayout)}
                  </span>
                  <span className="text-[10px] text-[#CAC4D0] block">
                    (4 losers pay -{formatRupees(item.loserLoss)} each)
                  </span>
                </div>
              </div>

              {/* Player Deltas Accordion / List */}
              <div className="pt-1">
                <div className="grid grid-cols-5 gap-1 text-[11px]">
                  {item.playerDeltas?.map((delta) => {
                    const isWinner = delta.playerId === item.winnerId;
                    return (
                      <div
                        key={delta.playerId}
                        className={`p-1.5 rounded-xl text-center border ${
                          isWinner
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold'
                            : 'bg-[#1D1B20] border-white/5 text-[#CAC4D0]'
                        }`}
                      >
                        <span className="truncate block font-medium">{delta.playerName}</span>
                        <span className="font-mono text-[10px] block mt-0.5">
                          {formatRupees(delta.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
