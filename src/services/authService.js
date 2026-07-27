import { auth } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';

export const authService = {
  signUp: async (email, password, fullName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update user profile with display name
      await updateProfile(userCredential.user, {
        displayName: fullName
      });
      return { data: { user: userCredential.user }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { data: { user: userCredential.user }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  signOut: async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  getCurrentUser: async () => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve({ user, error: null });
      });
    });
  },

  onAuthStateChange: (callback) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      callback(user);
    });
    return unsubscribe;
  }
};
