// BudgetPage.jsx
import React, { useState } from 'react';
import { Plus, X, AlertTriangle } from 'lucide-react';
import { Card, CategoryPill, ProgressBar, Modal, fmt, CATEGORY_COLORS, EXPENSE_CATEGORIES } from './shared/SharedComponents';

/**
 * BudgetPage - Manage category budgets with tracking and alerts
 * 
 * @param {Array} budgets - List of budget objects { category, limit, spent }
 * @param {Function} setBudgets - Function to update budgets
 */
/* 
  CHANGES:
  - Destructured currency prop.
  - Added editingBudget state to manage limit editing.
*/
const BudgetPage = ({ budgets, setBudgets, transactions = [], currency = 'USD' }) => {
  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [editingBudget, setEditingBudget] = useState(null);

  // ==========================================
  // 2. DATA CALCULATIONS
  // ==========================================

  // Calculate actual spent per category from transactions
  const spentByCategory = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      spentByCategory[t.category] = (spentByCategory[t.category] || 0) + t.amount;
    });

  // Get actual spent for a budget category
  const getSpent = (category) => spentByCategory[category] || 0;

  // Total budget across all categories
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  
  // Total spent across all categories (from actual transactions)
  const totalSpent = budgets.reduce((sum, b) => sum + getSpent(b.category), 0);
  
  // Categories that have exceeded their budget
  const overBudgetCategories = budgets.filter((b) => getSpent(b.category) > b.limit);

  // ==========================================
  // 3. EVENT HANDLERS
  // ==========================================

  /* 
    CHANGES:
    - Renamed addBudget to saveBudget.
    - Updated saveBudget to handle both adding a new budget limit and updating an existing category limit.
  */
  const saveBudget = () => {
    // Validate inputs
    if (!newCategory || !newLimit || isNaN(Number(newLimit)) || Number(newLimit) <= 0) {
      return;
    }
    
    setBudgets((prev) => {
      const exists = prev.some((b) => b.category === newCategory);
      if (exists) {
        return prev.map((b) => b.category === newCategory ? { ...b, limit: Number(newLimit) } : b);
      } else {
        return [
          ...prev, 
          { 
            category: newCategory, 
            limit: Number(newLimit)
          }
        ];
      }
    });
    
    // Reset form
    setNewCategory("");
    setNewLimit("");
    setEditingBudget(null);
    setShowAddModal(false);
  };

  // Remove a budget
  const removeBudget = (category) => {
    if (window.confirm(`Are you sure you want to delete the budget for ${category}?`)) {
      setBudgets(budgets.filter((b) => b.category !== category));
    }
  };

  const startEdit = (budget) => {
    setEditingBudget(budget);
    setNewCategory(budget.category);
    setNewLimit(String(budget.limit));
    setShowAddModal(true);
  };

  // Helper to map currency codes to symbols
  const getCurrencySymbol = (curr) => {
    const symbols = { USD: '$', EUR: '€', GBP: '£', PKR: 'Rs', INR: '₹', SAR: 'SR', AED: 'د.إ', BDT: '৳', TRY: '₺' };
    return symbols[curr] || curr;
  };

  // ==========================================
  // 4. RENDER UI
  // ==========================================

  return (
    <div className="p-6 space-y-5 max-w-screen-xl">
      
      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Budget Card */}
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Total Budget</p>
          <p className="text-2xl font-semibold text-foreground">
            {/* CHANGES: Passed currency prop to formatting function */}
            {fmt(totalBudget, currency)}
          </p>
        </Card>
        
        {/* Total Spent Card */}
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
          <p className="text-2xl font-semibold text-foreground">
            {/* CHANGES: Passed currency prop to formatting function */}
            {fmt(totalSpent, currency)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {/* CHANGES: Guarded against division by zero (NaN%) when totalBudget is 0 */}
            {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(0) : 0}% of budget
          </p>
        </Card>
        
        {/* Remaining Budget Card */}
        <Card className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Remaining</p>
          <p className={`text-2xl font-semibold ${
            totalBudget - totalSpent < 0 ? "text-red-500" : "text-emerald-500"
          }`}>
            {/* CHANGES: Passed currency prop to formatting function */}
            {fmt(totalBudget - totalSpent, currency)}
          </p>
          {overBudgetCategories.length > 0 && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertTriangle size={10} /> 
              {overBudgetCategories.length} category exceeded
            </p>
          )}
        </Card>
      </div>

      {/* ===== BUDGET LIST HEADER ===== */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          Category Budgets
        </h3>
        <button
          onClick={() => {
            // CHANGES: Reset state when creating a new budget
            setEditingBudget(null);
            setNewCategory("");
            setNewLimit("");
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all cursor-pointer"
        >
          <Plus size={13} /> New Budget
        </button>
      </div>

      {/* ===== BUDGET CARDS GRID ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {budgets.map((budget) => {
          // Calculate percentage spent from actual transactions
          const spent = getSpent(budget.category);
          // CHANGES: Avoid division by zero when budget.limit is 0
          const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
          const isExceeded = spent > budget.limit;
          const color = CATEGORY_COLORS[budget.category] || "#6B7280";
          
          return (
            <Card key={budget.category} className="p-4 hover:shadow-md transition-shadow">
              {/* Header with category and edit/delete buttons */}
              {/* CHANGES: Added Edit button to allow updating budget limits */}
              <div className="flex items-start justify-between mb-3">
                <CategoryPill category={budget.category} />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(budget)}
                    className="text-muted-foreground hover:text-blue-500 transition-colors p-0.5"
                    title="Edit Limit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeBudget(budget.category)}
                    className="text-muted-foreground hover:text-red-500 transition-colors p-0.5"
                    title="Delete Budget"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
              
              {/* Amounts */}
              <div className="mb-3">
                <div className="flex justify-between items-baseline mb-1.5">
                  <span className="text-lg font-semibold text-foreground">
                    {/* CHANGES: Pass currency prop */}
                    {fmt(spent, currency)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {/* CHANGES: Pass currency prop */}
                    of {fmt(budget.limit, currency)}
                  </span>
                </div>
                
                {/* Progress bar */}
                <ProgressBar 
                  value={spent} 
                  max={budget.limit} 
                  color={color} 
                  exceeded={isExceeded} 
                />
              </div>
              
              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${
                  isExceeded ? "text-red-500" : "text-muted-foreground"
                }`}>
                  {isExceeded ? (
                    <span className="flex items-center gap-1">
                      {/* CHANGES: Pass currency prop to fmt */}
                      <AlertTriangle size={10} /> Over by {fmt(spent - budget.limit, currency)}
                    </span>
                  ) : (
                    /* CHANGES: Pass currency prop to fmt */
                    `${fmt(budget.limit - spent, currency)} left`
                  )}
                </span>
                <span className={`text-xs font-semibold ${
                  isExceeded ? "text-red-500" : 
                  percentage > 80 ? "text-orange-500" : "text-muted-foreground"
                }`}>
                  {percentage.toFixed(0)}%
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ===== ADD / EDIT BUDGET MODAL ===== */}
      {/* CHANGES: Updated modal title based on whether editing or adding */}
      <Modal 
        open={showAddModal} 
        onClose={() => {
          setShowAddModal(false);
          setEditingBudget(null);
        }} 
        title={editingBudget ? "Edit Budget Limit" : "Create Budget"}
      >
        <div className="space-y-4">
          {/* Category Selection */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Category
            </label>
            {/* CHANGES: Disabled category modification when editing a budget */}
            <select
              value={newCategory}
              disabled={!!editingBudget}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-border text-sm bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
            >
              <option value="">Select category</option>
              {/* CHANGES: Filter categories but keep the current category visible when editing */}
              {EXPENSE_CATEGORIES
                .filter((c) => c === newCategory || !budgets.some((b) => b.category === c))
                .map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
            </select>
          </div>
          
          {/* Monthly Limit Input */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
              Monthly Limit
            </label>
            <div className="relative">
              {/* CHANGES: Show dynamic currency symbol instead of hardcoded $ */}
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold">
                {getCurrencySymbol(currency)}
              </span>
              <input
                type="number"
                placeholder="0.00"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-border text-sm bg-input-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button 
              onClick={() => {
                setShowAddModal(false);
                setEditingBudget(null);
              }} 
              className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all"
            >
              Cancel
            </button>
            {/* CHANGES: Connected saveBudget handler and updated button text for edits */}
            <button 
              onClick={saveBudget} 
              className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
            >
              {editingBudget ? "Save Changes" : "Create Budget"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BudgetPage;