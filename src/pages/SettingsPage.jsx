import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import { speechSynthesisService } from '../services/speechSynthesisService';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import {
  Settings,
  Type,
  Eye,
  Volume2,
  Sliders,
  RotateCcw,
  CheckCircle2,
  Contrast
} from 'lucide-react';

const SECTION_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem'
};

const ROW_STYLE = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.875rem 1rem',
  backgroundColor: 'var(--color-bg-surface)',
  border: '1px solid var(--color-border-subtle)',
  borderRadius: 'var(--radius-md)',
  gap: '1rem',
  flexWrap: 'wrap'
};

const LABEL_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem'
};

export default function SettingsPage() {
  const { settings, updateSetting, updateSettings, resetToDefaults } = useSettings();
  const { addToast } = useToast();
  const [voices, setVoices] = useState([]);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const v = speechSynthesisService.getVoices();
      if (v.length > 0) setVoices(v);
    };
    loadVoices();
    const id = setInterval(loadVoices, 500);
    setTimeout(() => clearInterval(id), 3000);
    return () => clearInterval(id);
  }, []);

  const handleReset = () => {
    resetToDefaults();
    setConfirmReset(false);
    addToast({ type: 'info', message: 'All accessibility settings have been reset to their defaults.' });
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-primary"><Settings size={13} /><span>Accessibility Settings</span></span>
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>Reading Experience Settings</h1>
        <p style={{ color: 'var(--color-slate)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Customize font, layout, colours, and speech to suit your personal reading comfort. All settings are saved automatically.
        </p>
      </div>

      {/* Section: Typography */}
      <section className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-navy-dark)', marginBottom: '1.25rem' }}>
          <Type size={20} />Typography
        </h2>
        <div style={SECTION_STYLE}>
          {/* Font Size */}
          <div style={ROW_STYLE}>
            <div style={LABEL_STYLE}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-navy-dark)' }}>Font Size</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>
                Small (15px) · Medium (17px) · Large (20px) · Extra Large (24px)
              </span>
            </div>
            <select
              className="form-select"
              value={settings.fontSize}
              onChange={e => updateSetting('fontSize', e.target.value)}
              style={{ minWidth: '140px', minHeight: '42px' }}
              aria-label="Font Size"
            >
              <option value="small">Small</option>
              <option value="medium">Medium (Default)</option>
              <option value="large">Large</option>
              <option value="xlarge">Extra Large</option>
            </select>
          </div>

          {/* Line Spacing */}
          <div style={ROW_STYLE}>
            <div style={LABEL_STYLE}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-navy-dark)' }}>Line Spacing</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>
                Standard (1.5) · Relaxed (1.85) · Loose (2.2)
              </span>
            </div>
            <select
              className="form-select"
              value={settings.lineSpacing}
              onChange={e => updateSetting('lineSpacing', e.target.value)}
              style={{ minWidth: '140px', minHeight: '42px' }}
              aria-label="Line Spacing"
            >
              <option value="standard">Standard</option>
              <option value="relaxed">Relaxed (Default)</option>
              <option value="loose">Loose</option>
            </select>
          </div>

          {/* Letter Spacing */}
          <div style={ROW_STYLE}>
            <div style={LABEL_STYLE}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-navy-dark)' }}>Letter Spacing</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>
                Normal · Wide (0.05em) · Extra Wide (0.09em)
              </span>
            </div>
            <select
              className="form-select"
              value={settings.letterSpacing}
              onChange={e => updateSetting('letterSpacing', e.target.value)}
              style={{ minWidth: '140px', minHeight: '42px' }}
              aria-label="Letter Spacing"
            >
              <option value="normal">Normal (Default)</option>
              <option value="wide">Wide</option>
              <option value="extraWide">Extra Wide</option>
            </select>
          </div>

          {/* Dyslexia-Friendly Font */}
          <div style={ROW_STYLE}>
            <div style={LABEL_STYLE}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-navy-dark)' }}>Dyslexia-Friendly Font</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>
                Switches to Atkinson Hyperlegible — designed for maximum readability with letter distinction
              </span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', minWidth: '100px' }}>
              <input
                type="checkbox"
                checked={settings.dyslexiaFont}
                onChange={e => updateSetting('dyslexiaFont', e.target.checked)}
                style={{ width: '20px', height: '20px' }}
                aria-label="Enable Dyslexia-Friendly Font"
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {settings.dyslexiaFont ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Section: Visual Accessibility */}
      <section className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-navy-dark)', marginBottom: '1.25rem' }}>
          <Eye size={20} />Visual Accessibility
        </h2>
        <div style={SECTION_STYLE}>
          {/* High Contrast */}
          <div style={ROW_STYLE}>
            <div style={LABEL_STYLE}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-navy-dark)' }}>High Contrast Mode</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>
                Bolder text and borders for improved readability under bright lighting or visual fatigue
              </span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', minWidth: '100px' }}>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={e => updateSetting('highContrast', e.target.checked)}
                style={{ width: '20px', height: '20px' }}
                aria-label="Enable High Contrast Mode"
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {settings.highContrast ? 'On' : 'Off'}
              </span>
            </label>
          </div>

          {/* Reduced Motion */}
          <div style={ROW_STYLE}>
            <div style={LABEL_STYLE}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-navy-dark)' }}>Reduce Animations</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>
                Eliminates page transitions and micro-animations for motion-sensitive users
              </span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', minWidth: '100px' }}>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={e => updateSetting('reducedMotion', e.target.checked)}
                style={{ width: '20px', height: '20px' }}
                aria-label="Enable Reduced Motion"
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {settings.reducedMotion ? 'On' : 'Off'}
              </span>
            </label>
          </div>

          {/* Reading Ruler */}
          <div style={ROW_STYLE}>
            <div style={LABEL_STYLE}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-navy-dark)' }}>Reading Guide Ruler</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>
                A horizontal highlight band that follows your mouse to help track the current reading line
              </span>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', minWidth: '100px' }}>
              <input
                type="checkbox"
                checked={settings.readingRuler}
                onChange={e => updateSetting('readingRuler', e.target.checked)}
                style={{ width: '20px', height: '20px' }}
                aria-label="Enable Reading Guide Ruler"
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                {settings.readingRuler ? 'On' : 'Off'}
              </span>
            </label>
          </div>
        </div>
      </section>

      {/* Section: Speech & Audio */}
      <section className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-navy-dark)', marginBottom: '1.25rem' }}>
          <Volume2 size={20} />Speech & Audio
        </h2>
        <div style={SECTION_STYLE}>
          {/* Speech Rate */}
          <div style={ROW_STYLE}>
            <div style={LABEL_STYLE}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-navy-dark)' }}>Default Read Aloud Speed</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>
                Slow (0.75x) · Normal (1.0x) · Fast (1.25x)
              </span>
            </div>
            <div style={{ display: 'inline-flex', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              {[{ val: 0.75, label: '0.75x Slow' }, { val: 1.0, label: '1.0x Normal' }, { val: 1.25, label: '1.25x Fast' }].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => updateSetting('speechRate', val)}
                  style={{
                    padding: '0.5rem 0.8rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    backgroundColor: settings.speechRate === val ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                    color: settings.speechRate === val ? '#ffffff' : 'var(--color-navy-dark)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  aria-pressed={settings.speechRate === val}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Voice */}
          {voices.length > 0 && (
            <div style={ROW_STYLE}>
              <div style={LABEL_STYLE}>
                <strong style={{ fontSize: '0.9rem', color: 'var(--color-navy-dark)' }}>Preferred Voice</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>
                  Voice used for the Read Aloud feature. Availability depends on your browser and operating system.
                </span>
              </div>
              <select
                className="form-select"
                value={settings.preferredVoice}
                onChange={e => updateSetting('preferredVoice', e.target.value)}
                style={{ minWidth: '200px', maxWidth: '300px', minHeight: '42px', fontSize: '0.85rem' }}
                aria-label="Preferred Text-to-Speech Voice"
              >
                <option value="">System Default</option>
                {voices.map(v => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Live Preview Box */}
      <section className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-navy-dark)', marginBottom: '0.75rem' }}>
          Live Reading Preview
        </h2>
        <div style={{ backgroundColor: 'var(--color-bg-base)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <p style={{ color: 'var(--color-navy-dark)', margin: 0 }}>
            The morning sun rose gently over the green valley. Cool breeze danced softly through the tall oak trees. Small birds began to sing sweet songs upon the branches.
          </p>
        </div>
      </section>

      {/* Reset Defaults */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {!confirmReset ? (
          <button type="button" onClick={() => setConfirmReset(true)} className="btn btn-ghost" style={{ color: 'var(--color-slate)' }}>
            <RotateCcw size={16} /><span>Reset All to Defaults</span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-slate)' }}>Reset all settings to defaults?</span>
            <button type="button" onClick={handleReset} className="btn btn-danger btn-sm">Yes, Reset</button>
            <button type="button" onClick={() => setConfirmReset(false)} className="btn btn-secondary btn-sm">Cancel</button>
          </div>
        )}
      </div>

      <MedicalDisclaimer compact />
    </div>
  );
}
