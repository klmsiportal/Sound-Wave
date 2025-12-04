import React, { useState } from 'react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [dragging, setDragging] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white">
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        <h2 className="text-2xl font-bold mb-4">Upload Music</h2>
        <p className="text-zinc-400 text-sm mb-6">Supported formats: MP3, WAV, FLAC</p>

        <div 
          className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center transition-colors ${dragging ? 'border-green-500 bg-green-500/10' : 'border-zinc-700 hover:border-zinc-500'}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); }}
        >
          <i className="fa-solid fa-cloud-arrow-up text-4xl text-zinc-500 mb-4"></i>
          <p className="font-semibold mb-2">Drag and drop audio files</p>
          <p className="text-sm text-zinc-500 mb-4">or</p>
          <label className="bg-white text-black font-bold py-2 px-6 rounded-full cursor-pointer hover:scale-105 transition-transform">
            Browse Files
            <input type="file" className="hidden" accept="audio/*" />
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="text-white font-bold py-2 px-4 hover:underline">Cancel</button>
        </div>
      </div>
    </div>
  );
};