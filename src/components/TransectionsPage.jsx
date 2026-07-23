// TransactionsPage.jsx — Self-contained, koi bahar ki dependency nahi
import { useState, useMemo } from "react";
import {
  Search, Edit2, Trash2, ChevronLeft, ChevronRight, Plus,
  ArrowLeftRight, X, Utensils, Car, ShoppingCart, Home, Zap,
  Film, Heart, GraduationCap, Briefcase, TrendingUp, Wallet,
} from "lucide-react";

// ─── Category Config ─────────────────────────────────────────────
const CATEGORY_COLORS = {
  Food:"#10B981", Transport:"#3B82F6", Shopping:"#F59E0B",
  Housing:"#8B5CF6", Utilities:"#EF4444", Entertainment:"#EC4899",
  Health:"#06B6D4", Education:"#14B8A6", Salary:"#10B981",
  Freelance:"#3B82F6", Investment:"#F59E0B", Other:"#6B7280",
};
const CATEGORY_ICONS = {
  Food:<Utensils size={14}/>, Transport:<Car size={14}/>,
  Shopping:<ShoppingCart size={14}/>, Housing:<Home size={14}/>,
  Utilities:<Zap size={14}/>, Entertainment:<Film size={14}/>,
  Health:<Heart size={14}/>, Education:<GraduationCap size={14}/>,
  Salary:<Briefcase size={14}/>, Freelance:<Briefcase size={14}/>,
  Investment:<TrendingUp size={14}/>, Other:<Wallet size={14}/>,
};
const CURRENCY_LOCALES = {
  USD: 'en-US', EUR: 'de-DE', GBP: 'en-GB', PKR: 'en-PK',
  INR: 'en-IN', SAR: 'ar-SA', AED: 'ar-AE', BDT: 'en-BD', TRY: 'tr-TR',
};
const fmt = (n, currency = 'USD') => {
  const locale = CURRENCY_LOCALES[currency] || 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency', currency: currency, maximumFractionDigits: 0
  }).format(n);
};

