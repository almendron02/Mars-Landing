import { ELEMENTS, STARTING_ELEMENTS } from '../data/elements';
import { RECIPES } from '../data/recipes';
import type { Element, Era, Recipe } from '../types/game';

export type MapStage = 'Base' | Era;
export type MapBranchId = 'fire' | 'water' | 'earth' | 'air';

export interface MapBranchLevel {
  level: number;
  elementIds: string[];
}

export interface MapBranch {
  rootId: MapBranchId;
  label: string;
  angle: number;
  color: string;
  levels: MapBranchLevel[];
}

export interface CivilizationMapNode extends Element {
  mapParent: string | null;
  recipeParents: Array<[string, string]>;
  branch: MapBranchId;
  level: number;
  stage: MapStage;
  stageIndex: number;
  x: number;
  y: number;
  angle: number;
  radius: number;
  isMilestone: boolean;
  isGoal: boolean;
}

export interface CivilizationMapEdge {
  parentId: string;
  childId: string;
}

export interface CivilizationMapModel {
  size: number;
  center: number;
  nodes: CivilizationMapNode[];
  edges: CivilizationMapEdge[];
  nodeById: Map<string, CivilizationMapNode>;
}

export const MAP_SIZE = 5600;
export const MAP_CENTER = MAP_SIZE / 2;
export const MAP_LEVEL_RADIUS = 165;
export const MAP_ORIGIN_RADIUS = 190;

export const MAP_STAGES: Array<{ stage: MapStage; label: string; color: string }> = [
  { stage: 'Base', label: 'Origins', color: '#A98B6D' },
  { stage: 'Nature', label: 'Nature', color: '#8DAE69' },
  { stage: 'Life', label: 'Life', color: '#77A881' },
  { stage: 'Human', label: 'Humanity', color: '#D39A62' },
  { stage: 'Civilization', label: 'Civilization', color: '#C7A46A' },
  { stage: 'Industry', label: 'Industry', color: '#7892AC' },
  { stage: 'Space', label: 'Space · Mars', color: '#C96F4A' },
];

export const MAP_LEVELS = Array.from({ length: 15 }, (_, level) => ({
  level,
  radius: MAP_ORIGIN_RADIUS + level * MAP_LEVEL_RADIUS,
}));

export const MAP_BRANCHES: MapBranch[] = [
  {
    rootId: 'fire',
    label: 'Fire',
    angle: -Math.PI * 0.75,
    color: '#D96645',
    levels: [
      { level: 0, elementIds: ['fire'] },
      { level: 1, elementIds: ['lava'] },
      { level: 2, elementIds: ['life'] },
      { level: 3, elementIds: ['mountain', 'road'] },
      { level: 4, elementIds: ['food', 'metal'] },
      { level: 5, elementIds: ['coal', 'cooking'] },
      { level: 6, elementIds: ['factory', 'fuel', 'meal'] },
      { level: 7, elementIds: ['engine', 'industry'] },
      { level: 10, elementIds: ['technology'] },
      { level: 11, elementIds: ['rocket'] },
      { level: 12, elementIds: ['astronaut'] },
      { level: 13, elementIds: ['launch'] },
    ],
  },
  {
    rootId: 'water',
    label: 'Water',
    angle: -Math.PI * 0.25,
    color: '#4F91B8',
    levels: [
      { level: 0, elementIds: ['water'] },
      { level: 1, elementIds: ['mud', 'rain'] },
      { level: 2, elementIds: ['stone'] },
      { level: 3, elementIds: ['fish', 'tree'] },
      { level: 4, elementIds: ['forest', 'pressure'] },
      { level: 5, elementIds: ['electricity', 'shelter'] },
      { level: 6, elementIds: ['house', 'map'] },
      { level: 7, elementIds: ['family'] },
      { level: 8, elementIds: ['town'] },
      { level: 10, elementIds: ['medicine'] },
      { level: 12, elementIds: ['network', 'space'] },
      { level: 13, elementIds: ['space-mission'] },
    ],
  },
  {
    rootId: 'earth',
    label: 'Earth',
    angle: Math.PI * 0.25,
    color: '#8D7458',
    levels: [
      { level: 0, elementIds: ['earth'] },
      { level: 1, elementIds: ['dust'] },
      { level: 2, elementIds: ['plant'] },
      { level: 3, elementIds: ['crop', 'human', 'ore'] },
      { level: 4, elementIds: ['tool', 'wood'] },
      { level: 5, elementIds: ['machine', 'paper'] },
      { level: 6, elementIds: ['wheel', 'wire'] },
      { level: 7, elementIds: ['village'] },
      { level: 9, elementIds: ['science'] },
      { level: 11, elementIds: ['planet'] },
      { level: 12, elementIds: ['mars'] },
      { level: 14, elementIds: ['mars-landing'] },
    ],
  },
  {
    rootId: 'air',
    label: 'Air',
    angle: Math.PI * 0.75,
    color: '#7297AD',
    levels: [
      { level: 0, elementIds: ['air'] },
      { level: 1, elementIds: ['energy', 'sky'] },
      { level: 3, elementIds: ['bird', 'sand'] },
      { level: 4, elementIds: ['glass', 'language'] },
      { level: 5, elementIds: ['knowledge', 'lens', 'red-dust'] },
      { level: 6, elementIds: ['telescope', 'writing'] },
      { level: 7, elementIds: ['vehicle'] },
      { level: 8, elementIds: ['school'] },
      { level: 10, elementIds: ['astronomy'] },
      { level: 11, elementIds: ['computer'] },
      { level: 12, elementIds: ['mission-control'] },
      { level: 14, elementIds: ['orbit'] },
    ],
  },
];

