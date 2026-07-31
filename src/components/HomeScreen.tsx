import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Player } from '../types';
import { formatRupees } from '../utils/formatters';
import { WinConfirmationModal } from './WinConfirmationModal';
import { EditPlayerModal } from './EditPlayerModal';
import {
  Trophy,
  Zap,
  Edit2,
  Crown,
  ChevronRight,
  Plus,
  TrendingUp,
  TrendingDown,
  Sparkles,
  DollarSign,
  Flame,
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const {
    players,
    isDoublePrice,
    toggleDoublePrice,
    recordWin,
    effectiveWinnerPayout,
    effectiveLoserLoss,
    baseStake,
    totalGamesPlayed,
  } = useGame();

  const [selectedWinner, setSelectedWinner] = useState<Player | null>(null);
  const [isWinModalOpen, setIsWinModalOpen] = useState<boolean>(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isFabMenuOpen, setIsFabMenuOpen] = useState<boolean>(false);

  // Find Leader (Player with max balance > 0)
  const leader = [...players].sort((a, b) => b.balance - a.balance)[0];
  const hasLeader = leader && leader.balance > 0;

  const handleCardClick = (player: Player) => {
    setSelectedWinner(player);
    setIsWinModalOpen(true);
  };

  const handleConfirmWin = () => {
    if (selectedWinner) {
      recordWin(selectedWinner.id);
      setIsWinModalOpen(false);
      setSelectedWinner(null);
    }
  };

  const handleEditClick = (e: React.MouseEvent, player: Player) => {
    e.stopPropagation();
    setEditingPlayer(player);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Stake & Double Price Controller Card */}
      <div className="bg-[#211F26] border border-white/10 rounded-3xl p-5 shadow-lg relative overflow-hidden transition-all">
        {/* Glow effect when Double Price is active */}
        {isDoublePrice && (
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        )}

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-colors ${
                isDoublePrice
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-[#381E72] text-[#D0BCFF] border border-[#4F378B]'
              }`}
            >
              <Zap className={`w-5 h-5 ${isDoublePrice ? 'fill-amber-300' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#E6E0E9]">Double Price</h2>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    isDoublePrice
                      ? 'bg-amber-400 text-[#141218]'
                      : 'bg-[#36343B] text-[#CAC4D0]'
                  }`}
                >
                  {isDoublePrice ? '2X Active' : '1X Standard'}
                </span>
              </div>
              <p className="text-xs text-[#CAC4D0]">
                Base Stake: <strong className="text-[#E6E0E9]">₹{baseStake}</strong> per player
              </p>
            </div>
          </div>

          {/* M3 Style Switch */}
          <button
            id="double-price-toggle-switch"
            onClick={toggleDoublePrice}
            className={`w-14 h-8 rounded-full p-1 transition-colors flex items-center shadow-inner ${
              isDoublePrice ? 'bg-amber-400 justify-end' : 'bg-[#36343B] justify-start'
            }`}
            title="Toggle Double Price"
          >
            <div
              className={`w-6 h-6 rounded-full bg-[#141218] flex items-center justify-center shadow-md transition-transform ${
                isDoublePrice ? 'text-amber-400' : 'text-[#CAC4D0]'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${isDoublePrice ? 'fill-amber-400' : ''}`} />
            </div>
          </button>
        </div>

        {/* Dynamic Calculation Banner */}
        <div
          className={`p-3 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${
            isDoublePrice
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-100'
              : 'bg-[#1D1B20] border-white/5 text-[#CAC4D0]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${isDoublePrice ? 'text-amber-300' : 'text-[#D0BCFF]'}`} />
            <span>
              Winner receives:{' '}
              <strong className="text-emerald-400 font-extrabold text-sm">
                +{formatRupees(effectiveWinnerPayout)}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>
              Each of 4 losers pay:{' '}
              <strong className="text-rose-400 font-extrabold text-sm">
                -{formatRupees(effectiveLoserLoss)}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Leader & Summary Stats Banner */}
      <div className="grid grid-cols-2 gap-3">
        {/* Leader Chip */}
        <div className="bg-[#211F26] border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <Crown className="w-5 h-5 fill-amber-300" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] uppercase font-bold text-[#CAC4D0] tracking-wider block">
              Current Leader
            </span>
            <span className="text-sm font-bold text-[#E6E0E9] truncate block">
              {hasLeader ? leader.name : 'No Leader Yet'}
            </span>
            <span className="text-xs font-semibold text-emerald-400 font-mono">
              {hasLeader ? formatRupees(leader.balance) : '₹0'}
            </span>
          </div>
        </div>

        {/* Rounds Stat */}
        <div className="bg-[#211F26] border border-white/10 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#381E72] border border-[#4F378B] flex items-center justify-center text-[#D0BCFF]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#CAC4D0] tracking-wider block">
              Games Played
            </span>
            <span className="text-base font-extrabold text-[#E6E0E9]">
              {totalGamesPlayed} {totalGamesPlayed === 1 ? 'Round' : 'Rounds'}
            </span>
            <span className="text-[11px] text-[#D0BCFF]">
              {isDoublePrice ? '2x Double pot' : '1x Pot: ₹1,500'}
            </span>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between pt-1">
        <h3 className="text-sm font-bold text-[#D0BCFF] uppercase tracking-wider flex items-center gap-1.5">
          <Trophy className="w-4 h-4" />
          Players List (Tap Card to Set Winner)
        </h3>
        <span className="text-xs text-[#CAC4D0]">5 Players</span>
      </div>

      {/* 5 Player Cards Grid */}
      <div className="space-y-3">
        {players.map((player, index) => {
          const isPositive = player.balance > 0;
          const isNegative = player.balance < 0;
          const isCurrentLeader = hasLeader && leader.id === player.id;

          return (
            <div
              key={player.id}
              id={`player-card-${player.id}`}
              onClick={() => handleCardClick(player)}
              className={`group bg-[#211F26] hover:bg-[#2B2930] active:scale-[0.99] border rounded-3xl p-4 transition-all duration-200 cursor-pointer relative shadow-md ${
                isCurrentLeader
                  ? 'border-amber-500/40 shadow-amber-500/5'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              {/* Leader Ribbon Badge */}
              {isCurrentLeader && (
                <div className="absolute top-3 right-4 flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <Crown className="w-3 h-3 fill-amber-300" />
                  LEADER
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                {/* Left: Avatar & Info */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-[#141218] shadow-md flex-shrink-0 relative"
                    style={{ backgroundColor: player.avatarColor }}
                  >
                    {player.name.charAt(0).toUpperCase()}
                    <span className="absolute -bottom-1 -right-1 bg-[#141218] text-[#CAC4D0] text-[10px] font-mono px-1 rounded-md border border-white/10">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-bold text-[#E6E0E9] truncate">
                        {player.name}
                      </h4>
                      <button
                        id={`edit-name-btn-${player.id}`}
                        onClick={(e) => handleEditClick(e, player)}
                        className="p-1 rounded-lg text-[#CAC4D0] hover:text-[#E6E0E9] hover:bg-white/10 transition-colors"
                        title="Edit Player Name"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#CAC4D0] mt-0.5">
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <strong className="text-[#E6E0E9] font-semibold">{player.wins}</strong>{' '}
                        {player.wins === 1 ? 'Win' : 'Wins'}
                      </span>
                      {totalGamesPlayed > 0 && (
                        <span className="text-[11px] font-mono text-[#D0BCFF]">
                          ({Math.round((player.wins / totalGamesPlayed) * 100)}% Win Rate)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Balance & Tap Hint */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center justify-end gap-1">
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    ) : isNegative ? (
                      <TrendingDown className="w-4 h-4 text-rose-400" />
                    ) : null}
                    <span
                      className={`text-lg font-extrabold font-mono ${
                        isPositive
                          ? 'text-emerald-400'
                          : isNegative
                          ? 'text-rose-400'
                          : 'text-[#CAC4D0]'
                      }`}
                    >
                      {formatRupees(player.balance)}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-end gap-0.5 text-[11px] font-medium text-[#D0BCFF] group-hover:translate-x-0.5 transition-transform">
                    <span>Tap to Win</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button (FAB) for Quick Win Logging */}
      <div className="fixed bottom-20 right-5 z-40">
        <button
          id="fab-add-game"
          onClick={() => setIsFabMenuOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-[#D0BCFF] hover:bg-[#EADDFF] text-[#381E72] font-bold shadow-xl shadow-[#D0BCFF]/20 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Record Win</span>
        </button>
      </div>

      {/* Quick Winner Selection Bottom Sheet Modal */}
      {isFabMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div
            id="fab-winner-sheet"
            className="w-full max-w-xl bg-[#211F26] border-t border-white/10 rounded-t-3xl p-6 shadow-2xl space-y-4 animate-slide-up"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div>
                <h3 className="text-lg font-bold text-[#E6E0E9]">Select Round Winner</h3>
                <p className="text-xs text-[#CAC4D0]">Tap any player who won this round</p>
              </div>
              <button
                onClick={() => setIsFabMenuOpen(false)}
                className="px-3 py-1.5 rounded-full bg-[#36343B] text-xs font-semibold text-[#E6E0E9]"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {players.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setIsFabMenuOpen(false);
                    handleCardClick(p);
                  }}
                  className="w-full flex items-center justify-between p-3.5 bg-[#2B2930] hover:bg-[#36343B] rounded-2xl border border-white/5 text-left transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-[#141218]"
                      style={{ backgroundColor: p.avatarColor }}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-[#E6E0E9]">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#D0BCFF] font-medium">
                    <span>+{formatRupees(effectiveWinnerPayout)}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <WinConfirmationModal
        winner={selectedWinner}
        isOpen={isWinModalOpen}
        onClose={() => setIsWinModalOpen(false)}
        onConfirm={handleConfirmWin}
      />

      {/* Edit Player Name Modal */}
      <EditPlayerModal
        player={editingPlayer}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};
