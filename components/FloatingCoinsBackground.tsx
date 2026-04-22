"use client";
import React, { useEffect, useState } from 'react';

interface CoinProps {
  delay: number;
  duration: number;
  size: number;
  left: string;
  blur: string;
  spinDuration: number;
  id: number;
}

const Coin = ({ delay, duration, size, left, blur, spinDuration, id }: CoinProps) => (
  <div 
    className={`absolute opacity-60 ${blur}`}
    style={{
      left,
      width: size,
      height: size,
      // Pure vertical fall
      animation: `fall ${duration}s linear ${delay}s infinite`,
      // Start above the screen so they don't pop in abruptly
      transform: 'translateY(-120vh)',
      willChange: 'transform'
    }}
  >
    <div
      className="w-full h-full"
      style={{
        // Realistic spinning with a permanent perspective tilt
        animation: `spin ${spinDuration}s linear infinite`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Realistic Gold Coin SVG without text */}
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_5px_15px_rgba(180,83,9,0.4)]">
        <defs>
          <radialGradient id={`coinGlow-${id}`} cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="20%" stopColor="#fde68a" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </radialGradient>
          <linearGradient id={`coinEdge-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="50%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <radialGradient id={`innerRelief-${id}`} cx="50%" cy="50%" r="50%">
            <stop offset="65%" stopColor="#f59e0b" stopOpacity="0" />
            <stop offset="100%" stopColor="#78350f" stopOpacity="0.8" />
          </radialGradient>
        </defs>

        {/* Outer Edge to simulate 3D thickness */}
        <circle cx="50" cy="50" r="48" fill={`url(#coinEdge-${id})`} />
        {/* Main Body */}
        <circle cx="50" cy="50" r="42" fill={`url(#coinGlow-${id})`} />
        {/* Inner Relief Shadow for depth and realism */}
        <circle cx="50" cy="50" r="42" fill={`url(#innerRelief-${id})`} />

        {/* Engraved Relief Pattern: Metallic Star */}
        <polygon points="50,22 57,39 76,39 61,51 66,69 50,58 34,69 39,51 24,39 43,39" fill="#b45309" opacity="0.5" />
        <polygon points="50,25 55,39 70,39 58,49 63,63 50,54 37,63 42,49 30,39 45,39" fill="#fde68a" opacity="0.4" />

        {/* Decorative Rings for high-stakes casino aesthetic */}
        <circle cx="50" cy="50" r="35" fill="none" stroke="#fcd34d" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="#d97706" strokeWidth="1" opacity="0.6" />
      </svg>
    </div>
  </div>
);

export default function FloatingCoinsBackground() {
  const [coins, setCoins] = useState<CoinProps[]>([]);

  useEffect(() => {
    // Generate a good amount of rain for a jackpot effect
    const COIN_COUNT = 30; 
    const generated = Array.from({ length: COIN_COUNT }).map((_, i) => {
      const size = Math.random() * 45 + 35; // 35px to 80px
      const left = `${Math.random() * 100}%`;
      // Rain needs to be slow and steady
      const duration = Math.random() * 25 + 20; // 20s to 45s falling down
      // Randomize delay heavily so they are scattered uniformly across the screen initially
      const delay = -(Math.random() * 45); 
      // Slower spin for realism
      const spinDuration = Math.random() * 6 + 4; // 4s to 10s spin
      
      // Depth of field blurring
      let blur = "blur-none";
      if (size < 45) {
        blur = "blur-[3px]";
      } else if (size < 55) {
        blur = "blur-[1px]";
      }

      return { id: i, size, left, duration, delay, spinDuration, blur };
    });
    
    setCoins(generated);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0a0a0f] pointer-events-none">
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-120vh); }
          100% { transform: translateY(120vh); }
        }
        @keyframes spin {
          0% { transform: rotateX(25deg) rotateY(0deg); }
          100% { transform: rotateX(25deg) rotateY(360deg); }
        }
      `}</style>
      
      {coins.map((c) => (
        <Coin key={c.id} {...c} />
      ))}
      
      {/* Volumetric vignette overlay to blend the raining coins nicely into the dark background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0a0a0f_80%)] pointer-events-none opacity-90" />
    </div>
  );
}
