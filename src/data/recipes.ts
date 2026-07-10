import { Recipe } from '../types/game';

export const RECIPES: Recipe[] = [
  // CORE PATH TO LIFE & HUMAN
  { id: 'air-fire', element1: 'air', element2: 'fire', result: 'energy' },
  { id: 'earth-water', element1: 'earth', element2: 'water', result: 'mud' },
  { id: 'energy-mud', element1: 'energy', element2: 'mud', result: 'life' },
  { id: 'life-mud', element1: 'life', element2: 'mud', result: 'human' },

  // HOUSE & VILLAGE PROGRESSION
  { id: 'air-water', element1: 'air', element2: 'water', result: 'rain' },
  { id: 'earth-rain', element1: 'earth', element2: 'rain', result: 'plant' },
  { id: 'plant-water', element1: 'plant', element2: 'water', result: 'tree' },
  { id: 'stone-tree', element1: 'stone', element2: 'tree', result: 'wood' },
  { id: 'human-wood', element1: 'human', element2: 'wood', result: 'shelter' },
  { id: 'human-shelter', element1: 'human', element2: 'shelter', result: 'house' },
  { id: 'house-house', element1: 'house', element2: 'house', result: 'village' },

  // KNOWLEDGE, SCHOOL, SCIENCE
  { id: 'human-human', element1: 'human', element2: 'human', result: 'language' },
  { id: 'human-language', element1: 'human', element2: 'language', result: 'knowledge' },
  { id: 'knowledge-village', element1: 'knowledge', element2: 'village', result: 'school' },
  { id: 'knowledge-school', element1: 'knowledge', element2: 'school', result: 'science' },

  // METAL, MACHINE, FACTORY, TECHNOLOGY
  { id: 'earth-fire', element1: 'earth', element2: 'fire', result: 'lava' },
  { id: 'lava-water', element1: 'lava', element2: 'water', result: 'stone' },
  { id: 'earth-stone', element1: 'earth', element2: 'stone', result: 'ore' },
  { id: 'fire-ore', element1: 'fire', element2: 'ore', result: 'metal' },
  { id: 'human-stone', element1: 'human', element2: 'stone', result: 'tool' },
  { id: 'metal-tool', element1: 'metal', element2: 'tool', result: 'machine' },
  { id: 'energy-machine', element1: 'energy', element2: 'machine', result: 'factory' },
  { id: 'factory-science', element1: 'factory', element2: 'science', result: 'technology' },

  // COAL, FUEL, ROCKET
  { id: 'stone-stone', element1: 'stone', element2: 'stone', result: 'mountain' },
  { id: 'earth-mountain', element1: 'earth', element2: 'mountain', result: 'pressure' },
  { id: 'plant-pressure', element1: 'plant', element2: 'pressure', result: 'coal' },
  { id: 'coal-fire', element1: 'coal', element2: 'fire', result: 'fuel' },
  { id: 'fuel-technology', element1: 'fuel', element2: 'technology', result: 'rocket' },

  // COMPUTER, MISSION CONTROL, SPACE MISSION
  { id: 'air-air', element1: 'air', element2: 'air', result: 'sky' },
  { id: 'rocket-sky', element1: 'rocket', element2: 'sky', result: 'space' },
  { id: 'electricity-technology', element1: 'electricity', element2: 'technology', result: 'computer' },
  { id: 'computer-science', element1: 'computer', element2: 'science', result: 'mission-control' },
  { id: 'mission-control-rocket', element1: 'mission-control', element2: 'rocket', result: 'launch' },
  { id: 'launch-space', element1: 'launch', element2: 'space', result: 'orbit' },
  { id: 'human-rocket', element1: 'human', element2: 'rocket', result: 'astronaut' },
  { id: 'astronaut-orbit', element1: 'astronaut', element2: 'orbit', result: 'space-mission' },

  // MARS DETECTION & LANDING
  { id: 'air-stone', element1: 'air', element2: 'stone', result: 'sand' },
  { id: 'fire-sand', element1: 'fire', element2: 'sand', result: 'glass' },
  { id: 'glass-science', element1: 'glass', element2: 'science', result: 'lens' },
  { id: 'lens-sky', element1: 'lens', element2: 'sky', result: 'telescope' },
  { id: 'science-telescope', element1: 'science', element2: 'telescope', result: 'astronomy' },
  { id: 'astronomy-science', element1: 'astronomy', element2: 'science', result: 'planet' },
  { id: 'air-earth', element1: 'air', element2: 'earth', result: 'dust' },
  { id: 'dust-metal', element1: 'dust', element2: 'metal', result: 'red-dust' },
  { id: 'planet-red-dust', element1: 'planet', element2: 'red-dust', result: 'mars' },
  { id: 'mars-space-mission', element1: 'mars', element2: 'space-mission', result: 'mars-landing' },

  // OPTIONAL DISCOVERIES
  { id: 'life-water', element1: 'life', element2: 'water', result: 'fish' },
  { id: 'air-life', element1: 'air', element2: 'life', result: 'bird' },
  { id: 'tree-tree', element1: 'tree', element2: 'tree', result: 'forest' },
  { id: 'earth-plant', element1: 'earth', element2: 'plant', result: 'crop' },
  { id: 'crop-fire', element1: 'crop', element2: 'fire', result: 'food' },
  { id: 'fire-food', element1: 'fire', element2: 'food', result: 'cooking' },
  { id: 'cooking-food', element1: 'cooking', element2: 'food', result: 'meal' },
  { id: 'house-human', element1: 'house', element2: 'human', result: 'family' },
  { id: 'tool-tree', element1: 'tool', element2: 'tree', result: 'paper' },
  { id: 'language-paper', element1: 'language', element2: 'paper', result: 'writing' },
  { id: 'plant-science', element1: 'plant', element2: 'science', result: 'medicine' },
  { id: 'earth-paper', element1: 'earth', element2: 'paper', result: 'map' },
  { id: 'mud-stone', element1: 'mud', element2: 'stone', result: 'road' },
  { id: 'road-village', element1: 'road', element2: 'village', result: 'town' },
  { id: 'village-village', element1: 'village', element2: 'village', result: 'town' },
  { id: 'tool-wood', element1: 'tool', element2: 'wood', result: 'wheel' },
  { id: 'fuel-machine', element1: 'fuel', element2: 'machine', result: 'engine' },
  { id: 'engine-wheel', element1: 'engine', element2: 'wheel', result: 'vehicle' },
  { id: 'energy-metal', element1: 'energy', element2: 'metal', result: 'electricity' },
  { id: 'tool-metal', element1: 'tool', element2: 'metal', result: 'wire' },
  { id: 'factory-machine', element1: 'factory', element2: 'machine', result: 'industry' },
  { id: 'computer-wire', element1: 'computer', element2: 'wire', result: 'network' }
];

export function getRecipeResult(el1: string, el2: string): string | null {
  const sorted = [el1, el2].sort();
  const found = RECIPES.find(
    (r) =>
      (r.element1 === sorted[0] && r.element2 === sorted[1]) ||
      (r.element1 === sorted[1] && r.element2 === sorted[0])
  );
  return found ? found.result : null;
}
