import { supabase } from '../lib/supabase';

export const transactionService = {
  getTransactions: async (userId) => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    return { data, error };
  },

  createTransaction: async (transaction) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();
    
    return { data, error };
  },

  updateTransaction: async (id, transaction) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  deleteTransaction: async (id) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    return { error };
  }
};
