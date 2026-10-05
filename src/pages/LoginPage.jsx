import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { BookOpen, LogIn, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await login(email, password);
      addToast({
        type: 'success',
        message: `Welcome back, ${user.name}! Ready for today's reading practice.`
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@fluentpath.org');
    setPassword('password123');
    setError('');
  };

  return (
    <div
      style={{
        maxWidth: '460px',
        margin: '2rem auto',
        padding: '1rem'
      }}
    >
      <div className="card" style={{ padding: '2rem' }}>
        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'var(--color-primary)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem'
            }}
          >
            <BookOpen size={26} strokeWidth={2.5} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>
            FluentPath
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)', marginTop: '0.25rem' }}>
            Reading Fluency Support &bull; Log in to continue
          </p>
        </div>

        {/* Demo Account Quick-Fill Card */}
        <div
          style={{
            backgroundColor: 'var(--color-primary-light)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}
        >
          <div style={{ fontSize: '0.825rem', color: 'var(--color-primary-text)' }}>
            <strong>Demo Account:</strong> demo@fluentpath.org
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            className="btn btn-primary btn-sm"
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', minHeight: '32px' }}
          >
            <Sparkles size={13} />
            <span>Fill Demo</span>
          </button>
        </div>

        {error && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-danger-light)',
              color: 'var(--color-danger-text)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              fontSize: '0.875rem'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. reader@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={isSubmitting}
          >
            <LogIn size={18} />
            <span>{isSubmitting ? 'Logging in...' : 'Log In to FluentPath'}</span>
          </button>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--color-border-subtle)',
            fontSize: '0.875rem',
            color: 'var(--color-slate)'
          }}
        >
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Create one free <ArrowRight size={14} style={{ display: 'inline' }} />
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <MedicalDisclaimer compact={true} />
      </div>
    </div>
  );
}
