"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  playAttempted: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [playAttempted, setPlayAttempted] = useState(false);

  useEffect(() => {
    // Attempt autoplay logic
    const playAudio = async () => {
      if (audioRef.current && !playAttempted) {
        try {
          audioRef.current.volume = 0.3; // Low volume for background music
          await audioRef.current.play();
          setIsMuted(false);
          setPlayAttempted(true);
        } catch (error) {
          // Autoplay blocked
          console.warn("Autoplay blocked by browser. User must interact first.");
          setIsMuted(true);
          setPlayAttempted(true);
        }
      }
    };

    // Browsers require interaction to play audio unmuted,
    // so we attempt it and fallback gracefully.
    playAudio();
  }, [playAttempted]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        // Try playing again in case it was never started
        audioRef.current.play().catch(console.error);
      }
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, playAttempted }}>
      <audio
        ref={audioRef}
        src="https://cdn.pixabay.com/audio/2024/01/16/audio_8d4d3d1b6b.mp3"
        loop
        autoPlay
        muted={isMuted}
      />
      {children}
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
