'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { ThemePreset } from '@/types/theme';
import { defaultPresets } from '@/utils/theme-preset';

interface ThemeCustomContextType {
  currentPreset: string;
  customTheme: ThemePreset | null;
  presets: Record<string, ThemePreset>;
  applyPreset: (presetName: string) => void;
  saveCustomTheme: (theme: ThemePreset) => void;
  resetTheme: () => void;
}

const ThemeCustomContext = createContext<ThemeCustomContextType | undefined>(undefined);

const PRESET_KEY = 'aeiouly-theme-preset';
const STYLE_TAG_ID = 'aeiouly-theme-preset-styles';

export const ThemeCustomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPreset, setCurrentPreset] = useState<string>('default');
  const [customTheme, setCustomTheme] = useState<ThemePreset | null>(null);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedPreset = localStorage.getItem(PRESET_KEY);

    if (savedPreset && defaultPresets[savedPreset]) {
      setCurrentPreset(savedPreset);
      applyThemeToDOM(defaultPresets[savedPreset]);
    } else {
      // Apply default theme if no saved preset
      applyThemeToDOM(defaultPresets['default']);
    }
  }, []);

  const applyThemeToDOM = useCallback((theme: ThemePreset) => {
    // Remove existing style tag if it exists
    const existingStyle = document.getElementById(STYLE_TAG_ID);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create CSS rules for light and dark mode
    const lightVars = Object.entries(theme.styles.light)
      .map(([key, value]) => `  --${key}: ${value};`)
      .join('\n');

    const darkVars = Object.entries(theme.styles.dark)
      .map(([key, value]) => `  --${key}: ${value};`)
      .join('\n');

    const cssContent = `
:root {
${lightVars}
}

.aeiouly-dark {
${darkVars}
}
`;

    // Inject style tag into document head
    const styleTag = document.createElement('style');
    styleTag.id = STYLE_TAG_ID;
    styleTag.textContent = cssContent;
    document.head.appendChild(styleTag);
  }, []);

  const resetTheme = useCallback(() => {
    setCustomTheme(null);
    setCurrentPreset('default');
    localStorage.removeItem(PRESET_KEY);

    // Apply default theme from preset
    const defaultPreset = defaultPresets['default'];
    if (defaultPreset) {
      applyThemeToDOM(defaultPreset);
    }
  }, [applyThemeToDOM]);

  const applyPreset = useCallback(
    (presetName: string) => {
      const preset = defaultPresets[presetName];
      if (preset) {
        setCurrentPreset(presetName);
        setCustomTheme(null);
        localStorage.setItem(PRESET_KEY, presetName);
        applyThemeToDOM(preset);
      }
    },
    [applyThemeToDOM]
  );

  const saveCustomTheme = useCallback(
    (theme: ThemePreset) => {
      setCustomTheme(theme);
      setCurrentPreset('custom');
      localStorage.setItem(PRESET_KEY, 'custom');
      applyThemeToDOM(theme);
    },
    [applyThemeToDOM]
  );

  const value: ThemeCustomContextType = {
    currentPreset,
    customTheme,
    presets: defaultPresets,
    applyPreset,
    saveCustomTheme,
    resetTheme,
  };

  return <ThemeCustomContext.Provider value={value}>{children}</ThemeCustomContext.Provider>;
};

export const useThemeCustom = () => {
  const context = useContext(ThemeCustomContext);
  if (!context) {
    throw new Error('useThemeCustom must be used within ThemeCustomProvider');
  }
  return context;
};
