import React from 'react';
import { Track } from '../types';

interface QueueSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  queue: Track[];
  currentTrack: Track | null;
  onPlay: (track: Track) => void;
  onRemove: (index: number) => void;
}

export const QueueSidebar: React.FC<QueueSidebarProps> = ({ 
  isOpen, onClose, queue, currentTrack, onPlay, onRemove 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-[var(--bg-secondary)] border-l border-[var(--bg-hover)] shadow-2xl transform transition-transform duration-300 z-40 flex flex-col slide-in-right">
      <div className="p-4 border-b border-[var(--bg-hover)] flex items-center justify-between">
        <h2 className="font-bold text-lg text-[var(--text-primary)]">Play Queue</h2>
        <button onClick={onClose} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {currentTrack && (
          <div className="mb-6">
            <h3 className="text-xs uppercase font-bold text-[var(--text-secondary)] mb-2">Now Playing</h3>
            <div className="flex items-center gap-3 p-2 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-md">
               <img src={currentTrack.coverUrl} className="w-10 h-10 rounded object-cover animate-pulse" />
               <div className="flex-1 overflow-hidden">
                 <div className="font-bold text-[var(--accent)] truncate">{currentTrack.title}</div>
                 <div className="text-xs text-[var(--text-secondary)] truncate">{currentTrack.artist}</div>
               </div>
               <div className="flex items-end gap-[2px] h-3 mr-2">
                  <div className="w-1 bg-[var(--accent)] animate-equalizer-bar" style={{animationDelay: '0s'}}></div>
                  <div className="w-1 bg-[var(--accent)] animate-equalizer-bar" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-1 bg-[var(--accent)] animate-equalizer-bar" style={{animationDelay: '0.4s'}}></div>
               </div>
            </div>
          </div>
        )}

        <h3 className="text-xs uppercase font-bold text-[var(--text-secondary)] mb-2">Next Up</h3>
        {queue.length === 0 ? (
          <p className="text-[var(--text-secondary)] text-sm italic">Queue is empty.</p>
        ) : (
          <div className="space-y-1">
            {queue.map((track, idx) => (
              <div key={`${track.id}-${idx}`} className="group flex items-center justify-between p-2 hover:bg-[var(--bg-hover)] rounded-md cursor-pointer">
                <div className="flex items-center gap-3 overflow-hidden" onClick={() => onPlay(track)}>
                  <span className="text-xs text-[var(--text-secondary)] w-4">{idx + 1}</span>
                  <img src={track.coverUrl} className="w-8 h-8 rounded object-cover opacity-70 group-hover:opacity-100" />
                  <div className="flex-col overflow-hidden">
                    <div className="text-sm text-[var(--text-primary)] truncate font-medium">{track.title}</div>
                    <div className="text-xs text-[var(--text-secondary)] truncate">{track.artist}</div>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
                  className="opacity-0 group-hover:opacity-100 text-[var(--text-secondary)] hover:text-red-500 transition-opacity px-2"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};