import { useCallback, useEffect, useRef, useState } from 'react';
import type { MultiplayerPlayer, SharedDiscovery, SharedGameSnapshot } from '../types/game';

type ConnectionState = 'offline' | 'connecting' | 'connected';

interface MultiplayerOptions {
  onSnapshot: (snapshot: SharedGameSnapshot) => void;
}

const getRealtimeUrl = () => {
  const configuredUrl = import.meta.env.VITE_REALTIME_URL?.trim();
  if (configuredUrl) return configuredUrl;
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/realtime`;
};

const verifySameOriginRealtimeServer = async () => {
  if (import.meta.env.DEV || import.meta.env.VITE_REALTIME_URL) return;
  const response = await fetch('/health', { headers: { Accept: 'application/json' } });
  if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
    throw new Error('Production multiplayer server is not configured.');
  }
};

export function useMultiplayer({ onSnapshot }: MultiplayerOptions) {
  const socketRef = useRef<WebSocket | null>(null);
  const snapshotHandler = useRef(onSnapshot);
  const [connection, setConnection] = useState<ConnectionState>('offline');
  const [roomCode, setRoomCode] = useState('');
  const [playerId, setPlayerId] = useState('');
  const [players, setPlayers] = useState<MultiplayerPlayer[]>([]);
  const [roomStarted, setRoomStarted] = useState(false);
  const [error, setError] = useState('');
  const [lastDiscovery, setLastDiscovery] = useState<SharedDiscovery | null>(null);

  useEffect(() => {
    snapshotHandler.current = onSnapshot;
  }, [onSnapshot]);

  const send = useCallback((payload: unknown) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    }
  }, []);

  const connect = useCallback(async () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) return Promise.resolve(socketRef.current);
    if (socketRef.current?.readyState === WebSocket.CONNECTING) {
      return new Promise<WebSocket>((resolve, reject) => {
        const socket = socketRef.current!;
        socket.addEventListener('open', () => resolve(socket), { once: true });
        socket.addEventListener('error', () => reject(new Error('Connection failed')), { once: true });
      });
    }

    setConnection('connecting');
    setError('');
    try {
      await verifySameOriginRealtimeServer();
    } catch {
      setConnection('offline');
      setError('Multiplayer is not available on this deployment yet. The realtime server must be connected.');
      return Promise.reject(new Error('Realtime server unavailable'));
    }

    const socket = new WebSocket(getRealtimeUrl());
    socketRef.current = socket;

    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'identity') setPlayerId(message.playerId);
      if (message.type === 'error') setError(message.message);
      if (message.type === 'room-state' || message.type === 'room-started') {
        setRoomCode(message.roomCode);
        setPlayers(message.players);
        setRoomStarted(Boolean(message.snapshot?.isActive));
        if (message.snapshot) snapshotHandler.current(message.snapshot);
      }
      if (message.type === 'snapshot') snapshotHandler.current(message.snapshot);
      if (message.type === 'discovery') setLastDiscovery(message.discovery);
    });
    socket.addEventListener('close', () => {
      setConnection('offline');
      socketRef.current = null;
    });
    socket.addEventListener('error', () => {
      setError('The expedition server is unavailable. Try again in a moment.');
    });

    return new Promise<WebSocket>((resolve, reject) => {
      socket.addEventListener('open', () => {
        setConnection('connected');
        resolve(socket);
      }, { once: true });
      socket.addEventListener('error', () => reject(new Error('Connection failed')), { once: true });
    });
  }, []);

  const createRoom = useCallback(async (playerName: string, snapshot: SharedGameSnapshot) => {
    try {
      const socket = await connect();
      socket.send(JSON.stringify({ type: 'create-room', playerName, snapshot }));
    } catch {
      setError('Could not open a shared expedition.');
    }
  }, [connect]);

  const joinRoom = useCallback(async (playerName: string, code: string) => {
    try {
      const socket = await connect();
      socket.send(JSON.stringify({ type: 'join-room', playerName, roomCode: code }));
    } catch {
      setError('Could not join that shared expedition.');
    }
  }, [connect]);

  const leaveRoom = useCallback(() => {
    socketRef.current?.close();
    socketRef.current = null;
    setRoomCode('');
    setPlayerId('');
    setPlayers([]);
    setRoomStarted(false);
    setLastDiscovery(null);
    setError('');
    setConnection('offline');
  }, []);

  useEffect(() => () => socketRef.current?.close(), []);

  const currentPlayer = players.find((player) => player.id === playerId) ?? null;

  return {
    connection,
    roomCode,
    playerId,
    players,
    currentPlayer,
    isHost: Boolean(currentPlayer?.isHost),
    roomStarted,
    error,
    lastDiscovery,
    createRoom,
    joinRoom,
    leaveRoom,
    startRoom: () => send({ type: 'start-room' }),
    syncState: (snapshot: SharedGameSnapshot) => send({ type: 'sync-state', snapshot }),
    clearDiscovery: () => setLastDiscovery(null),
  };
}

export type MultiplayerSession = ReturnType<typeof useMultiplayer>;
