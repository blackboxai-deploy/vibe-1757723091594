"use client";

import { useEffect, useState } from 'react';
import { ArenaStats, Player, ArenaSettings } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DashboardProps {
  arenaStats: ArenaStats;
  players: Player[];
  settings: ArenaSettings;
  loading: boolean;
  onAction: (action: string) => void;
}

export default function Dashboard({ arenaStats, players, loading, onAction }: DashboardProps) {
  const [animatedStats, setAnimatedStats] = useState({
    playerCount: 0,
    totalKills: 0,
  });

  // Animate number changes
  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number) => {
      const range = end - start;
      const startTime = Date.now();
      
      const updateValue = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        setAnimatedStats(prev => ({
          ...prev,
          playerCount: Math.floor(start + range * easeOutCubic),
        }));
        
        if (progress < 1) {
          requestAnimationFrame(updateValue);
        }
      };
      
      updateValue();
    };

    animateValue(animatedStats.playerCount, arenaStats.playerCount, 800);
  }, [arenaStats.playerCount]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ON': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'OFF': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'STARTING': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'STOPPING': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    gradient,
    animate = false 
  }: { 
    title: string; 
    value: string | number; 
    icon: string;
    gradient: string;
    animate?: boolean;
  }) => (
    <div className="group relative overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute inset-0 ${gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
      
      {/* Card content */}
      <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105">
        {/* Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl opacity-80">{icon}</div>
          {animate && (
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          )}
        </div>
        
        {/* Value */}
        <div className="text-3xl font-bold text-white mb-1">
          {animate ? animatedStats.playerCount : value}
        </div>
        
        {/* Title */}
        <div className="text-slate-400 text-sm font-medium">{title}</div>
        
        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      </div>
    </div>
  );

  const ActionButton = ({ 
    action, 
    label, 
    icon, 
    variant = 'default',
    disabled = false 
  }: { 
    action: string; 
    label: string; 
    icon: string;
    variant?: 'default' | 'success' | 'danger';
    disabled?: boolean;
  }) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'success':
          return 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/25';
        case 'danger':
          return 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg shadow-red-500/25';
        default:
          return 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg shadow-blue-500/25';
      }
    };

    return (
      <button
        onClick={() => onAction(action)}
        disabled={disabled || loading}
        className={cn(
          "relative flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium",
          "text-white transition-all duration-300 hover:transform hover:scale-105",
          "focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
          getVariantStyles()
        )}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </>
        )}
      </button>
    );
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Players"
          value={arenaStats.playerCount}
          icon="👥"
          gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
          animate={true}
        />
        
        <div className="group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
          <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl opacity-80">🎮</div>
            </div>
            <div className="mb-1">
              <span className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
                getStatusColor(arenaStats.status)
              )}>
                {arenaStats.status}
              </span>
            </div>
            <div className="text-slate-400 text-sm font-medium">Arena Status</div>
            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          </div>
        </div>
        
        <StatCard
          title="Zone Radius"
          value={arenaStats.zoneSize}
          icon="🎯"
          gradient="bg-gradient-to-br from-amber-500 to-orange-500"
        />
      </div>

      {/* Quick Actions Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <span className="text-2xl">⚡</span>
          <span>Quick Actions</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton
            action="start"
            label="Start Arena"
            icon="▶️"
            variant="success"
            disabled={arenaStats.status === 'ON' || arenaStats.status === 'STARTING'}
          />
          
          <ActionButton
            action="stop"
            label="Stop Arena"
            icon="⏹️"
            variant="danger"
            disabled={arenaStats.status === 'OFF' || arenaStats.status === 'STOPPING'}
          />
          
          <ActionButton
            action="reload"
            label="Reload Arena"
            icon="🔄"
            variant="default"
            disabled={arenaStats.status !== 'ON'}
          />
        </div>
      </div>

      {/* Live Activity */}
      {arenaStats.status === 'ON' && players.length > 0 && (
        <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <span className="text-xl">📈</span>
            <span>Live Activity</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse ml-auto" />
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{players.filter(p => p.status === 'active').length}</div>
              <div className="text-slate-400">Active Now</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{arenaStats.totalKills || 0}</div>
              <div className="text-slate-400">Total Kills</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{arenaStats.uptime || '00:00:00'}</div>
              <div className="text-slate-400">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">{arenaStats.zoneSize}</div>
              <div className="text-slate-400">Zone Size</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}