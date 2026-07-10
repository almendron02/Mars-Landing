import { Element } from '../types/game';

export const ELEMENTS: Element[] = [
  // NATURE ERA (Starting Elements)
  { id: 'air', name: 'Air', icon: '💨', era: 'Nature', description: 'A gentle breeze that cools and moves the world.' },
  { id: 'earth', name: 'Earth', icon: '🟫', era: 'Nature', description: 'The solid ground beneath our feet.' },
  { id: 'fire', name: 'Fire', icon: '🔥', era: 'Nature', description: 'Warm, bright, and dangerously powerful.' },
  { id: 'water', name: 'Water', icon: '💧', era: 'Nature', description: 'The source of all nourishment and flow.' },

  // NATURE ERA (Combinations)
  { id: 'energy', name: 'Energy', icon: '⚡', era: 'Nature', description: 'Pure dynamic force generated from heat and air.' },
  { id: 'mud', name: 'Mud', icon: '🌫️', era: 'Nature', description: 'A wet, squishy mix of earth and water.' },
  { id: 'rain', name: 'Rain', icon: '🌧️', era: 'Nature', description: 'Water falling from the sky to refresh the soil.' },
  { id: 'plant', name: 'Plant', icon: '🌱', era: 'Nature', description: 'Green life sprouting from the earth.' },
  { id: 'tree', name: 'Tree', icon: '🌳', era: 'Nature', description: 'A tall, strong plant with a wooden trunk.' },
  { id: 'lava', name: 'Lava', icon: '🌋', era: 'Nature', description: 'Superheated molten stone flowing from the depths.' },
  { id: 'stone', name: 'Stone', icon: '🪨', era: 'Nature', description: 'Hard, durable material cooled from fire and liquid.' },
  { id: 'wood', name: 'Wood', icon: '🪵', era: 'Nature', description: 'Natural construction material harvested from trees.' },
  { id: 'ore', name: 'Ore', icon: '💎', era: 'Nature', description: 'Mineral-rich rock containing raw metals.' },
  { id: 'metal', name: 'Metal', icon: '🔩', era: 'Nature', description: 'Strong, shiny material forged from mineral ores.' },
  { id: 'mountain', name: 'Mountain', icon: '🏔️', era: 'Nature', description: 'A colossal stone formation reaching for the heavens.' },
  { id: 'pressure', name: 'Pressure', icon: '💥', era: 'Nature', description: 'An intense, squeezing weight from deep below.' },
  { id: 'coal', name: 'Coal', icon: '🕳️', era: 'Nature', description: 'Ancient compressed organic matter, perfect for burning.' },
  { id: 'sky', name: 'Sky', icon: '🌤️', era: 'Nature', description: 'The wide blue expanse above the earth.' },
  { id: 'sand', name: 'Sand', icon: '⏳', era: 'Nature', description: 'Fine grains of stone worn down by the wind.' },
  { id: 'glass', name: 'Glass', icon: '🔍', era: 'Nature', description: 'Clear, silica-based pane melted from hot sand.' },
  { id: 'dust', name: 'Dust', icon: '🌫️', era: 'Nature', description: 'Tiny dry particles carried by the air.' },
  { id: 'red-dust', name: 'Red Dust', icon: '🔴', era: 'Nature', description: 'Iron-rich dust that glows with a rusty hue.' },

  // LIFE ERA
  { id: 'life', name: 'Life', icon: '🍀', era: 'Life', description: 'A miraculous, self-sustaining spark in wet soil.' },
  { id: 'fish', name: 'Fish', icon: '🐟', era: 'Life', description: 'A scaled creature swimming peacefully in the deep.' },
  { id: 'bird', name: 'Bird', icon: '🐦', era: 'Life', description: 'A feathered creature soaring through the sky.' },

  // HUMAN ERA
  { id: 'human', name: 'Human', icon: '🧑', era: 'Human', description: 'A curious creature with clever hands and big dreams.' },
  { id: 'tool', name: 'Tool', icon: '🔨', era: 'Human', description: 'An extension of human hands to shape the world.' },
  { id: 'shelter', name: 'Shelter', icon: '⛺', era: 'Human', description: 'A basic, cozy structure to protect from the weather.' },
  { id: 'food', name: 'Food', icon: '🍞', era: 'Human', description: 'Nourishment prepared for sustenance.' },
  { id: 'cooking', name: 'Cooking', icon: '🍳', era: 'Human', description: 'The art of applying heat to ingredients.' },
  { id: 'meal', name: 'Meal', icon: '🍽️', era: 'Human', description: 'A complete, heartwarming feast to enjoy.' },
  { id: 'family', name: 'Family', icon: '👪', era: 'Human', description: 'Loved ones coming together to live and grow.' },

  // CIVILIZATION ERA
  { id: 'house', name: 'House', icon: '🏠', era: 'Civilization', description: 'A warm, permanent home built for comfort.' },
  { id: 'village', name: 'Village', icon: '🏘️', era: 'Civilization', description: 'A cozy cluster of homes sharing a peaceful community.' },
  { id: 'language', name: 'Language', icon: '💬', era: 'Civilization', description: 'Symbols and sounds to share ideas and stories.' },
  { id: 'knowledge', name: 'Knowledge', icon: '📖', era: 'Civilization', description: 'Stored wisdom passed down through generations.' },
  { id: 'school', name: 'School', icon: '🏫', era: 'Civilization', description: 'A dedicated sanctuary of learning.' },
  { id: 'science', name: 'Science', icon: '🔬', era: 'Civilization', description: 'The methodical pursuit of truth and understanding.' },
  { id: 'paper', name: 'Paper', icon: '📄', era: 'Civilization', description: 'A thin sheet of wood fiber, ready for ink.' },
  { id: 'writing', name: 'Writing', icon: '📝', era: 'Civilization', description: 'Permanent records of thoughts and speech.' },
  { id: 'medicine', name: 'Medicine', icon: '💊', era: 'Civilization', description: 'Remedies to cure ailments and soothe pain.' },
  { id: 'map', name: 'Map', icon: '🗺️', era: 'Civilization', description: 'A guide to chart discovered lands.' },
  { id: 'road', name: 'Road', icon: '🛣️', era: 'Civilization', description: 'A paved path connecting distant points.' },
  { id: 'town', name: 'Town', icon: '🌆', era: 'Civilization', description: 'A busy center of commerce and community.' },

  // INDUSTRY ERA
  { id: 'machine', name: 'Machine', icon: '⚙️', era: 'Industry', description: 'A collection of moving parts to automate labor.' },
  { id: 'factory', name: 'Factory', icon: '🏭', era: 'Industry', description: 'A grand workshop of mass production.' },
  { id: 'technology', name: 'Technology', icon: '💻', era: 'Industry', description: 'Advanced tools to calculate and innovate.' },
  { id: 'fuel', name: 'Fuel', icon: '⛽', era: 'Industry', description: 'Highly concentrated energy to power combustion.' },
  { id: 'electricity', name: 'Electricity', icon: '⚡', era: 'Industry', description: 'Harnessed current flowing through wires.' },
  { id: 'computer', name: 'Computer', icon: '🖥️', era: 'Industry', description: 'An electronic device that processes information.' },
  { id: 'wheel', name: 'Wheel', icon: '⚙️', era: 'Industry', description: 'A rolling disc that makes transport easy.' },
  { id: 'engine', name: 'Engine', icon: '🚂', era: 'Industry', description: 'A mechanical heart powered by fuel.' },
  { id: 'vehicle', name: 'Vehicle', icon: '🚗', era: 'Industry', description: 'A mobile carriage to traverse roads quickly.' },
  { id: 'wire', name: 'Wire', icon: '🔌', era: 'Industry', description: 'Metal filaments to transmit electricity.' },
  { id: 'industry', name: 'Industry', icon: '🏭', era: 'Industry', description: 'Large-scale trade and manufacturing systems.' },
  { id: 'network', name: 'Network', icon: '🌐', era: 'Industry', description: 'Interconnected computers sharing information.' },
  { id: 'lens', name: 'Lens', icon: '👓', era: 'Industry', description: 'Curved glass to focus light and see the invisible.' },

  // SPACE ERA
  { id: 'rocket', name: 'Rocket', icon: '🚀', era: 'Space', description: 'A roaring vessel designed to break Earth’s gravity.' },
  { id: 'space', name: 'Space', icon: '🌌', era: 'Space', description: 'The silent, beautiful ocean of stars.' },
  { id: 'mission-control', name: 'Mission Control', icon: '🏢', era: 'Space', description: 'The brain-center coordinating space travel.' },
  { id: 'launch', name: 'Launch', icon: '💥', era: 'Space', description: 'The exciting ignite-and-lift off of a spacecraft.' },
  { id: 'orbit', name: 'Orbit', icon: '💫', era: 'Space', description: 'A stable circular path around a celestial body.' },
  { id: 'astronaut', name: 'Astronaut', icon: '🧑‍🚀', era: 'Space', description: 'A brave traveler visiting the stars.' },
  { id: 'space-mission', name: 'Space Mission', icon: '🛰️', era: 'Space', description: 'An official venture into outer space.' },
  { id: 'telescope', name: 'Telescope', icon: '🔭', era: 'Space', description: 'A tool to gaze upon distant worlds.' },
  { id: 'astronomy', name: 'Astronomy', icon: '🪐', era: 'Space', description: 'The study of stars, planets, and the cosmos.' },
  { id: 'planet', name: 'Planet', icon: '🪐', era: 'Space', description: 'A celestial ball of stone and atmosphere.' },
  { id: 'mars', name: 'Mars', icon: '🪐🔴', era: 'Space', description: 'Our beautiful, dusty red cosmic neighbor.' },
  { id: 'mars-landing', name: 'Mars Landing', icon: '🚀🔴', era: 'Space', description: 'Humankind’s greatest achievement: setting foot on Mars!' }
];

export const STARTING_ELEMENTS = ['air', 'earth', 'fire', 'water'];
