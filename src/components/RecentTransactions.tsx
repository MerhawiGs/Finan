import { 
  Clock, Wallet, ShoppingCart, Home, ArrowUpRight, ArrowDownLeft, 
  TrendingUp, TrendingDown, MoreHorizontal, Calendar,
  Car, Coffee, Gamepad2, BookOpen, Heart, 
  Smartphone, Zap, Briefcase, Gift
} from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { useCardContext } from '../contexts/CardContext';
import { Link } from 'react-router-dom';

type TransactionType = 'income' | 'expense' | 'reward';

interface Transaction {
  id: string;
  title: string;
  category: string;
  date: string; // ISO date
  amount: number;
  type: TransactionType;
  description?: string;
  status?: 'completed' | 'pending' | 'failed';
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
  onViewAll?: () => void;
}

const mockTransactions: Transaction[] = [
  // { 
  //   id: 't1', 
  //   title: 'Apartment Rent', 
  //   category: 'Housing', 
  //   date: '2025-01-15', 
  //   amount: 12000, 
  //   type: 'expense',
  //   description: 'Monthly rent payment',
  //   status: 'completed'
  // },
  // { 
  //   id: 't2', 
  //   title: 'Grocery Shopping', 
  //   category: 'Groceries', 
  //   date: '2025-01-14', 
  //   amount: 942.30, 
  //   type: 'expense',
  //   description: 'Weekly groceries at Shoa Market',
  //   status: 'completed'
  // },
  // { 
  //   id: 't3', 
  //   title: 'Salary Payment', 
  //   category: 'Income', 
  //   date: '2025-01-10', 
  //   amount: 42000, 
  //   type: 'income',
  //   description: 'Monthly salary from TechCorp',
  //   status: 'completed'
  // },
  // { 
  //   id: 't4', 
  //   title: 'Stock Dividend', 
  //   category: 'Investments', 
  //   date: '2025-01-08', 
  //   amount: 545.00, 
  //   type: 'income',
  //   description: 'Quarterly dividend from EEPCo',
  //   status: 'completed'
  // },
  // { 
  //   id: 't5', 
  //   title: 'Coffee Shop', 
  //   category: 'Food & Drink', 
  //   date: '2025-01-13', 
  //   amount: 85.50, 
  //   type: 'expense',
  //   description: 'Morning coffee at Tomoca',
  //   status: 'completed'
  // },
  // { 
  //   id: 't6', 
  //   title: 'Uber Ride', 
  //   category: 'Transportation', 
  //   date: '2025-01-12', 
  //   amount: 120.00, 
  //   type: 'expense',
  //   description: 'Ride to Bole Airport',
  //   status: 'completed'
  // },
  // { 
  //   id: 't7', 
  //   title: 'Freelance Project', 
  //   category: 'Income', 
  //   date: '2025-01-11', 
  //   amount: 5000.00, 
  //   type: 'income',
  //   description: 'Web development project',
  //   status: 'completed'
  // },
  // { 
  //   id: 't8', 
  //   title: 'Phone Bill', 
  //   category: 'Utilities', 
  //   date: '2025-01-09', 
  //   amount: 250.00, 
  //   type: 'expense',
  //   description: 'Monthly mobile subscription',
  //   status: 'pending'
  // }
];

function formatCurrency(n: number) {
  return n.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' });
}

