import React from 'react';

// Currency code to locale mapping
const CURRENCY_LOCALES = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  PKR: 'en-PK',
  INR: 'en-IN',
  SAR: 'ar-SA',
  AED: 'ar-AE',
  BDT: 'en-BD',
  TRY: 'tr-TR',
};

export const fmt = (value, currency = 'USD') => {
  const locale = CURRENCY_LOCALES[currency] || 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const CATEGORY_COLORS = {
  Food: '#F59E0B',
  Transport: '#3B82F6',
  Shopping: '#EC4899',
  Bills: '#8B5CF6',
  Entertainment: '#EF4444',
  Health: '#14B8A6',
  Education: '#6366F1',
  Salary: '#10B981',
  Other: '#6B7280',
};

export const CATEGORY_ICONS = {
  Food: '🍔',
  Transport: '🚗',
  Shopping: '🛍️',
  Bills: '📄',
  Entertainment: '🎬',
  Health: '💊',
  Education: '📚',
  Salary: '💼',
  Other: '📌',
};

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Health',
  'Education',
  'Other',
];

export const MONTHLY_DATA = [
  { month: 'Feb', income: 4200, expenses: 2800 },
  { month: 'Mar', income: 4500, expenses: 3100 },
  { month: 'Apr', income: 4800, expenses: 2900 },
  { month: 'May', income: 5000, expenses: 3500 },
  { month: 'Jun', income: 5200, expenses: 3300 },
  { month: 'Jul', income: 4800, expenses: 3400 },
];

/* 
  CHANGES:
  - Updated Card component to support dark mode backgrounds (bg-slate-800), borders, and text colors.
*/
export const Card = ({ className = '', children }) => {
  return (
    <div className={`bg-white  rounded-3xl border border-slate-200  shadow-sm text-slate-900  transition-colors duration-200 ${className}`}>
      {children}
    </div>
  );
};

export const CategoryPill = ({ category }) => {
  const color = CATEGORY_COLORS[category] || '#6B7280';
  return (
    <span
      className="px-2.5 py-1 text-xs font-semibold rounded-full"
      style={{
        backgroundColor: `${color}18`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {category}
    </span>
  );
};

export const ProgressBar = ({ value, max, color = '#10B981', exceeded = false }) => {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-200"
        style={{
          width: `${percent}%`,
          backgroundColor: exceeded ? '#EF4444' : color,
          minWidth: '6px',
        }}
      />
    </div>
  );
};

/* 
  CHANGES:
  - Updated Modal to support dark mode backgrounds, text, and header styles.
*/
export const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white  text-slate-900  shadow-2xl border border-slate-200  overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 ">
          <h2 className="text-lg font-semibold text-slate-900 ">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600  hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};
