export interface Player {
  id: number;
  name: string;
  status: 'active' | 'inactive';
  avatar?: string;
  joinTime: Date;
  kills?: number;
  position?: {
    x: number;
    y: number;
  };
}

export interface ArenaStats {
  playerCount: number;
  status: 'ON' | 'OFF' | 'STARTING' | 'STOPPING';
  zoneSize: string | number;
  uptime?: string;
  totalKills?: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  displayTime: number;
  timestamp: Date;
}

export interface NotificationData {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

export type TabType = 'dashboard' | 'controls' | 'players' | 'announce' | 'tools';

export interface ArenaSettings {
  playerBlips: boolean;
  autoRestart: boolean;
  maxPlayers: number;
  mapRotation: boolean;
}