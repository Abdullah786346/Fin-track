import { auth, db } from '../lib/firebase';
import { 
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const authService = {
  sendSignInLink: async (email, fullName) => {
    try {
      const actionCodeSettings = {
        url: window.location.origin + '/login',
        handleCodeInApp: true,
      };
      
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Save email and name for later use
      window.localStorage.setItem('emailForSignIn', email);
      window.localStorage.setItem('fullNameForSignIn', fullName);
      
      return { data: { success: true }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  completeSignIn: async () => {
    try {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        const fullName = window.localStorage.getItem('fullNameForSignIn');
        
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
        
        const result = await signInWithEmailLink(auth, email, window.location.href);
        
        // Clear localStorage
        window.localStorage.removeItem('emailForSignIn');
        window.localStorage.removeItem('fullNameForSignIn');
        
        // Save user data to Firestore
        if (result.user && fullName) {
          await updateProfile(result.user, { displayName: fullName });
          await setDoc(doc(db, 'users', result.user.uid), {
            uid: result.user.uid,
            email: result.user.email,
            displayName: fullName,
            createdAt: new Date().toISOString(),
          }, { merge: true });
        }
        
        return { data: { user: result.user }, error: null };
      }
      return { data: null, error: new Error('Invalid sign-in link') };
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
  },

  getUserData: async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { data: docSnap.data(), error: null };
      }
      return { data: null, error: new Error('User not found') };
    } catch (error) {
      return { data: null, error };
    }
  }
};
