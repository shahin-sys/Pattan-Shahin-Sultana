import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'Future Funk Systems',
    url: 'https://cdn.pixabay.com/audio/2022/03/10/audio_c8b8a8a97a.mp3',
    color: '#00f3ff'
  },
  {
    id: '2',
    title: 'Digital Abyss',
    artist: 'Void Walker',
    url: 'https://cdn.pixabay.com/audio/2022/01/21/audio_31b5803ef7.mp3',
    color: '#ff00ff'
  },
  {
    id: '3',
    title: 'Retro Grid',
    artist: 'Arcade Memory',
    url: 'https://cdn.pixabay.com/audio/2022/08/04/audio_2dbc14aef4.mp3',
    color: '#39ff14'
  }
];

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 50;
