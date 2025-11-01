import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useCardContext } from '../contexts/CardContext';

// const API = 'http://localhost:3000';
const API = import.meta.env.VITE_API_URL ?? 'https://finan-back-qmph.onrender.com';

type Tx = {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  createdAt?: string;
};

function getLastNDates(n: number) {
  const arr: { iso: string; label: string }[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const iso = d.toISOString();
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    arr.push({ iso, label });
  }
  return arr;
}

export default function WeeklyReport() {
  const { selectedCardId } = useCardContext();
  const [txs, setTxs] = useState<Tx[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const url = selectedCardId ? `${API}/transactions/card/${selectedCardId}` : `${API}/transactions`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const data = await res.json();
        const mapped: Tx[] = (data || []).map((t: any) => ({
          id: t._id || t.id,
          amount: Number(t.amount || 0),
          type: t.type === 'income' ? 'income' : 'expense',
          createdAt: t.createdAt || t.date || new Date().toISOString(),
        }));
        if (mounted) setTxs(mapped);
      } catch (err: any) {
        if (mounted) setError(err.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    const onCreated = () => load();
    window.addEventListener('transaction:created', onCreated as EventListener);
    return () => {
      mounted = false;
      window.removeEventListener('transaction:created', onCreated as EventListener);
    };
  }, [selectedCardId]);

  const last7 = useMemo(() => getLastNDates(7), []);

  const data = useMemo(() => {
    // initialize with zeros
    const base = last7.map(d => ({ name: d.label, inc: 0, exp: 0 }));

    const source = txs && txs.length ? txs : [];

    for (const t of source) {
      const date = t.createdAt ? new Date(t.createdAt) : new Date();
      // find matching day (by date string)
      for (let i = 0; i < last7.length; i++) {
        const dIso = new Date(last7[i].iso);
        if (dIso.getFullYear() === date.getFullYear() && dIso.getMonth() === date.getMonth() && dIso.getDate() === date.getDate()) {
          if (t.type === 'income') base[i].inc += Math.abs(t.amount);
          else base[i].exp -= Math.abs(t.amount); // keep expenses negative for chart
          break;
        }
      }
    }

    return base;
  }, [txs, last7]);

  const totalInc = data.reduce((s, it) => s + (it.inc || 0), 0);
  const totalExp = Math.abs(data.reduce((s, it) => s + (it.exp || 0), 0));
  const net = totalInc - totalExp;
  const isPositive = net >= 0;

  return (
    <div className="w-full max-w-4xl p-4 mt-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">Weekly Report</h3>
          <p className="text-sm text-slate-500">Performance for the last 7 days</p>
        </div>
        <div className="flex items-center self-end sm:self-auto gap-4">
          <div className="text-right">
            <div className={`text-xl font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>{isPositive ? `+${net}` : `${net}`}</div>
            <div className="text-xs text-slate-500">Net</div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
            {isPositive ? <ArrowUpRight className="w-4 h-4 text-emerald-600" /> : <ArrowDownLeft className="w-4 h-4 text-rose-500" />}
            <div className="text-sm text-slate-700">{isPositive ? 'Up' : 'Down'}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
          <div className="text-sm text-slate-600">Income: <span className="font-medium text-slate-800">${totalInc.toLocaleString()}</span></div>
          <div className="text-sm text-slate-600">Expenses: <span className="font-medium text-slate-800">${totalExp.toLocaleString()}</span></div>
        </div>

        {loading && <div className="py-6 text-center text-sm text-slate-500">Loading weekly data…</div>}
        {error && <div className="py-4 text-center text-sm text-rose-600">Failed to load data: {error}</div>}

        <div style={{ width: '100%', height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 8, left: -12, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fill: '#475569' }} />
              <Tooltip formatter={(value: number) => `$${Math.abs(value)}`} />
              <ReferenceLine y={0} stroke="#94a3b8" />
              <Bar dataKey="inc" stackId="a" fill="#10b981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="exp" stackId="a" fill="#ef4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
