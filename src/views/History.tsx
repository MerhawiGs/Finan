import { useState, useMemo, useEffect } from 'react';
import { 
  Search, Download, Share2,
  TrendingUp, TrendingDown, DollarSign, Clock, CheckCircle, 
  XCircle, AlertCircle, MoreHorizontal, Edit, Trash2, Copy,
  Home, ShoppingCart, Car, Coffee, Zap, Heart, BookOpen,
  Smartphone, Briefcase, Gift, Gamepad2, CreditCard, Wallet,
  ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft
} from 'lucide-react';

// Extended transaction interface for detailed history
interface DetailedTransaction {
  id: string;
  title: string;
  description?: string;
  category: string;
  subcategory?: string;
  date: string;
  time: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'completed' | 'pending' | 'failed' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'mobile_money' | 'crypto';
  location?: string;
  tags?: string[];
  notes?: string;
  receipt?: string;
  recurring?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

// Comprehensive mock data for history
const mockHistoryData: DetailedTransaction[] = [
  {
    id: 't1',
    title: 'Apartment Rent',
    description: 'Monthly rent payment for 2-bedroom apartment in Bole',
    category: 'Housing',
    subcategory: 'Rent',
    date: '2025-01-15',
    time: '09:00',
    amount: 12000,
    type: 'expense',
    status: 'completed',
    paymentMethod: 'bank_transfer',
    location: 'Bole, Addis Ababa',
    tags: ['rent', 'housing', 'monthly'],
    notes: 'Paid via CBE mobile banking',
    recurring: true,
    frequency: 'monthly'
  },
  {
    id: 't2',
    title: 'Grocery Shopping',
    description: 'Weekly groceries at Shoa Market',
    category: 'Groceries',
    subcategory: 'Food',
    date: '2025-01-14',
    time: '14:30',
    amount: 942.30,
    type: 'expense',
    status: 'completed',
    paymentMethod: 'card',
    location: 'Shoa Market, Addis Ababa',
    tags: ['groceries', 'food', 'weekly'],
    notes: 'Bought vegetables, fruits, and household items'
  },
  {
    id: 't3',
    title: 'Salary Payment',
    description: 'Monthly salary from TechCorp',
    category: 'Income',
    subcategory: 'Salary',
    date: '2025-01-10',
    time: '08:00',
    amount: 42000,
    type: 'income',
    status: 'completed',
    paymentMethod: 'bank_transfer',
    location: 'TechCorp Office',
    tags: ['salary', 'income', 'monthly'],
    notes: 'Net salary after deductions',
    recurring: true,
    frequency: 'monthly'
  },
  {
    id: 't4',
    title: 'Stock Dividend',
    description: 'Quarterly dividend from EEPCo shares',
    category: 'Investments',
    subcategory: 'Dividends',
    date: '2025-01-08',
    time: '10:15',
    amount: 545.00,
    type: 'income',
    status: 'completed',
    paymentMethod: 'bank_transfer',
    tags: ['dividend', 'investment', 'quarterly'],
    notes: 'Dividend from 100 EEPCo shares',
    recurring: true,
    frequency: 'quarterly'
  },
  {
    id: 't5',
    title: 'Coffee Shop',
    description: 'Morning coffee at Tomoca',
    category: 'Food & Drink',
    subcategory: 'Coffee',
    date: '2025-01-13',
    time: '07:45',
    amount: 85.50,
    type: 'expense',
    status: 'completed',
    paymentMethod: 'mobile_money',
    location: 'Tomoca Coffee, Piazza',
    tags: ['coffee', 'morning', 'daily'],
    notes: 'Regular morning coffee'
  },
  {
    id: 't6',
    title: 'Uber Ride',
    description: 'Ride to Bole Airport',
    category: 'Transportation',
    subcategory: 'Ride Share',
    date: '2025-01-12',
    time: '16:20',
    amount: 120.00,
    type: 'expense',
    status: 'completed',
    paymentMethod: 'mobile_money',
    location: 'Bole Airport',
    tags: ['transport', 'airport', 'uber'],
    notes: 'Airport pickup for business trip'
  },
  {
    id: 't7',
    title: 'Freelance Project',
    description: 'Web development project for local business',
    category: 'Income',
    subcategory: 'Freelance',
    date: '2025-01-11',
    time: '18:00',
    amount: 5000.00,
    type: 'income',
    status: 'completed',
    paymentMethod: 'bank_transfer',
    tags: ['freelance', 'web development', 'project'],
    notes: 'Completed website for restaurant'
  },
  {
    id: 't8',
    title: 'Phone Bill',
    description: 'Monthly mobile subscription',
    category: 'Utilities',
    subcategory: 'Mobile',
    date: '2025-01-09',
    time: '12:00',
    amount: 250.00,
    type: 'expense',
    status: 'pending',
    paymentMethod: 'mobile_money',
    tags: ['phone', 'utilities', 'monthly'],
    notes: 'Ethio Telecom monthly plan',
    recurring: true,
    frequency: 'monthly'
  },
  {
    id: 't9',
    title: 'Gym Membership',
    description: 'Monthly gym membership at Fitness First',
    category: 'Health',
    subcategory: 'Fitness',
    date: '2025-01-08',
    time: '19:30',
    amount: 500.00,
    type: 'expense',
    status: 'completed',
    paymentMethod: 'card',
    location: 'Fitness First, Bole',
    tags: ['gym', 'health', 'fitness'],
    notes: 'Monthly membership renewal',
    recurring: true,
    frequency: 'monthly'
  },
  {
    id: 't10',
    title: 'Online Course',
    description: 'React Development course on Udemy',
    category: 'Education',
    subcategory: 'Online Learning',
    date: '2025-01-07',
    time: '20:00',
    amount: 1200.00,
    type: 'expense',
    status: 'completed',
    paymentMethod: 'card',
    tags: ['education', 'online', 'programming'],
    notes: 'Advanced React course for career development'
  },
  {
    id: 't11',
    title: 'Restaurant Dinner',
    description: 'Dinner at Yod Abyssinia Restaurant',
    category: 'Food & Drink',
    subcategory: 'Restaurant',
    date: '2025-01-06',
    time: '19:00',
    amount: 350.00,
    type: 'expense',
    status: 'completed',
    paymentMethod: 'card',
    location: 'Yod Abyssinia, Piazza',
    tags: ['dinner', 'restaurant', 'entertainment'],
    notes: 'Date night dinner'
  },
  {
    id: 't12',
    title: 'Gas Station',
    description: 'Fuel for car',
    category: 'Transportation',
    subcategory: 'Fuel',
    date: '2025-01-05',
    time: '15:30',
    amount: 180.00,
    type: 'expense',
    status: 'completed',
    paymentMethod: 'cash',
    location: 'Total Gas Station, Bole',
    tags: ['fuel', 'car', 'transport'],
    notes: 'Filled up car tank'
  },
  {
    id: 't13',
    title: 'Book Purchase',
    description: 'Programming books from online store',
    category: 'Education',
    subcategory: 'Books',
    date: '2025-01-04',
    time: '16:45',
    amount: 450.00,
    type: 'expense',
    status: 'completed',
    paymentMethod: 'card',
    tags: ['books', 'education', 'programming'],
    notes: 'JavaScript and Python programming books'
  },
  {
    id: 't14',
    title: 'Movie Tickets',
    description: 'Cinema tickets for weekend movie',
    category: 'Entertainment',
    subcategory: 'Movies',
    date: '2025-01-03',
    time: '20:30',
    amount: 200.00,
    type: 'expense',
    status: 'completed',
    paymentMethod: 'mobile_money',
    location: 'Cinema Ethiopia, Bole',
    tags: ['movies', 'entertainment', 'weekend'],
    notes: 'Weekend movie with friends'
  },
  {
    id: 't15',
    title: 'Medical Checkup',
    description: 'Annual health checkup',
    category: 'Health',
    subcategory: 'Medical',
    date: '2025-01-02',
    time: '10:00',
    amount: 800.00,
    type: 'expense',
    status: 'completed',
    paymentMethod: 'card',
    location: 'Black Lion Hospital',
    tags: ['health', 'medical', 'checkup'],
    notes: 'Annual comprehensive health checkup'
  }
];

function formatCurrency(amount: number) {
  return amount.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' });
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-ET', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getCategoryIcon(category: string) {
  const iconClass = "w-5 h-5";
  switch (category.toLowerCase()) {
    case 'housing': return <Home className={`${iconClass} text-blue-600`} />;
    case 'groceries': return <ShoppingCart className={`${iconClass} text-green-600`} />;
    case 'income': return <Wallet className={`${iconClass} text-emerald-600`} />;
    case 'investments': return <TrendingUp className={`${iconClass} text-purple-600`} />;
    case 'food & drink': return <Coffee className={`${iconClass} text-orange-600`} />;
    case 'transportation': return <Car className={`${iconClass} text-indigo-600`} />;
    case 'utilities': return <Zap className={`${iconClass} text-yellow-600`} />;
    case 'health': return <Heart className={`${iconClass} text-red-600`} />;
    case 'education': return <BookOpen className={`${iconClass} text-teal-600`} />;
    case 'entertainment': return <Gamepad2 className={`${iconClass} text-pink-600`} />;
    case 'technology': return <Smartphone className={`${iconClass} text-cyan-600`} />;
    case 'business': return <Briefcase className={`${iconClass} text-slate-600`} />;
    case 'gifts': return <Gift className={`${iconClass} text-rose-600`} />;
    default: return <DollarSign className={`${iconClass} text-gray-600`} />;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
    case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
    case 'cancelled': return <XCircle className="w-4 h-4 text-gray-600" />;
    default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
  }
}

function getPaymentMethodIcon(method: string) {
  switch (method) {
    case 'card': return <CreditCard className="w-4 h-4 text-blue-600" />;
    case 'cash': return <DollarSign className="w-4 h-4 text-green-600" />;
    case 'bank_transfer': return <Wallet className="w-4 h-4 text-indigo-600" />;
    case 'mobile_money': return <Smartphone className="w-4 h-4 text-purple-600" />;
    case 'crypto': return <TrendingUp className="w-4 h-4 text-orange-600" />;
    default: return <DollarSign className="w-4 h-4 text-gray-600" />;
  }
}

export default function History() {
  const API_BASE = (import.meta as any).env.VITE_API_URL ?? 'http://localhost:3000';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedTransaction, setSelectedTransaction] = useState<DetailedTransaction | null>(null);
  const [transactions, setTransactions] = useState<DetailedTransaction[]>(mockHistoryData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { fetchTransactions(); window.addEventListener('transaction:created', fetchTransactions); return () => window.removeEventListener('transaction:created', fetchTransactions); }, []);

