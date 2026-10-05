// Authentication Service for FluentPath
const USER_KEY = 'fluentpath_user';
const USERS_DB_KEY = 'fluentpath_users_db';

// Pre-seeded demo user for quick testing if database empty
const INITIAL_DEMO_USERS = [
  {
    id: 'demo_user_1',
    name: 'Alex Rivera',
    email: 'demo@fluentpath.org',
    password: 'password123',
    preferredLanguage: 'en',
    readingLevel: 'Intermediate',
    dailyGoalMinutes: 10,
    onboarded: true,
    createdAt: new Date().toISOString()
  }
];

function getUsersDb() {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    if (!raw) {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return INITIAL_DEMO_USERS;
  }
}

function saveUsersDb(users) {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving users db:', err);
  }
}

export const authService = {
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  login(email, password) {
    const users = getUsersDb();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) {
      throw new Error('Please enter your email address.');
    }
    if (!cleanPassword) {
      throw new Error('Please enter your password.');
    }

    const found = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      throw new Error('No account found with this email. Please register first or use the demo login.');
    }

    if (found.password !== cleanPassword) {
      throw new Error('Incorrect password. Please verify and try again.');
    }

    // Clone user without password for session storage
    const sessionUser = { ...found };
    delete sessionUser.password;

    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  register({ name, email, password, confirmPassword, preferredLanguage = 'en' }) {
    const users = getUsersDb();
    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();
    const cleanConfirm = (confirmPassword || '').trim();

    if (!cleanName || cleanName.length < 2) {
      throw new Error('Please enter your full name (minimum 2 characters).');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      throw new Error('Please provide a valid email address.');
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    if (cleanPassword !== cleanConfirm) {
      throw new Error('Passwords do not match. Please retype carefully.');
    }

    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email address already exists. Please log in.');
    }

    const newUser = {
      id: 'user_' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      preferredLanguage: preferredLanguage || 'en',
      readingLevel: 'Beginner',
      dailyGoalMinutes: 10,
      onboarded: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsersDb(users);

    const sessionUser = { ...newUser };
    delete sessionUser.password;
    localStorage.setItem(USER_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  updateProfile(updates) {
    const current = this.getCurrentUser();
    if (!current) throw new Error('Not authenticated');

    const users = getUsersDb();
    const idx = users.findIndex(u => u.id === current.id);

    const updatedUser = {
      ...current,
      ...updates
    };

    if (idx !== -1) {
      users[idx] = {
        ...users[idx],
        ...updates
      };
      saveUsersDb(users);
    }

    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },

  logout() {
    localStorage.removeItem(USER_KEY);
  }
};
