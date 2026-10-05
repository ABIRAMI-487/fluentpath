import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ReadingRuler from './components/ReadingRuler';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import ReadPage from './pages/ReadPage';
import PracticePage from './pages/PracticePage';
import MyTextPage from './pages/MyTextPage';
import ProgressPage from './pages/ProgressPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

function AppLayout({ children }) {
  return (
    <div className="app-container">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <ReadingRuler />
      <main id="main-content" className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <AppLayout>
                    <LandingPage />
                  </AppLayout>
                }
              />
              <Route
                path="/login"
                element={
                  <AppLayout>
                    <LoginPage />
                  </AppLayout>
                }
              />
              <Route
                path="/register"
                element={
                  <AppLayout>
                    <RegisterPage />
                  </AppLayout>
                }
              />

              {/* Protected Routes */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <OnboardingPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <DashboardPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/read"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ReadPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/practice"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <PracticePage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-text"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <MyTextPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/progress"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ProgressPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SettingsPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ProfilePage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}