export const MILESTONE_IDS = new Set([
  'life',
  'human',
  'village',
  'science',
  'technology',
  'rocket',
  'mars',
  'mars-landing',
]);

const stageFor = (element: Element): MapStage =>
  STARTING_ELEMENTS.includes(element.id) ? 'Base' : element.era;

const stageIndexFor = (element: Element) =>
  MAP_STAGES.findIndex(({ stage }) => stage === stageFor(element));

export const getNodeRecipes = (elementId: string, recipes: Recipe[] = RECIPES) =>
  recipes.filter((recipe) => recipe.result === elementId);

export const isNodeReachable = (
  elementId: string,
  discovered: Set<string>,
  recipes: Recipe[] = RECIPES,
) => getNodeRecipes(elementId, recipes).some((recipe) =>
  discovered.has(recipe.element1) && discovered.has(recipe.element2));

export const buildCivilizationMap = (
  elements: Element[] = ELEMENTS,
  recipes: Recipe[] = RECIPES,
): CivilizationMapModel => {
  const elementsById = new Map(elements.map((element) => [element.id, element]));
  const nodes: CivilizationMapNode[] = [];
  const edges: CivilizationMapEdge[] = [];

  MAP_BRANCHES.forEach((branch) => {
    let previousLevelIds: string[] = [];

    branch.levels.forEach(({ level, elementIds }) => {
      const availableIds = elementIds.filter((id) => elementsById.has(id));
      const radius = MAP_ORIGIN_RADIUS + level * MAP_LEVEL_RADIUS;
      const angleStep = Math.min(0.32, 140 / radius);

      availableIds.forEach((id, index) => {
        const element = elementsById.get(id)!;
        const angle = branch.angle + (index - (availableIds.length - 1) / 2) * angleStep;
        const mapParent = level === 0 || previousLevelIds.length === 0
          ? null
          : previousLevelIds[Math.floor(index * previousLevelIds.length / availableIds.length)];

        nodes.push({
          ...element,
          mapParent,
          recipeParents: getNodeRecipes(id, recipes).map((recipe) => [recipe.element1, recipe.element2]),
          branch: branch.rootId,
          level,
          stage: stageFor(element),
          stageIndex: stageIndexFor(element),
          x: MAP_CENTER + Math.cos(angle) * radius,
          y: MAP_CENTER + Math.sin(angle) * radius,
          angle,
          radius,
          isMilestone: MILESTONE_IDS.has(id),
          isGoal: id === 'mars' || id === 'mars-landing',
        });

        if (mapParent) edges.push({ parentId: mapParent, childId: id });
      });

      if (availableIds.length > 0) previousLevelIds = availableIds;
    });
  });

  return {
    size: MAP_SIZE,
    center: MAP_CENTER,
    nodes,
    edges,
    nodeById: new Map(nodes.map((node) => [node.id, node])),
  };
};
