import React, { useState, useEffect } from 'react';
import { Track } from '../types';
import { MOCK_TRACKS } from '../services/mockData';

interface RecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackIdentified: (track: Track) => void;
}

export const RecognitionModal: React.FC<RecognitionModalProps> = ({ isOpen, onClose, onTrackIdentified }) => {
  const [status, setStatus] = useState<'listening' | 'analyzing' | 'found' | 'error'>('listening');
  const [identifiedTrack, setIdentifiedTrack] = useState<Track | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStatus('listening');
      // Simulate listening
      const listenTimer = setTimeout(() => {
        setStatus('analyzing');
        // Simulate analysis
        const analyzeTimer = setTimeout(() => {
          // Randomly pick a track to "identify"
          const randomTrack = MOCK_TRACKS[Math.floor(Math.random() * MOCK_TRACKS.length)];
          setIdentifiedTrack(randomTrack);
          setStatus('found');
        }, 2000);
        return () => clearTimeout(analyzeTimer);
      }, 3000);
      return () => clearTimeout(listenTimer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md text-center relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <h2 className="text-2xl font-bold mb-6">Identify Song</h2>

        {status === 'listening' && (
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-blue-600/20 flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 opacity-20 animate-ping"></div>
              <i className="fa-solid fa-microphone text-4xl text-blue-500"></i>
            </div>
            <p className="text-zinc-300">Listening to music...</p>
          </div>
        )}

        {status === 'analyzing' && (
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-purple-600/20 flex items-center justify-center mb-6">
               <i className="fa-solid fa-circle-notch fa-spin text-4xl text-purple-500"></i>
            </div>
            <p className="text-zinc-300">Matching with database...</p>
          </div>
        )}

        {status === 'found' && identifiedTrack && (
          <div className="flex flex-col items-center animate-fade-in">
            <img src={identifiedTrack.coverUrl} alt={identifiedTrack.title} className="w-32 h-32 rounded-lg shadow-lg mb-4" />
            <h3 className="text-xl font-bold text-white mb-1">{identifiedTrack.title}</h3>
            <p className="text-zinc-400 mb-6">{identifiedTrack.artist}</p>
            <button 
              onClick={() => { onTrackIdentified(identifiedTrack); onClose(); }}
              className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-8 rounded-full transition-transform hover:scale-105"
            >
              Play Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};