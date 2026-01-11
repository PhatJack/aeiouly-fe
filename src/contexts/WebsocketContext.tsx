'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { usePathname } from 'next/navigation';

import { StreakNotificationDialog } from '@/components/streak/StreakNotificationDialog';
import { ROUTE } from '@/configs/route';

import { createContext, useContextSelector } from 'use-context-selector';

import { useAuthStore } from './AuthContext';

interface WebSocketContextType {
  connected: boolean;
  connect: () => void;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const location = usePathname();
  const user = useAuthStore((state) => state.user);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const [autoConnect, setAutoConnect] = useState(false);

  const connect = () => {
    if (
      wsRef.current &&
      (wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING)
    )
      return;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const wsProtocol = baseUrl.startsWith('https') ? 'wss' : 'ws';
    const wsHost = baseUrl.startsWith('https')
      ? 'api.' + baseUrl.replace(/^https?:\/\//, '')
      : baseUrl.replace(/^https?:\/\//, '');
    const url = `${wsProtocol}://${wsHost}/online/ws`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      // Clear any pending reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    ws.onmessage = (ev) => {
      // Dispatch custom event for other components to listen
      try {
        const data = JSON.parse(ev.data);
        window.dispatchEvent(new CustomEvent('ws:message', { detail: data }));
      } catch {
        // If not JSON, dispatch raw message
        window.dispatchEvent(new CustomEvent('ws:message', { detail: ev.data }));
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = (event) => {
      setConnected(false);

      // Auto-reconnect if autoConnect is enabled and it's not a manual close
      if (autoConnect && event.code !== 1000) {
        reconnectTimeoutRef.current = window.setTimeout(() => {
          if (autoConnect) {
            connect();
          }
        }, 3000);
      }
    };
  };

  const disconnect = () => {
    setAutoConnect(false);
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    wsRef.current?.close(1000, 'Manual disconnect');
  };

  useEffect(() => {
    const checkAuthAndConnect = async () => {
      try {
        if (!user) return;
        if (user.role === 'admin') return;
        if (Object.values(ROUTE.AUTH).includes(location) || location === ROUTE.HOME) return;

        setAutoConnect(true);
        connect();
        window.dispatchEvent(
          new CustomEvent('auth:changed', {
            detail: { status: 'logged_in', source: 'mount_check' },
          })
        );
      } catch {
        setAutoConnect(false);
      }
    };
    checkAuthAndConnect();

    const handleVisibilityChange = () => {
      if (!document.hidden && !connected && autoConnect) {
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // React to auth changes: disconnect on logout, (re)connect on login
    const handleAuthChanged = (e: Event) => {
      const detail = (e as CustomEvent<{ status?: 'logged_in' | 'logged_out' }>).detail;
      if (detail?.status === 'logged_out') {
        disconnect();
      } else if (detail?.status === 'logged_in') {
        setAutoConnect(true);
        connect();
      } else {
        // Fallback: just attempt a reconnect to refresh presence
        connect();
      }
    };
    window.addEventListener('auth:changed', handleAuthChanged as EventListener);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('auth:changed', handleAuthChanged as EventListener);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      // Only close on unmount, not on tab switch
      wsRef.current?.close(1000, 'Component unmount');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, location]);

  const value: WebSocketContextType = useMemo(
    () => ({
      connected,
      connect,
      disconnect,
    }),
    [connected]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
      <StreakNotificationDialog />
    </WebSocketContext.Provider>
  );
};

export { WebSocketContext };

export const useWebSocketSelector = <T,>(selector: (state: WebSocketContextType) => T): T => {
  return useContextSelector(WebSocketContext, (ctx) => {
    if (!ctx) {
      throw new Error('useWebSocketSelector must be used within a WebSocketProvider');
    }
    return selector(ctx);
  });
};
