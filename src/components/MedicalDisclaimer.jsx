import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function MedicalDisclaimer({ compact = false }) {
  if (compact) {
    return (
      <div
        role="note"
        aria-label="Educational Notice"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          color: 'var(--color-slate)',
          padding: '0.5rem 0.75rem',
          backgroundColor: 'var(--color-bg-surface-hover)',
          borderRadius: 'var(--radius-sm)',
          borderLeft: '3px solid var(--color-slate-light)'
        }}
      >
        <ShieldAlert size={16} color="var(--color-slate)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Educational Notice:</strong> FluentPath supports literacy and reading confidence. FluentPath does not diagnose, treat, or medically evaluate dyslexia or any health condition.
        </span>
      </div>
    );
  }

  return (
    <aside
      role="note"
      aria-label="Non-Medical Educational Notice"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border)',
        borderLeft: '4px solid var(--color-primary)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.25rem',
        margin: '1.5rem 0',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.875rem'
      }}
    >
      <ShieldAlert size={22} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
      <div style={{ fontSize: '0.875rem', color: 'var(--color-navy)' }}>
        <strong style={{ display: 'block', marginBottom: '0.25rem', color: 'var(--color-navy-dark)' }}>
          Educational Reading-Practice Platform Notice
        </strong>
        FluentPath is an accessibility-focused educational platform designed to support reading fluency, word recognition, pronunciation practice, reading confidence, and independent practice. FluentPath is not a medical tool and does not diagnose, treat, or medically assess dyslexia or any other learning or health condition.
      </div>
    </aside>
  );
}
