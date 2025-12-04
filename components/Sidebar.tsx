import React from 'react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onOpenUpload: () => void;
  onOpenRecognition: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onOpenUpload, onOpenRecognition }) => {
  const navItemClass = (view: ViewState) => 
    `flex items-center gap-4 px-4 py-3 text-sm font-semibold transition-colors cursor-pointer rounded-md ${
      currentView === view ? 'text-white bg-zinc-800' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
    }`;

  return (
    <div className="w-64 bg-black h-full flex flex-col border-r border-zinc-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <i className="fa-solid fa-wave-square text-green-500"></i>
          SoundWave
        </h1>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        <div onClick={() => onChangeView(ViewState.HOME)} className={navItemClass(ViewState.HOME)}>
          <i className="fa-solid fa-house text-xl w-6"></i>
          Home
        </div>
        <div onClick={() => onChangeView(ViewState.SEARCH)} className={navItemClass(ViewState.SEARCH)}>
          <i className="fa-solid fa-magnifying-glass text-xl w-6"></i>
          Search
        </div>
        <div onClick={() => onChangeView(ViewState.LIBRARY)} className={navItemClass(ViewState.LIBRARY)}>
          <i className="fa-solid fa-book text-xl w-6"></i>
          Your Library
        </div>
        
        <div className="mt-6 pt-6 border-t border-zinc-800 px-4">
          <p className="text-xs font-bold text-zinc-500 tracking-wider mb-2 uppercase">Tools</p>
        </div>

        <div onClick={() => onChangeView(ViewState.DOWNLOADS)} className={navItemClass(ViewState.DOWNLOADS)}>
          <i className="fa-solid fa-circle-down text-xl w-6"></i>
          Downloads
        </div>

        <button onClick={onOpenRecognition} className="w-full text-left flex items-center gap-4 px-4 py-3 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors">
          <i className="fa-solid fa-microphone-lines text-xl w-6"></i>
          Identify Song
        </button>

         <button onClick={onOpenUpload} className="w-full text-left flex items-center gap-4 px-4 py-3 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-md transition-colors">
          <i className="fa-solid fa-cloud-arrow-up text-xl w-6"></i>
          Upload Music
        </button>
      </nav>

      <div className="px-6 py-4 border-t border-zinc-800">
        <div className="text-xs text-zinc-500 hover:underline cursor-pointer">Cookies</div>
        <div className="text-xs text-zinc-500 hover:underline cursor-pointer mt-1 mb-4">Privacy</div>
        
        <div className="pt-4 border-t border-zinc-800">
          <div className="text-xs text-zinc-600 mb-1">Created by</div>
          <a 
            href="https://www.facebook.com/profile.php?id=61583456361691" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
          >
            Akin S. Sokpah 
            <i className="fa-brands fa-facebook text-blue-600"></i>
          </a>
        </div>
      </div>
    </div>
  );
};