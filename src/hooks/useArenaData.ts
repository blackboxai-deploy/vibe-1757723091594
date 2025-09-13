"use client";

import { useState, useEffect, useCallback } from 'react';
import { Player, ArenaStats, ArenaSettings } from '@/lib/types';

// Mock data generator
const generateMockPlayers = (count: number): Player[] => {
  const names = [
    'AlphaWolf', 'ShadowHunter', 'CyberNinja', 'StormBreaker', 'IronFist',
    'BlazeFire', 'VoidWalker', 'TechMaster', 'GhostRider', 'QuantumLeap',
    'ThunderBolt', 'NeonGlow', 'DarkKnight', 'StarGazer', 'FlashStrike'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 1000),
    status: Math.random() > 0.2 ? 'active' : 'inactive' as const,
    joinTime: new Date(Date.now() - Math.random() * 3600000),
    kills: Math.floor(Math.random() * 20),
    position: {
      x: Math.random() * 1000,
      y: Math.random() * 1000,
    }
  }));
};

export const useArenaData = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [arenaStats, setArenaStats] = useState<ArenaStats>({
    playerCount: 0,
    status: 'OFF',
    zoneSize: 'N/A',
    uptime: '00:00:00',
    totalKills: 0,
  });
  const [settings, setSettings] = useState<ArenaSettings>({
    playerBlips: false,
    autoRestart: false,
    maxPlayers: 100,
    mapRotation: true,
  });
  const [loading, setLoading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (arenaStats.status === 'ON') {
        // Randomly update player count
        const newCount = Math.max(0, players.length + Math.floor(Math.random() * 3 - 1));
        if (newCount !== players.length) {
          setPlayers(prev => {
            if (newCount > prev.length) {
              return [...prev, ...generateMockPlayers(newCount - prev.length)];
            } else {
              return prev.slice(0, newCount);
            }
          });
        }

        // Update zone size
        setArenaStats(prev => ({
          ...prev,
          playerCount: newCount,
          zoneSize: Math.floor(Math.random() * 500 + 200),
          totalKills: (prev.totalKills || 0) + Math.floor(Math.random() * 3),
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [arenaStats.status, players.length]);

  const startArena = useCallback(async () => {
    setLoading(true);
    setArenaStats(prev => ({ ...prev, status: 'STARTING' }));
    
    // Simulate startup delay
    setTimeout(() => {
      const initialPlayers = generateMockPlayers(Math.floor(Math.random() * 15 + 5));
      setPlayers(initialPlayers);
      setArenaStats(prev => ({
        ...prev,
        status: 'ON',
        playerCount: initialPlayers.length,
        zoneSize: 500,
        totalKills: 0,
      }));
      setLoading(false);
    }, 2000);
  }, []);

  const stopArena = useCallback(async () => {
    setLoading(true);
    setArenaStats(prev => ({ ...prev, status: 'STOPPING' }));
    
    setTimeout(() => {
      setPlayers([]);
      setArenaStats(prev => ({
        ...prev,
        status: 'OFF',
        playerCount: 0,
        zoneSize: 'N/A',
        uptime: '00:00:00',
      }));
      setLoading(false);
    }, 1000);
  }, []);

  const reloadArena = useCallback(async () => {
    if (arenaStats.status === 'ON') {
      setLoading(true);
      setTimeout(() => {
        const newPlayers = generateMockPlayers(Math.floor(Math.random() * 20 + 5));
        setPlayers(newPlayers);
        setArenaStats(prev => ({
          ...prev,
          playerCount: newPlayers.length,
          totalKills: 0,
        }));
        setLoading(false);
      }, 1500);
    }
  }, [arenaStats.status]);

  const kickPlayer = useCallback((playerId: number) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
    setArenaStats(prev => ({
      ...prev,
      playerCount: prev.playerCount - 1,
    }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<ArenaSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    players,
    arenaStats,
    settings,
    loading,
    actions: {
      startArena,
      stopArena,
      reloadArena,
      kickPlayer,
      updateSettings,
    }
  };
};