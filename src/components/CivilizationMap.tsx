import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { LocateFixed, Minus, Plus, X } from 'lucide-react';
import { ELEMENTS } from '../data/elements';
import {
  MAP_BRANCHES,
  MAP_LEVELS,
  MAP_STAGES,
  buildCivilizationMap,
  getNodeRecipes,
  isNodeReachable,
} from '../lib/civilizationMap';
import PixelIcon from './PixelIcon';

interface CivilizationMapProps {
  discoveredElements: string[];
  highlightedElementId?: string;
  highlightedPlayerName?: string;
  onClose: () => void;
}

const getFitZoom = () => {
  const shortestSide = Math.min(window.innerWidth, window.innerHeight);
  return window.innerWidth < 640
    ? Math.min(0.11, Math.max(0.075, shortestSide / 5400))
    : Math.min(0.22, Math.max(0.18, shortestSide / 5400));
};

const displayName = (id: string) =>
  ELEMENTS.find((element) => element.id === id)?.name ??
  id.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

export default function CivilizationMap({
  discoveredElements,
  highlightedElementId,
  highlightedPlayerName,
  onClose,
}: CivilizationMapProps) {
  const model = useMemo(buildCivilizationMap, []);
  const discovered = useMemo(() => new Set(discoveredElements), [discoveredElements]);
  const furthestDiscoveredLevel = useMemo(() => model.nodes.reduce((furthest, node) =>
    discovered.has(node.id) ? Math.max(furthest, node.level) : furthest, 0), [discovered, model.nodes]);
  const [zoom, setZoom] = useState(getFitZoom);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const drag = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);

  const selectedNode = selectedId ? model.nodeById.get(selectedId) ?? null : null;
  const selectedRecipes = selectedNode ? getNodeRecipes(selectedNode.id) : [];

  useEffect(() => {
    if (!highlightedElementId || !discovered.has(highlightedElementId)) return;
    const node = model.nodeById.get(highlightedElementId);
    if (!node) return;
    const nextZoom = Math.max(zoom, window.innerWidth < 640 ? 0.42 : 0.52);
    setZoom(nextZoom);
    setPan({
      x: (model.center - node.x) * nextZoom,
      y: (model.center - node.y) * nextZoom,
    });
    setSelectedId(highlightedElementId);
  }, [highlightedElementId]);

  const stopNodePointer = (event: ReactPointerEvent) => event.stopPropagation();

  return (
    <div className="fixed inset-0 z-[70] bg-brand-bg text-brand-ink overflow-clip select-none">
      <div className="absolute left-4 top-4 sm:left-6 sm:top-6 z-30 pointer-events-none">
        <h2 className="font-serif font-black text-2xl leading-none">Discovery Map</h2>
        <p className="mt-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.16em] text-brand-muted">
          {discoveredElements.length} of {ELEMENTS.length} discovered · four branches advance outward toward Mars
        </p>
      </div>

      <button onClick={onClose} className="absolute right-4 top-4 sm:right-6 sm:top-6 z-30 w-10 h-10 grid place-items-center rounded-xl border-2 border-brand-ink bg-brand-card hover:bg-brand-paper shadow-[1.5px_2px_0px_0px_rgba(36,33,30,1)] cursor-pointer" aria-label="Close civilization map">
        <X size={18} />
      </button>

      <div
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none civilization-map-grid"
        onWheel={(event) => {
          event.preventDefault();
          setZoom((current) => Math.min(1.25, Math.max(0.065, current - event.deltaY * 0.0007)));
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
          className="absolute w-[5600px] h-[5600px] will-change-transform"
          style={{
            left: '50%',
            top: '50%',
            transformOrigin: '0 0',
            transform: `translate(${pan.x - model.center * zoom}px, ${pan.y - model.center * zoom}px) scale(${zoom})`,
          }}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${model.size} ${model.size}`}>
            {MAP_LEVELS.slice(1).map(({ level, radius }) => (
              <g key={level}>
                <circle
                  cx={model.center}
                  cy={model.center}
                  r={radius}
                  fill="none"
                  stroke="#A98B6D"
                  strokeOpacity="0.09"
                  strokeWidth="2"
                  strokeDasharray="7 18"
                />
              </g>
            ))}

            {model.edges.map((edge) => {
              const parent = model.nodeById.get(edge.parentId);
              const child = model.nodeById.get(edge.childId);
              const isKnown = discovered.has(edge.parentId) && discovered.has(edge.childId);
              if (!parent || !child || !isKnown) return null;
              const isHighlighted = highlightedElementId === edge.childId;
              const color = MAP_BRANCHES.find((branch) => branch.rootId === child.branch)?.color ?? MAP_STAGES[child.stageIndex].color;
              return (
                <g key={`${edge.parentId}-${edge.childId}`} className={isHighlighted ? 'map-path is-new' : 'map-path'}>
                  <line x1={parent.x} y1={parent.y} x2={child.x} y2={child.y} stroke={color} strokeOpacity="0.14" strokeWidth="18" strokeLinecap="round" />
                  <line x1={parent.x} y1={parent.y} x2={child.x} y2={child.y} stroke={color} strokeOpacity="0.86" strokeWidth={isHighlighted ? 8 : 5} strokeLinecap="round" />
                </g>
              );
            })}
          </svg>

          {model.nodes.map((node) => {
            const isKnown = discovered.has(node.id);
            const isReachable = !isKnown && isNodeReachable(node.id, discovered);
            const isHighlighted = highlightedElementId === node.id;
            const showIdentity = isKnown || node.isGoal;
            const nodeColor = MAP_BRANCHES.find((branch) => branch.rootId === node.branch)?.color ?? MAP_STAGES[node.stageIndex].color;
            const futureDistance = Math.max(0, node.level - furthestDiscoveredLevel);
            const futureOpacity = node.isGoal ? 0.82 : isReachable ? 0.86 : Math.max(0.2, 0.58 - futureDistance * 0.08);
            return (
              <button
                key={node.id}
                type="button"
                className={`civilization-node ${isKnown ? 'is-known' : isReachable ? 'is-reachable' : 'is-locked'} ${node.isMilestone ? 'is-milestone' : ''} ${node.isGoal ? 'is-goal' : ''} ${isHighlighted ? 'is-new' : ''} ${selectedId === node.id ? 'is-selected' : ''}`}
                style={{ left: node.x, top: node.y, '--node-color': nodeColor, '--future-opacity': futureOpacity } as CSSProperties}
                aria-label={isKnown ? `${node.name}, discovered ${node.era} element` : node.isGoal ? `${node.name}, locked final goal` : `Undiscovered ${node.era} element`}
                disabled={!isKnown}
                onPointerDown={stopNodePointer}
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedId(node.id);
                }}
              >
                <span className="civilization-node-icon">
                  {showIdentity ? <PixelIcon id={node.id} size={node.isMilestone ? 42 : 34} /> : <span>?</span>}
                </span>
                <span className="civilization-node-name">{showIdentity ? node.name : 'Unknown'}</span>
                {node.isGoal && !isKnown && <span className="civilization-node-goal">Final goal</span>}
              </button>
            );
          })}
        </div>
      </div>

      {selectedNode && discovered.has(selectedNode.id) && (
        <aside className="map-node-detail" aria-label={`${selectedNode.name} discovery details`}>
          <button type="button" onClick={() => setSelectedId(null)} className="map-node-detail-close" aria-label="Close discovery details"><X size={14} /></button>
          <div className="flex items-center gap-3 pr-8">
            <span className="w-12 h-12 shrink-0 rounded-xl border-2 border-brand-ink bg-brand-paper grid place-items-center">
              <PixelIcon id={selectedNode.id} size={34} />
            </span>
            <div>
              <span className="text-[9px] font-black uppercase tracking-[0.16em] text-brand-primary">{selectedNode.stage} discovery</span>
              <h3 className="font-serif text-xl font-black leading-tight">{selectedNode.name}</h3>
            </div>
          </div>
          {highlightedElementId === selectedNode.id && (
            <p className="mt-3 rounded-lg bg-brand-primary/10 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-brand-primary">
              {highlightedPlayerName ? `${highlightedPlayerName} discovered this` : 'New discovery'}
            </p>
          )}
          {selectedNode.description && <p className="mt-3 text-xs font-semibold leading-relaxed text-brand-muted">{selectedNode.description}</p>}
          {selectedRecipes.length > 0 && (
            <div className="mt-4 border-t border-brand-border pt-3">
              <span className="text-[9px] font-black uppercase tracking-[0.16em] text-brand-muted">True recipes</span>
              <div className="mt-2 space-y-2">
                {selectedRecipes.map((recipe) => (
                  <div key={recipe.id} className="flex items-center justify-center gap-2 rounded-xl border border-brand-border bg-brand-paper px-2 py-2 text-[10px] font-black">
                    <span className="flex items-center gap-1"><PixelIcon id={recipe.element1} size={20} /> {displayName(recipe.element1)}</span>
                    <span className="text-brand-primary">+</span>
                    <span className="flex items-center gap-1"><PixelIcon id={recipe.element2} size={20} /> {displayName(recipe.element2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      )}

      <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 z-30 flex items-center rounded-full border-2 border-brand-ink bg-brand-card shadow-[2px_3px_0px_0px_rgba(36,33,30,1)] p-1">
        <button onClick={() => setZoom((value) => Math.max(0.065, value - 0.1))} className="map-control" aria-label="Zoom out"><Minus size={16} /></button>
        <span className="w-12 text-center text-[9px] font-black">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom((value) => Math.min(1.25, value + 0.1))} className="map-control" aria-label="Zoom in"><Plus size={16} /></button>
        <button onClick={() => { setPan({ x: 0, y: 0 }); setZoom(getFitZoom()); setSelectedId(null); }} className="map-control" aria-label="Center map"><LocateFixed size={16} /></button>
      </div>
    </div>
  );
}
