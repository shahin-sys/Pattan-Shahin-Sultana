import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACKS } from '../constants';
import { SkipBack, SkipForward, Play, Pause, Volume2, Music } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentTrack.url;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      }
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const percentage = (audio.currentTime / audio.duration) * 100;
      setProgress(percentage || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', nextTrack);
    };
  }, []);

  return (
    <div id="music-sidebar" className="flex-1 flex flex-col bg-white/5 rounded-3xl border border-white/10 p-5 overflow-hidden">
      <audio ref={audioRef} />
      
      <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-fuchsia-400 mb-6 px-2">AI Music Stream</h2>
      
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {TRACKS.map((track, index) => {
          const isActive = index === currentTrackIndex;
          return (
            <button
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(index);
                setIsPlaying(true);
              }}
              className={`p-3 rounded-xl flex items-center gap-3 transition-all text-left ${
                isActive 
                  ? 'bg-fuchsia-500/20 border border-fuchsia-500/50' 
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className={`w-10 h-10 rounded flex items-center justify-center ${isActive ? 'bg-fuchsia-500/30' : 'bg-white/10'}`}>
                {isActive && isPlaying ? (
                  <motion.div 
                    animate={{ scaleY: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="w-1 h-4 bg-fuchsia-400" 
                  />
                ) : (
                  <Music size={16} className={isActive ? 'text-fuchsia-400' : 'text-white/40'} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-white/80'}`}>{track.title}</p>
                <p className={`text-[10px] uppercase truncate ${isActive ? 'text-fuchsia-300' : 'text-white/40'}`}>{track.artist}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-6">
        <div className="p-4 bg-black/40 rounded-2xl border border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-white/40 mb-3">Sync Progress</p>
          
          <div className="flex items-center gap-2 mb-4">
             <span className="text-lime-400 font-mono text-[10px]">
               {audioRef.current ? Math.floor(audioRef.current.currentTime / 60) : 0}:
               {audioRef.current ? String(Math.floor(audioRef.current.currentTime % 60)).padStart(2, '0') : '00'}
             </span>
             <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
               <motion.div 
                className="h-full bg-lime-400 shadow-[0_0_8px_#39ff14]"
                style={{ width: `${progress}%` }}
               />
             </div>
             <span className="text-white/40 font-mono text-[10px]">
               {audioRef.current ? Math.floor(audioRef.current.duration / 60) : 0}:
               {audioRef.current ? String(Math.floor(audioRef.current.duration % 60)).padStart(2, '0') : '00'}
             </span>
          </div>

          <div className="flex justify-between items-center px-4">
            <button onClick={prevTrack} className="text-white/60 hover:text-white transition-colors">
              <SkipBack size={20} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-10 h-10 bg-white text-black hover:scale-105 active:scale-95 transition-all rounded-full flex items-center justify-center"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>
            <button onClick={nextTrack} className="text-white/60 hover:text-white transition-colors">
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
