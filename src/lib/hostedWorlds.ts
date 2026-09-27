import type { GameState, HostedWorld } from '../types/game';

export const MAX_HOSTED_WORLDS = 3;

const sortWorlds = (worlds: HostedWorld[]) => [...worlds].sort((a, b) => a.slot - b.slot);

const hasLegacyProgress = (state: GameState) =>
  state.discoveredElements.length > 4 ||
  state.achievements.length > 0 ||
  state.elapsedTime > 0 ||
  state.hasWon;

export const createHostedWorld = (
  worlds: HostedWorld[],
  snapshot: GameState,
  now = Date.now(),
  id: string = crypto.randomUUID(),
) => {
  const openSlot = ([1, 2, 3] as const).find((slot) => !worlds.some((world) => world.slot === slot));
  if (!openSlot || worlds.length >= MAX_HOSTED_WORLDS) {
    return { ok: false as const, reason: 'no-space' as const, worlds };
  }

  const world: HostedWorld = { id, slot: openSlot, createdAt: now, updatedAt: now, snapshot };
  return { ok: true as const, world, worlds: sortWorlds([...worlds, world]) };
};

export const updateHostedWorld = (
  worlds: HostedWorld[],
  worldId: string,
  snapshot: GameState,
  now = Date.now(),
) => worlds.map((world) => world.id === worldId ? { ...world, updatedAt: now, snapshot } : world);

export const deleteHostedWorld = (worlds: HostedWorld[], worldId: string) =>
  worlds.filter((world) => world.id !== worldId);

export const migrateLegacyWorld = (
  worlds: HostedWorld[],
  legacyState: GameState | null,
  now = Date.now(),
  id: string = crypto.randomUUID(),
) => {
  if (worlds.length > 0 || !legacyState || !hasLegacyProgress(legacyState)) return worlds;
  const migrated = createHostedWorld(worlds, legacyState, now, id);
  return migrated.ok ? migrated.worlds : worlds;
};
