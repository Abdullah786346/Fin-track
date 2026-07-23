// AnalyticsPage.jsx
import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CategoryPill, ProgressBar, fmt, CATEGORY_COLORS } from './shared/SharedComponents';

/**
 * AnalyticsPage - Displays financial analytics with charts and spending insights
 * 
 * @param {Array} transactions - List of all transactions
 */
const AnalyticsPage = ({ transactions, currency = 'USD' }) => {
  // ==========================================
  // 1. STATE & DATA PROCESSING
  // ==========================================

  /* 
    CHANGES:
    - Added timeframe selector state ('monthly' or 'yearly') to toggle data grouping.
    - Dynamically computed chartData from transactions based on timeframe.
  */
  const [timeframe, setTimeframe] = useState('monthly');

  const chartData = useMemo(() => {
    const now = new Date();
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (timeframe === 'monthly') {
      const monthsMap = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
        monthsMap[label] = { label, income: 0, expenses: 0, sortKey: d.getTime() };
      }

      transactions.forEach((t) => {
        if (!t.date) return;
        const dateObj = new Date(t.date);
        if (isNaN(dateObj.getTime())) return;
        const label = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear().toString().slice(-2)}`;
        
        if (!monthsMap[label]) {
          monthsMap[label] = { label, income: 0, expenses: 0, sortKey: dateObj.getTime() };
        }
        
        if (t.type === "income") {
          monthsMap[label].income += t.amount;
        } else if (t.type === "expense") {
          monthsMap[label].expenses += t.amount;
        }
      });

      return Object.values(monthsMap)
        .sort((a, b) => a.sortKey - b.sortKey);
    } else {
      // Yearly
      const yearsMap = {};
      const currentYear = now.getFullYear();
      for (let i = 4; i >= 0; i--) {
        const year = currentYear - i;
        yearsMap[year] = { label: String(year), income: 0, expenses: 0, sortKey: year };
      }

      transactions.forEach((t) => {
        if (!t.date) return;
        const dateObj = new Date(t.date);
        if (isNaN(dateObj.getTime())) return;
        const year = dateObj.getFullYear();
        
        if (!yearsMap[year]) {
          yearsMap[year] = { label: String(year), income: 0, expenses: 0, sortKey: year };
        }
        
        if (t.type === "income") {
          yearsMap[year].income += t.amount;
        } else if (t.type === "expense") {
          yearsMap[year].expenses += t.amount;
        }
      });

      return Object.values(yearsMap)
        .sort((a, b) => a.sortKey - b.sortKey);
    }
  }, [transactions, timeframe]);

  // Group expenses by category for pie chart
  const expensesByCategory = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      expensesByCategory[t.category] = 
        (expensesByCategory[t.category] || 0) + t.amount;
    });

  // Convert to array format for charts
  const pieData = Object.entries(expensesByCategory).map(
    ([name, value]) => ({ name, value })
  );

  // Get top 5 spending categories
  const topCategories = [...pieData]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Calculate total expenses
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // ==========================================
  // 2. RENDER UI
  // ==========================================

  return (
    <div className="p-6 space-y-5 max-w-screen-xl">
      
      {/* CHANGES: Added toggle interface for switching timeframe */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 ">Analytics</h2>
          <p className="text-sm text-gray-400 mt-0.5">Visualize your financial habits over time</p>
        </div>
        <div className="inline-flex rounded-xl bg-white  border border-slate-200  p-1 self-start sm:self-auto">
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              timeframe === 'monthly'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600  hover:text-slate-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeframe('yearly')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              timeframe === 'yearly'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600  hover:text-slate-900'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* ===== TOP ROW: TREND CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Line Chart - Expenses Trend */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Expenses Trend
          </h3>
          <p className="text-xs text-muted-foreground mb-5">
            {timeframe === 'monthly' ? 'Last 6 months' : 'Last 5 years'}
          </p>
          
          <ResponsiveContainer width="100%" height={220}>
            {/* CHANGES: Bound to dynamic chartData */}
            <LineChart data={chartData}>
              {/* Grid lines */}
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--border)" 
              />
              
              {/* X-Axis */}
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} 
                axisLine={false} 
                tickLine={false} 
              />
              
              {/* Y-Axis */}
              <YAxis 
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} 
                axisLine={false} 
                tickLine={false} 
                /* CHANGES: Dynamically format YAxis using current currency */
                tickFormatter={(v) => {
                  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency;
                  if (v >= 1000) return `${symbol}${v / 1000}k`;
                  return `${symbol}${v}`;
                }} 
              />
              
              {/* Tooltip */}
              <Tooltip 
                contentStyle={{ 
                  background: "var(--card)", 
                  border: "1px solid var(--border)", 
                  borderRadius: "8px", 
                  fontSize: 12 
                }} 
                formatter={(v) => [fmt(v, currency)]} 
              />
              
              {/* Expense Line */}
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#EF4444" 
                strokeWidth={2.5} 
                dot={{ r: 4, fill: "#EF4444" }} 
                activeDot={{ r: 6 }} 
                name="Expenses" 
              />
              
              {/* Income Line (for comparison) */}
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10B981" 
                strokeWidth={2.5} 
                dot={{ r: 4, fill: "#10B981" }} 
                activeDot={{ r: 6 }} 
                name="Income" 
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart - Income vs Expenses Comparison */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Income vs Expenses
          </h3>
          <p className="text-xs text-muted-foreground mb-5">
            {timeframe === 'monthly' ? 'Monthly comparison' : 'Yearly comparison'}
          </p>
          
          <ResponsiveContainer width="100%" height={220}>
            {/* CHANGES: Bound to dynamic chartData */}
            <BarChart data={chartData} barGap={4} barSize={18}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--border)" 
              />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} 
                axisLine={false} 
                tickLine={false} 
                /* CHANGES: Dynamically format YAxis using current currency */
                tickFormatter={(v) => {
                  const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency;
                  if (v >= 1000) return `${symbol}${v / 1000}k`;
                  return `${symbol}${v}`;
                }} 
              />
              <Tooltip 
                contentStyle={{ 
                  background: "var(--card)", 
                  border: "1px solid var(--border)", 
                  borderRadius: "8px", 
                  fontSize: 12 
                }} 
                formatter={(v) => [fmt(v, currency)]} 
              />
              <Legend iconType="circle" iconSize={8} />
              
              {/* Income Bars */}
              <Bar 
                dataKey="income" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]} 
                name="Income" 
              />
              
              {/* Expense Bars */}
              <Bar 
                dataKey="expenses" 
                fill="#EF4444" 
                radius={[4, 4, 0, 0]} 
                name="Expenses" 
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ===== BOTTOM ROW: SPENDING DETAILS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Pie Chart - Spending by Category */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Spending by Category
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            All-time breakdown
          </p>
          
          {/* CHANGES: Added check to render fallback UI when no expense records exist */}
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-[180px] text-sm text-muted-foreground">
              No expense transactions to display.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={75} 
                  paddingAngle={2} 
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
          )}
        </Card>

        {/* Top Spending Categories List */}
        <Card className="p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Top Spending Categories
          </h3>
          <p className="text-xs text-muted-foreground mb-5">
            Ranked by total spend
          </p>
          
          <div className="space-y-4">
            {/* CHANGES: Added fallback list empty state check */}
            {topCategories.length === 0 ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No categories available. Please add some expenses.
              </div>
            ) : (
              topCategories.map((category, index) => (
                <div key={category.name}>
                  {/* Category header with rank */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-mono w-4">
                        #{index + 1}
                      </span>
                      <CategoryPill category={category.name} />
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-foreground">
                        {fmt(category.value, currency)}
                      </span>
                      {/* CHANGES: Fixed division by zero (NaN%) check when totalExpenses is 0 */}
                      <span className="text-xs text-muted-foreground ml-1.5">
                        {totalExpenses > 0 ? ((category.value / totalExpenses) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress bar showing percentage of total */}
                  <ProgressBar 
                    value={category.value} 
                    max={totalExpenses} 
                    color={CATEGORY_COLORS[category.name] || "#6B7280"} 
                  />
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
