import { Element } from '../types/game';

export const ELEMENTS: Element[] = [
  // NATURE ERA (Starting Elements)
  { id: 'air', name: 'Air', era: 'Nature', description: 'A gentle breeze that cools and moves the world.' },
  { id: 'earth', name: 'Earth', era: 'Nature', description: 'The solid ground beneath our feet.' },
  { id: 'fire', name: 'Fire', era: 'Nature', description: 'Warm, bright, and dangerously powerful.' },
  { id: 'water', name: 'Water', era: 'Nature', description: 'The source of all nourishment and flow.' },

  // NATURE ERA (Combinations)
  { id: 'energy', name: 'Energy', era: 'Nature', description: 'Pure dynamic force generated from heat and air.' },
  { id: 'mud', name: 'Mud', era: 'Nature', description: 'A wet, squishy mix of earth and water.' },
  { id: 'rain', name: 'Rain', era: 'Nature', description: 'Water falling from the sky to refresh the soil.' },
  { id: 'plant', name: 'Plant', era: 'Nature', description: 'Green life sprouting from the earth.' },
  { id: 'tree', name: 'Tree', era: 'Nature', description: 'A tall, strong plant with a wooden trunk.' },
  { id: 'crop', name: 'Crop', era: 'Nature', description: 'A golden corn crop cultivated for food.' },
  { id: 'forest', name: 'Forest', era: 'Nature', description: 'A thriving gathering of trees growing together.' },
  { id: 'lava', name: 'Lava', era: 'Nature', description: 'Superheated molten stone flowing from the depths.' },
  { id: 'stone', name: 'Stone', era: 'Nature', description: 'Hard, durable material cooled from fire and liquid.' },
  { id: 'wood', name: 'Wood', era: 'Nature', description: 'Natural construction material harvested from trees.' },
  { id: 'ore', name: 'Ore', era: 'Nature', description: 'Mineral-rich rock containing raw metals.' },
  { id: 'metal', name: 'Metal', era: 'Nature', description: 'Strong, shiny material forged from mineral ores.' },
  { id: 'mountain', name: 'Mountain', era: 'Nature', description: 'A colossal stone formation reaching for the heavens.' },
  { id: 'pressure', name: 'Pressure', era: 'Nature', description: 'An intense, squeezing weight from deep below.' },
  { id: 'coal', name: 'Coal', era: 'Nature', description: 'Ancient compressed organic matter, perfect for burning.' },
  { id: 'sky', name: 'Sky', era: 'Nature', description: 'The wide blue expanse above the earth.' },
  { id: 'sand', name: 'Sand', era: 'Nature', description: 'Fine grains of stone worn down by the wind.' },
  { id: 'glass', name: 'Glass', era: 'Nature', description: 'Clear, silica-based pane melted from hot sand.' },
  { id: 'dust', name: 'Dust', era: 'Nature', description: 'Tiny dry particles carried by the air.' },
  { id: 'red-dust', name: 'Red Dust', era: 'Nature', description: 'Iron-rich dust that glows with a rusty hue.' },

  // LIFE ERA
  { id: 'life', name: 'Life', era: 'Life', description: 'A miraculous, self-sustaining spark in wet soil.' },
  { id: 'fish', name: 'Fish', era: 'Life', description: 'A scaled creature swimming peacefully in the deep.' },
  { id: 'bird', name: 'Bird', era: 'Life', description: 'A feathered creature soaring through the sky.' },

  // HUMAN ERA
  { id: 'human', name: 'Human', era: 'Human', description: 'A curious creature with clever hands and big dreams.' },
  { id: 'tool', name: 'Tool', era: 'Human', description: 'An extension of human hands to shape the world.' },
  { id: 'shelter', name: 'Shelter', era: 'Human', description: 'A basic, cozy structure to protect from the weather.' },
  { id: 'food', name: 'Food', era: 'Human', description: 'Nourishment prepared for sustenance.' },
  { id: 'cooking', name: 'Cooking', era: 'Human', description: 'The art of applying heat to ingredients.' },
  { id: 'meal', name: 'Meal', era: 'Human', description: 'A complete, heartwarming feast to enjoy.' },
  { id: 'family', name: 'Family', era: 'Human', description: 'Loved ones coming together to live and grow.' },

  // CIVILIZATION ERA
  { id: 'house', name: 'House', era: 'Civilization', description: 'A warm, permanent home built for comfort.' },
  { id: 'village', name: 'Village', era: 'Civilization', description: 'A cozy cluster of homes sharing a peaceful community.' },
  { id: 'language', name: 'Language', era: 'Civilization', description: 'Symbols and sounds to share ideas and stories.' },
  { id: 'knowledge', name: 'Knowledge', era: 'Civilization', description: 'Stored wisdom passed down through generations.' },
  { id: 'school', name: 'School', era: 'Civilization', description: 'A dedicated sanctuary of learning.' },
  { id: 'science', name: 'Science', era: 'Civilization', description: 'The methodical pursuit of truth and understanding.' },
  { id: 'paper', name: 'Paper', era: 'Civilization', description: 'A thin sheet of wood fiber, ready for ink.' },
  { id: 'writing', name: 'Writing', era: 'Civilization', description: 'Permanent records of thoughts and speech.' },
  { id: 'medicine', name: 'Medicine', era: 'Civilization', description: 'Remedies to cure ailments and soothe pain.' },
  { id: 'map', name: 'Map', era: 'Civilization', description: 'A guide to chart discovered lands.' },
  { id: 'road', name: 'Road', era: 'Civilization', description: 'A paved path connecting distant points.' },
  { id: 'town', name: 'Town', era: 'Civilization', description: 'A busy center of commerce and community.' },

  // INDUSTRY ERA
  { id: 'machine', name: 'Machine', era: 'Industry', description: 'A collection of moving parts to automate labor.' },
  { id: 'factory', name: 'Factory', era: 'Industry', description: 'A grand workshop of mass production.' },
  { id: 'technology', name: 'Technology', era: 'Industry', description: 'Advanced tools to calculate and innovate.' },
  { id: 'fuel', name: 'Fuel', era: 'Industry', description: 'Highly concentrated energy to power combustion.' },
  { id: 'electricity', name: 'Electricity', era: 'Industry', description: 'Harnessed current flowing through wires.' },
  { id: 'computer', name: 'Computer', era: 'Industry', description: 'An electronic device that processes information.' },
  { id: 'wheel', name: 'Wheel', era: 'Industry', description: 'A rolling disc that makes transport easy.' },
  { id: 'engine', name: 'Engine', era: 'Industry', description: 'A mechanical heart powered by fuel.' },
  { id: 'vehicle', name: 'Vehicle', era: 'Industry', description: 'A mobile carriage to traverse roads quickly.' },
  { id: 'wire', name: 'Wire', era: 'Industry', description: 'Metal filaments to transmit electricity.' },
  { id: 'industry', name: 'Industry', era: 'Industry', description: 'Large-scale trade and manufacturing systems.' },
  { id: 'network', name: 'Network', era: 'Industry', description: 'Interconnected computers sharing information.' },
  { id: 'lens', name: 'Lens', era: 'Industry', description: 'Curved glass to focus light and see the invisible.' },

  // SPACE ERA
  { id: 'rocket', name: 'Rocket', era: 'Space', description: "A roaring vessel designed to break Earth's gravity." },
  { id: 'space', name: 'Space', era: 'Space', description: 'The silent, beautiful ocean of stars.' },
  { id: 'mission-control', name: 'Mission Control', era: 'Space', description: 'The brain-center coordinating space travel.' },
  { id: 'launch', name: 'Launch', era: 'Space', description: 'The exciting ignite-and-lift off of a spacecraft.' },
  { id: 'orbit', name: 'Orbit', era: 'Space', description: 'A stable circular path around a celestial body.' },
  { id: 'astronaut', name: 'Astronaut', era: 'Space', description: 'A brave traveler visiting the stars.' },
  { id: 'space-mission', name: 'Space Mission', era: 'Space', description: 'An official venture into outer space.' },
  { id: 'telescope', name: 'Telescope', era: 'Space', description: 'A tool to gaze upon distant worlds.' },
  { id: 'astronomy', name: 'Astronomy', era: 'Space', description: 'The study of stars, planets, and the cosmos.' },
  { id: 'planet', name: 'Planet', era: 'Space', description: 'A celestial ball of stone and atmosphere.' },
  { id: 'mars', name: 'Mars', era: 'Space', description: 'Our beautiful, dusty red cosmic neighbor.' },
  { id: 'mars-landing', name: 'Mars Landing', era: 'Space', description: "Humankind's greatest achievement: setting foot on Mars!" }
];

export const STARTING_ELEMENTS = ['air', 'earth', 'fire', 'water'];
