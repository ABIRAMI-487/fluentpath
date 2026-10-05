# FluentPath — Reading Fluency Support

> An accessibility-focused educational platform for building word recognition, pronunciation mastery, and reading confidence — in both **English** and **Tamil (தமிழ்)**.

🌐 **Live Demo:** [https://peppy-banoffee-f40654.netlify.app](https://peppy-banoffee-f40654.netlify.app)

> **Demo Account:** Email `demo@fluentpath.org` | Password `password123`

---

## 📖 About

FluentPath is a reading fluency practice web app built for learners of all levels — especially those with dyslexia, reading difficulties, or low-tracking challenges. It combines real-time speech recognition, text-to-speech (TTS), and rich accessibility customizations into a structured, pressure-free reading practice routine.

---

## ✨ Features

### 🎙️ Real-time Speech Recognition
- Speak aloud while reading curated passages
- Words highlight in green as you read them correctly
- Immediate, non-judgmental feedback

### 🔊 Natural Read Aloud (TTS)
- Listen to any passage or word at adjustable speeds: **0.75×** (slow), **1.0×** (normal), **1.25×** (fast)
- Synced visual word tracking while audio plays

### 🌐 English & Tamil Reading
- Practice multi-level passages — literature, nature stories, philosophical essays
- Full support for **Tamil (தமிழ்)** with Noto Sans Tamil font

### ♿ Dyslexia & Accessibility Accommodations
- Adjustable font size, line spacing, and letter spacing
- Dyslexia-friendly fonts (Lexend, Atkinson Hyperlegible)
- High-contrast color palette
- Interactive **Reading Ruler** overlay to aid focus

### 📚 My Text
- Paste or upload your own text for custom reading practice

### 📊 Progress Tracking
- Track words-per-minute (WPM) accuracy over time
- Review tricky words with syllable breakdowns

### 🔐 Authentication & Onboarding
- Register / Login with local auth
- Onboarding flow to personalize the experience

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 18](https://react.dev/) |
| Build Tool | [Vite 6](https://vitejs.dev/) |
| Routing | [React Router v6](https://reactrouter.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Fonts | Lexend, Atkinson Hyperlegible, Noto Sans Tamil (Google Fonts) |
| Styling | Vanilla CSS with CSS custom properties |
| Hosting | [Netlify](https://netlify.com) |

---

## 📁 Project Structure

```
fluent/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Footer.jsx              # Site-wide footer
│   │   ├── MedicalDisclaimer.jsx   # Non-medical educational disclaimer
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── ProtectedRoute.jsx      # Auth guard for protected pages
│   │   └── ReadingRuler.jsx        # Accessibility reading ruler overlay
│   ├── context/
│   │   ├── AuthContext.jsx         # Authentication state
│   │   ├── SettingsContext.jsx     # User accessibility settings
│   │   └── ToastContext.jsx        # Global toast notifications
│   ├── pages/
│   │   ├── LandingPage.jsx         # Home / marketing page
│   │   ├── LoginPage.jsx           # Login form
│   │   ├── RegisterPage.jsx        # Registration form
│   │   ├── OnboardingPage.jsx      # New user onboarding
│   │   ├── DashboardPage.jsx       # User dashboard
│   │   ├── ReadPage.jsx            # Reading practice (TTS + speech recognition)
│   │   ├── PracticePage.jsx        # Word practice exercises
│   │   ├── MyTextPage.jsx          # Custom user-uploaded texts
│   │   ├── ProgressPage.jsx        # Progress & WPM tracking
│   │   ├── SettingsPage.jsx        # Accessibility & display settings
│   │   └── ProfilePage.jsx         # User profile
│   ├── services/
│   │   ├── authService.js              # Auth logic (login, register, demo)
│   │   ├── passagesData.js             # Curated reading passages (EN + Tamil)
│   │   ├── speechRecognitionService.js # Web Speech API integration
│   │   ├── speechSynthesisService.js   # TTS service
│   │   ├── storageService.js           # LocalStorage persistence
│   │   └── wordPracticeService.js      # Syllable breakdown & word drills
│   ├── App.jsx         # Root app with routing
│   ├── index.css       # Global design system & CSS variables
│   └── main.jsx        # React entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## 🗺️ Routes

| Path | Access | Page |
|---|---|---|
| `/` | Public | Landing Page |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/onboarding` | 🔒 Protected | Onboarding |
| `/dashboard` | 🔒 Protected | Dashboard |
| `/read` | 🔒 Protected | Reading Practice |
| `/practice` | 🔒 Protected | Word Practice |
| `/my-text` | 🔒 Protected | My Text |
| `/progress` | 🔒 Protected | Progress |
| `/settings` | 🔒 Protected | Settings |
| `/profile` | 🔒 Protected | Profile |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd fluent

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The production-ready files will be output to the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 🔐 Demo Access

You can try FluentPath without registering:

| Field | Value |
|---|---|
| Email | `demo@fluentpath.org` |
| Password | `password123` |

Or create a new account for free at [https://peppy-banoffee-f40654.netlify.app/register](https://peppy-banoffee-f40654.netlify.app/register).

---

## ♿ Accessibility Commitment

FluentPath is built with accessibility at its core:
- Skip-to-content link for keyboard users
- Semantic HTML5 structure
- Dyslexia-friendly fonts and spacing customization
- High-contrast color modes
- Reading ruler overlay for focus tracking
- Screen-reader friendly labels

---

## ⚠️ Disclaimer

FluentPath is an **educational reading practice tool** and is **not** a medical or therapeutic service. It is not a substitute for professional evaluation or treatment. If you or someone you know has a reading difficulty or learning disability, please consult a qualified specialist.

---

## 📄 License

This project is private. All rights reserved.
