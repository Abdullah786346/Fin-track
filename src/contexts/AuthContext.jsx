import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    authService.getCurrentUser().then(({ user }) => {
      setUser(user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const subscription = authService.onAuthStateChange((user) => {
      setUser(user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email, fullName) => {
    const { data, error } = await authService.signUp(email, fullName);
    return { data, error };
  };

  const signInWithOtp = async (email) => {
    const { data, error } = await authService.signInWithOtp(email);
    return { data, error };
  };

  const verifyOtp = async (email, token) => {
    const { data, error } = await authService.verifyOtp(email, token);
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (!error) setUser(null);
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signInWithOtp, verifyOtp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
