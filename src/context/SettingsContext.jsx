import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService, DEFAULT_SETTINGS } from '../services/storageService';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => storageService.getSettings());

  // Apply settings to document root & body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Font size
    const fontSizeMap = {
      small: '15px',
      medium: '17px',
      large: '20px',
      xlarge: '24px'
    };
    root.style.setProperty('--font-size-base', fontSizeMap[settings.fontSize] || '17px');

    // Line spacing
    const lineSpacingMap = {
      standard: '1.5',
      relaxed: '1.85',
      loose: '2.2'
    };
    root.style.setProperty('--line-height-base', lineSpacingMap[settings.lineSpacing] || '1.85');

    // Letter spacing
    const letterSpacingMap = {
      normal: '0.01em',
      wide: '0.05em',
      extraWide: '0.09em'
    };
    root.style.setProperty('--letter-spacing-base', letterSpacingMap[settings.letterSpacing] || '0.01em');

    // Dyslexia-friendly font class
    if (settings.dyslexiaFont) {
      body.classList.add('font-dyslexic');
    } else {
      body.classList.remove('font-dyslexic');
    }

    // High Contrast class
    if (settings.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Reduced motion class
    if (settings.reducedMotion) {
      body.classList.add('reduced-motion');
    } else {
      body.classList.remove('reduced-motion');
    }

    // Persist to storage
    storageService.saveSettings(settings);
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, updateSettings, resetToDefaults }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
