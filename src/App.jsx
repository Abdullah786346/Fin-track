import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Sidebar } from "./components/Sidebar.jsx";
import { Menu, Bell, Plus } from "lucide-react";
import AddTransactionModal from "./components/AddTransactionModal";
import DashboardPage from "./pages/Dashboard.jsx";
import TransactionsPage from "./components/TransectionsPage.jsx";
import AnalyticsPage from "./components/AnalyticsPage.jsx";
import BudgetPage from "./components/BudgetPage.jsx";
import SettingsPage from "./components/SettingsPage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";

function App() {
  const { user, loading, signOut } = useAuth();
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("fintrack_transactions");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currency, setCurrency] = useState(() => {
    const saved = localStorage.getItem("fintrack_currency");
    return saved || "USD";
  });
  
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("fintrack_budgets");
    return saved ? JSON.parse(saved) : [
      { category: "Food", limit: 1000 },
      { category: "Shopping", limit: 600 },
    ];
  });

  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    localStorage.setItem("fintrack_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("fintrack_currency", currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem("fintrack_budgets", JSON.stringify(budgets));
  }, [budgets]);

  const saveTransaction = (transaction) => {
    setTransactions((prev) => {
      const exists = prev.some((t) => t.id === transaction.id);
      if (exists) {
        return prev.map((t) => (t.id === transaction.id ? transaction : t));
      } else {
        return [transaction, ...prev];
      }
    });
    setEditingTransaction(null);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const resetAll = () => {
    if (window.confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      setTransactions([]);
      setBudgets([
        { category: "Food", limit: 1000 },
        { category: "Shopping", limit: 600 },
      ]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={() => window.location.href = '/'} />} />
      <Route path="/signup" element={<Signup onSignup={() => window.location.href = '/'} />} />
      
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex h-screen overflow-hidden bg-white text-slate-900">
              <Sidebar
                page={page}
                setPage={setPage}
                collapsed={collapsed}
                onToggle={() => setCollapsed((value) => !value)}
                mobileOpen={mobileOpen}
                onCloseMobile={() => setMobileOpen(false)}
              />

              <div className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
                <header className="h-16 flex-shrink-0 flex items-center justify-between gap-3 px-4 lg:px-6 border-b border-slate-200 bg-white">
                  <button
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                    className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                  >
                    <Menu className="w-5 h-5" />
                  </button>

                  <h1 className="text-lg font-semibold text-slate-900 capitalize">{page}</h1>

                  <div className="ml-auto flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Notifications"
                      className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <Bell className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                      onClick={() => {
                        setEditingTransaction(null);
                        setShowTransactionModal(true);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </header>

                <main className="p-4 lg:p-8 flex-1 overflow-y-auto bg-white">
                  {page === "dashboard" ? (
                    <DashboardPage transactions={transactions} currency={currency} />
                  ) : page === "transactions" ? (
                    <TransactionsPage
                      transactions={transactions}
                      onEdit={(tx) => {
                        setEditingTransaction(tx);
                        setShowTransactionModal(true);
                      }}
                      onDelete={deleteTransaction}
                      onAdd={() => {
                        setEditingTransaction(null);
                        setShowTransactionModal(true);
                      }}
                      currency={currency}
                    />
                  ) : page === "analytics" ? (
                    <AnalyticsPage transactions={transactions} currency={currency} />
                  ) : page === "budget" ? (
                    <BudgetPage budgets={budgets} setBudgets={setBudgets} transactions={transactions} currency={currency} />
                  ) : page === "settings" ? (
                    <SettingsPage
                      currency={currency}
                      onCurrencyChange={setCurrency}
                      onResetAll={resetAll}
                      onSignOut={signOut}
                    />
                  ) : (
                    <div className="rounded-3xl border border-dashed border-slate-300 h-[60vh] flex items-center justify-center text-slate-400 text-sm">
                      {page} content goes here
                    </div>
                  )}
                </main>

                <AddTransactionModal
                  open={showTransactionModal}
                  editingTransaction={editingTransaction}
                  onClose={() => {
                    setShowTransactionModal(false);
                    setEditingTransaction(null);
                  }}
                  onSave={saveTransaction}
                />
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;