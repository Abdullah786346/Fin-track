import { supabase } from '../lib/supabase';

export const budgetService = {
  getBudgets: async (userId) => {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId);
    
    return { data, error };
  },

  createBudget: async (budget) => {
    const { data, error } = await supabase
      .from('budgets')
      .insert([budget])
      .select()
      .single();
    
    return { data, error };
  },

  updateBudget: async (id, budget) => {
    const { data, error } = await supabase
      .from('budgets')
      .update(budget)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  deleteBudget: async (id) => {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);
    
    return { error };
  }
};
