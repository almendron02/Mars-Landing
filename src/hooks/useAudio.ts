import { useEffect, useRef, useCallback } from 'react';

// Use a singleton audio context to avoid recreating it multiple times
let audioCtx: AudioContext | null = null;
let bgmInterval: number | null = null;
let bgmOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Resume context if suspended (browser security autoplays)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function useAudio(
  isMutedMusic: boolean,
  isMutedSfx: boolean,
  volume: number
) {
  const volumeRef = useRef(volume);
  const isMutedMusicRef = useRef(isMutedMusic);
  const isMutedSfxRef = useRef(isMutedSfx);



  // SYNTHESIZE SOUNDS
  const playTone = useCallback((freqs: number[], duration: number, type: OscillatorType = 'sine', staggerMs = 0) => {
    if (isMutedSfxRef.current) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      freqs.forEach((freq, index) => {
        const timeOffset = index * (staggerMs / 1000);
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now + timeOffset);

        // Warm cozy volume control
        const targetGain = 0.15 * volumeRef.current;
        gainNode.gain.setValueAtTime(0, now + timeOffset);
        gainNode.gain.linearRampToValueAtTime(targetGain, now + timeOffset + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + timeOffset + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now + timeOffset);
        osc.stop(now + timeOffset + duration);
      });
    } catch (e) {
      console.warn('Procedural sound failed to play', e);
    }
  }, []);

  const playNewDiscovery = useCallback(() => {
    // Beautiful ascending major chord chimes
    playTone([261.63, 329.63, 392.00, 523.25], 0.8, 'sine', 100); // C4 -> E4 -> G4 -> C5
  }, [playTone]);

  const playFailedCombination = useCallback(() => {
    // Soft, low, gentle dual tone thud
    playTone([110, 115], 0.3, 'triangle', 0); // Low, cozy thud
  }, [playTone]);

  const playAchievement = useCallback(() => {
    // Sparkly chime arpeggio
    playTone([329.63, 392.00, 523.25, 659.25, 783.99], 1.2, 'sine', 80); // E4 -> G4 -> C5 -> E5 -> G5
  }, [playTone]);

  const playWinning = useCallback(() => {
    // Warm, majestic progression
    playTone([523.25, 659.25, 783.99, 1046.50], 2.5, 'sine', 150); // Majestic ascending
    setTimeout(() => {
      playTone([587.33, 739.99, 880.00, 1174.66], 2.5, 'sine', 150); // Stepping up
    }, 600);
    setTimeout(() => {
      playTone([659.25, 830.61, 987.77, 1318.51], 3.0, 'sine', 120); // Climax!
    }, 1200);
  }, [playTone]);

  // PROCEDURAL COZY BGM
  const startBgm = useCallback(() => {
    if (isMutedMusicRef.current) return;
    if (bgmInterval) return; // Already running

    try {
      const ctx = getAudioContext();

      const chords = [
        [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
        [146.83, 174.61, 220.00, 261.63], // Dm7 (D3, F3, A3, C4)
        [174.61, 220.00, 261.63, 329.63], // Fmaj7 (F3, A3, C4, E4)
        [196.00, 246.94, 293.66, 349.23], // G7 (G3, B3, D4, F4)
      ];

      let chordIndex = 0;

      const playChord = () => {
        if (isMutedMusicRef.current || !audioCtx || audioCtx.state === 'suspended') return;

        const now = audioCtx.currentTime;
        const chord = chords[chordIndex];
        chordIndex = (chordIndex + 1) % chords.length;

        // Clean up previous oscillators if any are dangling
        bgmOscillators = bgmOscillators.filter(({ osc, gain }) => {
          try {
            // Check if active or let garbage collection handle it
          } catch (e) {}
          return false;
        });

        // Create cozy pad notes
        chord.forEach((freq) => {
          const osc = audioCtx!.createOscillator();
          const gainNode = audioCtx!.createGain();
          const filter = audioCtx!.createBiquadFilter();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          // Cozy low-pass filter to make it sound warm and pillowy
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, now);

          // Very quiet soft pad volume
          const maxGain = 0.03 * volumeRef.current;

          gainNode.gain.setValueAtTime(0, now);
          // 2.5 second attack
          gainNode.gain.linearRampToValueAtTime(maxGain, now + 2.5);
          // Hold and then fade out starting around 4.5 seconds
          gainNode.gain.setValueAtTime(maxGain, now + 4.5);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 8.0);

          osc.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(audioCtx!.destination);

          osc.start(now);
          osc.stop(now + 8.5);

          bgmOscillators.push({ osc, gain: gainNode });
        });
      };

      // Play immediate first chord
      playChord();

      // Repeat chord loop every 8 seconds
      bgmInterval = window.setInterval(playChord, 8000);
    } catch (e) {
      console.warn('Cozy BGM start failed', e);
    }
  }, []);

  const stopBgm = useCallback(() => {
    if (bgmInterval) {
      window.clearInterval(bgmInterval);
      bgmInterval = null;
    }
    // Fade out any active oscillators
    bgmOscillators.forEach(({ gain }) => {
      try {
        if (audioCtx) {
          const now = audioCtx.currentTime;
          gain.gain.cancelScheduledValues(now);
          gain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
        }
      } catch (e) {}
    });
    bgmOscillators = [];
  }, []);

  const updateVolume = useCallback((v: number) => {
    volumeRef.current = v;
    // Update the gain nodes of currently playing BGM oscillators instantly
    bgmOscillators.forEach(({ gain }) => {
      try {
        if (audioCtx) {
          const now = audioCtx.currentTime;
          // Soft triangle pad volume is 0.03 * volume
          gain.gain.setValueAtTime(gain.gain.value, now);
          gain.gain.linearRampToValueAtTime(0.03 * v, now + 0.15);
        }
      } catch (e) {
        console.warn('Failed to update active gain node', e);
      }
    });
  }, []);

  const updateMutedMusic = useCallback((muted: boolean) => {
    isMutedMusicRef.current = muted;
    if (muted) {
      stopBgm();
    } else {
      startBgm();
    }
  }, [stopBgm, startBgm]);

  const updateMutedSfx = useCallback((muted: boolean) => {
    isMutedSfxRef.current = muted;
  }, []);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    isMutedMusicRef.current = isMutedMusic;
    if (isMutedMusic) {
      stopBgm();
    } else {
      startBgm();
    }
  }, [isMutedMusic, startBgm, stopBgm]);

  useEffect(() => {
    isMutedSfxRef.current = isMutedSfx;
  }, [isMutedSfx]);

  // Cleanup on unmount & Mobile Audio Context Unlocking
  useEffect(() => {
    const handleUnlock = () => {
      try {
        const ctx = getAudioContext();
        if (ctx && ctx.state === 'suspended') {
          ctx.resume().then(() => {
            console.log('AudioContext successfully unlocked on mobile!');
            // If music is enabled, start playing
            if (!isMutedMusicRef.current && !bgmInterval) {
              startBgm();
            }
          });
        }
      } catch (e) {
        console.warn('Unable to resume AudioContext from gesture:', e);
      }
    };

    window.addEventListener('click', handleUnlock);
    window.addEventListener('touchstart', handleUnlock, { passive: true });

    return () => {
      stopBgm();
      window.removeEventListener('click', handleUnlock);
      window.removeEventListener('touchstart', handleUnlock);
    };
  }, [startBgm, stopBgm]);

  return {
    playNewDiscovery,
    playFailedCombination,
    playAchievement,
    playWinning,
    startBgm,
    stopBgm,
    updateVolume,
    updateMutedMusic,
    updateMutedSfx
  };
}
