import React from 'react';
import { Player } from '../types';
import { useGame } from '../context/GameContext';
import { formatRupees, formatRupeesPlain } from '../utils/formatters';
import { Trophy, AlertCircle, CheckCircle2, Zap, X } from 'lucide-react';

interface WinConfirmationModalProps {
  winner: Player | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const WinConfirmationModal: React.FC<WinConfirmationModalProps> = ({
  winner,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { isDoublePrice, baseStake, effectiveWinnerPayout, effectiveLoserLoss, players } = useGame();

  if (!isOpen || !winner) return null;

  const losers = players.filter((p) => p.id !== winner.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        id="win-confirmation-dialog"
        className="w-full max-w-md bg-[#211F26] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 transform transition-all animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#381E72] flex items-center justify-center text-[#D0BCFF] border border-[#4F378B]">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#E6E0E9]">Confirm Game Winner</h3>
              <p className="text-xs text-[#CAC4D0]">Verify round payouts before saving</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#36343B] text-[#CAC4D0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Winner Highlight Box */}
        <div className="bg-[#2B2930] p-4 rounded-2xl border border-[#4F378B]/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-[#141218]"
              style={{ backgroundColor: winner.avatarColor }}
            >
              {winner.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-[#D0BCFF]">
                Round Winner
              </span>
              <h4 className="text-lg font-bold text-[#E6E0E9]">{winner.name}</h4>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-emerald-400 font-medium">Payout</span>
            <div className="text-xl font-extrabold text-emerald-400">
              {formatRupees(effectiveWinnerPayout)}
            </div>
          </div>
        </div>

        {/* Stake Rules Badge */}
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium ${
            isDoublePrice
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              : 'bg-blue-500/10 border-blue-500/30 text-blue-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${isDoublePrice ? 'text-amber-400 fill-amber-400' : 'text-blue-400'}`} />
            <span>
              Multiplier Mode:{' '}
              <strong className="underline decoration-dotted font-bold">
                {isDoublePrice ? 'DOUBLE PRICE (2X)' : 'NORMAL STAKE (1X)'}
              </strong>
            </span>
          </div>
          <span className="bg-white/10 px-2.5 py-1 rounded-md font-mono font-bold">
            {formatRupeesPlain(isDoublePrice ? baseStake * 2 : baseStake)} / player
          </span>
        </div>

        {/* Detailed Player Settlements Table */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#CAC4D0] uppercase tracking-wider px-1">
            Payout Breakdown
          </span>
          <div className="bg-[#1D1B20] rounded-2xl border border-white/5 p-3 space-y-2 max-h-44 overflow-y-auto">
            {/* Winner row */}
            <div className="flex items-center justify-between py-1.5 px-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-xs">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {winner.name} (Winner)
              </span>
              <span className="font-extrabold text-emerald-300 font-mono text-sm">
                {formatRupees(effectiveWinnerPayout)}
              </span>
            </div>

            {/* Losers rows */}
            {losers.map((loser) => (
              <div
                key={loser.id}
                className="flex items-center justify-between py-1.5 px-2 hover:bg-[#2B2930] rounded-xl text-xs text-[#E6E0E9]"
              >
                <span className="text-[#CAC4D0] font-medium">{loser.name}</span>
                <span className="font-bold text-rose-400 font-mono text-sm">
                  {formatRupees(-effectiveLoserLoss)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            id="modal-cancel-btn"
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-full bg-[#36343B] hover:bg-[#49454F] text-[#E6E0E9] font-medium text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            id="modal-confirm-btn"
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-full bg-[#D0BCFF] hover:bg-[#EADDFF] text-[#381E72] font-bold text-sm transition-colors shadow-lg shadow-[#D0BCFF]/10 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Confirm & Save
          </button>
        </div>
      </div>
    </div>
  );
};
