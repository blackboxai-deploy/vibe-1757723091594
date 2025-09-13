"use client";

import { useState } from 'react';
import { useArenaData } from '@/hooks/useArenaData';
import { useNotification } from '@/hooks/useNotification';
import { TabType } from '@/lib/types';
import Header from './Header';
import TabNavigation from './TabNavigation';
import Dashboard from './Dashboard';
import Controls from './Controls';
import Players from './Players';
import Announcements from './Announcements';
import Tools from './Tools';
import NotificationSystem from './NotificationSystem';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const arenaData = useArenaData();
  const notification = useNotification();

  const handleAction = async (action: string) => {
    try {
      switch (action) {
        case 'start':
          await arenaData.actions.startArena();
          notification.showNotification({
            type: 'success',
            title: 'Arena Started',
            message: 'Arena has been successfully started.',
          });
          break;
        case 'stop':
          await arenaData.actions.stopArena();
          notification.showNotification({
            type: 'success',
            title: 'Arena Stopped',
            message: 'Arena has been successfully stopped.',
          });
          break;
        case 'reload':
          await arenaData.actions.reloadArena();
          notification.showNotification({
            type: 'info',
            title: 'Arena Reloaded',
            message: 'Arena configuration has been reloaded.',
          });
          break;
        default:
          notification.showNotification({
            type: 'error',
            title: 'Unknown Action',
            message: `Action "${action}" is not recognized.`,
          });
      }
    } catch (error) {
      notification.showNotification({
        type: 'error',
        title: 'Action Failed',
        message: `Failed to execute ${action}. Please try again.`,
      });
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard {...arenaData} onAction={handleAction} />;
      case 'controls':
        return <Controls {...arenaData} onAction={handleAction} />;
      case 'players':
        return <Players {...arenaData} notification={notification} />;
      case 'announce':
        return <Announcements notification={notification} />;
      case 'tools':
        return <Tools {...arenaData} notification={notification} />;
      default:
        return <Dashboard {...arenaData} onAction={handleAction} />;
    }
  };

  return (
    <>
      <div className="relative w-full max-w-6xl mx-auto">
        {/* Glass morphism container */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-amber-500/10 pointer-events-none" />
          
          {/* Content */}
          <div className="relative z-10">
            <Header />
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>

      <NotificationSystem {...notification} />
    </>
  );
}