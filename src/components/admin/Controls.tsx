"use client";

import { ArenaStats, Player, ArenaSettings } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ControlsProps {
  arenaStats: ArenaStats;
  players: Player[];
  settings: ArenaSettings;
  loading: boolean;
  onAction: (action: string) => void;
}

export default function Controls({ arenaStats, loading, onAction }: ControlsProps) {
  const ControlCard = ({ 
    title, 
    description, 
    action, 
    icon, 
    variant = 'default',
    disabled = false,
    status 
  }: {
    title: string;
    description: string;
    action: string;
    icon: string;
    variant?: 'success' | 'danger' | 'warning' | 'default';
    disabled?: boolean;
    status?: string;
  }) => {
    const getVariantStyles = () => {
      switch (variant) {
        case 'success':
          return {
            bg: 'hover:bg-green-500/10 border-green-500/30',
            button: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-green-500/25',
            glow: 'shadow-green-500/20'
          };
        case 'danger':
          return {
            bg: 'hover:bg-red-500/10 border-red-500/30',
            button: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-red-500/25',
            glow: 'shadow-red-500/20'
          };
        case 'warning':
          return {
            bg: 'hover:bg-yellow-500/10 border-yellow-500/30',
            button: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-yellow-500/25',
            glow: 'shadow-yellow-500/20'
          };
        default:
          return {
            bg: 'hover:bg-blue-500/10 border-blue-500/30',
            button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-blue-500/25',
            glow: 'shadow-blue-500/20'
          };
      }
    };

    const styles = getVariantStyles();

    return (
      <div className={cn(
        "group relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6",
        "hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.02]",
        styles.bg,
        `hover:${styles.glow} hover:shadow-xl`
      )}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl opacity-80">{icon}</div>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              {status && (
                <span className={cn(
                  "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1",
                  arenaStats.status === 'ON' && "text-green-400 bg-green-500/20",
                  arenaStats.status === 'OFF' && "text-red-400 bg-red-500/20",
                  arenaStats.status === 'STARTING' && "text-yellow-400 bg-yellow-500/20",
                  arenaStats.status === 'STOPPING' && "text-orange-400 bg-orange-500/20"
                )}>
                  {status}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">{description}</p>
        
        {/* Action Button */}
        <button
          onClick={() => onAction(action)}
          disabled={disabled || loading}
          className={cn(
            "w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl",
            "font-medium text-white transition-all duration-300",
            "focus:outline-none focus:ring-2 focus:ring-white/20",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            styles.button,
            "shadow-lg hover:shadow-xl transform hover:scale-105 disabled:hover:scale-100"
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
              <span>{title}</span>
            </>
          )}
        </button>
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
          Arena Controls
        </h2>
        <p className="text-slate-400">
          Manage your arena with advanced control options
        </p>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ControlCard
          title="Start Arena"
          description="Initialize the arena and allow players to join. This will set up the game environment and activate all systems."
          action="start"
          icon="🚀"
          variant="success"
          disabled={arenaStats.status === 'ON' || arenaStats.status === 'STARTING'}
          status={arenaStats.status === 'STARTING' ? 'Starting...' : undefined}
        />
        
        <ControlCard
          title="Stop Arena"
          description="Safely stop the arena session and disconnect all players. This will end the current game and reset the environment."
          action="stop"
          icon="🛑"
          variant="danger"
          disabled={arenaStats.status === 'OFF' || arenaStats.status === 'STOPPING'}
          status={arenaStats.status === 'STOPPING' ? 'Stopping...' : undefined}
        />
        
        <ControlCard
          title="Reload Arena"
          description="Refresh the arena configuration and restart systems without stopping the current session completely."
          action="reload"
          icon="🔄"
          variant="warning"
          disabled={arenaStats.status !== 'ON'}
        />
      </div>

      {/* Advanced Controls */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <span className="text-2xl">⚙️</span>
          <span>Advanced Controls</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ControlCard
            title="Emergency Stop"
            description="Immediately terminate all arena processes and disconnect players. Use only in emergency situations."
            action="emergency"
            icon="🆘"
            variant="danger"
            disabled={arenaStats.status === 'OFF'}
          />
          
          <ControlCard
            title="Soft Restart"
            description="Gracefully restart the arena with a countdown timer, giving players time to prepare for the restart."
            action="soft-restart"
            icon="♻️"
            variant="default"
            disabled={arenaStats.status !== 'ON'}
          />
        </div>
      </div>

      {/* System Status */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <span className="text-xl">📊</span>
          <span>System Status</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-green-400 mb-1">Online</div>
            <div className="text-xs text-slate-400">Server Status</div>
          </div>
          
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-blue-400 mb-1">{arenaStats.playerCount}</div>
            <div className="text-xs text-slate-400">Connected Players</div>
          </div>
          
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-purple-400 mb-1">99%</div>
            <div className="text-xs text-slate-400">System Health</div>
          </div>
          
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <div className="text-lg font-bold text-amber-400 mb-1">12ms</div>
            <div className="text-xs text-slate-400">Average Latency</div>
          </div>
        </div>
      </div>
    </div>
  );
}