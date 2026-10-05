import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { storageService } from '../services/storageService';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import {
  User,
  LogOut,
  Save,
  AlertCircle,
  BookOpen,
  Target,
  Languages,
  Calendar,
  Trash2
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    preferredLanguage: user?.preferredLanguage || 'en',
    readingLevel: user?.readingLevel || 'Intermediate',
    dailyGoalMinutes: user?.dailyGoalMinutes || 10
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const stats = storageService.getProgressStats();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setFormError('');
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setFormError('Name must be at least 2 characters.');
      return;
    }
    try {
      setIsSubmitting(true);
      await updateProfile({
        name: formData.name.trim(),
        preferredLanguage: formData.preferredLanguage,
        readingLevel: formData.readingLevel,
        dailyGoalMinutes: Number(formData.dailyGoalMinutes)
      });
      setIsEditing(false);
      addToast({ type: 'success', message: 'Your profile has been updated successfully.' });
    } catch (err) {
      setFormError(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    addToast({ type: 'info', message: 'You have been logged out of FluentPath.' });
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-primary"><User size={13} /><span>Your Profile</span></span>
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>Profile & Learning Goals</h1>
        <p style={{ color: 'var(--color-slate)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Manage your reading preferences and language goals.
        </p>
      </div>

      {/* Profile Card */}
      <section className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.75rem', fontWeight: 800
            }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>{user?.name}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-slate)' }}>{user?.email}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-slate-light)', marginTop: '0.15rem' }}>
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'recently'}
              </div>
            </div>
          </div>

          {!isEditing && (
            <button type="button" onClick={() => setIsEditing(true)} className="btn btn-secondary">
              Edit Profile
            </button>
          )}
        </div>

        {formError && (
          <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger-text)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
            <AlertCircle size={16} /><span>{formError}</span>
          </div>
        )}

        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <input id="profile-name" name="name" type="text" className="form-input" value={formData.name} onChange={handleChange} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="profile-lang">Primary Language</label>
                <select id="profile-lang" name="preferredLanguage" className="form-select" value={formData.preferredLanguage} onChange={handleChange}>
                  <option value="en">English</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="profile-level">Reading Level</label>
                <select id="profile-level" name="readingLevel" className="form-select" value={formData.readingLevel} onChange={handleChange}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="profile-goal">Daily Goal (minutes)</label>
                <select id="profile-goal" name="dailyGoalMinutes" className="form-select" value={formData.dailyGoalMinutes} onChange={handleChange}>
                  {[5, 10, 15, 20, 30].map(m => <option key={m} value={m}>{m} minutes</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => { setIsEditing(false); setFormError(''); }} className="btn btn-secondary">Cancel</button>
              <button type="button" onClick={handleSave} className="btn btn-primary" disabled={isSubmitting}>
                <Save size={18} /><span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Languages size={22} color="var(--color-primary)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)', fontWeight: 600 }}>PRIMARY LANGUAGE</div>
                <div style={{ fontWeight: 700, color: 'var(--color-navy-dark)' }}>
                  {user?.preferredLanguage === 'ta' ? 'தமிழ் (Tamil)' : 'English'}
                </div>
              </div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <BookOpen size={22} color="var(--color-accent)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)', fontWeight: 600 }}>READING LEVEL</div>
                <div style={{ fontWeight: 700, color: 'var(--color-navy-dark)' }}>{user?.readingLevel || 'Intermediate'}</div>
              </div>
            </div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Target size={22} color="var(--color-primary)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)', fontWeight: 600 }}>DAILY GOAL</div>
                <div style={{ fontWeight: 700, color: 'var(--color-navy-dark)' }}>{user?.dailyGoalMinutes || 10} minutes / day</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Quick Summary Stats */}
      {stats.hasData && (
        <section className="card" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-navy-dark)', marginBottom: '1rem' }}>
            Your Practice Summary
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.875rem' }}>
            <div style={{ textAlign: 'center', padding: '0.875rem', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>{stats.totalSessions}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>Total Sessions</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.875rem', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>{stats.averageAccuracy}%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>Avg. Accuracy</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.875rem', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>{stats.totalMinutes}m</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>Total Reading Time</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.875rem', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>{stats.streakDays}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>Day Streak</div>
            </div>
          </div>
        </section>
      )}

      {/* Logout */}
      <section className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-navy-dark)', marginBottom: '0.75rem' }}>
          Account
        </h2>
        {!confirmLogout ? (
          <button type="button" onClick={() => setConfirmLogout(true)} className="btn btn-secondary" style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger-light)' }}>
            <LogOut size={18} /><span>Log Out of FluentPath</span>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-slate)' }}>Are you sure you want to log out?</span>
            <button type="button" onClick={handleLogout} className="btn btn-danger btn-sm">
              <LogOut size={16} /><span>Yes, Log Out</span>
            </button>
            <button type="button" onClick={() => setConfirmLogout(false)} className="btn btn-secondary btn-sm">Cancel</button>
          </div>
        )}
      </section>

      <MedicalDisclaimer compact />
    </div>
  );
}
