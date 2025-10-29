import React, { Dispatch, createContext, useEffect, useMemo, useReducer, useRef } from 'react';

// Define the type for the state
export interface InitialState {
  sounds:
    | {
        stream_url: string;
        sound_name: string;
        volume: number;
      }[]
    | null;
  isInitialized: boolean;
}

// Define the action type
export type Action =
  | { type: 'SET_SOUNDS'; payload: { stream_url: string; sound_name: string; volume: number }[] }
  | { type: 'UPDATE_VOLUME'; payload: { stream_url: string; volume: number } }
  | { type: 'SET_INITIALIZED'; payload: boolean };

// Create the initial state
const initialState: InitialState = {
  sounds: null,
  isInitialized: false,
};

// Create the context with an initial value of `null`
export const SoloSoundContext = createContext<{
  state: InitialState;
  dispatch: Dispatch<Action>;
} | null>(null);

// Reducer function
const reducer = (state: InitialState, action: Action): InitialState => {
  switch (action.type) {
    case 'SET_SOUNDS':
      return { ...state, sounds: action.payload };
    case 'UPDATE_VOLUME':
      return {
        ...state,
        sounds: state.sounds
          ? state.sounds.map((sound) =>
              sound.stream_url === action.payload.stream_url
                ? { ...sound, volume: action.payload.volume }
                : sound
            )
          : null,
      };
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    default:
      return state;
  }
};

// Provider component
export const SoloSoundProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Define audio management refs inside the component
  const audioMapRef = useRef(new Map<string, HTMLAudioElement>());
  const playingAudiosRef = useRef(new Set<string>());

  // Handle volume changes across components
  useEffect(() => {
    if (state.sounds) {
      state.sounds.forEach((sound) => {
        handleAudioPlayback(sound.stream_url, sound.volume);
      });
    }
  }, [state.sounds]);

  // Clean up on provider unmount
  useEffect(() => {
    return () => {
      // Cleanup all audio elements
      audioMapRef.current.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
      playingAudiosRef.current.clear();
    };
  }, []);

  // Handle audio playback based on volume
  const handleAudioPlayback = (stream_url: string, volume: number) => {
    if (!audioMapRef.current.has(stream_url)) {
      const audio = new Audio(stream_url);
      audio.volume = volume;
      audio.loop = true;
      audioMapRef.current.set(stream_url, audio);
    }

    const audio = audioMapRef.current.get(stream_url);
    if (audio) {
      audio.volume = volume;

      if (volume > 0) {
        if (audio.paused) {
          audio.play().catch((error) => console.log('Error playing audio:', error));
        }
        playingAudiosRef.current.add(stream_url);
      } else {
        audio.pause();
        playingAudiosRef.current.delete(stream_url);
      }
    }
  };

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <SoloSoundContext.Provider value={value}>{children}</SoloSoundContext.Provider>;
};
