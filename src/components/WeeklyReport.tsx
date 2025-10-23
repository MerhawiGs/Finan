import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const data = [
  { name: 'Mon', inc: 2400, exp: -400 },
  { name: 'Tue', inc: 1800, exp: -600 },
  { name: 'Wed', inc: 2200, exp: -200 },
  { name: 'Thu', inc: 2000, exp: -800 },
  { name: 'Fri', inc: 2600, exp: -300 },
  { name: 'Sat', inc: 1700, exp: -700 },
  { name: 'Sun', inc: 2100, exp: -100 },
];

function sumKey(arr: any[], key: string) {
  return arr.reduce((s, it) => s + (it[key] || 0), 0);
}

export default function WeeklyReport() {
  const totalInc = sumKey(data, 'inc');
  const totalExp = Math.abs(sumKey(data, 'exp'));
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
