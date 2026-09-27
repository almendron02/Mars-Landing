import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Check, Clipboard, LoaderCircle, LogIn, Settings, Sparkles, Trash2, Users } from 'lucide-react';
import type { MultiplayerSession } from '../hooks/useMultiplayer';
import type { HostedWorld } from '../types/game';
import MenuModal from './MenuModal';
import PixelIcon from './PixelIcon';

type Panel = 'home' | 'host' | 'join' | 'lobby';

interface ExpeditionSetupProps {
  hostedWorlds: HostedWorld[];
  multiplayer: MultiplayerSession;
  onCreateWorld: (name: string) => boolean;
  onSelectWorld: (worldId: string, name: string) => void;
  onDeleteWorld: (worldId: string) => void;
  onJoinWorld: (name: string, code: string) => void;
  isMutedMusic: boolean;
  isMutedSfx: boolean;
  volume: number;
  toggleMusic: () => void;
  toggleSfx: () => void;
  changeVolume: (value: number) => void;
}

export default function ExpeditionSetup({
  hostedWorlds,
  multiplayer,
  onCreateWorld,
  onSelectWorld,
  onDeleteWorld,
  onJoinWorld,
  isMutedMusic,
  isMutedSfx,
  volume,
  toggleMusic,
  toggleSfx,
  changeVolume,
}: ExpeditionSetupProps) {
  const [panel, setPanel] = useState<Panel>('home');
  const [name, setName] = useState(() => window.localStorage.getItem('mars_player_name') || '');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [menuTab, setMenuTab] = useState<'settings' | 'tutorial' | 'developer' | null>(null);

  const rememberName = () => {
    const playerName = name.trim() || 'Explorer';
    window.localStorage.setItem('mars_player_name', playerName);
    return playerName;
  };

  const createWorld = () => {
    if (onCreateWorld(rememberName())) setPanel('lobby');
  };

  const selectWorld = (worldId: string) => {
    setPanel('lobby');
    onSelectWorld(worldId, rememberName());
  };

  const joinRoom = () => {
    setPanel('lobby');
    onJoinWorld(rememberName(), code);
  };

  const goBack = () => {
    if (panel === 'lobby') multiplayer.leaveRoom();
    setPanel('home');
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(multiplayer.roomCode);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-bg px-4 py-8 select-none">
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full min-h-[470px] bg-brand-card border-2 border-brand-ink p-8 rounded-3xl shadow-[3px_4px_0px_0px_rgba(36,33,30,1)] text-center relative overflow-hidden flex flex-col"
      >
        <div className="absolute top-4 right-4 text-brand-primary opacity-60 animate-pulse"><Sparkles size={18} /></div>

        <h1 className="text-3xl font-serif font-black tracking-tight text-brand-ink uppercase mb-2">Mars Landing</h1>
        <p className="text-brand-muted text-xs font-black uppercase tracking-widest mt-1 mb-8">Advance civilization & land on Mars</p>

        <AnimatePresence mode="wait">
          {panel === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="flex-1 flex flex-col">
              {multiplayer.roomClosed && (
                <p className="mb-4 rounded-xl border-2 border-brand-primary/40 bg-brand-primary/10 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-brand-primary">
                  {multiplayer.roomClosed}
                </p>
              )}
              <div className="flex flex-col gap-3.5 w-full">
                <button onClick={() => setPanel('host')} className="w-full flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover border-2 border-brand-ink text-white font-extrabold uppercase tracking-widest py-3.5 rounded-2xl shadow-[2px_2.5px_0px_0px_rgba(36,33,30,1)] hover:translate-y-[1px] hover:shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)] active:scale-[0.98] cursor-pointer transition-all">
                  <Users size={16} /> Host Game
                </button>
                <button onClick={() => setPanel('join')} className="w-full flex items-center justify-center gap-2 bg-brand-card hover:bg-brand-paper border-2 border-brand-ink text-brand-ink font-extrabold uppercase tracking-widest py-3 rounded-2xl shadow-[2px_2.5px_0px_0px_rgba(36,33,30,1)] hover:translate-y-[1px] hover:shadow-[1px_1.5px_0px_0px_rgba(36,33,30,1)] active:scale-[0.98] cursor-pointer transition-all">
                  <LogIn size={15} strokeWidth={3} /> Join Game
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-5">
                <button onClick={() => setMenuTab('settings')} className="start-menu-link">
                  <Settings size={15} /><span>Sound</span>
                </button>
                <button onClick={() => setMenuTab('tutorial')} className="start-menu-link">
                  <PixelIcon id="hints" size={15} /><span>Tutorial</span>
                </button>
                <button onClick={() => setMenuTab('developer')} className="start-menu-link">
                  <PixelIcon id="astronaut" size={15} /><span>Developer</span>
                </button>
              </div>
              <p className="text-[10px] text-brand-muted/70 mt-auto pt-8 leading-normal font-bold uppercase tracking-wider">
                {hostedWorlds.length > 0 ? `${hostedWorlds.length} of 3 hosted worlds saved on this device.` : 'Create a hosted world to play alone or invite up to three explorers.'}
              </p>
            </motion.div>
          )}

          {(panel === 'host' || panel === 'join') && (
            <motion.div key={panel} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="text-left flex-1">
              <button onClick={goBack} className="setup-back"><ArrowLeft size={15} /> Back</button>
              <h2 className="text-2xl font-serif font-black uppercase tracking-tight mt-6">{panel === 'host' ? 'Host Game' : 'Join Game'}</h2>
              <p className="text-xs font-semibold text-brand-muted leading-relaxed mt-2 mb-5">
                {panel === 'host'
                  ? 'Select one of your worlds or create a new civilization in the next empty slot.'
                  : 'Enter the host code to join the same civilization.'}
              </p>

              <label className="setup-label" htmlFor="player-name">Explorer name</label>
              <input id="player-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={18} placeholder="Your name" className="setup-input" autoComplete="nickname" />

              {panel === 'host' ? (
                <div className="mt-5 space-y-4">
                  {hostedWorlds.length > 0 && (
                    <div>
                      <span className="setup-label">Select world</span>
                      <div className="space-y-2">
                        {hostedWorlds.map((world) => (
                          <div key={world.id} className="flex items-stretch gap-2">
                            <button onClick={() => selectWorld(world.id)} className="flex-1 text-left bg-brand-paper hover:bg-brand-bg border-2 border-brand-border hover:border-brand-ink rounded-xl p-3 cursor-pointer transition-all">
                              <span className="block text-xs font-black uppercase tracking-wider text-brand-ink">World {world.slot}</span>
                              <span className="block mt-1 text-[10px] font-bold text-brand-muted">{world.snapshot.discoveredElements.length} elements · {Math.floor(world.snapshot.elapsedTime / 60)} min played</span>
                            </button>
                            <button
                              aria-label={`Delete World ${world.slot}`}
                              onClick={() => {
                                if (confirm(`Delete World ${world.slot}? This progress cannot be recovered.`)) onDeleteWorld(world.id);
                              }}
                              className="w-11 grid place-items-center rounded-xl border-2 border-brand-border bg-brand-card text-brand-primary hover:border-brand-primary cursor-pointer transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-brand-border pt-4">
                    <span className="setup-label">Create new world</span>
                    {hostedWorlds.length < 3 ? (
                      <button onClick={createWorld} className="setup-primary"><Users size={17} /> Create New World</button>
                    ) : (
                      <div className="rounded-xl border-2 border-brand-primary/40 bg-brand-primary/10 p-3 text-center">
                        <p className="text-[10px] font-black uppercase tracking-wider text-brand-primary">No more space to create worlds</p>
                        <p className="mt-1 text-[10px] font-semibold text-brand-muted">Delete one of the saved worlds to open a slot.</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <label className="setup-label mt-4" htmlFor="room-code">Mars code</label>
                  <div className="setup-code-field">
                    <span aria-hidden="true">MARS-</span>
                    <input id="room-code" value={code.replace(/^MARS-/i, '')} onChange={(event) => setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4))} maxLength={4} placeholder="7K2Q" aria-label="Four-character Mars game code" autoCapitalize="characters" autoComplete="off" />
                  </div>
                  <button disabled={code.length < 4} onClick={joinRoom} className="setup-primary mt-6 disabled:opacity-40 disabled:cursor-not-allowed"><LogIn size={17} /> Join Game</button>
                </>
              )}
            </motion.div>
          )}

          {panel === 'lobby' && (
            <motion.div key="lobby" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="text-left flex-1">
              <button onClick={goBack} className="setup-back"><ArrowLeft size={15} /> Leave</button>
              {!multiplayer.roomCode ? (
                <div className="py-20 text-center">
                  <LoaderCircle size={26} className="animate-spin mx-auto text-brand-primary" />
                  <p className="mt-4 text-xs font-black uppercase tracking-widest text-brand-muted">Opening game…</p>
                  {multiplayer.error && <p className="mt-4 text-xs font-bold text-brand-primary">{multiplayer.error}</p>}
                </div>
              ) : (
                <>
                  <div className="text-center mt-5 mb-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-muted">Game code</p>
                    <button onClick={copyCode} className="mt-2 inline-flex items-center gap-2 text-3xl font-mono font-black tracking-tight hover:text-brand-primary cursor-pointer" title="Copy game code">
                      {multiplayer.roomCode} {copied ? <Check size={18} /> : <Clipboard size={18} />}
                    </button>
                    <p className="mt-2 text-[10px] font-bold text-brand-muted">Starting alone is completely fine. Friends can join with this code.</p>
                  </div>

                  <div className="space-y-2 mb-5">
                    {multiplayer.players.map((player) => (
                      <div key={player.id} className="flex items-center gap-3 bg-brand-paper border border-brand-border rounded-xl p-3">
                        <span className="w-3 h-3 rounded-full border border-brand-ink/30" style={{ background: player.color }} />
                        <strong className="text-sm flex-1">{player.name}</strong>
                        <span className="text-[9px] font-black uppercase tracking-wider text-brand-muted">{player.isHost ? 'Host' : 'Ready'}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center py-3 text-[10px] font-black uppercase tracking-[0.16em] text-brand-muted animate-pulse">{multiplayer.isHost ? 'Opening your world' : 'Waiting for the host to begin'}</div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      <MenuModal
        isOpen={menuTab !== null}
        initialTab={menuTab ?? 'settings'}
        context="start"
        onClose={() => setMenuTab(null)}
        onRestart={() => {}}
        canRestart={false}
        isMutedMusic={isMutedMusic}
        isMutedSfx={isMutedSfx}
        volume={volume}
        toggleMusic={toggleMusic}
        toggleSfx={toggleSfx}
        changeVolume={changeVolume}
      />
    </main>
  );
}
