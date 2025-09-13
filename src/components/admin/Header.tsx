"use client";

import { useEffect, useState } from 'react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-gradient-to-r from-slate-900/80 via-blue-900/60 to-slate-900/80 backdrop-blur-sm border-b border-white/10 p-6">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),transparent_70%)]" />
      </div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-lg opacity-60 animate-pulse" />
            <img
              src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/47714fef-2bf7-4f6e-97ec-01ada4c2e735.png"
              alt="Arena Admin Logo - Modern gaming shield with neon effects"
              className="relative w-16 h-16 rounded-2xl border-2 border-amber-400/50 shadow-2xl object-cover"
              onError={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b, #f97316)';
                e.currentTarget.style.display = 'flex';
                e.currentTarget.style.alignItems = 'center';
                e.currentTarget.style.justifyContent = 'center';
                e.currentTarget.innerHTML = '<span style="color: white; font-weight: bold; font-size: 1.2rem;">A</span>';
              }}
            />
          </div>
          
          {/* Title section */}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-amber-200 bg-clip-text text-transparent">
              Arena Admin Panel
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Advanced Management System
            </p>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex items-center space-x-6">
          {/* System status */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
            <span className="text-green-400 text-sm font-medium">System Online</span>
          </div>
          
          {/* Current time */}
          <div className="text-slate-300 text-sm font-mono bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50">
            {currentTime}
          </div>
        </div>
      </div>
    </div>
  );
}