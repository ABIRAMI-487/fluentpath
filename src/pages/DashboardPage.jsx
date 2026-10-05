import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import {
  BookOpen,
  Mic,
  BookmarkCheck,
  FileText,
  Flame,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(() => storageService.getProgressStats());

  useEffect(() => {
    setStats(storageService.getProgressStats());
  }, []);

  const dailyGoal = user?.dailyGoalMinutes || 10;
  const todayMinutes = stats.todayPracticeMinutes || 0;
  const goalPercent = Math.min(100, Math.round((todayMinutes / dailyGoal) * 100));

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          backgroundColor: 'var(--color-bg-surface)',
          padding: '1.75rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary">
              <Sparkles size={13} />
              <span>FluentPath Learning Space</span>
            </span>
            <span className="badge badge-accent">
              Level: {user?.readingLevel || 'Intermediate'}
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-dark)', letterSpacing: '-0.02em' }}>
            Welcome back, {user?.name || 'Reader'}!
          </h1>
          <p style={{ color: 'var(--color-slate)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Take your time, breathe smoothly, and read at whatever pace feels comfortable today.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/read" className="btn btn-primary btn-lg">
            <Mic size={18} />
            <span>Start Reading</span>
          </Link>
          <Link to="/practice" className="btn btn-secondary btn-lg">
            <BookmarkCheck size={18} />
            <span>Practice Words</span>
          </Link>
        </div>
      </section>

      {/* Metrics Row: Current Level, Recent Accuracy, Completed Sessions, Streak, Today's Practice */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '1rem'
        }}
      >
        {/* Streak */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-slate)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active Streak</span>
            <Flame size={20} color={stats.streakDays > 0 ? '#ea580c' : 'var(--color-slate-light)'} />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>
            {stats.streakDays} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-slate)' }}>{stats.streakDays === 1 ? 'day' : 'days'}</span>
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--color-slate)', marginTop: '0.25rem' }}>
            {stats.streakDays > 0 ? 'Consistent practice streak' : 'Complete a reading today to start'}
          </div>
        </div>

        {/* Recent Accuracy */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-slate)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Average Accuracy</span>
            <Award size={20} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>
            {stats.hasData ? `${stats.averageAccuracy}%` : '—'}
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--color-slate)', marginTop: '0.25rem' }}>
            {stats.hasData ? 'Based on actual recorded sessions' : 'No recorded sessions yet'}
          </div>
        </div>

        {/* Completed Sessions */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-slate)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Completed Sessions</span>
            <CheckCircle2 size={20} color="var(--color-accent)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>
            {stats.totalSessions}
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--color-slate)', marginTop: '0.25rem' }}>
            {stats.totalMinutes} total reading minutes
          </div>
        </div>

        {/* Today's Practice Progress */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-slate)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Today's Goal</span>
            <Clock size={20} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>
            {todayMinutes} <span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--color-slate)' }}>/ {dailyGoal}m</span>
          </div>
          <div style={{ height: '6px', backgroundColor: 'var(--color-border-subtle)', borderRadius: '999px', margin: '0.4rem 0', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${goalPercent}%`,
                backgroundColor: goalPercent >= 100 ? 'var(--color-success)' : 'var(--color-primary)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--color-slate)' }}>
            {goalPercent >= 100 ? 'Daily goal reached!' : `${dailyGoal - todayMinutes}m remaining today`}
          </div>
        </div>
      </section>

      {/* Main Action Hub */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Guided Reading Passages Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <BookOpen size={22} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
                Guided Reading Passages
              </h2>
            </div>
            <p style={{ color: 'var(--color-slate)', fontSize: '0.925rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Read passages in English or தமிழ். Utilize real-time microphone speech recognition, word highlighting, or natural read-aloud listening.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <span className="badge badge-primary">Speech Recognition</span>
              <span className="badge badge-accent">Read Aloud Audio</span>
              <span className="badge badge-success">Beginner to Advanced</span>
            </div>
          </div>
          <Link to="/read" className="btn btn-primary" style={{ width: '100%' }}>
            <span>Explore Passages</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Word and Pronunciation Practice Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-accent-light)',
                  color: 'var(--color-accent-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <BookmarkCheck size={22} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
                Word & Pronunciation Lab
              </h2>
            </div>
            <p style={{ color: 'var(--color-slate)', fontSize: '0.925rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Focus on individual multi-syllable words. Listen to native phonetic breakdowns, speak each word, and get instant gentle verification.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <span className="badge badge-accent">Syllable Division</span>
              <span className="badge badge-primary">Phonetics</span>
              <span className="badge badge-warning">Microphone Feedback</span>
            </div>
          </div>
          <Link to="/practice" className="btn btn-secondary" style={{ width: '100%' }}>
            <span>Practice Word Pronunciation</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* My Custom Texts Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: '#f1f5f9',
                  color: 'var(--color-navy)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FileText size={22} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
                My Text Collection
              </h2>
            </div>
            <p style={{ color: 'var(--color-slate)', fontSize: '0.925rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Paste stories, poems, school assignments, or favorite articles to practice reading with all speech and accessibility tools.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <span className="badge badge-primary">Custom Passages</span>
              <span className="badge badge-accent">Saved Locally</span>
            </div>
          </div>
          <Link to="/my-text" className="btn btn-secondary" style={{ width: '100%' }}>
            <span>Manage My Texts</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Recent Activity Table / Truthful Empty State */}
      <section className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
              Recent Practice Sessions
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-slate)' }}>
              Real history recorded directly from your practice sessions.
            </p>
          </div>
          {stats.hasData && (
            <Link to="/progress" className="btn btn-ghost btn-sm" style={{ fontWeight: 600 }}>
              <span>View Full Progress</span>
              <ArrowRight size={15} />
            </Link>
          )}
        </div>

        {stats.hasData && stats.recentSessions.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border-subtle)', color: 'var(--color-slate)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Passage</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Language</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Accuracy</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Duration</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Reading Speed</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSessions.slice(0, 5).map((session) => (
                  <tr key={session.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600, color: 'var(--color-navy-dark)' }}>
                      {session.passageTitle}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className="badge badge-primary">
                        {session.language === 'ta' ? 'தமிழ்' : 'English'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color:
                            session.accuracyPercentage >= 80
                              ? 'var(--color-success)'
                              : session.accuracyPercentage >= 60
                              ? 'var(--color-warning)'
                              : 'var(--color-navy)'
                        }}
                      >
                        {session.accuracyPercentage}%
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-slate)' }}>
                      {session.durationSeconds ? `${Math.round(session.durationSeconds)}s` : '—'}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-slate)' }}>
                      {session.wpm ? `${session.wpm} WPM` : '—'}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-slate)', fontSize: '0.8rem' }}>
                      {session.timestamp ? new Date(session.timestamp).toLocaleDateString() : 'Today'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              padding: '2.5rem 1rem',
              textAlign: 'center',
              backgroundColor: 'var(--color-bg-base)',
              borderRadius: 'var(--radius-md)',
              border: '1px dashed var(--color-border)'
            }}
          >
            <Calendar size={36} color="var(--color-slate-light)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-navy-dark)', marginBottom: '0.35rem' }}>
              No reading sessions recorded yet
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)', maxWidth: '440px', margin: '0 auto 1.25rem auto' }}>
              FluentPath never shows fake progress statistics. Complete your first reading passage to start tracking your fluency growth!
            </p>
            <Link to="/read" className="btn btn-primary btn-sm">
              <Mic size={16} />
              <span>Start Your First Session</span>
            </Link>
          </div>
        )}
      </section>

      {/* Mandatory Non-Medical Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
}
