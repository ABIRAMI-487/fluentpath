// LocalStorage Service for FluentPath
const KEYS = {
  CURRENT_USER: 'fluentpath_user',
  USERS_LIST: 'fluentpath_users_db',
  SESSIONS: 'fluentpath_sessions_v1',
  CUSTOM_TEXTS: 'fluentpath_custom_texts_v1',
  SETTINGS: 'fluentpath_settings_v1',
  PRACTICE_WORDS: 'fluentpath_flagged_words_v1'
};

export const DEFAULT_SETTINGS = {
  fontSize: 'medium', // small (15px), medium (18px), large (22px), xlarge (26px)
  lineSpacing: 'relaxed', // standard (1.5), relaxed (1.8), loose (2.2)
  letterSpacing: 'normal', // normal (0.01em), wide (0.05em), extraWide (0.1em)
  dyslexiaFont: false, // Atkinson Hyperlegible
  highContrast: false,
  reducedMotion: false,
  speechRate: 1.0, // 0.75, 1.0, 1.25
  preferredVoice: '',
  readingRuler: false,
  rulerHeight: 48
};

// Safe JSON parser
function safeGet(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export const storageService = {
  // Settings
  getSettings() {
    return { ...DEFAULT_SETTINGS, ...safeGet(KEYS.SETTINGS, {}) };
  },
  saveSettings(settings) {
    safeSet(KEYS.SETTINGS, settings);
  },

  // Sessions History (strictly real data, no fake seed data)
  getSessions() {
    return safeGet(KEYS.SESSIONS, []);
  },
  saveSession(sessionData) {
    const sessions = this.getSessions();
    const newSession = {
      id: 'session_' + Date.now(),
      timestamp: new Date().toISOString(),
      ...sessionData
    };
    sessions.unshift(newSession);
    safeSet(KEYS.SESSIONS, sessions);
    return newSession;
  },
  clearSessions() {
    safeSet(KEYS.SESSIONS, []);
  },

  // Genuine Progress Statistics Calculation
  getProgressStats() {
    const sessions = this.getSessions();
    if (!sessions || sessions.length === 0) {
      return {
        hasData: false,
        totalSessions: 0,
        totalDurationSeconds: 0,
        totalMinutes: 0,
        averageAccuracy: 0,
        averageWPM: 0,
        streakDays: 0,
        todayPracticeMinutes: 0,
        todayCompletedSessions: 0,
        recentSessions: []
      };
    }

    const totalSessions = sessions.length;
    let totalSeconds = 0;
    let totalAccuracy = 0;
    let totalWPM = 0;
    let wpmCount = 0;

    const todayStr = new Date().toISOString().split('T')[0];
    let todaySeconds = 0;
    let todaySessionsCount = 0;

    // Track unique practice dates for streak calculation
    const uniqueDates = new Set();

    sessions.forEach(s => {
      const dur = Number(s.durationSeconds) || 0;
      totalSeconds += dur;
      totalAccuracy += Number(s.accuracyPercentage) || 0;

      if (s.wpm && Number(s.wpm) > 0) {
        totalWPM += Number(s.wpm);
        wpmCount++;
      }

      const sessionDate = s.timestamp ? s.timestamp.split('T')[0] : '';
      if (sessionDate) {
        uniqueDates.add(sessionDate);
        if (sessionDate === todayStr) {
          todaySeconds += dur;
          todaySessionsCount++;
        }
      }
    });

    // Calculate genuine streak
    let streak = 0;
    const sortedDates = Array.from(uniqueDates).sort().reverse();
    
    if (sortedDates.length > 0) {
      const msPerDay = 86400000;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const latestDate = new Date(sortedDates[0]);
      latestDate.setHours(0, 0, 0, 0);

      const diffDays = Math.round((today - latestDate) / msPerDay);

      // Streak continues if practice was today (0) or yesterday (1)
      if (diffDays === 0 || diffDays === 1) {
        streak = 1;
        let prevDate = latestDate;
        for (let i = 1; i < sortedDates.length; i++) {
          const currDate = new Date(sortedDates[i]);
          currDate.setHours(0, 0, 0, 0);
          const gap = Math.round((prevDate - currDate) / msPerDay);
          if (gap === 1) {
            streak++;
            prevDate = currDate;
          } else {
            break;
          }
        }
      }
    }

    return {
      hasData: true,
      totalSessions,
      totalDurationSeconds: totalSeconds,
      totalMinutes: Math.round(totalSeconds / 60),
      averageAccuracy: Math.round(totalAccuracy / totalSessions),
      averageWPM: wpmCount > 0 ? Math.round(totalWPM / wpmCount) : 0,
      streakDays: streak,
      todayPracticeMinutes: Math.round(todaySeconds / 60),
      todayCompletedSessions: todaySessionsCount,
      recentSessions: sessions.slice(0, 10)
    };
  },

  // Custom User Passages (My Text)
  getCustomTexts() {
    return safeGet(KEYS.CUSTOM_TEXTS, []);
  },
  saveCustomText(customText) {
    const list = this.getCustomTexts();
    if (customText.id) {
      const index = list.findIndex(item => item.id === customText.id);
      if (index !== -1) {
        list[index] = { ...list[index], ...customText, updatedAt: new Date().toISOString() };
      } else {
        list.unshift({ ...customText, createdAt: new Date().toISOString() });
      }
    } else {
      const newItem = {
        id: 'custom_' + Date.now(),
        ...customText,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      list.unshift(newItem);
    }
    safeSet(KEYS.CUSTOM_TEXTS, list);
    return list;
  },
  deleteCustomText(id) {
    const list = this.getCustomTexts().filter(item => item.id !== id);
    safeSet(KEYS.CUSTOM_TEXTS, list);
    return list;
  },

  // Practice Words flagged by user
  getFlaggedWords() {
    return safeGet(KEYS.PRACTICE_WORDS, []);
  },
  saveFlaggedWord(wordObj) {
    const words = this.getFlaggedWords();
    const existingIndex = words.findIndex(w => w.word.toLowerCase() === wordObj.word.toLowerCase());
    if (existingIndex >= 0) {
      words[existingIndex] = { ...words[existingIndex], ...wordObj, lastReviewed: new Date().toISOString() };
    } else {
      words.unshift({
        id: 'word_' + Date.now(),
        ...wordObj,
        addedAt: new Date().toISOString(),
        reviewCount: 0
      });
    }
    safeSet(KEYS.PRACTICE_WORDS, words);
  },
  removeFlaggedWord(wordText) {
    const words = this.getFlaggedWords().filter(w => w.word.toLowerCase() !== wordText.toLowerCase());
    safeSet(KEYS.PRACTICE_WORDS, words);
  }
};
