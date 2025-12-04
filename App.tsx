import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { MediaPlayer } from './components/MediaPlayer';
import { TrackItem } from './components/TrackItem';
import { RecognitionModal } from './components/RecognitionModal';
import { UploadModal } from './components/UploadModal';
import { QueueSidebar } from './components/QueueSidebar';
import { SubscriptionModal } from './components/SubscriptionModal';
import { SettingsModal } from './components/SettingsModal';
import { ArtistBio } from './components/ArtistBio';
import { MOCK_TRACKS, getRadioTracks, ARTIST_BIOS } from './services/mockData';
import { Track, ViewState, Theme, Toast, Artist } from './types';
import { signInWithGoogle, logout, useAuth } from './services/firebase';

const App: React.FC = () => {
  // State
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Track[]>([]);
  const [theme, setTheme] = useState<Theme>('dark');
  const [user, setUser] = useState<any>(null);
  
  // Modals
  const [showRecognition, setShowRecognition] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Data
  const [displayTracks, setDisplayTracks] = useState<Track[]>(MOCK_TRACKS);
  const [downloads, setDownloads] = useState<Track[]>([]);

  // --- Effects ---

  // Auth & Storage Init
  useEffect(() => {
    const unsubscribe = useAuth((u) => setUser(u));
    
    // Load local storage data
    const savedDownloads = localStorage.getItem('soundwave_downloads');
    if (savedDownloads) setDownloads(JSON.parse(savedDownloads));

    const savedTheme = localStorage.getItem('soundwave_theme') as Theme;
    if (savedTheme) updateTheme(savedTheme);

    return () => unsubscribe();
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch(e.code) {
        case 'Space':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'KeyN':
          handleNext();
          break;
        case 'KeyP':
          handlePrevious();
          break;
        case 'KeyM':
          // Mute logic handled in player locally, but could lift state
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTrack, displayTracks, queue]);

  // --- Handlers ---

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('soundwave_theme', newTheme);
  };

  const handlePlay = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // Add rest of display list to queue if queue is empty
    if (queue.length === 0) {
      const idx = displayTracks.findIndex(t => t.id === track.id);
      if (idx !== -1) {
         setQueue(displayTracks.slice(idx + 1));
      }
    }
  };

  const handleNext = useCallback(() => {
    if (queue.length > 0) {
      const next = queue[0];
      setCurrentTrack(next);
      setQueue(prev => prev.slice(1));
      setIsPlaying(true);
    } else {
      // Fallback to cycling current list if queue empty
      if (!currentTrack) return;
      const currentIndex = displayTracks.findIndex(t => t.id === currentTrack.id);
      const nextTrack = displayTracks[(currentIndex + 1) % displayTracks.length];
      handlePlay(nextTrack);
    }
  }, [queue, currentTrack, displayTracks]);

  const handlePrevious = useCallback(() => {
    if (!currentTrack) return;
    const currentIndex = displayTracks.findIndex(t => t.id === currentTrack.id);
    const prevTrack = displayTracks[(currentIndex - 1 + displayTracks.length) % displayTracks.length];
    handlePlay(prevTrack);
  }, [currentTrack, displayTracks]);

  const handleStartRadio = (track: Track) => {
    const radioTracks = getRadioTracks(track.artist);
    setDisplayTracks(radioTracks);
    setCurrentView(ViewState.HOME);
    handlePlay(radioTracks[0]);
    addToast(`Started radio for ${track.artist}`, 'success');
  };

  const handleDownload = (track: Track) => {
    const exists = downloads.find(d => d.id === track.id);
    if (!exists) {
      const newDownloads = [...downloads, { ...track, isOffline: true }];
      setDownloads(newDownloads);
      localStorage.setItem('soundwave_downloads', JSON.stringify(newDownloads));
      addToast('Downloaded to library', 'success');
    } else {
      addToast('Already downloaded', 'info');
    }
  };

  const handleShare = (track: Track) => {
    const text = `Check out ${track.title} by ${track.artist} on SoundWave!`;
    if (navigator.share) {
      navigator.share({ title: 'SoundWave', text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      addToast('Link copied to clipboard', 'success');
    }
  };

  const handleViewArtist = (artistName: string) => {
    setSelectedArtist(artistName);
    // Filter tracks by artist for the list
    const artistTracks = MOCK_TRACKS.filter(t => t.artist === artistName);
    // If we have no mock tracks, just show all (simulating a fetch)
    setDisplayTracks(artistTracks.length > 0 ? artistTracks : MOCK_TRACKS); 
    setCurrentView(ViewState.ARTIST);
  };

  const removeFromQueue = (index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index));
  };

  // --- Render ---

  const getContent = () => {
    let tracksToShow = displayTracks;
    let title = "Good evening";
    let gradient = "from-indigo-900 to-[var(--bg-primary)]";
    let subtitle = "Picked for you";
    let artistData: Artist | null = null;

    if (currentView === ViewState.SEARCH) {
      title = "Search";
      gradient = "from-purple-900 to-[var(--bg-primary)]";
      subtitle = "Find your next favorite song";
    } else if (currentView === ViewState.LIBRARY) {
      title = "Your Library";
      gradient = "from-emerald-900 to-[var(--bg-primary)]";
      subtitle = `${downloads.length} liked songs`;
    } else if (currentView === ViewState.DOWNLOADS) {
      title = "Downloads";
      gradient = "from-blue-900 to-[var(--bg-primary)]";
      tracksToShow = downloads;
      subtitle = "Listen offline";
    } else if (currentView === ViewState.ARTIST && selectedArtist) {
      title = selectedArtist;
      artistData = ARTIST_BIOS[selectedArtist] || ARTIST_BIOS['Default'];
      gradient = "from-zinc-800 to-[var(--bg-primary)]";
      subtitle = "Artist Profile";
    }

    return (
      <div className="flex-1 bg-[var(--bg-primary)] overflow-y-auto relative pb-32 transition-colors duration-300">
         {/* Header / Top Bar */}
        <header className={`sticky top-0 z-20 flex items-center justify-between px-8 py-4 ${currentView === ViewState.HOME ? 'bg-transparent' : 'bg-[var(--bg-secondary)]/90 backdrop-blur-md'}`}>
          <div className="flex gap-4">
            <button className="bg-black/40 rounded-full w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className="bg-black/40 rounded-full w-8 h-8 flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowSubscription(true)}
              className="hidden md:block bg-white text-black font-bold text-sm px-4 py-2 rounded-full hover:scale-105 transition-transform"
            >
              Explore Premium
            </button>
            <button onClick={() => setShowSettings(true)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
               <i className="fa-solid fa-gear text-xl"></i>
            </button>
            {!user ? (
              <div className="flex items-center gap-4">
                <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform">Sign up</button>
                <button onClick={signInWithGoogle} className="bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold py-2 px-6 rounded-full text-sm hover:scale-105 transition-transform">Log in</button>
              </div>
            ) : (
              <div className="flex items-center gap-4 cursor-pointer group relative">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-orange-500 flex items-center justify-center font-bold text-white">
                   {user.displayName?.charAt(0)}
                 </div>
                 <button onClick={logout} className="absolute top-10 right-0 bg-[var(--bg-secondary)] border border-[var(--bg-hover)] text-[var(--text-primary)] px-4 py-2 rounded shadow-xl hidden group-hover:block z-50">Logout</button>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className={`px-8 pb-8 pt-10 bg-gradient-to-b ${gradient}`}>
          {artistData && <ArtistBio artist={artistData} />}
          
          <div className="flex items-end gap-6">
            {!artistData && <div className="w-40 h-40 bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl rounded-md flex items-center justify-center">
              <i className={`fa-solid ${currentView === ViewState.DOWNLOADS ? 'fa-download' : currentView === ViewState.SEARCH ? 'fa-magnifying-glass' : 'fa-music'} text-6xl text-white opacity-50`}></i>
            </div>}
            
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-[var(--text-primary)] mb-2">{subtitle}</p>
              {!artistData && <h2 className="text-4xl md:text-7xl font-bold mb-4 shadow-xl text-[var(--text-primary)] tracking-tight">{title}</h2>}
              <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm font-medium">
                  {currentView === ViewState.DOWNLOADS && downloads.length === 0 ? 'No downloads yet.' : `Created by ${user?.displayName || 'SoundWave'} • ${tracksToShow.length} songs`}
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="px-8 py-6 flex items-center gap-6">
          <button className="w-14 h-14 bg-[var(--accent)] rounded-full flex items-center justify-center text-black text-xl hover:scale-105 hover:bg-green-400 transition-all shadow-lg shadow-green-900/20">
            <i className="fa-solid fa-play ml-1"></i>
          </button>
          <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-3xl">
            <i className="fa-regular fa-heart"></i>
          </button>
          <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-2xl">
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </div>

        {/* Track List */}
        <div className="px-8">
          <div className="sticky top-16 bg-[var(--bg-primary)]/0 text-[var(--text-secondary)] border-b border-[var(--bg-hover)] pb-2 mb-4 flex px-4 text-sm uppercase tracking-wider font-semibold">
             <div className="w-10 text-center">#</div>
             <div className="flex-1 ml-4">Title</div>
             <div className="hidden md:block w-1/4">Album</div>
             <div className="hidden lg:block w-1/6">Date Added</div>
             <div className="w-20 text-right"><i className="fa-regular fa-clock"></i></div>
          </div>
          <div className="flex flex-col space-y-1">
            {tracksToShow.map((track, idx) => (
              <TrackItem 
                key={track.id} 
                track={track} 
                index={idx} 
                onPlay={handlePlay}
                onAddToRadio={handleStartRadio}
                onDownload={handleDownload}
                onShare={handleShare}
              />
            ))}
          </div>
          
          <div className="mt-12 mb-8 text-center text-[var(--text-secondary)] text-sm pb-10">
            <p>You've reached the end of the list.</p>
            <div className="mt-4 flex justify-center gap-4 text-2xl">
              <i className="fa-brands fa-instagram hover:text-[var(--text-primary)] cursor-pointer"></i>
              <i className="fa-brands fa-twitter hover:text-[var(--text-primary)] cursor-pointer"></i>
              <i className="fa-brands fa-facebook hover:text-[var(--text-primary)] cursor-pointer"></i>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] font-sans text-[var(--text-primary)] overflow-hidden">
      {/* Toast Notifications */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`pointer-events-auto px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-fade-in ${
            toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-zinc-800 text-white border border-zinc-700'
          }`}>
             <i className={`fa-solid ${toast.type === 'success' ? 'fa-check' : 'fa-info-circle'}`}></i>
             <span className="font-medium text-sm">{toast.message}</span>
          </div>
        ))}
      </div>

      <Sidebar 
        currentView={currentView} 
        onChangeView={(view) => {
          if (view === ViewState.ARTIST) { setSelectedArtist(null); } // Reset if manually clicking library
          setCurrentView(view);
        }} 
        onOpenUpload={() => setShowUpload(true)}
        onOpenRecognition={() => setShowRecognition(true)}
      />
      
      {getContent()}

      <MediaPlayer 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onQueueClick={() => setShowQueue(!showQueue)}
      />

      {/* Slide-out Sidebar */}
      <QueueSidebar 
        isOpen={showQueue}
        onClose={() => setShowQueue(false)}
        queue={queue}
        currentTrack={currentTrack}
        onPlay={(track) => { handlePlay(track); }}
        onRemove={removeFromQueue}
      />

      {/* Modals */}
      <RecognitionModal 
        isOpen={showRecognition} 
        onClose={() => setShowRecognition(false)} 
        onTrackIdentified={(track) => { handlePlay(track); addToast('Song identified!', 'success'); }}
      />

      <UploadModal 
        isOpen={showUpload} 
        onClose={() => setShowUpload(false)} 
      />

      <SubscriptionModal
        isOpen={showSubscription}
        onClose={() => setShowSubscription(false)}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        currentTheme={theme}
        onThemeChange={updateTheme}
      />
    </div>
  );
};

export default App;