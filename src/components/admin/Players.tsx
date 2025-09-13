"use client";

import { useState } from 'react';
import { ArenaStats, Player, ArenaSettings } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PlayersProps {
  arenaStats: ArenaStats;
  players: Player[];
  settings: ArenaSettings;
  loading: boolean;
  actions: {
    kickPlayer: (playerId: number) => void;
  };
  notification: {
    showNotification: (notification: { type: 'success' | 'error' | 'info' | 'warning'; title: string; message?: string }) => void;
  };
}

export default function Players({ arenaStats, players, actions, notification }: PlayersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'kills' | 'joinTime'>('name');

  // Filter and sort players
  const filteredPlayers = players
    .filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.id.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'kills':
          return (b.kills || 0) - (a.kills || 0);
        case 'joinTime':
          return b.joinTime.getTime() - a.joinTime.getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleKickPlayer = (player: Player) => {
    actions.kickPlayer(player.id);
    notification.showNotification({
      type: 'info',
      title: 'Player Kicked',
      message: `${player.name} has been removed from the arena.`
    });
  };

  const getPlayerAvatar = (player: Player) => {
    return player.name.charAt(0).toUpperCase();
  };

  const formatJoinTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`;
    }
    return `${minutes}m ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Players in Arena
          </h2>
          <p className="text-slate-400">
            {arenaStats.status === 'ON' ? `${players.length} players currently active` : 'Arena is currently offline'}
          </p>
        </div>
        
        {/* Live indicator */}
        {arenaStats.status === 'ON' && (
          <div className="flex items-center space-x-2 bg-green-500/20 border border-green-500/30 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">{players.length} Live</span>
          </div>
        )}
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-slate-400">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search by ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
          />
        </div>
        
        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'name' | 'kills' | 'joinTime')}
          className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50"
        >
          <option value="name">Sort by Name</option>
          <option value="kills">Sort by Kills</option>
          <option value="joinTime">Sort by Join Time</option>
        </select>
      </div>

      {/* Player List */}
      <div className="space-y-3">
        {filteredPlayers.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl">
            {arenaStats.status === 'OFF' ? (
              <div className="space-y-3">
                <div className="text-4xl opacity-50">🎮</div>
                <h3 className="text-lg font-medium text-slate-300">Arena is Offline</h3>
                <p className="text-slate-400 text-sm">Start the arena to see players</p>
              </div>
            ) : searchTerm ? (
              <div className="space-y-3">
                <div className="text-4xl opacity-50">🔍</div>
                <h3 className="text-lg font-medium text-slate-300">No Players Found</h3>
                <p className="text-slate-400 text-sm">Try adjusting your search terms</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-4xl opacity-50">👥</div>
                <h3 className="text-lg font-medium text-slate-300">No Players in Arena</h3>
                <p className="text-slate-400 text-sm">Waiting for players to join...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredPlayers.map((player) => (
              <div
                key={player.id}
                className="group backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  {/* Player Info */}
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg",
                      "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg",
                      player.status === 'active' && "ring-2 ring-green-400/50",
                      player.status === 'inactive' && "ring-2 ring-red-400/50 grayscale"
                    )}>
                      {getPlayerAvatar(player)}
                    </div>
                    
                    {/* Details */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{player.name}</span>
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                          player.status === 'active' ? "text-green-400 bg-green-500/20" : "text-red-400 bg-red-500/20"
                        )}>
                          {player.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <span>ID: {player.id}</span>
                        <span>⚔️ {player.kills || 0} kills</span>
                        <span>🕒 {formatJoinTime(player.joinTime)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {/* Stats */}
                    <div className="hidden md:flex items-center space-x-3 text-sm">
                      {player.position && (
                        <span className="text-slate-400">
                          📍 {Math.floor(player.position.x)}, {Math.floor(player.position.y)}
                        </span>
                      )}
                    </div>
                    
                    {/* Kick Button */}
                    <button
                      onClick={() => handleKickPlayer(player)}
                      className={cn(
                        "px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg",
                        "transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50",
                        "opacity-0 group-hover:opacity-100"
                      )}
                    >
                      Kick
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      {players.length > 0 && (
        <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <span className="text-xl">📊</span>
            <span>Player Statistics</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{players.filter(p => p.status === 'active').length}</div>
              <div className="text-slate-400 text-sm">Active Players</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{players.filter(p => p.status === 'inactive').length}</div>
              <div className="text-slate-400 text-sm">Inactive Players</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">
                {players.reduce((sum, p) => sum + (p.kills || 0), 0)}
              </div>
              <div className="text-slate-400 text-sm">Total Kills</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Math.floor(players.reduce((sum, p) => sum + (p.kills || 0), 0) / players.length) || 0}
              </div>
              <div className="text-slate-400 text-sm">Avg Kills</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}