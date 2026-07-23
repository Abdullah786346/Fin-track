// DashboardPage.jsx
import React from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// ============================================
// 1. HELPER FUNCTIONS & CONSTANTS
// ============================================

// Currency code to locale mapping
const CURRENCY_LOCALES = {
  USD: 'en-US', EUR: 'de-DE', GBP: 'en-GB', PKR: 'en-PK',
  INR: 'en-IN', SAR: 'ar-SA', AED: 'ar-AE', BDT: 'en-BD', TRY: 'tr-TR',
};

// Format currency dynamically based on selected currency
const fmt = (value, currency = 'USD') => {
  const locale = CURRENCY_LOCALES[currency] || 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Sample monthly data for the area chart
const MONTHLY_DATA = [
  { month: 'Feb', income: 4200, expenses: 2800 },
  { month: 'Mar', income: 4500, expenses: 3100 },
  { month: 'Apr', income: 4800, expenses: 2900 },
  { month: 'May', income: 5000, expenses: 3500 },
  { month: 'Jun', income: 5200, expenses: 3300 },
  { month: 'Jul', income: 4800, expenses: 3400 },
];

// Colors for different categories in the pie chart
const CATEGORY_COLORS = {
  'Food': '#F59E0B',
  'Transport': '#3B82F6',
  'Shopping': '#EC4899',
  'Bills': '#8B5CF6',
  'Entertainment': '#EF4444',
  'Health': '#14B8A6',
  'Education': '#6366F1',
  'Other': '#6B7280',
};

// Icons for different categories (simple emoji/icon representation)
const CATEGORY_ICONS = {
  'Food': '🍔',
  'Transport': '🚗',
  'Shopping': '🛍️',
  'Bills': '📄',
  'Entertainment': '🎬',
  'Health': '💊',
  'Education': '📚',
  'Other': '📌',
};

// ============================================
// 2. SUB-COMPONENTS
// ============================================

// Stat Card - displays individual financial metrics
const StatCard = ({ label, value, delta, icon, color, dark }) => {
  // Determine if delta is positive or negative for styling
  const isPositive = delta && delta.startsWith('+');
  const deltaColor = isPositive ? 'text-emerald-500' : 'text-red-500';

  return (
    <div className={`p-4 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        {/* Label */}
        <span className="text-sm text-muted-foreground">{label}</span>
        {/* Icon with background */}
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}18` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      {/* Main Value */}
      <div className="mt-2">
        <span className="text-xl font-semibold text-foreground">{value}</span>
      </div>
      {/* Delta (percentage change) */}
      {delta && (
        <div className="flex items-center gap-1 mt-1">
          <span className={`text-xs font-medium ${deltaColor}`}>{delta}</span>
          <span className="text-xs text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
};

// Category Pill - displays category as a styled badge
const CategoryPill = ({ category }) => {
  const color = CATEGORY_COLORS[category] || '#6B7280';
  return (
    <span 
      className="px-2.5 py-1 text-xs font-medium rounded-full"
      style={{
        backgroundColor: `${color}18`,
        color: color,
        border: `1px solid ${color}30`
      }}
    >
      {category}
    </span>
  );
};

// Card Component - wrapper for consistent card styling
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/95 rounded-3xl border border-slate-200 shadow-2xl ${className}`}>
      {children}
    </div>
  );
};

// Badge Component - simple status indicator
const Badge = ({ children, color }) => {
  return (
    <span 
      className="px-2.5 py-1 text-xs font-medium rounded-full"
      style={{
        backgroundColor: `${color}18`,
        color: color,
      }}
    >
      {children}
    </span>
  );
};

// ============================================
// 3. MAIN DASHBOARD COMPONENT
// ============================================

const DashboardPage = ({ transactions = [], currency = 'USD' }) => {
  // ==========================================
  // 3a. DATA CALCULATIONS
  // ==========================================

  // Calculate total income from all income transactions
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate total expenses from all expense transactions
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate net balance (income minus expenses)
  const balance = totalIncome - totalExpenses;

  // Calculate actual monthly savings (income minus expenses)
  const savings = totalIncome - totalExpenses;

  /* 
    CHANGES:
    - Generated chart data dynamically from transactions instead of using hardcoded sample data.
    - Setup baseline data for the last 6 months to prevent empty charts when no transactions exist.
  */
  const monthsMap = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
    monthsMap[label] = { month: label, income: 0, expenses: 0, sortKey: d.getTime() };
  }

  transactions.forEach((t) => {
    if (!t.date) return;
    const dateObj = new Date(t.date);
    if (isNaN(dateObj.getTime())) return;
    const label = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear().toString().slice(-2)}`;
    
    if (!monthsMap[label]) {
      monthsMap[label] = { month: label, income: 0, expenses: 0, sortKey: dateObj.getTime() };
    }
    
    if (t.type === "income") {
      monthsMap[label].income += t.amount;
    } else if (t.type === "expense") {
      monthsMap[label].expenses += t.amount;
    }
  });

  const chartData = Object.values(monthsMap)
    .sort((a, b) => a.sortKey - b.sortKey)
    .map(({ month, income, expenses }) => ({ month, income, expenses }));

  // ==========================================
  // 3b. PIE CHART DATA (Spending by Category)
  // ==========================================

  // Group expenses by category and sum amounts
  const expensesByCategory = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      expensesByCategory[t.category] = 
        (expensesByCategory[t.category] || 0) + t.amount;
    });

  // Convert to array format for Recharts PieChart
  const pieData = Object.entries(expensesByCategory).map(
    ([name, value]) => ({ name, value })
  );

  // ==========================================
  // 3c. RECENT TRANSACTIONS (Last 5)
  // ==========================================

  // Sort transactions by date (newest first) and take first 5
  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  // Get current month/year dynamically for the overview message
  const fullMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonthYear = `${fullMonthNames[now.getMonth()]} ${now.getFullYear()}`;

  // ==========================================
  // 3d. RENDER UI
  // ==========================================

  return (
    <div className="p-6 space-y-6 max-w-screen-xl bg-gradient-to-br from-slate-100 via-white to-slate-200 rounded-[32px] shadow-2xl border border-slate-200">
      {/* ===== SECTION 1: WELCOME MESSAGE ===== */}
      <div>
        {/* CHANGES: Made user name and month dynamic */}
        <h2 className="text-xl font-semibold text-foreground">
          Welcome back 👋
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Here's your financial overview for {currentMonthYear}.
        </p>
      </div>

      {/* ===== SECTION 2: STATISTICS CARDS ===== */}
      {/* CHANGES: Replaced hardcoded delta percentages with real transaction counts / stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Total Balance" 
          value={fmt(balance, currency)} 
          delta={`${transactions.length} total txs`} 
          icon={<Wallet size={18} />} 
          color="#0F766E" 
          className="bg-gradient-to-br from-emerald-50 to-white"
        />
        <StatCard 
          label="Total Income" 
          value={fmt(totalIncome, currency)} 
          delta={`${transactions.filter(t => t.type === 'income').length} items`} 
          icon={<TrendingUp size={18} />} 
          color="#136F63" 
          className="bg-gradient-to-br from-sky-50 to-white"
        />
        <StatCard 
          label="Total Expenses" 
          value={fmt(totalExpenses, currency)} 
          delta={`${transactions.filter(t => t.type === 'expense').length} items`} 
          icon={<TrendingDown size={18} />} 
          color="#B91C1C" 
          className="bg-gradient-to-br from-red-50 to-white"
        />
        <StatCard 
          label="Monthly Savings" 
          value={fmt(savings, currency)} 
          delta={`${totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(0) : 0}% rate`} 
          icon={<PiggyBank size={18} />} 
          color="#1D4ED8" 
          className="bg-gradient-to-br from-blue-50 to-white"
        />
      </div>

      {/* ===== SECTION 3: CHARTS ROW ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* --- 3a. AREA CHART: Monthly Income vs Expenses --- */}
        <Card className="lg:col-span-2 p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-white">
                Monthly Overview
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Income vs Expenses
              </p>
            </div>
            <Badge color="#34D399">Last 6 Months</Badge>
          </div>
          
          {/* Recharts AreaChart - shows trend over time */}
          <ResponsiveContainer width="100%" height={200}>
            {/* CHANGES: Bound data to dynamic chartData instead of hardcoded MONTHLY_DATA */}
            <AreaChart data={chartData}>
              {/* Gradients for fill colors */}
              <defs>
                <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              
              {/* Grid lines */}
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--border)" 
              />
              
              {/* X-Axis (months) */}
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} 
                axisLine={false} 
                tickLine={false} 
              />
              
              {/* Y-Axis (dynamic currency display) */}
              <YAxis 
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} 
                axisLine={false} 
                tickLine={false} 
                /* CHANGES: Dynamically format Y-axis labels with the selected currency */
                tickFormatter={(v) => {
                  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency;
                  if (v >= 1000) return `${symbol}${v / 1000}k`;
                  return `${symbol}${v}`;
                }} 
              />
              
              {/* Tooltip - shows values on hover */}
              <Tooltip
                contentStyle={{ 
                  background: "var(--card)", 
                  border: "1px solid var(--border)", 
                  borderRadius: "8px", 
                  fontSize: 12 
                }}
                formatter={(v) => [fmt(v, currency)]}
              />
              
              {/* Area lines for Income and Expenses */}
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#10B981" 
                strokeWidth={2} 
                fill="url(#income)" 
                name="Income" 
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                stroke="#EF4444" 
                strokeWidth={2} 
                fill="url(#expenses)" 
                name="Expenses" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* --- 3b. PIE CHART: Spending Breakdown --- */}
        <Card className="p-5 bg-gradient-to-br from-white via-slate-50 to-slate-100">
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            Spending Breakdown
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            By category
          </p>
          
          {/* Donut/Pie Chart showing expense distribution */}
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie 
                data={pieData} 
                cx="50%" 
                cy="50%" 
                innerRadius={45}  // Creates a "donut" hole effect
                outerRadius={70} 
                paddingAngle={3} 
                dataKey="value"
              >
                {pieData.map((entry) => (
                  <Cell 
                    key={entry.name} 
                    fill={CATEGORY_COLORS[entry.name] || "#6B7280"} 
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ 
                  background: "var(--card)", 
                  border: "1px solid var(--border)", 
                  borderRadius: "8px", 
                  fontSize: 11 
                }}
                formatter={(v) => [fmt(v, currency)]}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Legend - shows top categories with amounts */}
          <div className="space-y-2 mt-2">
            {pieData.slice(0, 4).map((d) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                {/* Color dot */}
                <span 
                  className="w-2 h-2 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: CATEGORY_COLORS[d.name] }} 
                />
                {/* Category name */}
                <span className="text-muted-foreground flex-1 truncate">
                  {d.name}
                </span>
                {/* Amount */}
                <span className="font-medium text-foreground">
                  {fmt(d.value, currency)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ===== SECTION 4: RECENT TRANSACTIONS TABLE ===== */}
      <Card>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">
            Recent Transactions
          </h3>
          <span className="text-xs text-primary font-medium cursor-pointer hover:underline">
            View all
          </span>
        </div>
        
        {/* Transaction List */}
        <div className="divide-y divide-border">
          {/* CHANGES: Added empty state container when recentTransactions list is empty */}
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No recent transactions found. Add some transactions to get started!
            </div>
          ) : (
            recentTransactions.map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-center gap-4 px-5 py-3 hover:bg-muted/50 transition-colors"
              >
                {/* Category Icon */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ 
                    backgroundColor: `${CATEGORY_COLORS[tx.category] || "#6B7280"}18` 
                  }}
                >
                  <span style={{ color: CATEGORY_COLORS[tx.category] || "#6B7280" }}>
                    {CATEGORY_ICONS[tx.category] || "📌"}
                  </span>
                </div>
                
                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {tx.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tx.date}
                  </p>
                </div>
                
                {/* Category Badge */}
                <CategoryPill category={tx.category} />
                
                {/* Amount */}
                <span className={`text-sm font-semibold tabular-nums ${
                  tx.type === "income" ? "text-emerald-500" : "text-foreground"
                }`}>
                  {tx.type === "income" ? "+" : "-"}{fmt(tx.amount, currency)}
                </span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;