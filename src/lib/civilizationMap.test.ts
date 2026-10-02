import assert from 'node:assert/strict';
import test from 'node:test';
import { ELEMENTS, STARTING_ELEMENTS } from '../data/elements';
import { RECIPES } from '../data/recipes';
import {
  MAP_BRANCHES,
  buildCivilizationMap,
  getNodeRecipes,
  isNodeReachable,
} from './civilizationMap';

test('defines every recipe result as a playable element', () => {
  const elementIds = new Set(ELEMENTS.map((element) => element.id));
  const missingResults = [...new Set(RECIPES.map((recipe) => recipe.result))]
    .filter((result) => !elementIds.has(result));

  assert.deepEqual(missingResults, []);
  assert.ok(elementIds.has('crop'));
  assert.ok(elementIds.has('forest'));
});

test('places every element exactly once in the four specified branches', () => {
  const configuredIds = MAP_BRANCHES.flatMap((branch) =>
    branch.levels.flatMap((level) => level.elementIds));
  const expectedIds = ELEMENTS.map((element) => element.id);

  assert.equal(MAP_BRANCHES.length, 4);
  assert.deepEqual(MAP_BRANCHES.map((branch) => branch.rootId), ['fire', 'water', 'earth', 'air']);
  assert.equal(new Set(configuredIds).size, configuredIds.length);
  assert.deepEqual([...configuredIds].sort(), [...expectedIds].sort());
});

test('matches the approved branch levels and keeps the branches balanced', () => {
  const branch = (rootId: string) => MAP_BRANCHES.find((entry) => entry.rootId === rootId)!;
  const idsAt = (rootId: string, level: number) =>
    branch(rootId).levels.find((entry) => entry.level === level)?.elementIds ?? [];

  assert.deepEqual(idsAt('fire', 4), ['food', 'metal']);
  assert.deepEqual(idsAt('water', 4), ['forest', 'pressure']);
  assert.deepEqual(idsAt('earth', 3), ['crop', 'human', 'ore']);
  assert.deepEqual(idsAt('air', 5), ['knowledge', 'lens', 'red-dust']);
  assert.deepEqual(idsAt('earth', 14), ['mars-landing']);
  assert.deepEqual(idsAt('air', 14), ['orbit']);

  const descendantCounts = MAP_BRANCHES.map((entry) =>
    entry.levels.reduce((total, level) => total + level.elementIds.length, 0) - 1);
  assert.deepEqual(descendantCounts, [17, 17, 16, 17]);
});

test('gives every non-root element one line from the previous populated branch level', () => {
  const model = buildCivilizationMap();
  const roots = new Set(STARTING_ELEMENTS);

  assert.equal(model.nodes.length, ELEMENTS.length);
  assert.equal(model.edges.length, ELEMENTS.length - STARTING_ELEMENTS.length);

  model.nodes.forEach((node) => {
    if (roots.has(node.id)) {
      assert.equal(node.mapParent, null);
      assert.equal(node.level, 0);
      return;
    }

    const parent = model.nodeById.get(node.mapParent!);
    assert.ok(parent, `${node.id} should have one visual parent`);
    assert.equal(parent.branch, node.branch);
    assert.ok(parent.level < node.level);

    const populatedBefore = MAP_BRANCHES
      .find((entry) => entry.rootId === node.branch)!
      .levels
      .filter((entry) => entry.elementIds.length > 0 && entry.level < node.level)
      .at(-1)!;
    assert.equal(parent.level, populatedBefore.level);
  });
});

test('builds a stable outward radial layout with separated nodes', () => {
  const first = buildCivilizationMap();
  const second = buildCivilizationMap();
  let closestDistance = Number.POSITIVE_INFINITY;

  assert.deepEqual(first, second);
  first.nodes.forEach((node, index) => {
    const radius = Math.hypot(node.x - first.center, node.y - first.center);
    const expectedRadius = 190 + node.level * 165;
    assert.ok(Math.abs(radius - expectedRadius) < 0.001);

    first.nodes.slice(index + 1).forEach((other) => {
      closestDistance = Math.min(closestDistance, Math.hypot(node.x - other.x, node.y - other.y));
    });
  });

  assert.ok(closestDistance > 96, `closest nodes were only ${closestDistance.toFixed(1)}px apart`);
});

test('keeps true recipes separate from the visual branch lines', () => {
  const model = buildCivilizationMap();

  assert.equal(model.nodeById.get('life')?.mapParent, 'lava');
  assert.deepEqual(
    getNodeRecipes('life').map((recipe) => [recipe.element1, recipe.element2]),
    [['energy', 'mud']],
  );
  assert.deepEqual(
    getNodeRecipes('computer').map((recipe) => [recipe.element1, recipe.element2]),
    [['electricity', 'technology'], ['technology', 'wire']],
  );
  assert.deepEqual(
    getNodeRecipes('mars-landing').map((recipe) => [recipe.element1, recipe.element2]),
    [['mars', 'space-mission']],
  );
});

test('marks only discoveries whose full recipe is available as reachable', () => {
  assert.equal(isNodeReachable('mud', new Set(['earth', 'water'])), true);
  assert.equal(isNodeReachable('life', new Set(['earth', 'water', 'mud'])), false);
  assert.equal(isNodeReachable('life', new Set(['energy', 'mud'])), true);
  assert.equal(isNodeReachable('crop', new Set(['earth', 'plant'])), true);
  assert.equal(isNodeReachable('forest', new Set(['tree'])), true);
  assert.equal(isNodeReachable('mars', new Set(['planet', 'red-dust'])), true);
});
