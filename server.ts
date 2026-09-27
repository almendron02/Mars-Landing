import express from 'express';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocket, WebSocketServer } from 'ws';
import type { MultiplayerPlayer, SharedGameSnapshot } from './src/types/game';

type ClientMessage =
  | { type: 'create-room'; playerName: string; snapshot: SharedGameSnapshot }
  | { type: 'join-room'; playerName: string; roomCode: string }
  | { type: 'start-room' }
  | { type: 'sync-state'; snapshot: SharedGameSnapshot };

interface RoomPlayer extends MultiplayerPlayer {
  socket: WebSocket;
}

interface Room {
  code: string;
  snapshot: SharedGameSnapshot;
  players: Map<string, RoomPlayer>;
}

const app = express();
const server = createServer(app);
const realtime = new WebSocketServer({ server, path: '/realtime', maxPayload: 64 * 1024 });
const rooms = new Map<string, Room>();
const colors = ['#C96F4A', '#658B6F', '#657FA4', '#B781B0'];
const startingSnapshot: SharedGameSnapshot = {
  discoveredElements: ['air', 'earth', 'fire', 'water'],
  achievements: [],
  elapsedTime: 0,
  hasWon: false,
  isActive: false,
};

const sanitizeSnapshot = (value: Partial<SharedGameSnapshot> | undefined): SharedGameSnapshot => {
  const cleanIds = (items: unknown) => Array.isArray(items)
    ? [...new Set(items.filter((item): item is string => typeof item === 'string' && item.length <= 64))].slice(0, 200)
    : [];
  return {
    discoveredElements: cleanIds(value?.discoveredElements),
    achievements: cleanIds(value?.achievements),
    elapsedTime: Number.isFinite(value?.elapsedTime) ? Math.max(0, Math.floor(value!.elapsedTime!)) : 0,
    hasWon: Boolean(value?.hasWon),
    isActive: Boolean(value?.isActive),
  };
};

const safeName = (value: unknown) => {
  const name = String(value ?? '').trim().slice(0, 18);
  return name || 'Explorer';
};

const normalizeCode = (value: unknown) => {
  const suffix = String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/^MARS/, '').slice(0, 4);
  return suffix ? `MARS-${suffix}` : '';
};

const createCode = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  do {
    code = `MARS-${Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')}`;
  } while (rooms.has(code));
  return code;
};

const publicPlayers = (room: Room): MultiplayerPlayer[] =>
  [...room.players.values()].map(({ socket: _socket, ...player }) => player);

const send = (socket: WebSocket, payload: unknown) => {
  if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(payload));
};

const broadcast = (room: Room, payload: unknown) => {
  room.players.forEach((player) => send(player.socket, payload));
};

const roomState = (room: Room) => ({
  type: 'room-state',
  roomCode: room.code,
  players: publicPlayers(room),
  snapshot: room.snapshot,
});

const mergeSnapshot = (current: SharedGameSnapshot, incoming: SharedGameSnapshot): SharedGameSnapshot => ({
  discoveredElements: [...new Set([...current.discoveredElements, ...incoming.discoveredElements])],
  achievements: [...new Set([...current.achievements, ...incoming.achievements])],
  elapsedTime: Math.max(current.elapsedTime, incoming.elapsedTime),
  hasWon: current.hasWon || incoming.hasWon,
  isActive: current.isActive || incoming.isActive,
});

realtime.on('connection', (socket) => {
  const clientId = randomUUID();
  let roomCode = '';

  socket.on('message', (raw) => {
    let message: ClientMessage;
    try {
      message = JSON.parse(raw.toString()) as ClientMessage;
    } catch {
      send(socket, { type: 'error', message: 'That message could not be read.' });
      return;
    }

    if (message.type === 'create-room') {
      const code = createCode();
      const player: RoomPlayer = {
        id: clientId,
        name: safeName(message.playerName),
        color: colors[0],
        isHost: true,
        socket,
      };
      const room: Room = {
        code,
        snapshot: mergeSnapshot(startingSnapshot, { ...sanitizeSnapshot(message.snapshot), isActive: false }),
        players: new Map([[clientId, player]]),
      };
      rooms.set(code, room);
      roomCode = code;
      send(socket, { type: 'identity', playerId: clientId });
      broadcast(room, roomState(room));
      return;
    }

    if (message.type === 'join-room') {
      const code = normalizeCode(message.roomCode);
      const room = rooms.get(code);
      if (!room) {
        send(socket, { type: 'error', message: 'We could not find that expedition code.' });
        return;
      }
      if (room.players.size >= 4) {
        send(socket, { type: 'error', message: 'That expedition already has four explorers.' });
        return;
      }
      if (!room.snapshot.isActive || ![...room.players.values()].some((roomPlayer) => roomPlayer.isHost)) {
        send(socket, { type: 'error', message: 'The creator is not currently playing that world.' });
        return;
      }
      const player: RoomPlayer = {
        id: clientId,
        name: safeName(message.playerName),
        color: colors[room.players.size],
        isHost: false,
        socket,
      };
      room.players.set(clientId, player);
      roomCode = code;
      send(socket, { type: 'identity', playerId: clientId });
      broadcast(room, roomState(room));
      return;
    }

    const room = rooms.get(roomCode);
    const player = room?.players.get(clientId);
    if (!room || !player) {
      send(socket, { type: 'error', message: 'Join an expedition before sending updates.' });
      return;
    }

    if (message.type === 'start-room') {
      if (!player.isHost) return;
      room.snapshot = { ...room.snapshot, isActive: true };
      broadcast(room, { ...roomState(room), type: 'room-started' });
      return;
    }

    if (message.type === 'sync-state') {
      const previous = new Set(room.snapshot.discoveredElements);
      const incoming = sanitizeSnapshot(message.snapshot);
      const additions = incoming.discoveredElements.filter((id) => !previous.has(id));
      room.snapshot = mergeSnapshot(room.snapshot, incoming);
      broadcast(room, { type: 'snapshot', snapshot: room.snapshot });
      additions.forEach((elementId) => {
        broadcast(room, {
          type: 'discovery',
          discovery: { elementId, playerId: player.id, playerName: player.name, createdAt: Date.now() },
        });
      });
      return;
    }

  });

  socket.on('close', () => {
    const room = rooms.get(roomCode);
    if (!room) return;
    const departingPlayer = room.players.get(clientId);
    room.players.delete(clientId);
    if (departingPlayer?.isHost) {
      broadcast(room, { type: 'room-closed', message: 'The world creator stopped playing.' });
      room.players.forEach((player) => player.socket.close());
      rooms.delete(room.code);
      return;
    }
    if (room.players.size === 0) rooms.delete(room.code);
    broadcast(room, roomState(room));
  });
});

app.get('/health', (_request, response) => {
  response.json({ ok: true, activeRooms: rooms.size });
});

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');
if (existsSync(dist)) {
  app.use(express.static(dist));
  app.get('*', (_request, response) => response.sendFile(path.join(dist, 'index.html')));
}

const port = Number(process.env.PORT || 3001);
server.listen(port, '0.0.0.0', () => {
  console.log(`Mars Landing realtime server listening on http://localhost:${port}`);
});
