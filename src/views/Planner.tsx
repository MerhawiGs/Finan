import { useEffect, useMemo, useState } from 'react';
import { useCardContext } from '../contexts/CardContext';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CirclePoundSterling } from 'lucide-react';

const API = 'http://localhost:3000';
// const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type Task = {
  id: string;
  name: string;
  incentive?: string;
};

type History = Record<string, Record<string, boolean>>; // date -> { taskId: completed }
type Claims = Record<string, { cardId: string; amount: number; at: string }>;

const TASK_KEY = 'finan_tasks_v1';
const HISTORY_KEY = 'finan_task_history_v1';
const CLAIMS_KEY = 'finan_task_claims_v1';

function todayISO(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function getLastNDates(n: number) {
  const arr: Date[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    arr.push(d);
  }
  return arr;
}

export default function Planner() {
  const { selectedCardId } = useCardContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<History>({});
  const [claims, setClaims] = useState<Claims>({});

  const [selectedDate, setSelectedDate] = useState<string>(todayISO());

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [selectedCardToCharge, setSelectedCardToCharge] = useState<string | null>(null);
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(TASK_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch (e) { console.warn(e); }

    try {
      const h = localStorage.getItem(HISTORY_KEY);
      if (h) setHistory(JSON.parse(h));
    } catch (e) { console.warn(e); }

    try {
      const c = localStorage.getItem(CLAIMS_KEY);
      if (c) setClaims(JSON.parse(c));
    } catch (e) { console.warn(e); }
  }, []);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims));
  }, [claims]);

  const days = useMemo(() => getLastNDates(7), []);
  const navigate = useNavigate();

  function isCompletedOn(dateISO: string, taskId: string) {
    return !!(history[dateISO] && history[dateISO][taskId]);
  }

  function toggleTask(dateISO: string, taskId: string) {
    setHistory(prev => {
      const copy = { ...prev };
      copy[dateISO] = { ...(copy[dateISO] || {}) };
      copy[dateISO][taskId] = !copy[dateISO][taskId];
      return copy;
    });
  }

  

  const totalIncentive = useMemo(() => {
    const date = selectedDate;
    const completedIds = Object.keys(history[date] || {}).filter(id => history[date][id]);
    let sum = 0;
    for (const id of completedIds) {
      const t = tasks.find(x => x.id === id);
      if (t && t.incentive) {
        const parsed = parseFloat(t.incentive.replace(/[^0-9.]/g, ''));
        if (!isNaN(parsed)) sum += parsed;
      }
    }
    return sum;
  }, [history, selectedDate, tasks]);

  const isClaimed = !!claims[selectedDate];

  async function openClaim() {
    setClaimError(null);
    // fetch cards
    try {
      const res = await fetch(`${API}/cards`);
      const data = await res.json();
      setCards(data || []);
      // default to selectedCardId if it exists otherwise first card
      setSelectedCardToCharge(selectedCardId || (data && data[0] && data[0]._id) || null);
      setShowClaimModal(true);
    } catch (err: any) {
      setClaimError(err.message || 'Failed to load cards');
      setShowClaimModal(true);
    }
  }

  async function claim() {
    if (isClaimed) return;
    if (!selectedCardToCharge) { setClaimError('Choose a card to charge'); return; }
    if (totalIncentive <= 0) { setClaimError('No incentive to claim'); return; }

    setClaimLoading(true);
    setClaimError(null);
    try {
      // create a Reward payload on selected card (server supports 'reward' type)
      const payload = { type: 'reward', amount: totalIncentive, title: `Claim Reward ${selectedDate}`, category: 'Reward', remark: `Claim for ${selectedDate}` };
      const res = await fetch(`${API}/cards/${selectedCardToCharge}/transaction`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.message || 'Claim failed');

      // mark claimed
      setClaims(prev => ({ ...prev, [selectedDate]: { cardId: selectedCardToCharge, amount: totalIncentive, at: new Date().toISOString() } }));

      // notify other components
      window.dispatchEvent(new CustomEvent('transaction:created'));
      setShowClaimModal(false);
    } catch (err: any) {
      setClaimError(err.message || 'Claim failed');
    } finally {
      setClaimLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Weekly Planner</h2>
          <p className="text-sm text-slate-500">Mark daily tasks and claim Rewards</p>
        </div>
        <div>
          <button onClick={() => navigate('/taskmanager')} className="px-3 py-2 bg-indigo-600 text-white rounded-lg">Tasks</button>
        </div>
      </div>

      {/* week header */}
      <div className="flex gap-2 mb-4">
        {days.map(d => {
          const iso = d.toISOString().slice(0, 10);
          const label = d.toLocaleDateString('en-US', { weekday: 'short' });
          const isToday = iso === todayISO();
          const classes = `px-3 py-2 rounded-lg cursor-pointer ${iso === selectedDate ? 'bg-indigo-600 text-white' : isToday ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-200' : 'bg-slate-100 text-slate-700'}`;
          return <button key={iso} className={classes} onClick={() => setSelectedDate(iso)}>{label}</button>;
        })}
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h3 className="text-lg font-medium mb-3">Tasks for {new Date(selectedDate).toLocaleDateString()}</h3>

        {tasks.length === 0 ? (
          <div className="text-sm text-slate-500">No tasks yet. Add tasks in the Tasks view.</div>
        ) : (
          <div className="space-y-3">
            {tasks.map((t, idx) => (
              <div key={t.id} className="flex items-center justify-between p-4 rounded-xl shadow-lg bg-linear-to-br from-white to-slate-50">
                <div className="flex items-center gap-4">
                  {/* <div className="w-14 h-14 rounded-xl bg-linear-to-br from-indigo-500 to-emerald-400 flex items-center justify-center text-white font-bold text-lg">{String(idx+1)}</div> */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={isCompletedOn(selectedDate, t.id)} onChange={() => toggleTask(selectedDate, t.id)} className="w-5 h-5" />
                    <div>
                      <div className="text-lg font-semibold">{t.name}</div>
                      {t.incentive && <div className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                        <span className="py-0.5 bg-amber-50 border border-amber-100 rounded">
                          <CirclePoundSterling size={16} />
                        </span>
                        <span>{t.incentive}</span>
                      </div>}
                    </div>
                  </label>
                </div>
                <div className="text-sm text-slate-500">{isCompletedOn(selectedDate, t.id) ? 'Done' : 'Pending'}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm">Total Rewards: <span className="font-semibold">{totalIncentive.toFixed(2)}</span></div>
          <div>
            {isClaimed ? (
              <div className="flex items-center gap-3">
                <div className="text-sm text-emerald-600">Claimed: {claims[selectedDate].amount}</div>
              </div>
            ) : (
              <button onClick={openClaim} className="px-4 py-2 bg-emerald-600 text-white rounded">Claim</button>
            )}
          </div>
        </div>
      </div>

      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowClaimModal(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Claim Rewards for {selectedDate}</h3>
              <button onClick={() => setShowClaimModal(false)} className="p-2"><X className="w-5 h-5" /></button>
            </div>

            {claimError && <div className="mb-3 text-sm text-rose-600">{claimError}</div>}

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Charge card</label>
              <select value={selectedCardToCharge || ''} onChange={e => setSelectedCardToCharge(e.target.value)} className="w-full p-2 border rounded">
                <option value="">Select card to charge</option>
                {cards.map(c => <option key={c._id} value={c._id}>{c.accountName} — {c.availableBalance.toLocaleString()}</option>)}
              </select>
            </div>

            <div className="mb-3 text-sm">Amount: <span className="font-semibold">{totalIncentive.toFixed(2)}</span></div>

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowClaimModal(false)} className="px-4 py-2 rounded border">Cancel</button>
              <button onClick={claim} disabled={claimLoading} className="px-4 py-2 bg-emerald-600 text-white rounded">{claimLoading ? 'Claiming…' : 'Claim and Charge'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
