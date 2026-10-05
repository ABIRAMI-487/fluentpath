import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import {
  Compass,
  Languages,
  Target,
  Gauge,
  Sliders,
  Check,
  ArrowRight,
  Eye,
  Type,
  CheckCircle2
} from 'lucide-react';

export default function OnboardingPage() {
  const { user, updateProfile } = useAuth();
  const { settings, updateSetting } = useSettings();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || 'en');
  const [readingLevel, setReadingLevel] = useState(user?.readingLevel || 'Intermediate');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(user?.dailyGoalMinutes || 10);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      await updateProfile({
        preferredLanguage,
        readingLevel,
        dailyGoalMinutes: Number(dailyGoalMinutes),
        onboarded: true
      });

      addToast({
        type: 'success',
        message: 'Personalization complete! Welcome to your FluentPath reading space.'
      });

      navigate('/dashboard');
    } catch (err) {
      addToast({
        type: 'error',
        message: 'Could not save profile settings: ' + err.message
      });
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '1.5rem auto', padding: '1rem' }}>
      {/* Progress indicator */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)' }}>
            Step {step} of 4: {step === 1 ? 'Language' : step === 2 ? 'Reading Level' : step === 3 ? 'Daily Goal' : 'Accessibility'}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-slate)' }}>{step * 25}%</span>
        </div>
        <div style={{ height: '6px', backgroundColor: 'var(--color-border-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${step * 25}%`,
              backgroundColor: 'var(--color-primary)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {/* Step 1: Language */}
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Languages size={24} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
                Choose Your Primary Language
              </h2>
            </div>
            <p style={{ color: 'var(--color-slate)', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
              Select which language you want to focus on for reading passages and speech recognition.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setPreferredLanguage('en')}
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  border: preferredLanguage === 'en' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: preferredLanguage === 'en' ? 'var(--color-primary-light)' : 'var(--color-bg-surface)',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-navy-dark)', marginBottom: '0.25rem' }}>
                  English
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-slate)' }}>
                  Read curated passages, phonetics, and classic essays.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPreferredLanguage('ta')}
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  border: preferredLanguage === 'ta' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                  backgroundColor: preferredLanguage === 'ta' ? 'var(--color-primary-light)' : 'var(--color-bg-surface)',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-navy-dark)', marginBottom: '0.25rem' }}>
                  தமிழ் (Tamil)
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-slate)' }}>
                  தமிழ் சிறுகதைகள், திருக்குறள் நற்பண்புகள் மற்றும் உச்சரிப்பு.
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Reading Level */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Gauge size={24} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
                Select Your Comfortable Starting Level
              </h2>
            </div>
            <p style={{ color: 'var(--color-slate)', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
              FluentPath never tests or scores you aggressively. You can change levels whenever you like.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.5rem' }}>
              {[
                {
                  id: 'Beginner',
                  title: 'Beginner — Gentle Foundations',
                  desc: 'Shorter sentences, familiar vocabulary, simple syllable structures, comfortable rhythm.'
                },
                {
                  id: 'Intermediate',
                  title: 'Intermediate — Growing Fluency',
                  desc: 'Multi-clause sentences, richer descriptive vocabulary, expressive cadence.'
                },
                {
                  id: 'Advanced',
                  title: 'Advanced — Mastery & Expression',
                  desc: 'Complex academic and literary passages, nuanced articulation and pacing.'
                }
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setReadingLevel(lvl.id)}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: readingLevel === lvl.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: readingLevel === lvl.id ? 'var(--color-primary-light)' : 'var(--color-bg-surface)',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-navy-dark)' }}>{lvl.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-slate)', marginTop: '0.2rem' }}>
                      {lvl.desc}
                    </div>
                  </div>
                  {readingLevel === lvl.id && <CheckCircle2 size={20} color="var(--color-primary)" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Daily Goal */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Target size={24} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
                Set a Daily Reading Goal
              </h2>
            </div>
            <p style={{ color: 'var(--color-slate)', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
              Consistency builds reading confidence faster than long stressful sessions. Choose a modest goal to start.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[5, 10, 15, 20].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDailyGoalMinutes(mins)}
                  style={{
                    padding: '1.25rem 0.5rem',
                    borderRadius: 'var(--radius-md)',
                    border: dailyGoalMinutes === mins ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: dailyGoalMinutes === mins ? 'var(--color-primary-light)' : 'var(--color-bg-surface)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
                    {mins}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>minutes/day</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Accessibility Preferences with Live Preview */}
        {step === 4 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Sliders size={24} color="var(--color-primary)" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
                Personalize Your Reading View
              </h2>
            </div>
            <p style={{ color: 'var(--color-slate)', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
              Adjust text appearance for maximum comfort. You can fine-tune these anytime in Settings.
            </p>

            {/* Quick toggles */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  padding: '1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Dyslexia-Friendly Font</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Atkinson Hyperlegible</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dyslexiaFont}
                  onChange={(e) => updateSetting('dyslexiaFont', e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  aria-label="Toggle Dyslexia-Friendly Font"
                />
              </div>

              <div
                style={{
                  padding: '1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>High Contrast Theme</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Stronger text clarity</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={(e) => updateSetting('highContrast', e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  aria-label="Toggle High Contrast"
                />
              </div>

              <div
                style={{
                  padding: '1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Font Size</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Current: {settings.fontSize}</div>
                </div>
                <select
                  value={settings.fontSize}
                  onChange={(e) => updateSetting('fontSize', e.target.value)}
                  className="form-select"
                  style={{ minHeight: '36px', padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                  <option value="xlarge">Extra Large</option>
                </select>
              </div>

              <div
                style={{
                  padding: '1rem',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Reading Ruler</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>Visual line guide</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.readingRuler}
                  onChange={(e) => updateSetting('readingRuler', e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  aria-label="Toggle Reading Ruler"
                />
              </div>
            </div>

            {/* Live Text Preview Box */}
            <div
              style={{
                backgroundColor: 'var(--color-bg-base)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate)', marginBottom: '0.5rem' }}>
                LIVE PREVIEW:
              </div>
              <p style={{ margin: 0, color: 'var(--color-navy-dark)' }}>
                {preferredLanguage === 'ta'
                  ? 'கிழக்கு வானில் செங்கதிரோன் மெல்ல உதித்தான். அமைதியான காலைப் பொழுது மனதிற்குப் பேரமைதியைத் தருகிறது.'
                  : 'The morning sun rose gently over the green valley. Cool breeze danced softly through the tall oak trees.'}
              </p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="btn btn-secondary"
            >
              Back
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={handleNext}
            className="btn btn-primary"
          >
            <span>{step === 4 ? 'Finish & Open Dashboard' : 'Next Step'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <MedicalDisclaimer compact={true} />
      </div>
    </div>
  );
}
