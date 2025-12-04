import React, { useState, useEffect, useRef } from 'react';
import { Track } from '../types';

interface MediaPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onQueueClick: () => void;
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({ 
  currentTrack, isPlaying, onPlayPause, onNext, onPrevious, onQueueClick 
}) => {
  const [progress, setProgress] = useState(0); // in seconds
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'none' | 'all' | 'one'>('none');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying && !isDragging && currentTrack) {
      setDuration(currentTrack.duration);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentTrack.duration) {
            onNext(); // Auto next
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isDragging, currentTrack, onNext]);

  // Reset progress on track change
  useEffect(() => {
    if (currentTrack) {
      setProgress(0);
      setDuration(currentTrack.duration);
    }
  }, [currentTrack]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };

  if (!currentTrack) return null;

  return (
    <div className="h-24 bg-[var(--bg-secondary)] border-t border-[var(--bg-hover)] flex items-center justify-between px-4 fixed bottom-0 w-full z-50 transition-colors duration-300">
      {/* Track Info */}
      <div className="flex items-center w-1/3 min-w-[180px]">
        <img src={currentTrack.coverUrl} alt={currentTrack.title} className="h-14 w-14 rounded shadow-lg mr-4 object-cover" />
        <div className="flex flex-col overflow-hidden mr-4">
          <span className="text-sm font-semibold text-[var(--text-primary)] hover:underline cursor-pointer truncate">{currentTrack.title}</span>
          <span className="text-xs text-[var(--text-secondary)] hover:underline cursor-pointer truncate">{currentTrack.artist}</span>
        </div>
        <button 
          onClick={() => setIsLiked(!isLiked)} 
          className={`text-sm transition-transform hover:scale-110 ${isLiked ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`}></i>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center w-1/3">
        <div className="flex items-center gap-6 mb-1">
          <button 
            onClick={() => setShuffle(!shuffle)}
            className={`text-lg transition-all hover:scale-105 ${shuffle ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} 
            title="Shuffle"
          >
            <i className="fa-solid fa-shuffle"></i>
            {shuffle && <span className="block h-1 w-1 bg-[var(--accent)] rounded-full mx-auto mt-[-4px]"></span>}
          </button>
          <button onClick={onPrevious} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xl transition-transform hover:scale-110" title="Previous">
            <i className="fa-solid fa-backward-step"></i>
          </button>
          <button 
            onClick={onPlayPause} 
            className="bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-full w-8 h-8 flex items-center justify-center hover:scale-105 transition-transform"
          >
            <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'} text-sm`}></i>
          </button>
          <button onClick={onNext} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xl transition-transform hover:scale-110" title="Next">
            <i className="fa-solid fa-forward-step"></i>
          </button>
          <button 
            onClick={() => setRepeat(repeat === 'none' ? 'all' : repeat === 'all' ? 'one' : 'none')}
            className={`text-lg transition-all hover:scale-105 ${repeat !== 'none' ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} 
            title="Repeat"
          >
            <i className={`fa-solid ${repeat === 'one' ? 'fa-repeat' : 'fa-repeat'}`}></i>
            {repeat === 'one' && <span className="absolute text-[8px] font-bold mt-[-8px] ml-[2px]">1</span>}
            {repeat !== 'none' && <span className="block h-1 w-1 bg-[var(--accent)] rounded-full mx-auto mt-[-4px]"></span>}
          </button>
        </div>
        
        {/* Progress Bar with Scrubbing */}
        <div className="w-full max-w-md flex items-center gap-2 text-xs text-[var(--text-secondary)] font-mono">
          <span className="w-8 text-right">{formatTime(progress)}</span>
          <div className="flex-1 relative group h-1 bg-[var(--bg-hover)] rounded-full cursor-pointer flex items-center">
            {/* Native range input for better interaction */}
            <input 
              type="range"
              min="0"
              max={duration || 100}
              value={progress}
              onChange={handleSeek}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              className="absolute w-full h-full opacity-0 z-20 cursor-pointer"
            />
            {/* Visual Bar */}
            <div 
              className="absolute top-0 left-0 h-full bg-[var(--accent)] rounded-full group-hover:bg-[var(--accent)]/80 pointer-events-none" 
              style={{ width: `${(progress / (duration || 1)) * 100}%` }}
            ></div>
            {/* Handle */}
            <div 
              className="absolute w-3 h-3 bg-[var(--text-primary)] rounded-full opacity-0 group-hover:opacity-100 shadow pointer-events-none z-10 transition-opacity" 
              style={{ left: `calc(${(progress / (duration || 1)) * 100}% - 6px)` }}
            ></div>
          </div>
          <span className="w-8">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Queue */}
      <div className="flex items-center justify-end w-1/3 gap-3">
        <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
          <i className="fa-solid fa-microphone"></i>
        </button>
        <button 
          onClick={onQueueClick}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]" 
          title="Queue"
        >
          <i className="fa-solid fa-list-ul"></i>
        </button>
        <div className="flex items-center gap-2 w-32 group">
          <button onClick={() => setIsMuted(!isMuted)}>
             <i className={`fa-solid ${isMuted || volume === 0 ? 'fa-volume-xmark' : volume < 50 ? 'fa-volume-low' : 'fa-volume-high'} text-[var(--text-secondary)] text-xs`}></i>
          </button>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={isMuted ? 0 : volume}
            onChange={(e) => { setVolume(Number(e.target.value)); setIsMuted(false); }}
            className="w-full h-1 bg-[var(--bg-hover)] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[var(--text-primary)] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:opacity-0 group-hover:[&::-webkit-slider-thumb]:opacity-100"
          />
        </div>
      </div>
    </div>
  );
};