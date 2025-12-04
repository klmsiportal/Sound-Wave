export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  coverUrl: string;
  audioUrl?: string; 
  duration: number; // in seconds
  isOffline?: boolean;
  genre?: string;
  releaseYear?: number;
  isExplicit?: boolean;
  plays?: number;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  coverUrl?: string;
}

export enum ViewState {
  HOME = 'HOME',
  SEARCH = 'SEARCH',
  LIBRARY = 'LIBRARY',
  DOWNLOADS = 'DOWNLOADS',
  ARTIST = 'ARTIST',
  SETTINGS = 'SETTINGS'
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  isPremium?: boolean;
}

export interface Artist {
  name: string;
  bio: string;
  monthlyListeners: number;
  isVerified: boolean;
  coverUrl: string;
}

export type Theme = 'dark' | 'light' | 'ocean';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}