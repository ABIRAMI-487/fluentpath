import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', message, duration = 4000 }) => {
    const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const newToast = { id, type, message };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Notification Container with ARIA live region */}
      <div
        role="region"
        aria-label="Notifications"
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 11000,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '400px',
          width: 'calc(100vw - 3rem)',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((toast) => {
          let bg = 'var(--color-bg-surface)';
          let borderColor = 'var(--color-border)';
          let icon = <Info size={20} color="var(--color-primary)" />;

          if (toast.type === 'success') {
            borderColor = 'var(--color-success)';
            icon = <CheckCircle2 size={20} color="var(--color-success)" />;
          } else if (toast.type === 'error') {
            borderColor = 'var(--color-danger)';
            icon = <AlertCircle size={20} color="var(--color-danger)" />;
          } else if (toast.type === 'warning') {
            borderColor = 'var(--color-warning)';
            icon = <AlertCircle size={20} color="var(--color-warning)" />;
          }

          return (
            <div
              key={toast.id}
              role="status"
              aria-live="polite"
              style={{
                pointerEvents: 'auto',
                backgroundColor: bg,
                border: `2px solid ${borderColor}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.875rem 1rem',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                color: 'var(--color-navy-dark)'
              }}
            >
              <div style={{ flexShrink: 0, marginTop: '2px' }}>{icon}</div>
              <div style={{ flex: 1, fontSize: '0.925rem', lineHeight: '1.4' }}>
                {toast.message}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                aria-label="Close notification"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-slate)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
