import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Shield, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderTop: '1px solid var(--color-border-subtle)',
        padding: '2.5rem 1rem 2rem 1rem',
        marginTop: 'auto'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '2rem'
          }}
        >
          {/* Brand info */}
          <div style={{ maxWidth: '380px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}
              >
                <BookOpen size={16} strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-navy-dark)' }}>
                FluentPath
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)', lineHeight: '1.5' }}>
              An accessibility-focused educational reading-practice platform. Designed to build reading fluency, word recognition, pronunciation, and lasting reading confidence.
            </p>
          </div>

          {/* Quick links */}
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-navy-dark)', marginBottom: '0.75rem' }}>
                Practice Modules
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <li><Link to="/read" style={{ color: 'var(--color-slate)' }}>Guided Passages</Link></li>
                <li><Link to="/practice" style={{ color: 'var(--color-slate)' }}>Word & Pronunciation</Link></li>
                <li><Link to="/my-text" style={{ color: 'var(--color-slate)' }}>Custom Texts</Link></li>
                <li><Link to="/progress" style={{ color: 'var(--color-slate)' }}>Progress History</Link></li>
              </ul>
            </div>

            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-navy-dark)', marginBottom: '0.75rem' }}>
                Accessibility & Support
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
                <li><Link to="/settings" style={{ color: 'var(--color-slate)' }}>Visual & Audio Settings</Link></li>
                <li><Link to="/profile" style={{ color: 'var(--color-slate)' }}>Learning Goals</Link></li>
                <li><span style={{ color: 'var(--color-slate)' }}>English & Tamil Support</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Required Non-Medical Educational Disclaimer */}
        <div
          role="note"
          aria-label="Educational Disclaimer"
          style={{
            borderTop: '1px solid var(--color-border-subtle)',
            paddingTop: '1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            fontSize: '0.8rem',
            color: 'var(--color-slate)',
            lineHeight: '1.5'
          }}
        >
          <Shield size={18} color="var(--color-slate)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Educational Reading-Practice Platform Disclaimer:</strong> FluentPath is an educational technology solution dedicated to reading fluency, word recognition, pronunciation practice, and reading confidence. FluentPath does not diagnose, treat, or medically assess dyslexia or any other medical or cognitive condition. For clinical or medical assessments, consult a qualified healthcare or educational psychologist.
          </div>
        </div>

        {/* Copyright notice */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.75rem',
            color: 'var(--color-slate-light)',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <span>&copy; {new Date().getFullYear()} FluentPath — Reading Fluency Support. All rights reserved.</span>
          <span>Keyboard accessible &bull; High-contrast enabled &bull; Speech API powered</span>
        </div>
      </div>
    </footer>
  );
}
