import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import {
  BookOpen,
  LayoutDashboard,
  Mic,
  BookmarkCheck,
  FileText,
  BarChart2,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Contrast,
  SlidersHorizontal,
  Compass
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { settings, updateSetting } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 0.75rem',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: isActive ? 'var(--color-primary)' : 'var(--color-navy)',
    backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.15s ease'
  });

  return (
    <header
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Brand Wordmark */}
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            textDecoration: 'none',
            color: 'var(--color-navy-dark)'
          }}
          aria-label="FluentPath — Reading Fluency Support Home"
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <BookOpen size={20} strokeWidth={2.5} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: 'var(--color-navy-dark)'
              }}
            >
              FluentPath
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'var(--color-slate)',
                letterSpacing: '0.02em'
              }}
            >
              Reading Fluency Support
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {isAuthenticated ? (
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.25rem'
            }}
            className="desktop-nav"
          >
            <NavLink to="/dashboard" style={navLinkStyle}>
              <LayoutDashboard size={17} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/read" style={navLinkStyle}>
              <Mic size={17} />
              <span>Read</span>
            </NavLink>
            <NavLink to="/practice" style={navLinkStyle}>
              <BookmarkCheck size={17} />
              <span>Practice</span>
            </NavLink>
            <NavLink to="/my-text" style={navLinkStyle}>
              <FileText size={17} />
              <span>My Text</span>
            </NavLink>
            <NavLink to="/progress" style={navLinkStyle}>
              <BarChart2 size={17} />
              <span>Progress</span>
            </NavLink>
            <NavLink to="/settings" style={navLinkStyle}>
              <Settings size={17} />
              <span>Settings</span>
            </NavLink>
          </nav>
        ) : (
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '1rem'
            }}
            className="desktop-nav"
          >
            <Link to="/login" className="btn btn-ghost btn-sm">
              Log In
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </nav>
        )}

        {/* Quick Accessibility Toggles & User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Quick Reading Ruler toggle */}
          <button
            type="button"
            onClick={() => updateSetting('readingRuler', !settings.readingRuler)}
            className="btn btn-ghost btn-sm"
            title={settings.readingRuler ? 'Turn off Reading Guide Ruler' : 'Turn on Reading Guide Ruler'}
            aria-label="Toggle Reading Guide Ruler"
            style={{
              padding: '0.4rem',
              color: settings.readingRuler ? 'var(--color-primary)' : 'var(--color-slate)',
              backgroundColor: settings.readingRuler ? 'var(--color-primary-light)' : 'transparent'
            }}
          >
            <SlidersHorizontal size={18} />
          </button>

          {/* Quick Contrast toggle */}
          <button
            type="button"
            onClick={() => updateSetting('highContrast', !settings.highContrast)}
            className="btn btn-ghost btn-sm"
            title={settings.highContrast ? 'Standard Contrast' : 'High Contrast Mode'}
            aria-label="Toggle High Contrast Mode"
            style={{
              padding: '0.4rem',
              color: settings.highContrast ? 'var(--color-navy-dark)' : 'var(--color-slate)'
            }}
          >
            <Contrast size={18} />
          </button>

          {/* User profile dropdown link on desktop */}
          {isAuthenticated && (
            <Link
              to="/profile"
              className="desktop-nav"
              style={{
                display: 'none',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-surface-hover)',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-navy-dark)',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
              title="View Profile"
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
            </Link>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.5rem',
              color: 'var(--color-navy-dark)'
            }}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            borderTop: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-bg-surface)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
          className="mobile-drawer"
        >
          {isAuthenticated ? (
            <>
              <div
                style={{
                  padding: '0.5rem',
                  marginBottom: '0.5rem',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-navy-dark)' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>{user?.email}</div>
                </div>
              </div>

              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={navLinkStyle}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/read"
                onClick={() => setMobileMenuOpen(false)}
                style={navLinkStyle}
              >
                <Mic size={18} />
                <span>Read Passages</span>
              </NavLink>

              <NavLink
                to="/practice"
                onClick={() => setMobileMenuOpen(false)}
                style={navLinkStyle}
              >
                <BookmarkCheck size={18} />
                <span>Word & Pronunciation Practice</span>
              </NavLink>

              <NavLink
                to="/my-text"
                onClick={() => setMobileMenuOpen(false)}
                style={navLinkStyle}
              >
                <FileText size={18} />
                <span>My Text</span>
              </NavLink>

              <NavLink
                to="/progress"
                onClick={() => setMobileMenuOpen(false)}
                style={navLinkStyle}
              >
                <BarChart2 size={18} />
                <span>Progress</span>
              </NavLink>

              <NavLink
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                style={navLinkStyle}
              >
                <Settings size={18} />
                <span>Accessibility Settings</span>
              </NavLink>

              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                style={navLinkStyle}
              >
                <User size={18} />
                <span>Profile</span>
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  ...navLinkStyle({ isActive: false }),
                  color: 'var(--color-danger)',
                  marginTop: '0.5rem',
                  width: '100%',
                  justifyContent: 'flex-start'
                }}
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
              >
                Home
              </Link>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-secondary"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 820px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-nav-toggle {
            display: none !important;
          }
          .mobile-drawer {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
