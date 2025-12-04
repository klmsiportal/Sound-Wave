import { Track, Artist } from '../types';

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We\'re Dreaming',
    coverUrl: 'https://picsum.photos/seed/m83/300/300',
    duration: 243,
    genre: 'Synthpop',
    releaseYear: 2011,
    isExplicit: false,
    plays: 4500000
  },
  {
    id: '2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    coverUrl: 'https://picsum.photos/seed/weeknd/300/300',
    duration: 200,
    genre: 'Synthwave',
    releaseYear: 2019,
    isExplicit: false,
    plays: 8900000
  },
  {
    id: '3',
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    coverUrl: 'https://picsum.photos/seed/dua/300/300',
    duration: 203,
    genre: 'Pop',
    releaseYear: 2020,
    isExplicit: false,
    plays: 6200000
  },
  {
    id: '4',
    title: 'Peaches',
    artist: 'Justin Bieber',
    album: 'Justice',
    coverUrl: 'https://picsum.photos/seed/bieber/300/300',
    duration: 198,
    genre: 'R&B',
    releaseYear: 2021,
    isExplicit: true,
    plays: 5100000
  },
  {
    id: '5',
    title: 'Save Your Tears',
    artist: 'The Weeknd',
    album: 'After Hours',
    coverUrl: 'https://picsum.photos/seed/tears/300/300',
    duration: 215,
    genre: 'Synthpop',
    releaseYear: 2020,
    isExplicit: true,
    plays: 7800000
  },
  {
    id: '6',
    title: 'Good 4 U',
    artist: 'Olivia Rodrigo',
    album: 'Sour',
    coverUrl: 'https://picsum.photos/seed/olivia/300/300',
    duration: 178,
    genre: 'Pop Punk',
    releaseYear: 2021,
    isExplicit: true,
    plays: 6500000
  },
  {
    id: '7',
    title: 'Kiss Me More',
    artist: 'Doja Cat',
    album: 'Planet Her',
    coverUrl: 'https://picsum.photos/seed/doja/300/300',
    duration: 208,
    genre: 'Disco Pop',
    releaseYear: 2021,
    isExplicit: true,
    plays: 5900000
  },
  {
    id: '8',
    title: 'Montero',
    artist: 'Lil Nas X',
    album: 'Montero',
    coverUrl: 'https://picsum.photos/seed/nas/300/300',
    duration: 137,
    genre: 'Hip Hop',
    releaseYear: 2021,
    isExplicit: true,
    plays: 7100000
  }
];

export const ARTIST_BIOS: Record<string, Artist> = {
  'M83': {
    name: 'M83',
    bio: 'M83 is a French electronic music project formed in Antibes, Alpes-Maritimes in 1999 and currently based in Los Angeles.',
    monthlyListeners: 12000000,
    isVerified: true,
    coverUrl: 'https://picsum.photos/seed/m83-header/800/400'
  },
  'The Weeknd': {
    name: 'The Weeknd',
    bio: 'Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer, songwriter, and record producer. Known for his sonic versatility and dark lyricism.',
    monthlyListeners: 105000000,
    isVerified: true,
    coverUrl: 'https://picsum.photos/seed/weeknd-header/800/400'
  },
  'Dua Lipa': {
    name: 'Dua Lipa',
    bio: 'Dua Lipa is an English and Albanian singer and songwriter. Her mezzo-soprano vocal range and disco-influenced production have received critical acclaim.',
    monthlyListeners: 75000000,
    isVerified: true,
    coverUrl: 'https://picsum.photos/seed/dua-header/800/400'
  },
  'Justin Bieber': {
    name: 'Justin Bieber',
    bio: 'Justin Drew Bieber is a Canadian singer. He is recognized for his genre-melding musicianship and has played an influential role in modern-day popular music.',
    monthlyListeners: 80000000,
    isVerified: true,
    coverUrl: 'https://picsum.photos/seed/bieber-header/800/400'
  },
  // Default fallback
  'Default': {
    name: 'Unknown Artist',
    bio: 'Artist biography not available. Listen to their latest tracks and discover more music on SoundWave.',
    monthlyListeners: 1000,
    isVerified: false,
    coverUrl: 'https://picsum.photos/seed/default/800/400'
  }
};

export const getRadioTracks = (seedArtist: string): Track[] => {
  const shuffled = [...MOCK_TRACKS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
};