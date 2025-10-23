import { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Target, AlertCircle, 
  Download, Share2, EyeOff,
  BarChart3, Wallet,
  Home, ShoppingCart, Car, Coffee, Zap, Heart, BookOpen,
  Lightbulb
} from 'lucide-react';

// Mock data for comprehensive reports
const mockTransactions = [
  { id: 't1', title: 'Apartment Rent', category: 'Housing', date: '2025-01-15', amount: 12000, type: 'expense' },
  { id: 't2', title: 'Grocery Shopping', category: 'Groceries', date: '2025-01-14', amount: 942.30, type: 'expense' },
  { id: 't3', title: 'Salary Payment', category: 'Income', date: '2025-01-10', amount: 42000, type: 'income' },
  { id: 't4', title: 'Stock Dividend', category: 'Investments', date: '2025-01-08', amount: 545.00, type: 'income' },
  { id: 't5', title: 'Coffee Shop', category: 'Food & Drink', date: '2025-01-13', amount: 85.50, type: 'expense' },
  { id: 't6', title: 'Uber Ride', category: 'Transportation', date: '2025-01-12', amount: 120.00, type: 'expense' },
  { id: 't7', title: 'Freelance Project', category: 'Income', date: '2025-01-11', amount: 5000.00, type: 'income' },
  { id: 't8', title: 'Phone Bill', category: 'Utilities', date: '2025-01-09', amount: 250.00, type: 'expense' },
  { id: 't9', title: 'Gym Membership', category: 'Health', date: '2025-01-08', amount: 500.00, type: 'expense' },
  { id: 't10', title: 'Online Course', category: 'Education', date: '2025-01-07', amount: 1200.00, type: 'expense' },
  { id: 't11', title: 'Restaurant', category: 'Food & Drink', date: '2025-01-06', amount: 350.00, type: 'expense' },
  { id: 't12', title: 'Gas Station', category: 'Transportation', date: '2025-01-05', amount: 180.00, type: 'expense' },
];

const mockBudgets = [
  { category: 'Housing', budget: 15000, spent: 12000, color: 'bg-blue-500' },
  { category: 'Groceries', budget: 2000, spent: 942.30, color: 'bg-green-500' },
  { category: 'Transportation', budget: 1000, spent: 300, color: 'bg-indigo-500' },
  { category: 'Food & Drink', budget: 1500, spent: 435.50, color: 'bg-orange-500' },
  { category: 'Utilities', budget: 500, spent: 250, color: 'bg-yellow-500' },
  { category: 'Health', budget: 1000, spent: 500, color: 'bg-red-500' },
  { category: 'Education', budget: 2000, spent: 1200, color: 'bg-teal-500' },
];

const mockGoals = [
  { title: 'Emergency Fund', target: 50000, current: 25000, deadline: '2025-12-31', priority: 'high' },
  { title: 'Vacation Fund', target: 15000, current: 8000, deadline: '2025-06-30', priority: 'medium' },
  { title: 'New Laptop', target: 30000, current: 12000, deadline: '2025-03-31', priority: 'low' },
];

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

  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    // Filter transactions based on time range
    let filteredTransactions = mockTransactions;
    const now = new Date();
    
    if (timeRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredTransactions = mockTransactions.filter(t => new Date(t.date) >= weekAgo);
    } else if (timeRange === 'month') {
      filteredTransactions = mockTransactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
      });
    } else if (timeRange === 'quarter') {
      const quarterStart = new Date(currentYear, Math.floor(currentMonth / 3) * 3, 1);
      filteredTransactions = mockTransactions.filter(t => new Date(t.date) >= quarterStart);
    }

    const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const net = income - expenses;

    // Category breakdown
    const categoryBreakdown = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Top spending categories
    const topCategories = Object.entries(categoryBreakdown)
      .sort(([,a], [,b]) => b - a)
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
    const nearGoal = mockGoals.filter(g => (g.current / g.target) > 0.8);
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
                  <div className="font-semibold text-slate-800">{formatCurrency(amount)}</div>
                  <div className="text-xs text-slate-500">
                    {((amount / analytics.expenses) * 100).toFixed(1)}%
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
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Financial Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockGoals.map((goal, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-800">{goal.title}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(goal.priority)}`}>
                  {goal.priority}
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm text-slate-600 mb-1">
                  <span>Progress</span>
                  <span>{((goal.current / goal.target) * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>{formatCurrency(goal.current)}</span>
                  <span>{formatCurrency(goal.target)}</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Deadline: {new Date(goal.deadline).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
