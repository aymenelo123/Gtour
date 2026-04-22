"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Play, Pause, SkipForward, Music2 } from "lucide-react";

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playAttempted: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Attempt autoplay logic
    const playAudio = async () => {
      if (audioRef.current && !isPlaying) {
        try {
          audioRef.current.volume = 0.2; // Low background volume
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          // Autoplay blocked silently
          console.warn("Autoplay blocked by browser policy until interaction.");
          setIsPlaying(false);
        }
      }
    };
    playAudio();
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  return (
    <AudioContext.Provider value={{ isMuted: !isPlaying, toggleMute: togglePlay, playAttempted: true }}>
      <audio
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        loop
      />
      
      {children}

      {/* Global Rocket League Audio Widget */}
      <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="ltr">
        <div className="bg-[#0A0D14]/80 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.5)] w-[260px] hover:bg-[#0f1115]/95 transition-all group">
          
          <div className="w-12 h-12 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-inner overflow-hidden relative border border-white/10">
            <div className="absolute inset-0 bg-black/20" />
            <Music2 className="w-6 h-6 text-white drop-shadow-md z-10 opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="flex flex-col flex-1 overflow-hidden min-w-0">
            <span className="text-white font-bold text-sm truncate drop-shadow-sm">Be Easy</span>
            <span className="text-slate-400 text-[11px] truncate uppercase tracking-wider font-semibold">Massari</span>
          </div>
          
          <div className="flex items-center gap-1 shrink-0 pr-1">
            <button 
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors border border-white/5 shadow-sm"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>

        </div>
      </div>
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
