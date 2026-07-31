import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { RotateCcw, AlertTriangle, X, Check } from 'lucide-react';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { resetAllData } = useGame();
  const [keepNames, setKeepNames] = useState(true);

  if (!isOpen) return null;

  const handleConfirmReset = () => {
    resetAllData(keepNames);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        id="reset-confirm-dialog"
        className="w-full max-w-md bg-[#211F26] border border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-5 animate-scale-up"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#E6E0E9]">Reset All Game Data?</h3>
              <p className="text-xs text-[#CAC4D0]">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#36343B] text-[#CAC4D0]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-[#CAC4D0] leading-relaxed bg-[#1D1B20] p-3.5 rounded-2xl border border-white/5">
          Resetting will clear all game history, set all 5 player balances back to <span className="font-bold text-white">₹0</span>, and reset total win counts.
        </p>

        {/* Options */}
        <div className="space-y-2">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-[#2B2930] border border-white/5 cursor-pointer hover:bg-[#36343B] transition-colors">
            <input
              type="checkbox"
              checked={keepNames}
              onChange={(e) => setKeepNames(e.target.checked)}
              className="w-4 h-4 rounded text-[#D0BCFF] focus:ring-[#D0BCFF] bg-[#1D1B20] border-white/20"
            />
            <span className="text-xs text-[#E6E0E9] font-medium">
              Keep current player names (do not reset names to Player 1..5)
            </span>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-full bg-[#36343B] hover:bg-[#49454F] text-[#E6E0E9] font-medium text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            id="confirm-reset-data-btn"
            type="button"
            onClick={handleConfirmReset}
            className="flex-1 py-3 px-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-colors shadow-lg shadow-rose-900/30 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Data
          </button>
        </div>
      </div>
    </div>
  );
};
