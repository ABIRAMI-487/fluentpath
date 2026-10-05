import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import {
  BarChart2,
  Calendar,
  Award,
  Clock,
  TrendingUp,
  Mic,
  Trash2,
  BookOpen
} from 'lucide-react';

function formatDuration(seconds) {
  if (!seconds) return '0s';
  const s = Math.round(Number(seconds));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem > 0 ? `${m}m ${rem}s` : `${m}m`;
}

export default function ProgressPage() {
  const [stats, setStats] = useState(() => storageService.getProgressStats());
  const [sessions, setSessions] = useState(() => storageService.getSessions());
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const handleClearAll = () => {
    storageService.clearSessions();
    setStats(storageService.getProgressStats());
    setSessions([]);
    setShowConfirmClear(false);
  };

  if (!stats.hasData) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary"><BarChart2 size={13} /><span>Reading Progress</span></span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>Your Progress History</h1>
          <p style={{ color: 'var(--color-slate)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            All statistics shown here are based exclusively on your completed practice sessions.
          </p>
        </div>

        {/* Authentic empty state — no fake data */}
        <div style={{ padding: '3.5rem 1.5rem', textAlign: 'center', backgroundColor: 'var(--color-bg-surface)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
          <Calendar size={48} color="var(--color-slate-light)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy-dark)', marginBottom: '0.5rem' }}>
            No practice sessions recorded yet
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-slate)', maxWidth: '500px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
            FluentPath never shows invented statistics. Complete a reading session in the <strong>Read</strong> module and your genuine accuracy, reading speed, and duration will appear here.
          </p>
          <Link to="/read" className="btn btn-primary">
            <Mic size={18} /><span>Start Your First Reading Session</span>
          </Link>
        </div>

        <MedicalDisclaimer compact />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary"><BarChart2 size={13} /><span>Reading Progress</span></span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>Your Progress History</h1>
          <p style={{ color: 'var(--color-slate)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Real statistics from {stats.totalSessions} completed practice session{stats.totalSessions !== 1 ? 's' : ''}.
          </p>
        </div>

        {!showConfirmClear ? (
          <button type="button" onClick={() => setShowConfirmClear(true)} className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }}>
            <Trash2 size={16} /><span>Clear History</span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: 'var(--color-danger-light)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--color-danger-text)' }}>Remove all session history?</span>
            <button type="button" onClick={handleClearAll} className="btn btn-danger btn-sm">Yes, clear</button>
            <button type="button" onClick={() => setShowConfirmClear(false)} className="btn btn-secondary btn-sm">Cancel</button>
          </div>
        )}
      </div>

      {/* Aggregate Summary Stats */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <Award size={26} color="var(--color-primary)" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>{stats.averageAccuracy}%</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>Average Accuracy</div>
        </div>
        <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <BookOpen size={26} color="var(--color-accent)" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>{stats.totalSessions}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>Total Sessions</div>
        </div>
        <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <Clock size={26} color="var(--color-primary)" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>{stats.totalMinutes}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>Total Minutes Read</div>
        </div>
        <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <TrendingUp size={26} color={stats.streakDays > 0 ? '#ea580c' : 'var(--color-slate-light)'} style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>{stats.streakDays}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>Day{stats.streakDays !== 1 ? 's' : ''} Streak</div>
        </div>
        {stats.averageWPM > 0 && (
          <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <Mic size={26} color="var(--color-primary)" style={{ marginBottom: '0.5rem' }} />
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>{stats.averageWPM}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>Avg. WPM</div>
          </div>
        )}
      </section>

      {/* Full Sessions Table */}
      <section className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-navy-dark)', marginBottom: '1rem' }}>
          All Practice Sessions (newest first)
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--color-border-subtle)', color: 'var(--color-slate)' }}>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Passage</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Language</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Difficulty</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Accuracy</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Duration</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>WPM</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(session => (
                <tr key={session.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: 'var(--color-navy-dark)', maxWidth: '200px' }}>
                    <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {session.passageTitle || 'Unknown'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                      {session.language === 'ta' ? 'தமிழ்' : 'English'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-slate)' }}>
                    {session.difficulty || '—'}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <span style={{
                      fontWeight: 700,
                      color: Number(session.accuracyPercentage) >= 80
                        ? 'var(--color-success)'
                        : Number(session.accuracyPercentage) >= 60
                        ? 'var(--color-warning)'
                        : 'var(--color-navy-dark)'
                    }}>
                      {session.accuracyPercentage}%
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-slate)' }}>
                    {formatDuration(session.durationSeconds)}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-slate)' }}>
                    {session.wpm ? `${session.wpm}` : '—'}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-slate)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {session.timestamp ? new Date(session.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <MedicalDisclaimer compact />
    </div>
  );
}