  async function fetchTransactions() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/transactions`);
      if (!res.ok) throw new Error('Failed to load transactions');
      const data = await res.json();
      // Map backend transaction model to DetailedTransaction shape used by this view
      const mapped: DetailedTransaction[] = Array.isArray(data) ? data.map((t: any) => ({
        id: t._id || t.id,
        title: t.title || (t.description ? t.description.slice(0, 40) : 'Transaction'),
        description: t.remark || t.description || '',
        category: t.category || 'Other',
        subcategory: t.subcategory || '',
        date: t.createdAt || t.date || new Date().toISOString(),
        time: (t.createdAt && new Date(t.createdAt).toLocaleTimeString()) || t.time || '',
        amount: Number(t.amount || 0),
        type: t.type === 'income' ? 'income' : 'expense',
        status: t.status || 'completed',
        paymentMethod: t.paymentMethod || 'card',
        location: t.location || (t.card && t.card.accountName) || '',
        tags: t.tags || [],
        notes: t.notes || t.remark || '',
        receipt: t.receipt || '',
        recurring: !!t.recurring,
        frequency: t.frequency || undefined,
      })) : [];
      setTransactions(mapped);
    } catch (err: any) {
      setError(err?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }

  async function deleteTransaction(id: string) {
    if (!confirm('Delete this transaction?')) return;
    try {
      const res = await fetch(`${API_BASE}/transactions/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete transaction');
      setTransactions(prev => prev.filter(t => t.id !== id));
      setSelectedTransaction(null);
      // notify other parts of the app
      window.dispatchEvent(new CustomEvent('transaction:created'));
    } catch (err: any) {
      alert(err?.message || 'Delete failed');
    }
  }

  // Get unique categories for filter (from real transactions)
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(transactions.map(t => t.category || 'Other'))];
    return uniqueCategories.sort();
  }, [transactions]);

  // Filter and sort transactions (use real data)
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(t => t.status === selectedStatus);
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(t => t.type === selectedType);
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(t => new Date(t.date) >= filterDate);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [transactions, searchTerm, selectedCategory, selectedStatus, selectedType, dateRange, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Statistics
  const stats = useMemo(() => {
    const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    const completedTransactions = filteredTransactions.filter(t => t.status === 'completed').length;
    const pendingTransactions = filteredTransactions.filter(t => t.status === 'pending').length;

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      completedTransactions,
      pendingTransactions,
      totalTransactions: filteredTransactions.length
    };
  }, [filteredTransactions]);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Transaction History</h1>
          <p className="text-slate-600">Complete transaction details and analytics</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Download">
            <Download className="w-5 h-5 text-slate-600" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Share">
            <Share2 className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Income</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(stats.totalIncome)}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Expenses</p>
              <p className="text-2xl font-bold text-rose-600">{formatCurrency(stats.totalExpenses)}</p>
            </div>
            <div className="p-3 bg-rose-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-rose-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Net Balance</p>
              <p className={`text-2xl font-bold ${stats.netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatCurrency(stats.netBalance)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${stats.netBalance >= 0 ? 'bg-emerald-100' : 'bg-rose-100'}`}>
              <DollarSign className={`w-6 h-6 ${stats.netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Transactions</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalTransactions}</p>
              <p className="text-xs text-slate-500">
                {stats.completedTransactions} completed, {stats.pendingTransactions} pending
              </p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg">
              <Clock className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
  </div>

        {/* Sort Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'category')}
              className="px-3 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-3 py-1 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <div className="text-sm text-slate-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {error ? (
        <div className="bg-red-50 rounded-xl shadow-sm border border-red-100 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div className="text-sm text-red-700">Error loading transactions: {error}</div>
            </div>
            <div className="shrink-0">
              <button
                onClick={() => setError(null)}
                className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded-lg hover:bg-red-200 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
          <div className="text-sm text-slate-600">Loading transactions...</div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {currentTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => setSelectedTransaction(transaction)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start sm:items-center gap-4 w-full">
                    <div className="p-3 bg-slate-100 rounded-lg shrink-0">
                      {getCategoryIcon(transaction.category)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-800 truncate">{transaction.title}</h3>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(transaction.status)}
                          <span className="text-xs font-medium text-slate-600 capitalize">
                            {transaction.status}
                          </span>
                        </div>
                        {transaction.recurring && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Recurring
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 mb-2">
                        <span className="truncate">{transaction.category}</span>
                        <span>•</span>
                        <span className="truncate">{formatDate(transaction.date)}</span>
                        <span>•</span>
                        <span className="truncate">{transaction.time}</span>
                        {transaction.location && (
                          <>
                            <span>•</span>
                            <span className="truncate">{transaction.location}</span>
                          </>
                        )}
                      </div>

                      {transaction.description && (
                        <p className="text-sm text-slate-600 mb-2 truncate">{transaction.description}</p>
                      )}

                      {transaction.tags && transaction.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {transaction.tags.map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3 sm:mt-0 sm:ml-4 shrink-0">
                    <div className="w-full sm:w-auto text-right">
                      <div className={`text-lg font-bold ${
                        transaction.type === 'income' ? 'text-emerald-600' : 'text-slate-800'
                      } whitespace-nowrap`}>{transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}</div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 justify-end">
                        {getPaymentMethodIcon(transaction.paymentMethod)}
                        <span className="capitalize">{transaction.paymentMethod.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      transaction.type === 'income' 
                        ? 'bg-emerald-100 text-emerald-600' 
                        : 'bg-rose-100 text-rose-600'
                    }`}>
                      {transaction.type === 'income' ? (
                        <ArrowUpRight className="w-5 h-5" />
                      ) : (
                        <ArrowDownLeft className="w-5 h-5" />
                      )}
                    </div>

                    <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center sm:justify-between bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100 gap-3">
          <div className="text-sm text-slate-600">Page {currentPage} of {totalPages}</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="hidden sm:flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === page 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-slate-100 rounded-lg">
                  {getCategoryIcon(selectedTransaction.category)}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-800">{selectedTransaction.title}</h4>
                  <p className="text-slate-600">{selectedTransaction.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Amount</label>
                  <p className={`text-lg font-bold ${
                    selectedTransaction.type === 'income' ? 'text-emerald-600' : 'text-slate-800'
                  }`}>
                    {selectedTransaction.type === 'income' ? '+' : '-'}{formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Status</label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedTransaction.status)}
                    <span className="capitalize">{selectedTransaction.status}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Date & Time</label>
                  <p className="text-slate-800">{formatDate(selectedTransaction.date)} at {selectedTransaction.time}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Payment Method</label>
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(selectedTransaction.paymentMethod)}
                    <span className="capitalize">{selectedTransaction.paymentMethod.replace('_', ' ')}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Category</label>
                  <p className="text-slate-800">{selectedTransaction.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Location</label>
                  <p className="text-slate-800">{selectedTransaction.location || 'N/A'}</p>
                </div>
              </div>
              
              {selectedTransaction.notes && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Notes</label>
                  <p className="text-slate-800">{selectedTransaction.notes}</p>
                </div>
              )}
              
              {selectedTransaction.tags && selectedTransaction.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Tags</label>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedTransaction.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-200 flex items-center justify-end gap-3">
              <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </button>
              <button onClick={() => selectedTransaction && deleteTransaction(selectedTransaction.id)} className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
