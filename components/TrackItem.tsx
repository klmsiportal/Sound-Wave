import React, { useState } from 'react';
import { Track } from '../types';

interface TrackItemProps {
  track: Track;
  index: number;
  onPlay: (track: Track) => void;
  onAddToRadio: (track: Track) => void;
  onDownload: (track: Track) => void;
  onShare: (track: Track) => void;
}

export const TrackItem: React.FC<TrackItemProps> = ({ track, index, onPlay, onAddToRadio, onDownload, onShare }) => {
  const [showMenu, setShowMenu] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div 
      className="group flex items-center px-4 py-2 hover:bg-white/10 rounded-md transition-colors relative"
      onMouseLeave={() => setShowMenu(false)}
    >
      <div className="w-8 text-zinc-400 text-sm text-center">
        <span className="group-hover:hidden">{index + 1}</span>
        <button onClick={() => onPlay(track)} className="hidden group-hover:block text-white">
          <i className="fa-solid fa-play"></i>
        </button>
      </div>
      
      <div className="flex-1 flex items-center gap-4 ml-4">
        <img src={track.coverUrl} alt="" className="w-10 h-10 rounded object-cover" />
        <div>
          <div className="text-white font-medium hover:underline cursor-pointer">{track.title}</div>
          <div className="text-zinc-400 text-sm hover:underline cursor-pointer">{track.artist}</div>
        </div>
      </div>

      <div className="hidden md:block w-1/3 text-zinc-400 text-sm hover:underline cursor-pointer">{track.album || 'Unknown Album'}</div>

      <div className="w-24 text-zinc-400 text-sm text-right flex items-center justify-end gap-4">
        <button 
          className="opacity-0 group-hover:opacity-100 hover:text-white"
          onClick={() => setIsLiked(!isLiked)}
        >
          <i className="fa-regular fa-heart"></i>
        </button>
        <span>{formatTime(track.duration)}</span>
        
        <div className="relative">
          <button 
            className="opacity-0 group-hover:opacity-100 hover:text-white px-2"
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          >
            <i className="fa-solid fa-ellipsis"></i>
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-zinc-800 rounded shadow-xl z-10 border border-zinc-700 py-1">
              <button 
                onClick={() => onAddToRadio(track)}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700 flex items-center gap-2"
              >
                <i className="fa-solid fa-tower-broadcast text-xs"></i> Go to Artist Radio
              </button>
              <button 
                onClick={() => onDownload(track)}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700 flex items-center gap-2"
              >
                <i className="fa-solid fa-download text-xs"></i> Download
              </button>
              <button 
                onClick={() => onShare(track)}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700 flex items-center gap-2"
              >
                <i className="fa-solid fa-share-nodes text-xs"></i> Share
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const isLiked = false;
function setIsLiked(arg0: boolean) {
  // Mock function
}
