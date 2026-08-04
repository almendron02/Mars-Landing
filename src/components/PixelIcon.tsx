import React from 'react';

interface PixelIconProps {
  id: string;
  size?: number;
  className?: string;
}

export default function PixelIcon({ id, size = 48, className = "" }: PixelIconProps) {
  // Normalize the ID
  const normId = id.toLowerCase().replace(/_/g, '-');

  // Common colors to reuse
  const colors = {
    outline: '#24211E',
    white: '#FFFFFF',
    greyLight: '#D1CDC7',
    greyMedium: '#8F8A83',
    greyDark: '#56514A',
    blueWater: '#4B7FB5',
    blueSky: '#99CCE5',
    greenLight: '#A3D36C',
    greenDark: '#5E8F33',
    redMars: '#C2503C',
    redDark: '#8F2E21',
    orangeFire: '#F28A22',
    yellowGold: '#F5C63C',
    yellowLight: '#FCED74',
    brownEarth: '#96613B',
    brownDark: '#663B1C',
    purpleSpace: '#5E4B8C',
    purpleDark: '#35255C',
    creamPaper: '#FDF8F0',
  };

  // SVG dimensions: we'll use a 24x24 grid viewport, which renders perfectly as pixel art!
  // Setting shapeRendering="crispEdges" makes it look incredibly blocky and pixel-perfect.
  
  const renderIcon = () => {
    switch (normId) {
      case 'air':
        return (
          <>
            {/* Air: Whimsical pixel-art wind streams */}
            <path d="M2 7h14 M5 11h15 M1 15h11" stroke={colors.outline} strokeWidth="2" strokeLinecap="round" />
            <path d="M2 6h8 M5 10h12 M1 14h6" stroke={colors.white} strokeWidth="1" strokeLinecap="round" />
          </>
        );
      case 'earth':
        return (
          <>
            {/* Earth: Circular planet globe with landmasses */}
            <circle cx="12" cy="12" r="9" fill={colors.blueWater} stroke={colors.outline} strokeWidth="2" />
            <path d="M7 9c1-1 3-1 4 1s0 3-2 3c-1 0-1-1-2-1s-1-1 0-3z" fill={colors.greenLight} />
            <path d="M14 11c1-1 2-2 3-1s1 3-1 4c-2 1-3 0-3-1s0-1 1-2z" fill={colors.greenLight} />
            <path d="M9 15c0-1 2-2 3-1s1 2 0 3-2 1-3-1z" fill={colors.greenLight} />
            <circle cx="12" cy="12" r="9" fill="none" stroke={colors.outline} strokeWidth="2" />
          </>
        );
      case 'fire':
        return (
          <>
            {/* Fire: Layered flickering flame */}
            <path d="M12 2C9 5 6 9 6 13a6 6 0 0012 0c0-4-3-8-6-11z" fill={colors.redMars} stroke={colors.outline} strokeWidth="2" />
            <path d="M12 5c-2 2-4 5-4 8a4 4 0 008 0c0-3-2-6-4-8z" fill={colors.orangeFire} />
            <path d="M12 9c-1 1-2 2-2 4a2 2 0 004 0c0-2-1-3-2-4z" fill={colors.yellowGold} />
          </>
        );
      case 'water':
        return (
          <>
            {/* Water: Teardrop droplet */}
            <path d="M12 3c0 0-7 6-7 11a7 7 0 0014 0c0-5-7-11-7-11z" fill={colors.blueWater} stroke={colors.outline} strokeWidth="2" />
            <circle cx="10" cy="12" r="1.5" fill={colors.white} />
          </>
        );
      case 'sky':
        return (
          <>
            {/* Sky: Sun disk behind a cute cloud */}
            <circle cx="15" cy="9" r="6" fill={colors.yellowGold} stroke={colors.outline} strokeWidth="2" />
            <path d="M5 17h11a3 3 0 000-6 3 3 0 00-3-3 4 4 0 00-4 4 3 3 0 00-4 5z" fill={colors.white} stroke={colors.outline} strokeWidth="2" />
          </>
        );
      case 'rain':
        return (
          <>
            {/* Rain: Dark cloud with raindrops */}
            <path d="M6 13h12a3 3 0 000-6 3 3 0 00-3-3 4 4 0 00-4 4 3 3 0 00-5 5z" fill={colors.greyLight} stroke={colors.outline} strokeWidth="2" />
            <path d="M7 17l-1 3 M11 17l-1 3 M15 17l-1 3" stroke={colors.blueWater} strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'dust':
        return (
          <>
            {/* Dust: Small specks of particles */}
            <rect x="4" y="6" width="2" height="2" fill={colors.brownEarth} />
            <rect x="18" y="8" width="2" height="2" fill={colors.brownDark} />
            <rect x="9" y="12" width="2" height="2" fill={colors.brownEarth} />
            <rect x="14" y="18" width="2" height="2" fill={colors.brownDark} />
            <rect x="5" y="16" width="2" height="2" fill={colors.greyMedium} />
          </>
        );
      case 'mud':
        return (
          <>
            {/* Mud: Wet sludge pile */}
            <path d="M3 18c0-3 3-4 6-4s4 1 6 1 4-2 6-1 1 4-1 4H4c-1 0-1 0-1-4z" fill={colors.brownEarth} stroke={colors.outline} strokeWidth="2" />
            <path d="M8 15h8 M4 17h12" stroke={colors.brownDark} strokeWidth="1" />
          </>
        );
      case 'lava':
        return (
          <>
            {/* Lava: Volcano overflowing */}
            <path d="M4 19l4-10h8l4 10H4z" fill={colors.brownEarth} stroke={colors.outline} strokeWidth="2" />
            <path d="M10 9h4c1 1 2 2 1 4s-2 2-3 2c-2 0-2-2-2-6z" fill={colors.orangeFire} />
            <path d="M11 9h2l1 2-1 1-1-1-1-2z" fill={colors.yellowLight} />
            {/* Crater smoke */}
            <circle cx="12" cy="6" r="1.5" fill={colors.greyLight} />
          </>
        );
      case 'energy':
        return (
          <>
            {/* Energy: Lightning bolt */}
            <path d="M15 2L5 12h7l-3 10L19 10h-7L15 2z" fill={colors.yellowLight} stroke={colors.outline} strokeWidth="2" strokeLinejoin="round" />
          </>
        );
      case 'steam':
        return (
          <>
            {/* Steam: Wavy steam lines */}
            <path d="M7 19c-1-2-1-4 1-5s2-3 1-5M12 20c-1-3 0-5 1-6s1-3-1-5M17 19c-1-2-1-4 1-5s2-3 1-5" stroke={colors.greyLight} strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M7 19c-1-2-1-4 1-5s2-3 1-5M12 20c-1-3 0-5 1-6s1-3-1-5M17 19c-1-2-1-4 1-5s2-3 1-5" stroke={colors.white} strokeWidth="1" strokeLinecap="round" fill="none" />
          </>
        );
      case 'stone':
        return (
          <>
            {/* Stone: Gray boulder */}
            <path d="M7 5l8-2 6 6-2 9-11 3L2 14 7 5z" fill={colors.greyLight} stroke={colors.outline} strokeWidth="2" />
            <path d="M7 5l4 6 10-3 M2 14l9-3v10" stroke={colors.outline} strokeWidth="1.5" />
          </>
        );
      case 'sand':
        return (
          <>
            {/* Sand: Sand dune/hourglass/mound */}
            <path d="M3 19c3-4 6-4 9-2s5-3 9 2H3z" fill={colors.yellowGold} stroke={colors.outline} strokeWidth="2" />
            <path d="M3 18c3-4 6-4 9-2s5-3 9 2H3z" fill={colors.yellowLight} opacity="0.4" />
          </>
        );
      case 'glass':
        return (
          <>
            {/* Glass: Translucent magnifying lens */}
            <circle cx="10" cy="10" r="7" fill={colors.blueSky} stroke={colors.outline} strokeWidth="2" />
            <path d="M15 15l6 6" stroke={colors.outline} strokeWidth="3" strokeLinecap="round" />
            <path d="M7 7a5 5 0 015 0" stroke={colors.white} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'mountain':
        return (
          <>
            {/* Mountain: Pine peaked snowy mountain */}
            <path d="M2 19l8-15 4 7 6 8H2z" fill={colors.greenDark} stroke={colors.outline} strokeWidth="2" />
            <path d="M10 4l2.5 4.5-1.5 1-1.5-1.5L8 10 10 4z" fill={colors.white} stroke={colors.outline} strokeWidth="1.5" />
          </>
        );
      case 'pressure':
        return (
          <>
            {/* Pressure: High energy spark bursting */}
            <path d="M12 2v4 M12 18v4 M2 12h4 M18 12h4 M5 5l3 3 M16 16l3 3 M19 5l-3 3 M8 16l-3 3" stroke={colors.outline} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="12" cy="12" r="4" fill={colors.redMars} stroke={colors.outline} strokeWidth="2" />
          </>
        );
      case 'desert':
        return (
          <>
            {/* Desert: Sand dune with cactus */}
            <path d="M1 18c4-3 9-3 13-1s5-3 9-1H1z" fill={colors.yellowGold} stroke={colors.outline} strokeWidth="2" />
            {/* Cactus */}
            <path d="M16 14v-5h1 M17 10v-3 M18 11v-4" stroke={colors.greenDark} strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'ash':
        return (
          <>
            {/* Ash: Pile of grey cinders */}
            <path d="M4 19c2-2 5-3 8-3s6 1 8 3H4z" fill={colors.greyMedium} stroke={colors.outline} strokeWidth="2" />
            <circle cx="10" cy="18" r="1" fill={colors.greyLight} />
            <circle cx="14" cy="17" r="1.2" fill={colors.greyLight} />
          </>
        );
      case 'plant':
        return (
          <>
            {/* Plant: Green sprout */}
            <path d="M12 20V10" stroke={colors.brownDark} strokeWidth="2" strokeLinecap="round" />
            <path d="M12 12c-2-1-4-1-4 2s2 2 4-2zm0 4c2-1 4-1 4 2s-2 2-4-2z" fill={colors.greenLight} stroke={colors.outline} strokeWidth="1.5" />
          </>
        );
      case 'seed':
        return (
          <>
            {/* Seed: Cute acorn/nut */}
            <path d="M12 6c3 0 5 3 5 6s-2 6-5 6-5-3-5-6 2-6 5-6z" fill={colors.brownEarth} stroke={colors.outline} strokeWidth="2" />
            <path d="M7 11a5 5 0 0110 0v-2H7v2z" fill={colors.brownDark} stroke={colors.outline} strokeWidth="1.5" />
            <path d="M12 6V3" stroke={colors.outline} strokeWidth="1.5" />
          </>
        );
      case 'tree':
        return (
          <>
            {/* Tree: Green tree trunk */}
            <path d="M12 20v-7" stroke={colors.brownDark} strokeWidth="3" strokeLinecap="round" />
            <circle cx="12" cy="9" r="6" fill={colors.greenDark} stroke={colors.outline} strokeWidth="2" />
            <circle cx="10" cy="7" r="3" fill={colors.greenLight} />
          </>
        );
      case 'wood':
        return (
          <>
            {/* Wood: Cute log segment */}
            <rect x="4" y="8" width="16" height="8" rx="2" fill={colors.brownEarth} stroke={colors.outline} strokeWidth="2" />
            <ellipse cx="20" cy="12" rx="1.5" ry="3" fill={colors.brownDark} />
            <path d="M7 12h8" stroke={colors.brownDark} strokeWidth="1.5" />
          </>
        );
      case 'crop':
        return (
          <>
            {/* Crop: Stalk of wheat */}
            <path d="M12 21V5" stroke={colors.yellowGold} strokeWidth="2" />
            <path d="M12 6l-3-2 M12 6l3-2 M12 10l-3-2 M12 10l3-2 M12 14l-3-2 M12 14l3-2" stroke={colors.yellowLight} strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'life':
        return (
          <>
            {/* Life: Radiant golden cross / clover */}
            <path d="M12 2v20M2 12h20" stroke={colors.yellowLight} strokeWidth="4" strokeLinecap="round" />
            <circle cx="12" cy="12" r="5" fill={colors.greenLight} stroke={colors.outline} strokeWidth="2" />
            <path d="M12 4v16M4 12h16" stroke={colors.outline} strokeWidth="1.5" />
          </>
        );
      case 'animal':
        return (
          <>
            {/* Animal: Cute pixel bear/dog */}
            <rect x="5" y="7" width="14" height="11" rx="3" fill={colors.brownEarth} stroke={colors.outline} strokeWidth="2" />
            <circle cx="7" cy="6" r="2.5" fill={colors.brownDark} stroke={colors.outline} strokeWidth="1.5" />
            <circle cx="17" cy="6" r="2.5" fill={colors.brownDark} stroke={colors.outline} strokeWidth="1.5" />
            {/* Eyes */}
            <circle cx="9" cy="11" r="1" fill={colors.outline} />
            <circle cx="15" cy="11" r="1" fill={colors.outline} />
            {/* Snout */}
            <ellipse cx="12" cy="14" rx="2.5" ry="1.5" fill={colors.yellowLight} stroke={colors.outline} strokeWidth="1" />
          </>
        );
      case 'fish':
        return (
          <>
            {/* Fish: Blue aquatic fish */}
            <path d="M4 12c2-4 7-4 11 0s-9 4-11 0z" fill={colors.blueWater} stroke={colors.outline} strokeWidth="2" />
            {/* Tail */}
            <path d="M15 12l5-3v6z" fill={colors.blueWater} stroke={colors.outline} strokeWidth="2" strokeLinejoin="round" />
            <circle cx="7" cy="11" r="1" fill={colors.white} />
          </>
        );
      case 'bird':
        return (
          <>
            {/* Bird: High flier bird */}
            <path d="M3 11c3-4 6-2 9 1 3-3 6-5 9-1 M12 12V18" stroke={colors.outline} strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M3 10c3-4 6-2 9 1 3-3 6-5 9-1" stroke={colors.blueSky} strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </>
        );
      case 'forest':
        return (
          <>
            {/* Forest: Multiple cozy trees */}
            <path d="M4 19l4-8 2 3 5-6 6 11H4z" fill={colors.greenDark} stroke={colors.outline} strokeWidth="2" />
            <path d="M12 19V11" stroke={colors.brownDark} strokeWidth="1.5" />
          </>
        );
      case 'paper':
        return (
          <>
            {/* Paper: Document with a folded corner */}
            <path d="M5 4h10l4 4v12H5V4z" fill={colors.white} stroke={colors.outline} strokeWidth="2" />
            <path d="M15 4v4h4" fill="none" stroke={colors.outline} strokeWidth="1.5" />
            <path d="M8 9h4 M8 13h8 M8 16h6" stroke={colors.greyMedium} strokeWidth="1.5" strokeLinecap="round" />
          </>
        );
      case 'human':
        return (
          <>
            {/* Human: Cozy pixel explorer */}
            <circle cx="12" cy="8" r="4.5" fill={colors.yellowLight} stroke={colors.outline} strokeWidth="2" />
            <path d="M6 19c0-3 3-5 6-5s6 2 6 5v1H6v-1z" fill={colors.brownEarth} stroke={colors.outline} strokeWidth="2" />
            {/* Red scarf */}
            <path d="M9 13h6" stroke={colors.redMars} strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'language':
        return (
          <>
            {/* Language: Retro speech bubble */}
            <path d="M4 6h16v10H9l-5 4v-4H4V6z" fill={colors.white} stroke={colors.outline} strokeWidth="2" strokeLinejoin="round" />
            <circle cx="8" cy="11" r="1" fill={colors.greyDark} />
            <circle cx="12" cy="11" r="1" fill={colors.greyDark} />
            <circle cx="16" cy="11" r="1" fill={colors.greyDark} />
          </>
        );
      case 'knowledge':
        return (
          <>
            {/* Knowledge: Heavy magic textbook */}
            <rect x="4" y="5" width="16" height="14" rx="2" fill={colors.redMars} stroke={colors.outline} strokeWidth="2" />
            <path d="M12 5v14" stroke={colors.outline} strokeWidth="1.5" />
            {/* White pages */}
            <path d="M6 7h4M6 11h4M14 7h4M14 11h4" stroke={colors.white} strokeWidth="1.5" strokeLinecap="round" />
          </>
        );
      case 'tool':
        return (
          <>
            {/* Tool: Iron hammer */}
            <path d="M6 18l10-10" stroke={colors.brownEarth} strokeWidth="3" strokeLinecap="round" />
            <path d="M13 5l6 6" stroke={colors.greyMedium} strokeWidth="4" strokeLinecap="round" />
            <path d="M13 5l6 6" stroke={colors.outline} strokeWidth="4" strokeLinecap="round" opacity="0.3" />
            <path d="M15 4l5 5" stroke={colors.greyDark} strokeWidth="2.5" />
          </>
        );
      case 'farming':
        return (
          <>
            {/* Farming: Plowing pitchfork */}
            <path d="M12 21V9 M9 9h6 M9 9V4 M12 9V4 M15 9V4" stroke={colors.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="12" cy="15" r="1.5" fill={colors.yellowGold} />
          </>
        );
      case 'food':
        return (
          <>
            {/* Food: Slice of swiss cheese */}
            <path d="M4 16L18 5v11H4z" fill={colors.yellowLight} stroke={colors.outline} strokeWidth="2" strokeLinejoin="round" />
            <circle cx="9" cy="13" r="1" fill={colors.yellowGold} />
            <circle cx="13" cy="11" r="1.5" fill={colors.yellowGold} />
            <circle cx="15" cy="14" r="1" fill={colors.yellowGold} />
          </>
        );
      case 'cooking':
        return (
          <>
            {/* Cooking: Sizzling pan with fried egg */}
            <path d="M3 13a6 6 0 0011.5 2.5L20 21" stroke={colors.outline} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="9" cy="12" r="5" fill={colors.greyDark} stroke={colors.outline} strokeWidth="1.5" />
            <circle cx="9" cy="12" r="2" fill={colors.white} />
            <circle cx="9" cy="12" r="1" fill={colors.yellowGold} />
          </>
        );
      case 'meal':
        return (
          <>
            {/* Meal: Retro steaming hot bowl of soup */}
            <path d="M4 10h16a1 1 0 011 1 8 8 0 01-18 0 1 1 0 011-1z" fill={colors.orangeFire} stroke={colors.outline} strokeWidth="2" />
            <path d="M8 6c0-2 1-3 1-3M12 6c0-2 1-3 1-3M16 6c0-2 1-3 1-3" stroke={colors.greyLight} strokeWidth="1.5" strokeLinecap="round" />
          </>
        );
      case 'shelter':
        return (
          <>
            {/* Shelter: Campfire Tent */}
            <path d="M2 18l10-14 10 14H2z" fill={colors.yellowGold} stroke={colors.outline} strokeWidth="2" />
            {/* Doorflap */}
            <path d="M12 10l5 8H7l5-8z" fill={colors.brownDark} stroke={colors.outline} strokeWidth="1.5" />
          </>
        );
      case 'family':
        return (
          <>
            {/* Family: Three modular pixel people */}
            <circle cx="7" cy="9" r="2.5" fill={colors.yellowLight} stroke={colors.outline} strokeWidth="1.5" />
            <path d="M4 18c0-2 1.5-3 3-3s3 1 3 3v1H4v-1z" fill={colors.blueWater} stroke={colors.outline} strokeWidth="1.5" />
            <circle cx="17" cy="9" r="2.5" fill={colors.yellowLight} stroke={colors.outline} strokeWidth="1.5" />
            <path d="M14 18c0-2 1.5-3 3-3s3 1 3 3v1h-6v-1z" fill={colors.greenDark} stroke={colors.outline} strokeWidth="1.5" />
          </>
        );
      case 'house':
        return (
          <>
            {/* House: Cute suburban home */}
            <rect x="5" y="11" width="14" height="8" fill={colors.creamPaper} stroke={colors.outline} strokeWidth="2" />
            <path d="M3 11l9-8 9 8H3z" fill={colors.redMars} stroke={colors.outline} strokeWidth="2" strokeLinejoin="round" />
            <rect x="10" y="14" width="4" height="5" fill={colors.brownEarth} stroke={colors.outline} strokeWidth="1.5" />
          </>
        );
      case 'village':
        return (
          <>
            {/* Village: Group of small houses */}
            <rect x="3" y="13" width="8" height="6" fill={colors.creamPaper} stroke={colors.outline} strokeWidth="1.5" />
            <path d="M2 13l4.5-4 4.5 4H2z" fill={colors.redMars} stroke={colors.outline} strokeWidth="1.5" />
            <rect x="13" y="11" width="8" height="8" fill={colors.greyLight} stroke={colors.outline} strokeWidth="1.5" />
            <path d="M12 11l4.5-4 4.5 4h-9z" fill={colors.blueWater} stroke={colors.outline} strokeWidth="1.5" />
          </>
        );
      case 'writing':
        return (
          <>
            {/* Writing: Ink quill and parchment scroll */}
            <path d="M4 18l6-13 M18 4l-4 4" stroke={colors.outline} strokeWidth="2" strokeLinecap="round" />
            <path d="M4 18l3-3 M18 4l-4 4" stroke={colors.greyMedium} strokeWidth="1" strokeLinecap="round" />
            <rect x="12" y="14" width="8" height="5" rx="1" fill={colors.white} stroke={colors.outline} strokeWidth="1.5" />
          </>
        );
      case 'school':
        return (
          <>
            {/* School: Academy of science */}
            <rect x="4" y="9" width="16" height="10" fill={colors.redMars} stroke={colors.outline} strokeWidth="2" />
            <path d="M10 3l2-1 2 1v6h-4V3z" fill={colors.yellowGold} stroke={colors.outline} strokeWidth="1.5" />
            <rect x="11" y="14" width="2" height="5" fill={colors.outline} />
          </>
        );
      case 'science':
        return (
          <>
            {/* Science: Chemical lab beaker */}
            <path d="M9 4h6v2l-5 11h-2L9 4z" fill="none" />
            <path d="M8 4h8 M12 4v4 M6 18l4-10V4h4v4l4 10a2 2 0 01-2 2H8a2 2 0 01-2-2z" fill="none" stroke={colors.outline} strokeWidth="2" strokeLinejoin="round" />
            <path d="M7 15h10v3H7v-3z" fill={colors.blueSky} />
            <circle cx="10" cy="11" r="1" fill={colors.white} />
          </>
        );
      case 'medicine':
        return (
          <>
            {/* Medicine: Cute red and white pharmaceutical capsule */}
            <rect x="6" y="9" width="12" height="6" rx="3" transform="rotate(-45 12 12)" fill={colors.redMars} stroke={colors.outline} strokeWidth="2" />
            <rect x="12" y="9" width="6" height="6" rx="1" transform="rotate(-45 12 12)" fill={colors.white} />
            <rect x="6" y="9" width="12" height="6" rx="3" transform="rotate(-45 12 12)" fill="none" stroke={colors.outline} strokeWidth="2" />
          </>
        );
      case 'map':
        return (
          <>
            {/* Map: Cartographer scroll */}
            <rect x="4" y="6" width="16" height="12" rx="1" fill={colors.yellowLight} stroke={colors.outline} strokeWidth="2" />
            <path d="M7 10c1-1 3 0 4 2s2 0 2-2" fill="none" stroke={colors.brownEarth} strokeWidth="1.5" />
            <path d="M15 14l3-3 M18 14l-3-3" stroke={colors.redMars} strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'road':
        return (
          <>
            {/* Road: Paved lanes */}
            <path d="M4 20L10 4h4l6 16H4z" fill={colors.greyMedium} stroke={colors.outline} strokeWidth="2" />
            <path d="M12 4v16" stroke={colors.yellowGold} strokeWidth="1.5" strokeDasharray="3 3" />
          </>
        );
      case 'town':
        return (
          <>
            {/* Town: Skylines */}
            <rect x="3" y="10" width="5" height="9" fill={colors.greyDark} stroke={colors.outline} strokeWidth="1.5" />
            <rect x="9" y="5" width="6" height="14" fill={colors.greyMedium} stroke={colors.outline} strokeWidth="1.5" />
            <rect x="16" y="8" width="5" height="11" fill={colors.greyDark} stroke={colors.outline} strokeWidth="1.5" />
          </>
        );
      case 'ore':
        return (
          <>
            {/* Ore: Mining rock with gold veins */}
            <path d="M3 13l5-10 8 2 5 10-6 6H6l-3-8z" fill={colors.brownEarth} stroke={colors.outline} strokeWidth="2" />
            <rect x="7" y="7" width="2" height="2" fill={colors.yellowLight} />
            <rect x="14" y="9" width="3" height="2" fill={colors.yellowLight} />
            <rect x="10" y="14" width="2" height="2" fill={colors.yellowLight} />
          </>
        );
      case 'metal':
        return (
          <>
            {/* Metal: Shiny steel block */}
            <rect x="4" y="6" width="16" height="12" rx="2" fill={colors.greyLight} stroke={colors.outline} strokeWidth="2" />
            <path d="M5 7l14 4 M5 12l14 4" stroke={colors.white} strokeWidth="1.5" opacity="0.6" />
          </>
        );
      case 'coal':
        return (
          <>
            {/* Coal: Smoldering carbon block */}
            <path d="M5 5l8-3 7 5-2 11-10 3L3 13 5 5z" fill={colors.greyDark} stroke={colors.outline} strokeWidth="2" />
            <path d="M6 7l6 3 M10 16l6-3" stroke={colors.outline} strokeWidth="1.5" />
          </>
        );
      case 'fuel':
        return (
          <>
            {/* Fuel: Red jerrycan */}
            <rect x="6" y="8" width="12" height="11" rx="1.5" fill={colors.redMars} stroke={colors.outline} strokeWidth="2" />
            <path d="M12 8V5h3" stroke={colors.outline} strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle cx="12" cy="13" r="2.5" fill={colors.white} stroke={colors.outline} strokeWidth="1.5" />
          </>
        );
      case 'wheel':
        return (
          <>
            {/* Wheel: Spoked wheel */}
            <circle cx="12" cy="12" r="8" fill="none" stroke={colors.outline} strokeWidth="2.5" />
            <circle cx="12" cy="12" r="2" fill={colors.brownDark} />
            <path d="M12 4v16M4 12h16M6 6l12 12M6 18l12-12" stroke={colors.outline} strokeWidth="1.5" />
          </>
        );
      case 'machine':
        return (
          <>
            {/* Machine: Interlocking cogs */}
            <circle cx="10" cy="10" r="4.5" fill={colors.greyMedium} stroke={colors.outline} strokeWidth="2" />
            <circle cx="16" cy="15" r="3.5" fill={colors.greyLight} stroke={colors.outline} strokeWidth="1.5" />
            {/* Teeth */}
            <path d="M10 4v3M10 13v3M4 10h3M13 10h3" stroke={colors.outline} strokeWidth="2" />
          </>
        );
      case 'electricity':
        return (
          <>
            {/* Electricity: Yellow incandescent bulb */}
            <path d="M12 4a5 5 0 00-5 5c0 3 2 4.5 3 6h4c1-1.5 3-3 3-5a5 5 0 00-5-5z" fill={colors.yellowLight} stroke={colors.outline} strokeWidth="2" />
            <rect x="10" y="16" width="4" height="4" fill={colors.greyLight} stroke={colors.outline} strokeWidth="1.5" />
            <path d="M12 8v4" stroke={colors.orangeFire} strokeWidth="1.5" strokeLinecap="round" />
          </>
        );
      case 'wire':
        return (
          <>
            {/* Wire: Copper filament */}
            <path d="M3 12h18" stroke={colors.greyDark} strokeWidth="3" strokeLinecap="round" />
            <path d="M8 9h8" stroke={colors.yellowGold} strokeWidth="1" />
            <circle cx="12" cy="12" r="2" fill={colors.redMars} />
          </>
        );
      case 'engine':
        return (
          <>
            {/* Engine: Industrial core motor */}
            <rect x="4" y="8" width="12" height="10" fill={colors.greyDark} stroke={colors.outline} strokeWidth="2" />
            <circle cx="16" cy="13" r="3" fill={colors.greyLight} stroke={colors.outline} strokeWidth="1.5" />
            <path d="M8 8V5h4v3" stroke={colors.outline} strokeWidth="1.5" fill="none" />
          </>
        );
      case 'vehicle':
        return (
          <>
            {/* Vehicle: Cozy retro car */}
            <path d="M3 15h18a1 1 0 001-1v-4a4 4 0 00-4-4H8a4 4 0 00-4 4v4a1 1 0 001 1z" fill={colors.redMars} stroke={colors.outline} strokeWidth="2" />
            <circle cx="7" cy="16" r="2.5" fill={colors.greyDark} stroke={colors.outline} strokeWidth="1.5" />
            <circle cx="17" cy="16" r="2.5" fill={colors.greyDark} stroke={colors.outline} strokeWidth="1.5" />
            <rect x="7" y="9" width="4" height="3" fill={colors.blueSky} />
            <rect x="13" y="9" width="4" height="3" fill={colors.blueSky} />
          </>
        );
      case 'factory':
        return (
          <>
            {/* Factory: Brick chimneys */}
            <path d="M3 18V10l4 4V10l4 4V10l4 4h4v4H3z" fill={colors.redMars} stroke={colors.outline} strokeWidth="2" />
            <rect x="16" y="5" width="2" height="5" fill={colors.greyDark} stroke={colors.outline} strokeWidth="1.5" />
            <path d="M17 3c1-1 2 0 1 1s-1-1-1-1z" fill={colors.greyLight} />
          </>
        );
      case 'industry':
        return (
          <>
            {/* Industry: Manufacturing hubs */}
            <rect x="3" y="11" width="8" height="8" fill={colors.greyMedium} stroke={colors.outline} strokeWidth="1.5" />
            <rect x="12" y="8" width="9" height="11" fill={colors.greyDark} stroke={colors.outline} strokeWidth="1.5" />
            <circle cx="7" cy="14" r="1.5" fill={colors.yellowLight} />
            <circle cx="16" cy="12" r="1.5" fill={colors.yellowLight} />
          </>
        );
      case 'technology':
      case 'computer':
        return (
          <>
            {/* Technology / Computer: Retro desktop monitor with terminal green screen */}
            <rect x="4" y="5" width="16" height="11" rx="1.5" fill={colors.greyLight} stroke={colors.outline} strokeWidth="2" />
            <rect x="6" y="7" width="12" height="7" fill={colors.greyDark} />
            {/* Green line inside terminal */}
            <path d="M8 10h4" stroke={colors.greenLight} strokeWidth="1.5" />
            {/* Stand */}
            <path d="M10 16h4v2H10v-2z" fill={colors.outline} />
            <path d="M7 18h10" stroke={colors.outline} strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'network':
        return (
          <>
            {/* Network: Nodes connecting */}
            <path d="M6 16l6-8 6 8M6 16h12" stroke={colors.outline} strokeWidth="1.5" />
            <circle cx="12" cy="7" r="2.5" fill={colors.greenLight} stroke={colors.outline} strokeWidth="1.5" />
            <circle cx="6" cy="16" r="2.5" fill={colors.greenLight} stroke={colors.outline} strokeWidth="1.5" />
            <circle cx="18" cy="16" r="2.5" fill={colors.greenLight} stroke={colors.outline} strokeWidth="1.5" />
          </>
        );
      case 'lens':
        return (
          <>
            {/* Lens: Refractor scope */}
            <circle cx="12" cy="12" r="7" fill="none" stroke={colors.outline} strokeWidth="2.5" />
            <path d="M12 5a7 7 0 017 7" stroke={colors.blueSky} strokeWidth="2" fill="none" />
          </>
        );
      case 'rocket':
        return (
          <>
            {/* Rocket: Classic spaceship booster */}
            <path d="M12 3c0 0-4 4-4 10h8c0-6-4-10-4-10z" fill={colors.white} stroke={colors.outline} strokeWidth="2" />
            {/* Red tip */}
            <path d="M12 3c0 0-2 2-2 4h4c0-2-2-4-2-4z" fill={colors.redMars} stroke={colors.outline} strokeWidth="1.5" />
            {/* Wings */}
            <path d="M8 13l-3 4v-4h3zm8 0l3 4v-4h-3z" fill={colors.redMars} stroke={colors.outline} strokeWidth="1.5" />
            {/* Thruster exhaust */}
            <path d="M11 16l1 4 1-4h-2z" fill={colors.orangeFire} />
          </>
        );
      case 'space':
        return (
          <>
            {/* Space: Dark velvet galaxy with twinkles */}
            <rect x="3" y="3" width="18" height="18" rx="3" fill={colors.purpleDark} stroke={colors.outline} strokeWidth="2" />
            {/* Twinkling stars */}
            <circle cx="7" cy="8" r="1.2" fill={colors.yellowLight} />
            <circle cx="16" cy="7" r="0.8" fill={colors.white} />
            <circle cx="15" cy="15" r="1.5" fill={colors.blueSky} />
            <circle cx="8" cy="16" r="0.6" fill={colors.white} />
          </>
        );
      case 'mission-control':
        return (
          <>
            {/* Mission Control: High technology dishes */}
            <rect x="5" y="10" width="14" height="9" fill={colors.greyLight} stroke={colors.outline} strokeWidth="2" />
            {/* Radar dish */}
            <path d="M8 10V6M5 5c0-2 6-2 6 0" stroke={colors.outline} strokeWidth="1.5" fill="none" />
          </>
        );
      case 'launch':
        return (
          <>
            {/* Launch: Fire plumes bursting upwards */}
            <path d="M12 21c-4 0-7-4-7-8 0-5 7-11 7-11s7 6 7 11c0 4-3 8-7 8z" fill={colors.orangeFire} stroke={colors.outline} strokeWidth="2" />
            <path d="M12 19c-2.5 0-4.5-2.5-4.5-5 0-3 4.5-7 4.5-7s4.5 4 4.5 7c0 2.5-2 5-4.5 5z" fill={colors.yellowLight} />
          </>
        );
      case 'orbit':
        return (
          <>
            {/* Orbit: Flying satellites around gravity fields */}
            <circle cx="12" cy="12" r="5" fill={colors.blueWater} stroke={colors.outline} strokeWidth="2" />
            {/* Planetary Ring */}
            <ellipse cx="12" cy="12" rx="9" ry="2.5" fill="none" stroke={colors.yellowGold} strokeWidth="2" transform="rotate(-15 12 12)" />
          </>
        );
      case 'astronaut':
        return (
          <>
            {/* Astronaut: Reflective blue bubble helmet */}
            <circle cx="12" cy="11" r="7" fill={colors.white} stroke={colors.outline} strokeWidth="2" />
            {/* Visor */}
            <ellipse cx="12" cy="10" rx="4.5" ry="3" fill={colors.blueWater} stroke={colors.outline} strokeWidth="1.5" />
            <path d="M10 9a1.5 1.5 0 012 0" stroke={colors.white} strokeWidth="1" fill="none" />
          </>
        );
      case 'space-mission':
        return (
          <>
            {/* Space Mission: Interactive solar probe */}
            <rect x="10" y="8" width="4" height="8" fill={colors.greyMedium} stroke={colors.outline} strokeWidth="1.5" />
            {/* Solar panels */}
            <rect x="3" y="10" width="7" height="4" fill={colors.blueSky} stroke={colors.outline} strokeWidth="1.5" />
            <rect x="14" y="10" width="7" height="4" fill={colors.blueSky} stroke={colors.outline} strokeWidth="1.5" />
          </>
        );
      case 'telescope':
        return (
          <>
            {/* Telescope: Stellar scanner on tripod */}
            <path d="M6 14l10-10" stroke={colors.greyMedium} strokeWidth="4" strokeLinecap="round" />
            <path d="M6 14l10-10" stroke={colors.outline} strokeWidth="4" strokeLinecap="round" opacity="0.2" />
            <path d="M10 10l-4 8 M12 11l4 7" stroke={colors.outline} strokeWidth="1.5" />
          </>
        );
      case 'astronomy':
        return (
          <>
            {/* Astronomy: Stars of the universe */}
            <path d="M12 2l2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill={colors.yellowGold} stroke={colors.outline} strokeWidth="1.5" />
            <circle cx="6" cy="6" r="1" fill={colors.white} />
            <circle cx="18" cy="16" r="1.2" fill={colors.blueSky} />
          </>
        );
      case 'planet':
        return (
          <>
            {/* Planet: Ringed Saturn purple */}
            <circle cx="12" cy="12" r="6" fill={colors.purpleSpace} stroke={colors.outline} strokeWidth="2" />
            <ellipse cx="12" cy="12" rx="10" ry="2" fill="none" stroke={colors.yellowGold} strokeWidth="2" transform="rotate(-15 12 12)" />
          </>
        );
      case 'red-dust':
        return (
          <>
            {/* Red Dust: Martian sand particles */}
            <circle cx="6" cy="8" r="1" fill={colors.redMars} />
            <circle cx="16" cy="10" r="1.5" fill={colors.orangeFire} />
            <circle cx="10" cy="15" r="1.2" fill={colors.redMars} />
            <circle cx="15" cy="16" r="1" fill={colors.redMars} />
          </>
        );
      case 'mars':
        return (
          <>
            {/* Mars: Red Planet with crater shading */}
            <circle cx="12" cy="12" r="9" fill={colors.redMars} stroke={colors.outline} strokeWidth="2" />
            <circle cx="15" cy="9" r="2.2" fill={colors.redDark} opacity="0.6" />
            <circle cx="9" cy="14" r="1.5" fill={colors.redDark} opacity="0.6" />
            <circle cx="8" cy="8" r="1" fill={colors.redDark} opacity="0.4" />
            <circle cx="12" cy="12" r="9" fill="none" stroke={colors.outline} strokeWidth="2" />
          </>
        );
      case 'mars-landing':
        return (
          <>
            {/* Mars Landing: Red planet with a cute flag planted */}
            <circle cx="12" cy="12" r="9" fill={colors.redMars} stroke={colors.outline} strokeWidth="2" />
            {/* Flag stick */}
            <path d="M11 11V3" stroke={colors.outline} strokeWidth="1.5" />
            {/* Red and white flag */}
            <path d="M11 3h5v4h-5z" fill={colors.orangeFire} stroke={colors.outline} strokeWidth="1" />
            {/* Highlight */}
            <circle cx="12" cy="12" r="9" fill="none" stroke={colors.outline} strokeWidth="2" />
          </>
        );
      case 'achievement-speedrunner':
        return (
          <>
            {/* Speedrunner Achievement: Mission stopwatch */}
            <path d="M9 3h6v3H9V3z" fill={colors.greyLight} stroke={colors.outline} strokeWidth="1.5" />
            <path d="M7 6L5 4M17 6l2-2" stroke={colors.outline} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="13" r="7" fill={colors.creamPaper} stroke={colors.outline} strokeWidth="2" />
            <path d="M12 13l3-4" stroke={colors.redMars} strokeWidth="2" strokeLinecap="round" />
            <path d="M12 8v1M17 13h-1M12 18v-1M7 13h1" stroke={colors.greyMedium} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="13" r="1.5" fill={colors.yellowGold} stroke={colors.outline} strokeWidth="1" />
          </>
        );
      case 'achievement-completionist':
        return (
          <>
            {/* Completionist Achievement: Finished mission log */}
            <rect x="5" y="4" width="14" height="16" rx="2" fill={colors.creamPaper} stroke={colors.outline} strokeWidth="2" />
            <path d="M8 8l1.5 1.5L12 7M8 12l1.5 1.5L12 11" stroke={colors.greenDark} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 8h3M13 12h3" stroke={colors.greyMedium} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="16" cy="17" r="4" fill={colors.yellowGold} stroke={colors.outline} strokeWidth="1.5" />
            <path d="M16 14l1 2 2 .5-1.5 1.5.5 2-2-1-2 1 .5-2L13 16.5l2-.5z" fill={colors.yellowLight} stroke={colors.outline} strokeWidth="0.8" strokeLinejoin="round" />
          </>
        );
      case 'achievement-locked':
        return (
          <>
            {/* Locked Achievement: Secured badge */}
            <rect x="5" y="10" width="14" height="10" rx="2" fill={colors.greyLight} stroke={colors.outline} strokeWidth="2" />
            <path d="M8 10V7a4 4 0 018 0v3" fill="none" stroke={colors.outline} strokeWidth="2" strokeLinecap="round" />
            <rect x="11" y="14" width="2" height="3" fill={colors.greyDark} />
            <circle cx="12" cy="14" r="1.5" fill={colors.greyDark} />
          </>
        );
      
      // Bottom navigation / HUD Icons
      case 'hints':
        return (
          <path d="M15 2L5 12h7l-3 10L19 10h-7L15 2z" fill={colors.yellowLight} stroke={colors.outline} strokeWidth="2" strokeLinejoin="round" />
        );
      case 'recipes':
        return (
          <>
            <rect x="4" y="4" width="16" height="16" rx="2" fill={colors.creamPaper} stroke={colors.outline} strokeWidth="2" />
            <path d="M8 8h8 M8 12h8 M8 16h5" stroke={colors.outline} strokeWidth="2" strokeLinecap="round" />
          </>
        );
      case 'bag':
        return (
          <>
            {/* Backpack base */}
            <rect x="5" y="6" width="14" height="14" rx="2" fill={colors.brownEarth} stroke={colors.outline} strokeWidth="2" />
            {/* Top handle loop */}
            <path d="M9 6V4a2 2 0 014 0v2" fill="none" stroke={colors.outline} strokeWidth="2" />
            {/* Front pocket */}
            <rect x="8" y="12" width="8" height="6" rx="1" fill={colors.brownDark} stroke={colors.outline} strokeWidth="1.5" />
            {/* Buckle / latch */}
            <rect x="11" y="10" width="2" height="3" fill={colors.yellowGold} stroke={colors.outline} strokeWidth="1" />
          </>
        );
      case 'awards':
        return (
          <>
            {/* Trophy cup */}
            <path d="M6 5h12v6c0 3.5-2.5 6-6 6s-6-2.5-6-6V5z" fill={colors.yellowGold} stroke={colors.outline} strokeWidth="2" strokeLinejoin="round" />
            {/* Handles */}
            <path d="M6 7H4v3c0 2 2 2 2 2M18 7h2v3c0 2-2 2-2 2" fill="none" stroke={colors.outline} strokeWidth="2" />
            {/* Base stand */}
            <path d="M12 17v3 M9 20h6" stroke={colors.outline} strokeWidth="2.5" strokeLinecap="round" />
            <rect x="11" y="8" width="2" height="2" fill={colors.yellowLight} />
          </>
        );
      case 'menu':
        return (
          <path d="M4 6h16M4 12h16M4 18h16" stroke={colors.outline} strokeWidth="2.5" strokeLinecap="round" />
        );
      case 'close':
        return (
          <path d="M18 6L6 18M6 6l12 12" stroke={colors.outline} strokeWidth="2.5" strokeLinecap="round" />
        );
      case 'add':
        return (
          <path d="M12 5v14M5 12h14" stroke={colors.outline} strokeWidth="3" strokeLinecap="round" />
        );
      case 'arrow-right':
        return (
          <path d="M4 12h14M13 6l6 6-6 6" stroke={colors.outline} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        );
      default:
        // Render a cute generic mystery sparkling star element
        return (
          <path d="M12 2l2.5 6.5 6.5 2.5-6.5 2.5-2.5 6.5-2.5-6.5-6.5-2.5 6.5-2.5z" fill={colors.yellowGold} stroke={colors.outline} strokeWidth="2" />
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={`select-none shrink-0 ${className}`}
    >
      {renderIcon()}
    </svg>
  );
}
