"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AnnouncementsProps {
  notification: {
    showNotification: (notification: { type: 'success' | 'error' | 'info' | 'warning'; title: string; message?: string }) => void;
  };
}

export default function Announcements({ notification }: AnnouncementsProps) {
  const [announcement, setAnnouncement] = useState({
    title: '',
    message: '',
    displayTime: 5000,
  });
  const [sending, setSending] = useState(false);

  const handleSendAnnouncement = async () => {
    if (!announcement.title.trim() || !announcement.message.trim()) {
      notification.showNotification({
        type: 'error',
        title: 'Invalid Input',
        message: 'Please fill in both title and message fields.',
      });
      return;
    }

    setSending(true);
    
    // Simulate sending announcement
    setTimeout(() => {
      setSending(false);
      notification.showNotification({
        type: 'success',
        title: 'Announcement Sent',
        message: `Announcement "${announcement.title}" has been broadcast to all players.`,
      });
      
      // Clear form
      setAnnouncement({
        title: '',
        message: '',
        displayTime: 5000,
      });
    }, 1500);
  };

  const presetAnnouncements = [
    {
      title: 'Zone Closing',
      message: 'The safe zone is shrinking! Move to the designated area immediately.',
      icon: '⚠️'
    },
    {
      title: 'Server Restart',
      message: 'Server will restart in 5 minutes. Please prepare for disconnection.',
      icon: '🔄'
    },
    {
      title: 'Event Starting',
      message: 'Special event is starting now! Join the action for exclusive rewards.',
      icon: '🎉'
    },
    {
      title: 'Maintenance',
      message: 'Scheduled maintenance in 10 minutes. Session will be temporarily interrupted.',
      icon: '🔧'
    },
  ];

  const handlePresetClick = (preset: typeof presetAnnouncements[0]) => {
    setAnnouncement(prev => ({
      ...prev,
      title: preset.title,
      message: preset.message,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
          Send Announcement
        </h2>
        <p className="text-slate-400">
          Broadcast messages to all players in the arena
        </p>
      </div>

      {/* Main Form */}
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
        {/* Display Time */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Display Time (milliseconds)
          </label>
          <input
            type="number"
            value={announcement.displayTime}
            onChange={(e) => setAnnouncement(prev => ({ ...prev, displayTime: parseInt(e.target.value) || 5000 }))}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
            min="1000"
            max="30000"
            step="1000"
          />
          <p className="text-xs text-slate-400">Duration the announcement will be displayed to players</p>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Announcement Title
          </label>
          <input
            type="text"
            value={announcement.title}
            onChange={(e) => setAnnouncement(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors"
            placeholder="Enter announcement title..."
            maxLength={50}
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>Keep it concise and attention-grabbing</span>
            <span>{announcement.title.length}/50</span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">
            Announcement Message
          </label>
          <textarea
            value={announcement.message}
            onChange={(e) => setAnnouncement(prev => ({ ...prev, message: e.target.value }))}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-colors resize-none"
            placeholder="Enter your announcement message..."
            rows={4}
            maxLength={200}
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>Clear and informative message for players</span>
            <span>{announcement.message.length}/200</span>
          </div>
        </div>

        {/* Preview */}
        {(announcement.title || announcement.message) && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">Preview</label>
            <div className="bg-slate-900/50 border border-amber-500/30 rounded-xl p-4 space-y-2">
              <div className="text-amber-400 font-semibold text-lg">{announcement.title || 'Announcement Title'}</div>
              <div className="text-white">{announcement.message || 'Announcement message will appear here...'}</div>
              <div className="text-xs text-slate-400 mt-2">
                Will display for {(announcement.displayTime / 1000).toFixed(1)} seconds
              </div>
            </div>
          </div>
        )}

        {/* Send Button */}
        <button
          onClick={handleSendAnnouncement}
          disabled={sending || !announcement.title.trim() || !announcement.message.trim()}
          className={cn(
            "w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-xl font-medium text-white",
            "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600",
            "shadow-lg shadow-amber-500/25 transition-all duration-300 hover:transform hover:scale-105",
            "focus:outline-none focus:ring-2 focus:ring-amber-500/50",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
        >
          {sending ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sending Announcement...</span>
            </>
          ) : (
            <>
              <span className="text-xl">📢</span>
              <span>Send Announcement</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Presets */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <span className="text-xl">⚡</span>
          <span>Quick Presets</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {presetAnnouncements.map((preset, index) => (
            <button
              key={index}
              onClick={() => handlePresetClick(preset)}
              className="group text-left backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 hover:bg-white/10 transition-all duration-300 hover:transform hover:scale-[1.02]"
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl opacity-80 group-hover:scale-110 transition-transform">
                  {preset.icon}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="font-semibold text-white group-hover:text-amber-400 transition-colors">
                    {preset.title}
                  </div>
                  <div className="text-slate-400 text-sm line-clamp-2">
                    {preset.message}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Announcements (Simulated) */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <span className="text-xl">📋</span>
          <span>Recent Announcements</span>
        </h3>
        
        <div className="bg-slate-800/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="text-slate-300">
                <span className="font-medium">Zone Warning</span> - 2 minutes ago
              </div>
              <div className="text-green-400">✓ Delivered</div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="text-slate-300">
                <span className="font-medium">Event Notification</span> - 15 minutes ago
              </div>
              <div className="text-green-400">✓ Delivered</div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="text-slate-300">
                <span className="font-medium">Server Update</span> - 1 hour ago
              </div>
              <div className="text-green-400">✓ Delivered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}