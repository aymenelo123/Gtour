"use client";
import React from 'react';

export default function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0d0d12]">
      {/* كود CSS المخصص لصنع تأثير الجيلاتين والتموج */}
      <style>{`
        @keyframes morph {
          0%, 100% { border-radius: 40% 60% 70% 30% / 40% 40% 60% 50%; }
          34% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
          67% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; }
        }
        .gelatin-blob {
          animation: morph 12s ease-in-out infinite alternate;
          transition: all 1s ease-in-out;
        }
      `}</style>

      {/* الكتلة الجيلاتينية الخضراء */}
      <div 
        className="gelatin-blob absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-600/20 filter blur-[100px] opacity-60 mix-blend-screen"
        style={{ animationDelay: '0s' }}
      ></div>

      {/* الكتلة الجيلاتينية الحمراء */}
      <div 
        className="gelatin-blob absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-rose-700/20 filter blur-[120px] opacity-50 mix-blend-screen"
        style={{ animationDelay: '2s' }}
      ></div>

      {/* طبقة داكنة خفيفة لضمان وضوح نصوص الموقع فوقها */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
    </div>
  );
}
