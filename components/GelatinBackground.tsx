"use client";
import React from 'react';

export default function GelatinBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0a0a0f]">
      <style>{`
        @keyframes gelatin-morph {
          0% { border-radius: 40% 60% 60% 40% / 40% 40% 60% 60%; transform: translate(0, 0) scale(1); }
          33% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; transform: translate(10vw, 5vh) scale(1.1); }
          66% { border-radius: 30% 70% 70% 30% / 50% 100% 0% 50%; transform: translate(-5vw, 10vh) scale(0.9); }
          100% { border-radius: 40% 60% 60% 40% / 40% 40% 60% 60%; transform: translate(0, 0) scale(1); }
        }
        .gelatin-blob {
          animation: gelatin-morph 20s ease-in-out infinite alternate;
          will-change: border-radius, transform;
        }
      `}</style>

      {/* كتلة جيلاتينية خضراء (مريحة للعين) */}
      <div 
        className="gelatin-blob absolute top-[10%] left-[5%] w-[45vw] h-[45vw] bg-emerald-500/15 filter blur-[90px] opacity-70"
      ></div>

      {/* كتلة جيلاتينية حمراء (ناعمة جداً) */}
      <div 
        className="gelatin-blob absolute bottom-[5%] right-[5%] w-[55vw] h-[55vw] bg-rose-600/15 filter blur-[110px] opacity-60"
        style={{ animationDirection: 'reverse', animationDelay: '-5s' }}
      ></div>

      {/* طبقة Noise خفيفة تعطي ملمساً سينمائياً (اختياري) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
}
