import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { useToast } from '../context/ToastContext';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

export default function MyTextPage() {
  const { addToast } = useToast();
  const [customTexts, setCustomTexts] = useState(() => storageService.getCustomTexts());
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    language: 'en',
    difficulty: 'Intermediate'
  });
  const [formError, setFormError] = useState('');

  const refreshTexts = () => setCustomTexts(storageService.getCustomTexts());

  const handleOpenNew = () => {
    setFormData({ title: '', content: '', language: 'en', difficulty: 'Intermediate' });
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  };

  const handleEdit = (text) => {
    setFormData({
      title: text.title || '',
      content: text.content || '',
      language: text.language || 'en',
      difficulty: text.difficulty || 'Intermediate'
    });
    setEditingId(text.id);
    setFormError('');
    setShowForm(true);
  };

  const handleSave = () => {
    setFormError('');
    if (!formData.title.trim()) {
      setFormError('Please provide a title for this text.');
      return;
    }
    if (!formData.content.trim() || formData.content.trim().split(/\s+/).length < 5) {
      setFormError('Please enter at least 5 words of reading content.');
      return;
    }

    storageService.saveCustomText({
      id: editingId || undefined,
      title: formData.title.trim(),
      content: formData.content.trim(),
      language: formData.language,
      difficulty: formData.difficulty,
      category: 'My Text'
    });

    refreshTexts();
    setShowForm(false);
    setEditingId(null);
    addToast({ type: 'success', message: `"${formData.title}" saved to your collection!` });
  };

  const handleDelete = (id, title) => {
    if (!window.confirm(`Remove "${title}" from your saved texts?`)) return;
    storageService.deleteCustomText(id);
    refreshTexts();
    addToast({ type: 'info', message: `"${title}" removed from My Text.` });
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-primary"><FileText size={13} /><span>Custom Passages</span></span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>My Text Collection</h1>
          <p style={{ color: 'var(--color-slate)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Add your own stories, poems, school assignments, or articles to practice with all FluentPath tools.
          </p>
        </div>
        <button type="button" onClick={handleOpenNew} className="btn btn-primary">
          <Plus size={18} /><span>Add New Text</span>
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="card" style={{ padding: '1.75rem', border: '2px solid var(--color-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-navy-dark)' }}>
              {editingId ? 'Edit Saved Text' : 'Add New Custom Text'}
            </h2>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-ghost btn-sm">
              <X size={18} />
            </button>
          </div>

          {formError && (
            <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger-text)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              <AlertCircle size={16} /><span>{formError}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="ct-title">Title *</label>
              <input id="ct-title" type="text" className="form-input" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="e.g. My School Essay" />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="ct-lang">Language</label>
              <select id="ct-lang" className="form-select" value={formData.language} onChange={e => setFormData(p => ({ ...p, language: e.target.value }))}>
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="ct-diff">Difficulty</label>
              <select id="ct-diff" className="form-select" value={formData.difficulty} onChange={e => setFormData(p => ({ ...p, difficulty: e.target.value }))}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" htmlFor="ct-content">Reading Content *</label>
            <textarea
              id="ct-content"
              className="form-textarea"
              rows={8}
              value={formData.content}
              onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
              placeholder="Paste or type your reading passage here. Minimum 5 words..."
              style={{ resize: 'vertical', minHeight: '160px', lineHeight: 'var(--line-height-base)' }}
            />
            <span className="form-hint">
              Word count: {formData.content.trim() ? formData.content.trim().split(/\s+/).length : 0} words
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
            <button type="button" onClick={handleSave} className="btn btn-primary">
              <Check size={18} /><span>{editingId ? 'Update Text' : 'Save to Collection'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Texts List */}
      {customTexts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {customTexts.map(text => (
            <div key={text.id} className="card" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.25rem', padding: '1.25rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{text.difficulty}</span>
                  <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
                    {text.language === 'ta' ? 'தமிழ்' : 'English'}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-navy-dark)', marginBottom: '0.35rem' }}>
                  {text.title}
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {text.content}
                </p>
                <div style={{ fontSize: '0.775rem', color: 'var(--color-slate-light)', marginTop: '0.5rem' }}>
                  {text.content.trim().split(/\s+/).length} words &bull; Saved {text.createdAt ? new Date(text.createdAt).toLocaleDateString() : 'recently'}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
                <Link
                  to={`/read?customId=${text.id}`}
                  className="btn btn-primary btn-sm"
                  title="Practice reading this text"
                >
                  <BookOpen size={15} /><span>Read</span>
                </Link>
                <button
                  type="button"
                  onClick={() => handleEdit(text)}
                  className="btn btn-secondary btn-sm"
                  title="Edit this text"
                >
                  <Edit3 size={15} /><span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(text.id, text.title)}
                  className="btn btn-ghost btn-sm"
                  title="Delete this text"
                  style={{ color: 'var(--color-danger)' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : !showForm ? (
        <div style={{ padding: '3rem 1.5rem', textAlign: 'center', backgroundColor: 'var(--color-bg-surface)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
          <FileText size={42} color="var(--color-slate-light)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-navy-dark)', marginBottom: '0.5rem' }}>
            Your custom text collection is empty
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-slate)', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
            Add school reading assignments, favorite stories, poems, or any passage you'd like to practice with FluentPath's speech and audio tools.
          </p>
          <button type="button" onClick={handleOpenNew} className="btn btn-primary">
            <Plus size={18} /><span>Add Your First Text</span>
          </button>
        </div>
      ) : null}

      <MedicalDisclaimer compact />
    </div>
  );
}
