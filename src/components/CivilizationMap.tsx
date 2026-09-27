import { useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { LocateFixed, Minus, Plus, X } from 'lucide-react';
import type { Era } from '../types/game';
import { ELEMENTS, STARTING_ELEMENTS } from '../data/elements';
import { RECIPES } from '../data/recipes';
import PixelIcon from './PixelIcon';

interface CivilizationMapProps {
  discoveredElements: string[];
  onClose: () => void;
}

interface PositionedNode {
  id: string;
  name: string;
  era: Era;
  x: number;
  y: number;
}

const MAP_SIZE = 3200;
const CENTER = MAP_SIZE / 2;
const eraOrder: Era[] = ['Nature', 'Life', 'Human', 'Civilization', 'Industry', 'Space'];
const ringRadius: Record<Era, number> = {
  Nature: 360,
  Life: 560,
  Human: 760,
  Civilization: 980,
  Industry: 1200,
  Space: 1420,
};
const eraColor: Record<Era, string> = {
  Nature: '#8DAE69',
  Life: '#77A881',
  Human: '#D39A62',
  Civilization: '#C7A46A',
  Industry: '#7892AC',
  Space: '#C96F4A',
};

const getLayout = (): PositionedNode[] => {
  const nodes: PositionedNode[] = [];
  eraOrder.forEach((era, eraIndex) => {
    const elements = ELEMENTS.filter((element) => element.era === era);
    const nonStartingElements = elements.filter((element) => !STARTING_ELEMENTS.includes(element.id));

    elements.forEach((element) => {
      const startingIndex = STARTING_ELEMENTS.indexOf(element.id);
      const isStarting = startingIndex >= 0;
      const radius = isStarting ? 158 : ringRadius[era];
      const total = isStarting ? STARTING_ELEMENTS.length : nonStartingElements.length;
      const index = isStarting ? startingIndex : nonStartingElements.findIndex((item) => item.id === element.id);
      const stagger = eraIndex % 2 ? 0.12 : -0.08;
      const angle = -Math.PI / 2 + stagger + (index / Math.max(total, 1)) * Math.PI * 2;

      nodes.push({
        id: element.id,
        name: element.name,
        era: element.era,
        x: CENTER + Math.cos(angle) * radius,
        y: CENTER + Math.sin(angle) * radius,
      });
    });
  });
  return nodes;
};

export default function CivilizationMap({ discoveredElements, onClose }: CivilizationMapProps) {
  const nodes = useMemo(getLayout, []);
  const nodeById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const discovered = useMemo(() => new Set(discoveredElements), [discoveredElements]);
  const [zoom, setZoom] = useState(() => window.innerWidth < 640 ? 0.32 : 0.5);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const knownEdges = useMemo(() => {
    return RECIPES.filter((recipe) => discovered.has(recipe.result) && discovered.has(recipe.element1) && discovered.has(recipe.element2));
  }, [discovered]);

  return (
    <div className="fixed inset-0 z-[70] bg-brand-bg text-brand-ink overflow-hidden select-none">
      <div className="absolute left-4 top-4 sm:left-6 sm:top-6 z-30 pointer-events-none">
        <h2 className="font-serif font-black text-2xl leading-none">Discovery Map</h2>
        <p className="mt-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.16em] text-brand-muted">
          {discoveredElements.length} of {ELEMENTS.length} discovered · drag to explore · scroll to zoom
        </p>
      </div>

      <button onClick={onClose} className="absolute right-4 top-4 sm:right-6 sm:top-6 z-30 w-10 h-10 grid place-items-center rounded-xl border-2 border-brand-ink bg-brand-card hover:bg-brand-paper shadow-[1.5px_2px_0px_0px_rgba(36,33,30,1)] cursor-pointer" aria-label="Close civilization map">
        <X size={18} />
      </button>

      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none civilization-map-grid"
        onWheel={(event) => {
          event.preventDefault();
          setZoom((current) => Math.min(1.35, Math.max(0.24, current - event.deltaY * 0.0007)));
        }}
        onPointerDown={(event) => {
          drag.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          setPan({ x: drag.current.panX + event.clientX - drag.current.x, y: drag.current.panY + event.clientY - drag.current.y });
        }}
        onPointerUp={() => { drag.current = null; }}
        onPointerCancel={() => { drag.current = null; }}
      >
        <div
          className="absolute w-[3200px] h-[3200px] will-change-transform"
          style={{
            left: '50%',
            top: '50%',
            transformOrigin: '0 0',
            transform: `translate(${pan.x - CENTER * zoom}px, ${pan.y - CENTER * zoom}px) scale(${zoom})`,
          }}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${MAP_SIZE} ${MAP_SIZE}`}>
            {knownEdges.flatMap((recipe) => {
              const result = nodeById.get(recipe.result);
              const sources = [nodeById.get(recipe.element1), nodeById.get(recipe.element2)];
              if (!result) return [];
              return sources.flatMap((source, index) => source ? [
                <line
                  key={`${recipe.id}-${index}`}
                  x1={source.x}
                  y1={source.y}
                  x2={result.x}
                  y2={result.y}
                  stroke={eraColor[result.era]}
                  strokeOpacity="0.72"
                  strokeWidth="5"
                  strokeLinecap="round"
                />,
              ] : []);
            })}
          </svg>

          {nodes.map((node) => {
            const isKnown = discovered.has(node.id);
            return (
              <div
                key={node.id}
                className={`civilization-node ${isKnown ? 'is-known' : 'is-locked'}`}
                style={{ left: node.x, top: node.y, '--node-color': eraColor[node.era] } as CSSProperties}
                role="img"
                aria-label={isKnown ? node.name : `Undiscovered ${node.era} element`}
              >
                <span className="civilization-node-icon">{isKnown ? <PixelIcon id={node.id} size={34} /> : <span>?</span>}</span>
                <span className="civilization-node-name">{isKnown ? node.name : 'Unknown'}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 z-30 flex items-center rounded-full border-2 border-brand-ink bg-brand-card shadow-[2px_3px_0px_0px_rgba(36,33,30,1)] p-1">
        <button onClick={() => setZoom((value) => Math.max(0.24, value - 0.12))} className="map-control" aria-label="Zoom out"><Minus size={16} /></button>
        <span className="w-12 text-center text-[9px] font-black">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom((value) => Math.min(1.35, value + 0.12))} className="map-control" aria-label="Zoom in"><Plus size={16} /></button>
        <button onClick={() => { setPan({ x: 0, y: 0 }); setZoom(window.innerWidth < 640 ? 0.32 : 0.5); }} className="map-control" aria-label="Center map"><LocateFixed size={16} /></button>
      </div>
    </div>
  );
}
