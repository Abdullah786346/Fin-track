// Pure client-side localStorage authentication service (Zero backend / Zero external API dependency)

const USERS_KEY = 'fintrack_local_users';
const CURRENT_USER_KEY = 'fintrack_current_user';

const getLocalUsers = () => {
  try {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
  // Sign up a new user locally
  signUp: async (email, password, fullName) => {
    const users = getLocalUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      return { data: null, error: new Error('An account with this email address already exists.') };
    }

    const newUser = {
      uid: 'user_' + Date.now(),
      email: email.toLowerCase(),
      displayName: fullName || email.split('@')[0],
      createdAt: new Date().toISOString(),
      password, // stored in client localStorage for local authentication
    };

    users.push(newUser);
    saveLocalUsers(users);

    // Automatically sign in the user
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

    return { data: { user: newUser }, error: null };
  },

  // Sign in an existing user locally
  signIn: async (email, password) => {
    const users = getLocalUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return { data: null, error: new Error('Invalid email or password.') };
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return { data: { user }, error: null };
  },

  // Sign out the current user
  signOut: async () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    return { error: null };
  },

  // Get currently active logged-in user
  getCurrentUser: async () => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      const user = saved ? JSON.parse(saved) : null;
      return { user, error: null };
    } catch (e) {
      return { user: null, error: null };
    }
  },

  // Listen for auth state changes across components
  onAuthStateChange: (callback) => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      const user = saved ? JSON.parse(saved) : null;
      callback(user);
    } catch (e) {
      callback(null);
    }

    const handler = (e) => {
      if (e.key === CURRENT_USER_KEY) {
        try {
          const user = e.newValue ? JSON.parse(e.newValue) : null;
          callback(user);
        } catch (err) {
          callback(null);
        }
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  },

  getUserData: async (uid) => {
    const users = getLocalUsers();
    const user = users.find((u) => u.uid === uid);
    return { data: user || null, error: user ? null : new Error('User not found') };
  },
};
