import { Clock, Wallet, ShoppingCart, Home, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import FinancialCard from '../components/Card';
import { useMemo } from 'react';

type TransactionType = 'income' | 'expense';

interface Transaction {
  id: string;
  title: string;
  category: string;
  date: string; // ISO date
  amount: number;
  type: TransactionType;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
}

const mockTransactions: Transaction[] = [
  { id: 't1', title: 'Apartment Rent', category: 'Housing', date: '2025-10-01', amount: 1200, type: 'expense' },
  { id: 't2', title: 'Grocery Shopping', category: 'Groceries', date: '2025-10-20', amount: 94.23, type: 'expense' },
  { id: 't3', title: 'Salary', category: 'Income', date: '2025-10-15', amount: 4200, type: 'income' },
  { id: 't4', title: 'Stock Dividend', category: 'Investments', date: '2025-10-09', amount: 54.5, type: 'income' },
];

function formatCurrency(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

function formatShortDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return iso;
  }
}

function IconForCategory(category: string) {
  switch (category.toLowerCase()) {
    case 'housing':
      return <Home className="w-5 h-5 text-slate-600" />;
    case 'groceries':
      return <ShoppingCart className="w-5 h-5 text-slate-600" />;
    case 'income':
      return <Wallet className="w-5 h-5 text-slate-600" />;
    default:
      return <Clock className="w-5 h-5 text-slate-600" />;
  }
}

export default function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const items = useMemo(() => transactions && transactions.length ? transactions : mockTransactions, [transactions]);

  return (
    <div className="w-full max-w-4xl p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Recent Transactions</h3>
        <div className="text-sm text-slate-500 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>Last 30 days</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="divide-y divide-slate-100">
          {items.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50`}>{IconForCategory(t.category)}</div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-800">{t.title}</span>
                  <span className="text-xs text-slate-500">{t.category} · {formatShortDate(t.date)}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-sm text-slate-500">{formatCurrency(t.amount)}</div>
                <div className={`flex items-center text-sm font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {t.type === 'income' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownLeft className="w-4 h-4 mr-1" />}
                  <span className="sr-only">{t.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