function formatShortDate(iso: string) {
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays === 0) return 'Today';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return d.toLocaleDateString('en-ET', { month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

function getCategoryIcon(category: string) {
  const iconClass = "w-5 h-5";
  
  switch (category.toLowerCase()) {
    case 'housing':
      return <Home className={`${iconClass} text-blue-600`} />;
    case 'groceries':
      return <ShoppingCart className={`${iconClass} text-green-600`} />;
    case 'income':
      return <Wallet className={`${iconClass} text-emerald-600`} />;
    case 'investments':
      return <TrendingUp className={`${iconClass} text-purple-600`} />;
    case 'food & drink':
      return <Coffee className={`${iconClass} text-orange-600`} />;
    case 'transportation':
      return <Car className={`${iconClass} text-indigo-600`} />;
    case 'utilities':
      return <Zap className={`${iconClass} text-yellow-600`} />;
    case 'entertainment':
      return <Gamepad2 className={`${iconClass} text-pink-600`} />;
    case 'education':
      return <BookOpen className={`${iconClass} text-teal-600`} />;
    case 'health':
      return <Heart className={`${iconClass} text-red-600`} />;
    case 'technology':
      return <Smartphone className={`${iconClass} text-cyan-600`} />;
    case 'business':
      return <Briefcase className={`${iconClass} text-slate-600`} />;
    case 'gifts':
        return <Gift className={`${iconClass} text-rose-600`} />;
      case 'reward':
      case 'rewards':
      case 'reward(s)':
        return <Gift className={`${iconClass} text-amber-600`} />;
    default:
      return <Clock className={`${iconClass} text-gray-600`} />;
  }
}

function getCategoryColor(category: string) {
  switch (category.toLowerCase()) {
    case 'housing': return 'bg-blue-50 border-blue-200';
    case 'groceries': return 'bg-green-50 border-green-200';
    case 'income': return 'bg-emerald-50 border-emerald-200';
    case 'investments': return 'bg-purple-50 border-purple-200';
    case 'food & drink': return 'bg-orange-50 border-orange-200';
    case 'transportation': return 'bg-indigo-50 border-indigo-200';
    case 'utilities': return 'bg-yellow-50 border-yellow-200';
    case 'entertainment': return 'bg-pink-50 border-pink-200';
    case 'education': return 'bg-teal-50 border-teal-200';
    case 'health': return 'bg-red-50 border-red-200';
    case 'technology': return 'bg-cyan-50 border-cyan-200';
    case 'business': return 'bg-slate-50 border-slate-200';
    case 'gifts': return 'bg-rose-50 border-rose-200';
    case 'reward':
    case 'rewards':
    case 'reward(s)':
      return 'bg-amber-50 border-amber-200';
    default: return 'bg-gray-50 border-gray-200';
  }
}
const API = import.meta.env.VITE_API_URL; 
// const API = import.meta.env.VITE_API_URL ?? 'https://finan-back-qmph.onrender.com';

export default function RecentTransactions({ transactions, onViewAll }: RecentTransactionsProps) {
  const { selectedCardId } = useCardContext();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [fetched, setFetched] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // decide source: prefer passed-in transactions, otherwise fetched, otherwise mock
  const sourceTransactions = transactions && transactions.length ? transactions : (fetched && fetched.length ? fetched : mockTransactions);

  const items = useMemo(() => {
    let filtered = sourceTransactions;
    
    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter);
    }
    
    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return b.amount - a.amount;
      }
    });
    
    // Limit to 7 most recent transactions
    return filtered.slice(0, 7);
  }, [sourceTransactions, filter, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => {
    const allTransactions = sourceTransactions;
    const income = allTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = allTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const net = income - expenses;
    
    return { income, expenses, net, count: allTransactions.length };
  }, [sourceTransactions]);

  // fetch transactions from backend when component mounts or when selectedCardId changes
  useEffect(() => {
    let mounted = true;
    async function fetchTx() {
      setLoading(true);
      setError(null);
      try {
        const url = selectedCardId ? `${API}/transactions/card/${selectedCardId}` : `${API}/transactions`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        // map server transaction objects to component Transaction shape
        const mapped: Transaction[] = (data || []).map((t: any) => ({
          id: t._id || t.id,
          title: t.title || t.name || 'Transaction',
          category: t.category || 'Other',
          date: t.createdAt || t.date || new Date().toISOString(),
          amount: typeof t.amount === 'number' ? t.amount : Number(t.amount || 0),
          type: t.type === 'income' ? 'income' : t.type === 'reward' ? 'reward' : 'expense',
          description: t.remark || t.description || '',
          status: t.status || 'completed'
        }));

        if (mounted) setFetched(mapped);
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to fetch');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchTx();

    // re-fetch when a transaction is created elsewhere
    const onCreated = () => fetchTx();
    window.addEventListener('transaction:created', onCreated as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener('transaction:created', onCreated as EventListener);
    };
  }, [selectedCardId]);

  return (
    <div className="w-full max-w-4xl p-4 mt-4">
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-100">
          Failed to load transactions: {error}
        </div>
      )}
      {loading && (
        <div className="mb-4 p-3 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
          Loading transactions...
        </div>
      )}
      {/* Header with Statistics */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Recent Transactions</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Last 7 transactions</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium">{formatCurrency(stats.income)}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              <span className="text-rose-600 font-medium">{formatCurrency(stats.expenses)}</span>
            </div>
          </div>
        </div>
        
        {/* Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 self-start sm:self-center">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('income')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'income' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setFilter('expense')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filter === 'expense' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Expenses
            </button>
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
            
            <Link to="/history">
              <button 
                className="px-3 py-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                View All
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100">
        <div className="divide-y divide-slate-100">
          {items.map((t) => (
            <div 
              key={t.id} 
              className="flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-slate-50 transition-all duration-200 group"
            >
              <div className="flex items-center gap-4">
                <div className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-xl border-2 ${getCategoryColor(t.category)}`}>
                  {getCategoryIcon(t.category)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800 truncate max-w-[120px] sm:max-w-none">{t.title}</span>
                    {t.status === 'pending' && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Pending
                      </span>
                    )}
                    {t.status === 'failed' && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        Failed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{t.category}</span>
                    <span>•</span>
                    <span>{formatShortDate(t.date)}</span>
                    {t.description && (
                      <div className="hidden md:flex items-center gap-2">
                        <span>•</span>
                        <span className="truncate max-w-32">{t.description}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <div className="text-right">
                  <div className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-600' : t.type === 'reward' ? 'text-amber-600' : 'text-slate-800'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </div>
                  <div className="hidden sm:block text-xs text-slate-500">
                    {t.type === 'income' ? 'Income' : t.type === 'reward' ? 'Reward' : 'Expense'}
                  </div>
                </div>
                
                <div className={`hidden sm:flex items-center justify-center w-8 h-8 rounded-full ${
                  t.type === 'income' 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : t.type === 'reward' 
                      ? 'bg-amber-100 text-amber-600' 
                      : 'bg-rose-100 text-rose-600'
                }`}>
                  {t.type === 'income' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4" />
                  )}
                </div>
                
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded-lg">
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer with Summary */}
        <div className="px-4 sm:px-6 py-4 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <span className="text-slate-600">Showing {items.length} transactions</span>
              {filter !== 'all' && (
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                  {filter === 'income' ? 'Income only' : 'Expenses only'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-emerald-600 font-semibold">
                Net: {formatCurrency(stats.net)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