// ─── Mini Components ─────────────────────────────────────────────
/* 
  CHANGES: Updated Card and Modal sub-components in TransectionsPage.jsx 
  to support dark mode classes (, , etc.)
*/
function Card({ children, className="" }) {
  return (
    <div className={`bg-white  rounded-2xl border border-gray-100  shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CategoryPill({ category }) {
  const color = CATEGORY_COLORS[category] || "#6B7280";
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor:`${color}15`, color }}>
      {CATEGORY_ICONS[category]} {category}
    </span>
  );
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}/>
      <div className="relative bg-white  rounded-2xl border border-gray-100  shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 ">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X size={16}/>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────
const TransactionsPage = ({ transactions, onEdit, onDelete, onAdd, currency = 'USD' }) => {
  const [search,         setSearch]         = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter,     setTypeFilter]     = useState("");
  const [sortKey,        setSortKey]        = useState("date");
  const [sortDir,        setSortDir]        = useState("desc");
  const [page,           setPage]           = useState(1);
  const [deleteId,       setDeleteId]       = useState(null);
  const PER_PAGE = 8;

  const allCategories = [...new Set(transactions.map(t=>t.category))].sort();

  const filtered = useMemo(() => {
    let list = transactions.filter(t => {
      const ms = t.description.toLowerCase().includes(search.toLowerCase())
              || t.category.toLowerCase().includes(search.toLowerCase());
      return ms && (!categoryFilter||t.category===categoryFilter)
                && (!typeFilter||t.type===typeFilter);
    });
    list.sort((a,b) => {
      const mul = sortDir==="asc" ? 1 : -1;
      return sortKey==="date"
        ? mul*a.date.localeCompare(b.date)
        : mul*(a.amount-b.amount);
    });
    return list;
  }, [transactions, search, categoryFilter, typeFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const handleFilter = (setter, value) => { setter(value); setPage(1); };
  const toggleSort   = (key) => {
    if (sortKey===key) setSortDir(d=>d==="asc"?"desc":"asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const totalIncome   = transactions.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const totalExpenses = transactions.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);

  return (
    <div className="p-6 space-y-5 max-w-screen-xl" style={{fontFamily:"'Inter',system-ui,sans-serif"}}>

      {/* Header */}
      <div>
        {/* CHANGES: Added dark mode text color for header */}
        <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
        <p className="text-sm text-gray-400 mt-0.5">Track all your income and expenses</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5">
          <p className="text-xs text-gray-400 mb-1 font-medium">Total Transactions</p>
          {/* CHANGES: Added dark mode text color for values */}
          <p className="text-2xl font-semibold text-gray-900 ">{transactions.length}</p>
          <p className="text-xs text-gray-400 mt-1">{filtered.length} matching filters</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-gray-400 mb-1 font-medium">Total Income</p>
          <p className="text-2xl font-semibold text-emerald-500">{fmt(totalIncome, currency)}</p>
          <p className="text-xs text-gray-400 mt-1">{transactions.filter(t=>t.type==="income").length} transactions</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs text-gray-400 mb-1 font-medium">Total Expenses</p>
          {/* CHANGES: Added dark mode text color for values */}
          <p className="text-2xl font-semibold text-gray-900 ">{fmt(totalExpenses, currency)}</p>
          <p className="text-xs text-gray-400 mt-1">{transactions.filter(t=>t.type==="expense").length} transactions</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          {/* CHANGES: Updated inputs to support dark mode bg/text/border colors */}
          <input type="text" placeholder="Search transactions..." value={search}
            onChange={e=>handleFilter(setSearch,e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200  text-sm bg-white  text-gray-800  placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300  transition-all"/>
        </div>
        {/* CHANGES: Updated dropdown selectors for dark mode */}
        <select value={typeFilter} onChange={e=>handleFilter(setTypeFilter,e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-gray-200  text-sm bg-white  text-gray-700  focus:outline-none focus:ring-2 focus:ring-emerald-300  cursor-pointer">
          <option value="" className="bg-white ">All Types</option>
          <option value="income" className="bg-white ">Income</option>
          <option value="expense" className="bg-white ">Expense</option>
        </select>
        <select value={categoryFilter} onChange={e=>handleFilter(setCategoryFilter,e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-gray-200  text-sm bg-white  text-gray-700  focus:outline-none focus:ring-2 focus:ring-emerald-300  cursor-pointer">
          <option value="" className="bg-white ">All Categories</option>
          {allCategories.map(c=><option key={c} value={c} className="bg-white ">{c}</option>)}
        </select>
        <div className="ml-auto text-xs text-gray-400">
          <span className="font-semibold text-gray-700">{filtered.length}</span> results
        </div>
      </div>

      {/* Table */}
      {/* 
        CHANGES:
        - Added overflow-x-auto and a minimum width to prevent columns from collapsing on small screens.
        - Added dark mode background and border classes.
      */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3.5 border-b border-gray-100  bg-white  rounded-t-2xl text-xs font-semibold text-gray-400  uppercase tracking-wide">
              <span>Description</span>
              <span>Category</span>
              <button onClick={()=>toggleSort("date")} className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                Date {sortKey==="date"?(sortDir==="desc"?"↓":"↑"):"↕"}
              </button>
              <button onClick={()=>toggleSort("amount")} className="flex items-center gap-1 hover:text-gray-700 transition-colors">
                Amount {sortKey==="amount"?(sortDir==="desc"?"↓":"↑"):"↕"}
              </button>
              <span>Actions</span>
            </div>

            {/* Empty State */}
            {paged.length===0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white ">
                <div className="w-14 h-14 rounded-2xl bg-gray-100  flex items-center justify-center mb-4">
                  <ArrowLeftRight size={22} className="text-gray-400 "/>
                </div>
                <p className="text-sm font-semibold text-gray-700 ">No transactions found</p>
                <p className="text-xs text-gray-400  mt-1">Try adjusting your search or filters</p>
                <button onClick={onAdd}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-all cursor-pointer">
                  <Plus size={14}/> Add Transaction
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50  bg-white ">
                {paged.map(tx => {
                  const color = CATEGORY_COLORS[tx.category]||"#6B7280";
                  return (
                    <div key={tx.id}
                      className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-4 items-center hover:bg-gray-50/80  transition-colors group">
                      {/* Description */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{backgroundColor:`${color}18`}}>
                          <span style={{color}}>{CATEGORY_ICONS[tx.category] || CATEGORY_ICONS["Other"]}</span>
                        </div>
                        <div className="min-w-0">
                          {/* CHANGES: Added dark mode text support for transaction description */}
                          <p className="text-sm font-medium text-gray-900  truncate">{tx.description}</p>
                          {tx.notes && <p className="text-xs text-gray-400  truncate">{tx.notes}</p>}
                        </div>
                      </div>

                      <CategoryPill category={tx.category}/>

                      <span className="text-xs text-gray-400  whitespace-nowrap">{tx.date}</span>

                      {/* CHANGES: Added dark mode text support for transaction amount */}
                      <span className={`text-sm font-semibold tabular-nums whitespace-nowrap ${tx.type==="income"?"text-emerald-500":"text-gray-900 "}`}>
                        {tx.type==="income"?"+":"−"}{fmt(tx.amount, currency)}
                      </span>

                      {/* 
                        CHANGES:
                        - Changed opacity classes so action buttons are always visible on mobile/touch screens
                          (where hover does not exist) but hide and reveal on hover on larger screens.
                      */}
                      <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button onClick={()=>onEdit(tx)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50  hover:text-blue-500 transition-all" title="Edit">
                          <Edit2 size={13}/>
                        </button>
                        <button onClick={()=>setDeleteId(tx.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all" title="Delete">
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPages>1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100  bg-white ">
            <p className="text-xs text-gray-400 ">
              Showing <span className="font-semibold text-gray-700 ">{(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE,filtered.length)}</span> of <span className="font-semibold text-gray-700 ">{filtered.length}</span>
            </p>
            <div className="flex items-center gap-1">
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronLeft size={14}/>
              </button>
              {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                <button key={n} onClick={()=>setPage(n)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${n===page?"bg-emerald-500 text-white shadow-sm":"text-gray-500  hover:bg-gray-100"}`}>
                  {n}
                </button>
              ))}
              <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                <ChevronRight size={14}/>
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Delete Modal */}
      <Modal open={!!deleteId} onClose={()=>setDeleteId(null)} title="Delete Transaction">
        <div className="text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
            <Trash2 size={22} className="text-red-500"/>
          </div>
          <div>
            {/* CHANGES: Added dark mode text support in delete confirmation modal */}
            <p className="text-sm font-medium text-gray-900 ">Are you sure?</p>
            <p className="text-xs text-gray-400  mt-1">This transaction will be permanently deleted.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={()=>setDeleteId(null)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200  text-sm font-medium text-gray-500  hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button onClick={()=>{if(deleteId){onDelete(deleteId);setDeleteId(null);}}}
              className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all">
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* FAB */}
      <button onClick={onAdd}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-200 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-10 cursor-pointer">
        <Plus size={22}/>
      </button>
    </div>
  );
};

export default TransactionsPage;
