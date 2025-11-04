import { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Target, AlertCircle, 
  Download, Share2, EyeOff,
  BarChart3, Wallet,
  Home, ShoppingCart, Car, Coffee, Zap, Heart, BookOpen,
  Lightbulb
} from 'lucide-react';

// We'll load transactions and cards dynamically from the API

const mockBudgets = [
  { category: 'Housing', budget: 15000, spent: 12000, color: 'bg-blue-500' },
  { category: 'Groceries', budget: 2000, spent: 942.30, color: 'bg-green-500' },
  { category: 'Transportation', budget: 1000, spent: 300, color: 'bg-indigo-500' },
  { category: 'Food & Drink', budget: 1500, spent: 435.50, color: 'bg-orange-500' },
  { category: 'Utilities', budget: 500, spent: 250, color: 'bg-yellow-500' },
  { category: 'Health', budget: 1000, spent: 500, color: 'bg-red-500' },
  { category: 'Education', budget: 2000, spent: 1200, color: 'bg-teal-500' },
];

// goals will be loaded from the backend /goals

const API_BASE = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';

function formatCurrency(amount: number) {
  return amount.toLocaleString('en-ET', { style: 'currency', currency: 'ETB' });
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
    default: return <DollarSign className={`${iconClass} text-gray-600`} />;
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export default function Reports() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showInsights, setShowInsights] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);

  // goals persisted on the backend
  const [goals, setGoals] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Add-goal modal state
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState<number | ''>('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [newGoalPriority, setNewGoalPriority] = useState<'high' | 'medium' | 'low'>('medium');

  // Add-money modal state
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [moneyGoalId, setMoneyGoalId] = useState<string | null>(null);
  const [moneyAmount, setMoneyAmount] = useState<number | ''>('');
  const [moneyCardId, setMoneyCardId] = useState<string | null>(null);
  const [moneyError, setMoneyError] = useState<string | null>(null);

  useEffect(() => {
    const onTxCreated = () => fetchData();
    window.addEventListener('transaction:created', onTxCreated as EventListener);
    fetchData();
    return () => window.removeEventListener('transaction:created', onTxCreated as EventListener);
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const txRes = await fetch(`${API_BASE}/transactions`);
      const txJson = await txRes.json();
      // normalise createdAt/date
      const txs = Array.isArray(txJson) ? txJson.map((t: any) => ({
        ...t,
        date: t.createdAt || t.date || new Date().toISOString()
      })) : [];
      setTransactions(txs);

      const cardsRes = await fetch(`${API_BASE}/cards`);
      const cardsJson = await cardsRes.json();
      setCards(Array.isArray(cardsJson) ? cardsJson : []);
      // load goals from backend
      try {
        const goalsRes = await fetch(`${API_BASE}/goals`);
        const goalsJson = await goalsRes.json();
        setGoals(Array.isArray(goalsJson) ? goalsJson : []);
      } catch (gErr) {
        console.warn('Failed to load goals', gErr);
      }
    } catch (err: any) {
      console.warn(err);
      setError(err?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Filter transactions based on time range
    let filteredTransactions = transactions;
    const now = new Date();
    
    if (timeRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredTransactions = transactions.filter((t: any) => new Date(t.date) >= weekAgo);
    } else if (timeRange === 'month') {
      filteredTransactions = transactions.filter((t: any) => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      });
    } else if (timeRange === 'quarter') {
      const quarterStart = new Date(currentYear, Math.floor(currentMonth / 3) * 3, 1);
      filteredTransactions = transactions.filter((t: any) => new Date(t.date) >= quarterStart);
    }

    const income = filteredTransactions.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
    const expenses = filteredTransactions.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
    const net = income - expenses;

    // Category breakdown
    const categoryBreakdown = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Top spending categories
    const topCategories = (Object.entries(categoryBreakdown) as [string, number][])
      .sort(([,a],[,b]) => b - a)
      .slice(0, 5);

    // Budget performance
    const budgetPerformance = mockBudgets.map(budget => {
      const spent = categoryBreakdown[budget.category] || 0;
      const percentage = (spent / budget.budget) * 100;
      return {
        ...budget,
        spent,
        percentage: Math.min(percentage, 100),
        status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'good'
      };
    });

    return {
      income,
      expenses,
      net,
      categoryBreakdown,
      topCategories,
      budgetPerformance,
      transactionCount: filteredTransactions.length
    };
  }, [timeRange]);

  const insights = useMemo(() => {
    const insights = [];
    
    // Spending insights
    if (analytics.expenses > analytics.income * 0.8) {
      insights.push({
        type: 'warning',
        icon: AlertCircle,
        title: 'High Spending Alert',
        message: `You're spending ${((analytics.expenses / analytics.income) * 100).toFixed(1)}% of your income. Consider reducing expenses.`,
        action: 'Review Budget'
      });
    }

    // Budget insights
    const overBudget = analytics.budgetPerformance.filter(b => b.status === 'over');
    if (overBudget.length > 0) {
      insights.push({
        type: 'error',
        icon: AlertCircle,
        title: 'Over Budget',
        message: `You've exceeded budget in ${overBudget.length} category${overBudget.length > 1 ? 'ies' : 'y'}.`,
        action: 'Adjust Budget'
      });
    }

    // Savings insights
    if (analytics.net > 0) {
      insights.push({
        type: 'success',
        icon: TrendingUp,
        title: 'Great Savings!',
        message: `You saved ${formatCurrency(analytics.net)} this ${timeRange}. Keep it up!`,
        action: 'View Goals'
      });
    }

    // Goal progress insights
  const nearGoal = goals.filter((g: any) => (g.current / g.target) > 0.8 && !g.completed);
    if (nearGoal.length > 0) {
      insights.push({
        type: 'info',
        icon: Target,
        title: 'Goal Progress',
        message: `You're close to achieving ${nearGoal.length} goal${nearGoal.length > 1 ? 's' : ''}!`,
        action: 'View Goals'
      });
    }

    return insights;
  }, [analytics, timeRange]);

  // Goal helpers
  function openAddMoneyModal(goalId: string) {
    setMoneyGoalId(goalId);
    setMoneyAmount('');
    setMoneyCardId(cards.length ? cards[0]._id : null);
    setMoneyError(null);
    setShowAddMoney(true);
  }

  async function submitAddMoney() {
    if (!moneyGoalId || !moneyCardId || !moneyAmount || Number(moneyAmount) <= 0) return;
    const amount = Number(moneyAmount);
    // validate against remaining goal and selected card balance
    const goal = goals.find((g: any) => g.id === moneyGoalId);
    const card = cards.find((c: any) => c._id === moneyCardId);
    const remaining = Math.max(0, Number(goal?.target || 0) - Number(goal?.current || 0));
    const cardBalance = Number(card?.availableBalance ?? 0);
    if (amount > remaining) {
      setMoneyError(`Amount exceeds remaining goal amount (${formatCurrency(remaining)})`);
      return;
    }
    if (amount > cardBalance) {
      setMoneyError(`Insufficient card balance (${formatCurrency(cardBalance)})`);
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/cards/${moneyCardId}/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'expense', amount, title: `Goal: ${moneyGoalId}`, category: 'Goal', remark: `Add to goal` })
      });
      if (!res.ok) throw new Error('Failed to charge card');
      await res.json();
      // update goal on backend (increment current) and refresh local goals
      try {
        const gm = await fetch(`${API_BASE}/goals/${moneyGoalId}/add-money`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount })
        });
        if (gm.ok) {
          const updated = await gm.json();
          setGoals((prev: any[]) => prev.map((g: any) => g.id === updated.id ? updated : g));
        } else {
          console.warn('Failed to update goal after charging card');
        }
      } catch (gerr) {
        console.warn('Failed to update goal', gerr);
      }
      // notify other parts of the app
      window.dispatchEvent(new CustomEvent('transaction:created'));
      setShowAddMoney(false);
    } catch (err: any) {
      console.warn(err);
      setError(err?.message || 'Failed to add money');
    } finally { setLoading(false); }
  }

  function submitNewGoal() {
    if (!newGoalTitle || !newGoalTarget) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/goals`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newGoalTitle, target: Number(newGoalTarget), deadline: newGoalDeadline, priority: newGoalPriority })
        });
        if (!res.ok) throw new Error('Failed to create goal');
        const created = await res.json();
        setGoals((prev: any[]) => [created, ...prev]);
        setShowAddGoal(false);
        setNewGoalTitle(''); setNewGoalTarget(''); setNewGoalDeadline(''); setNewGoalPriority('medium');
      } catch (err: any) {
        console.warn(err);
        setError(err?.message || 'Failed to create goal');
      } finally { setLoading(false); }
    })();
  }

  function markGoalComplete(id: string) {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/goals/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: true })
        });
        if (!res.ok) throw new Error('Failed to mark complete');
        const updated = await res.json();
        setGoals((prev: any[]) => prev.map((g: any) => g.id === updated.id ? updated : g));
      } catch (err: any) {
        console.warn(err);
        setError(err?.message || 'Failed to update goal');
      } finally { setLoading(false); }
    })();
  }

  // sort goals: pending first by priority (high, medium, low), completed last
  const sortedGoals = useMemo(() => {
    const priorityValue = (p: string) => (p === 'high' ? 0 : p === 'medium' ? 1 : 2);
    const pending = goals.filter(g => !g.completed).sort((a: any, b: any) => {
      const pa = priorityValue(a.priority || 'medium');
      const pb = priorityValue(b.priority || 'medium');
      if (pa !== pb) return pa - pb;
      return a.title.localeCompare(b.title);
    });
    const completed = goals.filter(g => g.completed).sort((a: any, b: any) => a.title.localeCompare(b.title));
    return [...pending, ...completed];
  }, [goals]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Financial Reports</h1>
          <p className="text-slate-600">Comprehensive insights into your financial health</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 rounded-lg p-1">
            {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors capitalize ${
                  timeRange === range 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Download className="w-5 h-5 text-slate-600" />
          </button>
          
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Share2 className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-sm text-slate-600">Loading financial data…</div>
      )}

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Income</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCurrency(analytics.income)}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Expenses</p>
              <p className="text-2xl font-bold text-rose-600">{formatCurrency(analytics.expenses)}</p>
            </div>
            <div className="p-3 bg-rose-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-rose-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Net Balance</p>
              <p className={`text-2xl font-bold ${analytics.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatCurrency(analytics.net)}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${analytics.net >= 0 ? 'bg-emerald-100' : 'bg-rose-100'}`}>
              <DollarSign className={`w-6 h-6 ${analytics.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Transactions</p>
              <p className="text-2xl font-bold text-slate-800">{analytics.transactionCount}</p>
            </div>
            <div className="p-3 bg-slate-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      {showInsights && insights.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Smart Insights
            </h3>
            <button 
              onClick={() => setShowInsights(false)}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <EyeOff className="w-4 h-4 text-slate-600" />
            </button>
          </div>
          
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'success' ? 'bg-emerald-50 border-emerald-400' :
                insight.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                insight.type === 'error' ? 'bg-red-50 border-red-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-start gap-3">
                  <insight.icon className={`w-5 h-5 mt-0.5 ${
                    insight.type === 'success' ? 'text-emerald-600' :
                    insight.type === 'warning' ? 'text-yellow-600' :
                    insight.type === 'error' ? 'text-red-600' :
                    'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{insight.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{insight.message}</p>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 mt-2">
                      {insight.action} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Spending by Category</h3>
          <div className="space-y-3">
            {analytics.topCategories.map(([category, amount]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    {getCategoryIcon(category)}
                  </div>
                  <span className="font-medium text-slate-800">{category}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-800">{formatCurrency(Number(amount))}</div>
                  <div className="text-xs text-slate-500">
                    {((Number(amount) / analytics.expenses) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Performance */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Budget Performance</h3>
          <div className="space-y-4">
            {analytics.budgetPerformance.slice(0, 5).map((budget) => (
              <div key={budget.category}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-800">{budget.category}</span>
                  <div className="text-sm text-slate-600">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.budget)}
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      budget.status === 'over' ? 'bg-red-500' :
                      budget.status === 'warning' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs font-medium ${
                    budget.status === 'over' ? 'text-red-600' :
                    budget.status === 'warning' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {budget.percentage.toFixed(1)}%
                  </span>
                  {budget.status === 'over' && (
                    <span className="text-xs text-red-600 font-medium">Over Budget</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Goals */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Financial Goals</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAddGoal(true)} className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm">Add Goal</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sortedGoals.map((goal: any) => {
            const targetNum = Number(goal.target || 0) || 0;
            const currentNum = Number(goal.current || 0) || 0;
            const percent = targetNum > 0 ? Math.min(100, (currentNum / targetNum) * 100) : 0;
            return (
              <div key={goal.id} className={`p-4 border ${goal.completed ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'} rounded-lg`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-800">{goal.title}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(goal.priority)}`}>
                    {goal.priority}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-1">
                    <span>Progress</span>
                    <span>{percent.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percent)} title={`${formatCurrency(currentNum)} / ${formatCurrency(targetNum)} — ${percent.toFixed(1)}%`}>
                    <div 
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>

                <div className="text-sm text-slate-600 mb-3">
                  <div className="flex justify-between">
                    <span>{formatCurrency(Number(goal.current || 0))}</span>
                    <span>{formatCurrency(Number(goal.target || 0))}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button disabled={goal.completed} onClick={() => openAddMoneyModal(goal.id)} className="px-2 py-1 text-sm bg-slate-100 rounded-md">Add Money</button>
                  <button disabled={goal.completed || Number(goal.current || 0) < Number(goal.target || 0)} onClick={() => markGoalComplete(goal.id)} className="px-2 py-1 text-sm bg-emerald-100 rounded-md">Complete</button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Goal Modal */}
        {showAddGoal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h4 className="font-semibold mb-4">Create Goal</h4>
              <div className="space-y-3">
                <input value={newGoalTitle} onChange={e => setNewGoalTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
                <input value={String(newGoalTarget)} onChange={e => setNewGoalTarget(Number(e.target.value) || '')} placeholder="Target amount" type="number" className="w-full p-2 border rounded" />
                <input value={newGoalDeadline} onChange={e => setNewGoalDeadline(e.target.value)} placeholder="Deadline" type="date" className="w-full p-2 border rounded" />
                <select value={newGoalPriority} onChange={e => setNewGoalPriority(e.target.value as any)} className="w-full p-2 border rounded">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4">
                <button onClick={() => setShowAddGoal(false)} className="px-3 py-1">Cancel</button>
                <button onClick={submitNewGoal} className="px-3 py-1 bg-indigo-600 text-white rounded">Create</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Money Modal */}
        {showAddMoney && moneyGoalId && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h4 className="font-semibold mb-4">Add Money to Goal</h4>
              <div className="space-y-3">
                <select value={moneyCardId || ''} onChange={e => setMoneyCardId(e.target.value || null)} className="w-full p-2 border rounded">
                  {cards.map((c: any) => (<option key={c._id} value={c._id}>{c.accountName} — {c.currency} — {formatCurrency(c.availableBalance)}</option>))}
                </select>
                <input value={String(moneyAmount)} onChange={e => { setMoneyAmount(Number(e.target.value) || ''); setMoneyError(null); }} placeholder="Amount" type="number" className="w-full p-2 border rounded" />
                {moneyError && <div className="text-xs text-red-600 mt-1">{moneyError}</div>}
                <div className="text-xs text-slate-500 mt-1">
                  {(() => {
                    const goal = goals.find((g: any) => g.id === moneyGoalId);
                    const remaining = Math.max(0, Number(goal?.target || 0) - Number(goal?.current || 0));
                    const card = cards.find((c: any) => c._id === moneyCardId);
                    const cardBalance = Number(card?.availableBalance ?? 0);
                    return `Remaining goal: ${formatCurrency(remaining)} • Card balance: ${formatCurrency(cardBalance)}`;
                  })()}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4">
                <button onClick={() => setShowAddMoney(false)} className="px-3 py-1">Cancel</button>
                {(() => {
                  const amountNum = Number(moneyAmount) || 0;
                  const goal = goals.find((g: any) => g.id === moneyGoalId);
                  const remaining = Math.max(0, Number(goal?.target || 0) - Number(goal?.current || 0));
                  const card = cards.find((c: any) => c._id === moneyCardId);
                  const cardBalance = Number(card?.availableBalance ?? 0);
                  const disabled = amountNum <= 0 || amountNum > remaining || amountNum > cardBalance || !moneyCardId;
                  return (
                    <button disabled={disabled} onClick={submitAddMoney} className={`px-3 py-1 text-white rounded ${disabled ? 'bg-slate-300' : 'bg-indigo-600'}`}>
                      Charge Card & Add
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
