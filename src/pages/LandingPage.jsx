import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import {
  BookOpen,
  Mic,
  Volume2,
  Sparkles,
  Sliders,
  Languages,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem 0 3rem 0' }}>
      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          padding: '3rem 1rem 2rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem'
        }}
      >
        <div className="badge badge-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
          <Sparkles size={15} />
          <span>Accessibility-Focused Reading Support</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--color-navy-dark)',
            maxWidth: '850px'
          }}
        >
          Read with confidence. Learn at your own pace.
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--color-slate)',
            maxWidth: '680px',
            lineHeight: '1.6'
          }}
        >
          FluentPath helps readers develop word recognition, pronunciation mastery, and steady reading fluency through guided speech recognition and accessible typography in English and Tamil.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '0.75rem'
          }}
        >
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              <span>Go to Your Dashboard</span>
              <ArrowRight size={18} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">
                <span>Get Started Free</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                <span>Log in to FluentPath</span>
              </Link>
            </>
          )}
        </div>

        {/* Quick Demo Credentials Notice */}
        <div
          style={{
            marginTop: '1rem',
            padding: '0.625rem 1rem',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            color: 'var(--color-slate)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Award size={16} color="var(--color-primary)" />
          <span>
            <strong>Instant Evaluation:</strong> Try demo account with email <code>demo@fluentpath.org</code> and password <code>password123</code> or register a new one.
          </span>
        </div>
      </section>

      {/* Feature Pillar Cards */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          margin: '2.5rem 0'
        }}
      >
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Mic size={22} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
            Real-time Speech Recognition
          </h2>
          <p style={{ fontSize: '0.925rem', color: 'var(--color-slate)', lineHeight: '1.5' }}>
            Speak aloud while reading curated passages. Words highlight as you read them correctly, giving you immediate feedback without judgment.
          </p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-accent-light)',
              color: 'var(--color-accent-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Volume2 size={22} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
            Natural Read Aloud (TTS)
          </h2>
          <p style={{ fontSize: '0.925rem', color: 'var(--color-slate)', lineHeight: '1.5' }}>
            Listen to any passage or word at comfortable speeds (0.75x slow, 1.0x normal, 1.25x fast) with synced visual word tracking.
          </p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Languages size={22} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
            English & Tamil Reading
          </h2>
          <p style={{ fontSize: '0.925rem', color: 'var(--color-slate)', lineHeight: '1.5' }}>
            Practice authentic multi-level literature, nature stories, and philosophical essays in both English and Tamil (தமிழ்).
          </p>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: '#fef3c7',
              color: '#b45309',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Sliders size={22} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
            Dyslexia & Low-Tracking Accommodations
          </h2>
          <p style={{ fontSize: '0.925rem', color: 'var(--color-slate)', lineHeight: '1.5' }}>
            Customize font size, line spacing, letter spacing, dyslexia-friendly fonts, high-contrast palette, and an interactive reading ruler.
          </p>
        </div>
      </section>

      {/* How FluentPath Works */}
      <section className="card" style={{ padding: '2rem', margin: '2.5rem 0' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--color-navy-dark)' }}>
          A Structured Four-Step Practice Routine
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">1</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Choose a Passage</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)' }}>
              Select a passage by difficulty or add your own favorite literature into My Text.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">2</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Listen First</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)' }}>
              Hear natural pacing and rhythm with the Read Aloud tool at your chosen speech speed.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">3</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Read Aloud</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)' }}>
              Activate the microphone. Words turn green as you read them, building muscle memory.
            </p>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-primary">4</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>Review & Celebrate</h3>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)' }}>
              Check your accuracy and words-per-minute without pressure. Practice tricky words with syllable breakdowns.
            </p>
          </div>
        </div>
      </section>

      {/* Mandatory Non-Medical Educational Disclaimer */}
      <MedicalDisclaimer />

      {/* Final Call to Action */}
      <section
        style={{
          textAlign: 'center',
          padding: '2.5rem 1.5rem',
          backgroundColor: 'var(--color-primary-light)',
          borderRadius: 'var(--radius-lg)',
          marginTop: '2rem'
        }}
      >
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary-text)', marginBottom: '0.75rem' }}>
          Ready to experience FluentPath?
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--color-navy)', maxWidth: '540px', margin: '0 auto 1.5rem auto' }}>
          Join readers strengthening their fluency and pronunciation every day.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create Free Account
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Log In
          </Link>
        </div>
      </section>
    </div>
  );
}
