"use client";

import { TabType } from '@/lib/types';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'controls', label: 'Controls', icon: '🎮' },
  { id: 'players', label: 'Players', icon: '👥' },
  { id: 'announce', label: 'Announce', icon: '📢' },
  { id: 'tools', label: 'Tools', icon: '🔧' },
] as const;

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="relative bg-slate-900/40 backdrop-blur-sm border-b border-white/5">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent" />
      
      <div className="relative z-10 px-6">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as TabType)}
                className={cn(
                  "relative px-6 py-4 text-sm font-medium transition-all duration-300 whitespace-nowrap",
                  "hover:bg-white/5 hover:text-white",
                  "focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-inset",
                  isActive
                    ? "text-amber-400 bg-gradient-to-b from-amber-500/20 to-transparent"
                    : "text-slate-400"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <>
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-amber-500/5 to-transparent rounded-t-lg" />
                  </>
                )}
                
                {/* Content */}
                <div className="relative flex items-center space-x-2">
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
                
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-t-lg" />
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Bottom glow effect */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50" />
    </div>
  );
}