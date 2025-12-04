import React from 'react';
import { Theme } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentTheme, onThemeChange }) => {
  if (!isOpen) return null;

  const ThemeOption = ({ theme, label, color }: { theme: Theme; label: string; color: string }) => (
    <button 
      onClick={() => onThemeChange(theme)}
      className={`flex items-center justify-between p-4 rounded-lg border transition-all ${currentTheme === theme ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--bg-hover)] bg-[var(--bg-primary)] hover:border-[var(--text-secondary)]'}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-6 h-6 rounded-full ${color}`}></div>
        <span className="font-medium text-[var(--text-primary)]">{label}</span>
      </div>
      {currentTheme === theme && <i className="fa-solid fa-check text-[var(--accent)]"></i>}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="bg-[var(--bg-secondary)] border border-[var(--bg-hover)] rounded-xl w-full max-w-md p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Settings</h2>

        <div className="mb-6">
          <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase mb-3">Appearance</h3>
          <div className="space-y-2">
            <ThemeOption theme="dark" label="Deep Dark" color="bg-black" />
            <ThemeOption theme="ocean" label="Midnight Ocean" color="bg-slate-900" />
            <ThemeOption theme="light" label="Light Mode" color="bg-white border border-gray-300" />
          </div>
        </div>

        <div className="mb-6">
           <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase mb-3">Playback</h3>
           <div className="flex items-center justify-between p-3">
             <span className="text-[var(--text-primary)]">High Quality Audio</span>
             <div className="w-10 h-6 bg-[var(--accent)] rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
           </div>
           <div className="flex items-center justify-between p-3">
             <span className="text-[var(--text-primary)]">Crossfade Songs</span>
             <div className="w-10 h-6 bg-[var(--bg-hover)] rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div></div>
           </div>
        </div>
      </div>
    </div>
  );
};