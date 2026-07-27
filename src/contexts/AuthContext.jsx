import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is signing in with email link
    authService.completeSignIn().then(({ data, error }) => {
      if (data && data.user) {
        setUser(data.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const sendSignInLink = async (email, fullName) => {
    const { data, error } = await authService.sendSignInLink(email, fullName);
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await authService.signOut();
    if (!error) setUser(null);
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, loading, sendSignInLink, signOut }}>
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
