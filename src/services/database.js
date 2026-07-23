import { supabase } from '../lib/supabase';

// Transactions
export const getTransactions = async (userId) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });
  
  return { data, error };
};

export const createTransaction = async (transaction) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
    .single();
  
  return { data, error };
};

export const updateTransaction = async (id, transaction) => {
  const { data, error } = await supabase
    .from('transactions')
    .update(transaction)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
};

export const deleteTransaction = async (id) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Budgets
export const getBudgets = async (userId) => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId);
  
  return { data, error };
};

export const createBudget = async (budget) => {
  const { data, error } = await supabase
    .from('budgets')
    .insert([budget])
    .select()
    .single();
  
  return { data, error };
};

export const updateBudget = async (id, budget) => {
  const { data, error } = await supabase
    .from('budgets')
    .update(budget)
    .eq('id', id)
    .select()
    .single();
  
  return { data, error };
};

export const deleteBudget = async (id) => {
  const { error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id);
  
  return { error };
};
