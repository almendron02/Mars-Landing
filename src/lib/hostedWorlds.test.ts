import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createHostedWorld,
  deleteHostedWorld,
  migrateLegacyWorld,
  updateHostedWorld,
} from './hostedWorlds';
import type { GameState, HostedWorld } from '../types/game';

const state = (elapsedTime = 0): GameState => ({
  discoveredElements: ['air', 'earth', 'fire', 'water'],
  achievements: [],
  elapsedTime,
  isMutedMusic: false,
  isMutedSfx: false,
  volume: 0.5,
  hasWon: false,
  isActive: true,
});

test('creates hosted worlds in the next free slot and stops at three', () => {
  const first = createHostedWorld([], state(), 10, 'world-a');
  assert.equal(first.ok, true);
  if (!first.ok) return;
  assert.equal(first.world.slot, 1);

  const second = createHostedWorld(first.worlds, state(), 20, 'world-b');
  assert.equal(second.ok, true);
  if (!second.ok) return;
  const third = createHostedWorld(second.worlds, state(), 30, 'world-c');
  assert.equal(third.ok, true);
  if (!third.ok) return;

  const full = createHostedWorld(third.worlds, state(), 40, 'world-d');
  assert.deepEqual(full, { ok: false, reason: 'no-space', worlds: third.worlds });
});

test('reuses the first empty slot after a world is deleted', () => {
  const worlds: HostedWorld[] = [
    { id: 'one', slot: 1, createdAt: 1, updatedAt: 1, snapshot: state() },
    { id: 'three', slot: 3, createdAt: 3, updatedAt: 3, snapshot: state() },
  ];
  const result = createHostedWorld(worlds, state(), 4, 'two');
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.world.slot, 2);
});

test('updates progress without changing the world identity or slot', () => {
  const world: HostedWorld = { id: 'one', slot: 1, createdAt: 1, updatedAt: 1, snapshot: state() };
  const updated = updateHostedWorld([world], 'one', state(42), 50);
  assert.equal(updated[0].slot, 1);
  assert.equal(updated[0].createdAt, 1);
  assert.equal(updated[0].updatedAt, 50);
  assert.equal(updated[0].snapshot.elapsedTime, 42);
});

test('deletes only the selected hosted world', () => {
  const worlds: HostedWorld[] = [
    { id: 'one', slot: 1, createdAt: 1, updatedAt: 1, snapshot: state() },
    { id: 'two', slot: 2, createdAt: 2, updatedAt: 2, snapshot: state() },
  ];
  assert.deepEqual(deleteHostedWorld(worlds, 'one').map((world) => world.id), ['two']);
});

test('migrates a progressed legacy save into slot one once', () => {
  const legacy = state(12);
  const migrated = migrateLegacyWorld([], legacy, 100, 'legacy');
  assert.equal(migrated.length, 1);
  assert.equal(migrated[0].slot, 1);
  assert.equal(migrated[0].snapshot.elapsedTime, 12);
  assert.equal(migrateLegacyWorld(migrated, legacy, 200, 'ignored').length, 1);
  assert.equal(migrateLegacyWorld([], state(), 200, 'empty').length, 0);
});
