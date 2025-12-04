import React from 'react';
import { Artist } from '../types';

interface ArtistBioProps {
  artist: Artist;
}

export const ArtistBio: React.FC<ArtistBioProps> = ({ artist }) => {
  return (
    <div className="mt-8 mb-8 p-6 bg-[var(--bg-secondary)] rounded-xl border border-[var(--bg-hover)] animate-fade-in relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
         <i className="fa-brands fa-spotify text-6xl text-[var(--bg-hover)] transform rotate-12"></i>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 relative z-10">
        <img 
            src={artist.coverUrl} 
            alt={artist.name} 
            className="w-32 h-32 rounded-full object-cover shadow-2xl border-4 border-[var(--bg-primary)]"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-3xl font-bold text-[var(--text-primary)]">{artist.name}</h2>
            {artist.isVerified && (
              <i className="fa-solid fa-circle-check text-blue-500 text-xl" title="Verified Artist"></i>
            )}
          </div>
          <div className="text-[var(--text-secondary)] text-sm font-bold uppercase tracking-wider mb-4">
            {artist.monthlyListeners.toLocaleString()} Monthly Listeners
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed max-w-2xl line-clamp-3 hover:line-clamp-none transition-all cursor-pointer">
            {artist.bio}
          </p>
        </div>
        <div className="flex items-center">
            <button className="bg-[var(--bg-primary)] border border-[var(--text-secondary)] text-[var(--text-primary)] px-6 py-2 rounded-full font-bold hover:border-[var(--text-primary)] uppercase text-xs tracking-widest">
                Follow
            </button>
        </div>
      </div>
    </div>
  );
};