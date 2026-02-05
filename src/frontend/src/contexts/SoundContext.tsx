import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { SOUND_ASSETS, type SoundCue } from '@/constants/sounds';
import { getSoundPreference, setSoundPreference } from '@/utils/soundPreferences';

interface SoundContextValue {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  playNotification: () => void;
  playNewFeed: () => void;
  playCircleActivity: () => void;
  isUnlocked: boolean;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabledState] = useState(() => getSoundPreference());
  const [isUnlocked, setIsUnlocked] = useState(false);
  const audioRefs = useRef<Record<SoundCue, HTMLAudioElement>>({} as any);

  // Initialize audio elements
  useEffect(() => {
    audioRefs.current = {
      notification: new Audio(SOUND_ASSETS.notification),
      newFeed: new Audio(SOUND_ASSETS.newFeed),
      circleActivity: new Audio(SOUND_ASSETS.circleActivity),
    };

    // Set volume to a calm level
    Object.values(audioRefs.current).forEach((audio) => {
      audio.volume = 0.4;
      audio.preload = 'auto';
    });

    return () => {
      // Cleanup
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  // Attempt to unlock audio on user interaction
  useEffect(() => {
    const unlockAudio = async () => {
      if (isUnlocked) return;

      try {
        // Try to play and immediately pause a silent audio to unlock
        const testAudio = audioRefs.current.notification;
        if (testAudio) {
          testAudio.volume = 0;
          const playPromise = testAudio.play();
          if (playPromise) {
            await playPromise;
            testAudio.pause();
            testAudio.currentTime = 0;
            testAudio.volume = 0.4;
          }
          setIsUnlocked(true);
        }
      } catch {
        // Audio still locked, will try again on next interaction
      }
    };

    // Listen for any user interaction to unlock audio
    // Do NOT use { once: true } so we can retry on subsequent interactions
    const events = ['click', 'touchstart', 'keydown'];
    events.forEach((event) => {
      document.addEventListener(event, unlockAudio, { passive: true });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, unlockAudio);
      });
    };
  }, [isUnlocked]);

  const setEnabled = useCallback((newEnabled: boolean) => {
    setEnabledState(newEnabled);
    setSoundPreference(newEnabled);
  }, []);

  const playSound = useCallback(
    (cue: SoundCue) => {
      if (!enabled || !isUnlocked) return;

      const audio = audioRefs.current[cue];
      if (!audio) return;

      try {
        // Reset to start and play
        audio.currentTime = 0;
        const playPromise = audio.play();
        if (playPromise) {
          playPromise.catch(() => {
            // Silently handle play failures (e.g., if audio is still locked)
          });
        }
      } catch {
        // Silently handle any errors
      }
    },
    [enabled, isUnlocked]
  );

  const playNotification = useCallback(() => playSound('notification'), [playSound]);
  const playNewFeed = useCallback(() => playSound('newFeed'), [playSound]);
  const playCircleActivity = useCallback(() => playSound('circleActivity'), [playSound]);

  return (
    <SoundContext.Provider
      value={{
        enabled,
        setEnabled,
        playNotification,
        playNewFeed,
        playCircleActivity,
        isUnlocked,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within SoundProvider');
  }
  return context;
}
