"use client";

import { useEffect } from 'react';
import { NotificationData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface NotificationSystemProps {
  notifications: NotificationData[];
  removeNotification: (id: string) => void;
}

export default function NotificationSystem({ notifications, removeNotification }: NotificationSystemProps) {
  const getNotificationStyles = (type: NotificationData['type']) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/90 border-green-400/50',
          icon: '✅',
          iconBg: 'bg-green-400/20 text-green-300'
        };
      case 'error':
        return {
          bg: 'bg-red-500/90 border-red-400/50',
          icon: '❌',
          iconBg: 'bg-red-400/20 text-red-300'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/90 border-yellow-400/50',
          icon: '⚠️',
          iconBg: 'bg-yellow-400/20 text-yellow-300'
        };
      default:
        return {
          bg: 'bg-blue-500/90 border-blue-400/50',
          icon: 'ℹ️',
          iconBg: 'bg-blue-400/20 text-blue-300'
        };
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {notifications.map((notification) => {
        const styles = getNotificationStyles(notification.type);
        
        return (
          <NotificationItem
            key={notification.id}
            notification={notification}
            styles={styles}
            onClose={() => removeNotification(notification.id)}
          />
        );
      })}
    </div>
  );
}

interface NotificationItemProps {
  notification: NotificationData;
  styles: {
    bg: string;
    icon: string;
    iconBg: string;
  };
  onClose: () => void;
}

function NotificationItem({ notification, styles, onClose }: NotificationItemProps) {
  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration, onClose]);

  return (
    <div
      className={cn(
        "relative backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden",
        "animate-in slide-in-from-right-full duration-300",
        styles.bg
      )}
    >
      {/* Progress bar */}
      {notification.duration && (
        <div className="absolute top-0 left-0 h-1 bg-white/30 animate-pulse">
          <div 
            className="h-full bg-white/60 transition-all ease-linear"
            style={{
              width: '100%',
              animation: `shrink ${notification.duration}ms linear forwards`
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm",
            styles.iconBg
          )}>
            {styles.icon}
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold text-sm">
              {notification.title}
            </div>
            {notification.message && (
              <div className="text-white/90 text-sm mt-1 leading-relaxed">
                {notification.message}
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white/80 hover:text-white transition-colors text-sm"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

/* Custom CSS for shrinking animation */
const style = `
  @keyframes shrink {
    from { width: 100%; }
    to { width: 0%; }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = style;
  document.head.appendChild(styleSheet);
}