"use client";

import { ArenaStats, Player, ArenaSettings } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ToolsProps {
  arenaStats: ArenaStats;
  players: Player[];
  settings: ArenaSettings;
  loading: boolean;
  actions: {
    updateSettings: (settings: Partial<ArenaSettings>) => void;
  };
  notification: {
    showNotification: (notification: { type: 'success' | 'error' | 'info' | 'warning'; title: string; message?: string }) => void;
  };
}

export default function Tools({ settings, actions, notification }: ToolsProps) {
  const handleToggle = (setting: keyof ArenaSettings) => {
    const newValue = !settings[setting];
    actions.updateSettings({ [setting]: newValue });
    
    notification.showNotification({
      type: 'info',
      title: 'Settings Updated',
      message: `${setting.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} has been ${newValue ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleSliderChange = (setting: keyof ArenaSettings, value: number) => {
    actions.updateSettings({ [setting]: value });
  };

  const ToggleSwitch = ({ 
    enabled, 
    onChange, 
    disabled = false 
  }: { 
    enabled: boolean; 
    onChange: () => void; 
    disabled?: boolean; 
  }) => (
    <button
      onClick={onChange}
      disabled={disabled}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50",
        enabled ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-slate-600",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-lg",
          enabled ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );

  const SettingCard = ({ 
    title, 
    description, 
    icon, 
    children 
  }: { 
    title: string; 
    description: string; 
    icon: string; 
    children: React.ReactNode; 
  }) => (
    <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="text-2xl opacity-80">{icon}</div>
          <div className="space-y-1 flex-1">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="ml-4">
          {children}
        </div>
      </div>
    </div>
  );

  const tools = [
    {
      title: 'System Diagnostics',
      description: 'Run comprehensive system checks and performance analysis',
      icon: '🔧',
      action: 'diagnostics'
    },
    {
      title: 'Database Cleanup',
      description: 'Clean up temporary files and optimize database performance',
      icon: '🧹',
      action: 'cleanup'
    },
    {
      title: 'Backup Arena Data',
      description: 'Create a backup of current arena configuration and player data',
      icon: '💾',
      action: 'backup'
    },
    {
      title: 'Generate Reports',
      description: 'Create detailed reports on arena performance and player statistics',
      icon: '📊',
      action: 'reports'
    },
  ];

  const handleToolAction = (action: string, title: string) => {
    notification.showNotification({
      type: 'info',
      title: `${title} Started`,
      message: 'The operation has been initiated and will complete in the background.',
    });

    // Simulate completion after delay
    setTimeout(() => {
      notification.showNotification({
        type: 'success',
        title: `${title} Complete`,
        message: 'The operation has been completed successfully.',
      });
    }, 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
          Tools & Settings
        </h2>
        <p className="text-slate-400">
          Configure arena settings and access administrative tools
        </p>
      </div>

      {/* Settings Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <span className="text-2xl">⚙️</span>
          <span>Arena Settings</span>
        </h3>
        
        <div className="space-y-4">
          <SettingCard
            title="Player Blips"
            description="Show player locations on the minimap for administrative oversight"
            icon="📍"
          >
            <ToggleSwitch
              enabled={settings.playerBlips}
              onChange={() => handleToggle('playerBlips')}
            />
          </SettingCard>
          
          <SettingCard
            title="Auto Restart"
            description="Automatically restart the arena after each round completion"
            icon="🔄"
          >
            <ToggleSwitch
              enabled={settings.autoRestart}
              onChange={() => handleToggle('autoRestart')}
            />
          </SettingCard>
          
          <SettingCard
            title="Map Rotation"
            description="Enable automatic map rotation between arena sessions"
            icon="🗺️"
          >
            <ToggleSwitch
              enabled={settings.mapRotation}
              onChange={() => handleToggle('mapRotation')}
            />
          </SettingCard>

          {/* Max Players Setting */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="text-2xl opacity-80">👥</div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-lg font-semibold text-white">Maximum Players</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Set the maximum number of players allowed in the arena simultaneously
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">Players: {settings.maxPlayers}</span>
                  <span className="text-slate-400">Range: 10-200</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="10"
                  value={settings.maxPlayers}
                  onChange={(e) => handleSliderChange('maxPlayers', parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, rgb(245, 158, 11) 0%, rgb(245, 158, 11) ${((settings.maxPlayers - 10) / (200 - 10)) * 100}%, rgb(71, 85, 105) ${((settings.maxPlayers - 10) / (200 - 10)) * 100}%, rgb(71, 85, 105) 100%)`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Administrative Tools */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <span className="text-2xl">🛠️</span>
          <span>Administrative Tools</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tools.map((tool, index) => (
            <button
              key={index}
              onClick={() => handleToolAction(tool.action, tool.title)}
              className="group text-left backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-[1.02]"
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl opacity-80 group-hover:scale-110 transition-transform">
                  {tool.icon}
                </div>
                <div className="space-y-2 flex-1">
                  <h4 className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                    {tool.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* System Information */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <span className="text-xl">💻</span>
          <span>System Information</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-2">
            <div className="text-slate-400">Server Version</div>
            <div className="text-white font-medium">Arena v2.1.4</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-slate-400">Uptime</div>
            <div className="text-green-400 font-medium">7d 14h 23m</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-slate-400">Memory Usage</div>
            <div className="text-blue-400 font-medium">2.1 GB / 8.0 GB</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-slate-400">CPU Usage</div>
            <div className="text-purple-400 font-medium">23.4%</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-slate-400">Network I/O</div>
            <div className="text-amber-400 font-medium">↑ 1.2 MB/s ↓ 3.8 MB/s</div>
          </div>
          
          <div className="space-y-2">
            <div className="text-slate-400">Last Restart</div>
            <div className="text-slate-300 font-medium">2024-01-15 09:30 UTC</div>
          </div>
        </div>
      </div>
    </div>
  );
}