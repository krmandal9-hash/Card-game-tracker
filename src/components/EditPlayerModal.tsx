import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { useGame } from '../context/GameContext';
import { User, Check, X } from 'lucide-react';

interface EditPlayerModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditPlayerModal: React.FC<EditPlayerModalProps> = ({
  player,
  isOpen,
  onClose,
}) => {
  const { updatePlayerName } = useGame();
  const [name, setName] = useState('');

  useEffect(() => {
    if (player) {
      setName(player.name);
    }
  }, [player]);

  if (!isOpen || !player) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updatePlayerName(player.id, name.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        id="edit-player-dialog"
        className="w-full max-w-sm bg-[#211F26] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 animate-scale-up"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-[#141218]"
              style={{ backgroundColor: player.avatarColor }}
            >
              {player.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="text-lg font-bold text-[#E6E0E9]">Rename Player</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#36343B] text-[#CAC4D0]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#CAC4D0] mb-1.5 uppercase tracking-wider">
              Player Name
            </label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#CAC4D0]" />
              <input
                id="edit-player-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter player name..."
                maxLength={20}
                autoFocus
                className="w-full bg-[#1D1B20] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-[#E6E0E9] placeholder-[#49454F] focus:outline-none focus:border-[#D0BCFF] focus:ring-1 focus:ring-[#D0BCFF] text-sm font-medium transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#36343B] hover:bg-[#49454F] text-[#E6E0E9] font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-player-name-btn"
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#D0BCFF] hover:bg-[#EADDFF] disabled:opacity-50 text-[#381E72] font-bold text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Save Name
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
