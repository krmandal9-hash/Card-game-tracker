import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { generateFlutterProjectFiles, FlutterFile } from '../utils/flutterCodeGenerator';
import { ResetConfirmModal } from './ResetConfirmModal';
import {
  Settings,
  Users,
  RotateCcw,
  Download,
  Upload,
  Code2,
  Copy,
  Check,
  Zap,
  DollarSign,
  FileCode,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const {
    players,
    updatePlayerName,
    baseStake,
    setBaseStake,
    exportData,
    importData,
    settings,
  } = useGame();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeFlutterFileIndex, setActiveFlutterFileIndex] = useState<number>(0);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const flutterFiles = generateFlutterProjectFiles();
  const currentFlutterFile = flutterFiles[activeFlutterFileIndex] || flutterFiles[0];

  const handleCopyCode = (file: FlutterFile) => {
    navigator.clipboard.writeText(file.content);
    setCopiedFile(file.filename);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const handleExportJSON = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `card_game_tracker_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importData(content);
        if (success) {
          setImportStatus('Data imported successfully!');
        } else {
          setImportStatus('Failed to import data. Invalid JSON format.');
        }
        setTimeout(() => setImportStatus(null), 3500);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Settings Header */}
      <div className="bg-[#211F26] border border-white/10 rounded-3xl p-5 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#381E72] border border-[#4F378B] flex items-center justify-center text-[#D0BCFF]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#E6E0E9]">App Settings</h2>
            <p className="text-xs text-[#CAC4D0]">Configure players, stakes & export Flutter code</p>
          </div>
        </div>
      </div>

      {/* 1. Player Names Configuration */}
      <div className="bg-[#211F26] border border-white/10 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#D0BCFF]">
          <Users className="w-4 h-4" />
          <span>Edit 5 Player Names</span>
        </div>

        <div className="space-y-2.5">
          {players.map((p, idx) => (
            <div key={p.id} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs text-[#141218] flex-shrink-0"
                style={{ backgroundColor: p.avatarColor }}
              >
                P{idx + 1}
              </div>
              <input
                type="text"
                value={p.name}
                onChange={(e) => updatePlayerName(p.id, e.target.value)}
                placeholder={`Player ${idx + 1}`}
                maxLength={20}
                className="flex-1 bg-[#1D1B20] border border-white/10 rounded-2xl px-3.5 py-2 text-xs font-semibold text-[#E6E0E9] focus:outline-none focus:border-[#D0BCFF]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 2. Stake & Multiplier Configuration */}
      <div className="bg-[#211F26] border border-white/10 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#D0BCFF]">
          <DollarSign className="w-4 h-4" />
          <span>Base Stake Configuration</span>
        </div>

        <p className="text-xs text-[#CAC4D0]">
          Default stake is <strong className="text-white">₹300</strong> per player. Winner gets 4x base stake (+₹1,200 standard / +₹2,400 double).
        </p>

        <div className="grid grid-cols-4 gap-2">
          {[100, 200, 300, 500].map((stakeVal) => (
            <button
              key={stakeVal}
              onClick={() => setBaseStake(stakeVal)}
              className={`py-2 px-3 rounded-2xl text-xs font-bold transition-all border ${
                baseStake === stakeVal
                  ? 'bg-[#EADDFF] text-[#21005D] border-[#D0BCFF]'
                  : 'bg-[#1D1B20] text-[#CAC4D0] border-white/5 hover:bg-[#2B2930]'
              }`}
            >
              ₹{stakeVal}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Reset Data & Storage Backup */}
      <div className="bg-[#211F26] border border-white/10 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#D0BCFF]">
          <ShieldCheck className="w-4 h-4" />
          <span>Offline Storage & Reset</span>
        </div>

        {importStatus && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{importStatus}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#2B2930] hover:bg-[#36343B] text-[#E6E0E9] text-xs font-bold border border-white/10 transition-colors"
          >
            <Download className="w-4 h-4 text-[#D0BCFF]" />
            <span>Export Backup JSON</span>
          </button>

          <label className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#2B2930] hover:bg-[#36343B] text-[#E6E0E9] text-xs font-bold border border-white/10 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-[#D0BCFF]" />
            <span>Import Backup JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>

        <div className="pt-2 border-t border-white/5">
          <button
            id="open-reset-modal-btn"
            onClick={() => setIsResetModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Game Data & History</span>
          </button>
        </div>
      </div>

      {/* 4. Complete Native Flutter Source Code Viewer */}
      <div className="bg-[#211F26] border border-white/10 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#E6E0E9]">Flutter Source Code</h3>
              <p className="text-[11px] text-[#CAC4D0]">Dart + Provider + Hive offline state code</p>
            </div>
          </div>

          <button
            onClick={() => handleCopyCode(currentFlutterFile)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D0BCFF] text-[#381E72] text-xs font-bold hover:bg-[#EADDFF] transition-all"
          >
            {copiedFile === currentFlutterFile.filename ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {flutterFiles.map((f, idx) => (
            <button
              key={f.filename}
              onClick={() => setActiveFlutterFileIndex(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-[11px] whitespace-nowrap transition-colors border ${
                activeFlutterFileIndex === idx
                  ? 'bg-[#381E72] text-[#EADDFF] border-[#4F378B] font-bold'
                  : 'bg-[#1D1B20] text-[#CAC4D0] border-white/5 hover:bg-[#2B2930]'
              }`}
            >
              <FileCode className="w-3 h-3 text-[#D0BCFF]" />
              <span>{f.filename}</span>
            </button>
          ))}
        </div>

        {/* Code View Block */}
        <div className="relative rounded-2xl bg-[#0F0D13] border border-white/10 p-4 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-80 leading-relaxed">
          <pre>{currentFlutterFile.content}</pre>
        </div>
      </div>

      {/* Reset Dialog */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
