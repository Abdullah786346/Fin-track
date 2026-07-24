import { supabase } from '../lib/supabase';

export const authService = {
  signUp: async (email, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { data, error };
  },

  signInWithOtp: async (email) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });
    return { data, error };
  },

  verifyOtp: async (email, token) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        callback(session?.user ?? null);
      }
    );
    return subscription;
  }
};
