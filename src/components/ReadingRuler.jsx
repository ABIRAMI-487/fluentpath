import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

export default function ReadingRuler() {
  const { settings } = useSettings();
  const [topPos, setTopPos] = useState(200);

  useEffect(() => {
    if (!settings.readingRuler) return;

    const handleMouseMove = (e) => {
      setTopPos(e.clientY - 22);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [settings.readingRuler]);

  if (!settings.readingRuler) return null;

  return (
    <div
      className="reading-ruler-overlay"
      style={{ top: `${topPos}px` }}
      aria-hidden="true"
    />
  );
}
