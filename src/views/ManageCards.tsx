import { useEffect, useState } from 'react';
import { Trash2, Edit2, Plus, X } from 'lucide-react';

type Card = {
  _id: string;
  accountName: string;
  icon: string;
  currency: string;
  cardType: string;
  availableBalance: number;
  initialBalance: number;
  targetBalance: number;
};

// const API = 'http://localhost:3000';
const API = import.meta.env.VITE_API_URL ?? 'https://finan-back-qmph.onrender.com';

export default function ManageCards() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Card | null>(null);

  const [form, setForm] = useState({
    accountName: '',
    icon: 'Wallet',
    currency: 'ETB',
    cardType: 'credit-card',
    initialBalance: 0,
    targetBalance: 0,
  });

  useEffect(() => { fetchCards(); }, []);

  async function fetchCards() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/cards`);
      const data = await res.json();
      setCards(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load cards');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ accountName: '', icon: 'Wallet', currency: 'ETB', cardType: 'credit-card', initialBalance: 0, targetBalance: 0 });
    setShowForm(true);
  }

  function openEdit(card: Card) {
    setEditing(card);
    setForm({ accountName: card.accountName, icon: card.icon, currency: card.currency, cardType: card.cardType, initialBalance: card.initialBalance, targetBalance: card.targetBalance });
    setShowForm(true);
  }

  async function save() {
    try {
      const payload = { ...form, availableBalance: form.initialBalance };
      if (editing) {
        const res = await fetch(`${API}/cards/${editing._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('Update failed');
      } else {
        const res = await fetch(`${API}/cards`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('Create failed');
      }
      setShowForm(false);
      fetchCards();
    } catch (err: any) {
      setError(err.message || 'Save failed');
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this card?')) return;
    try {
      const res = await fetch(`${API}/cards/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      fetchCards();
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Manage Accounts</h2>
        <div className="flex items-center gap-3">
          <button onClick={openCreate} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
            <Plus className="w-4 h-4" /> Add Account
          </button>
        </div>
      </div>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center p-6 bg-white/5 rounded-lg">Loading...</div>
        ) : cards.length === 0 ? (
          <div className="col-span-full text-center p-8 bg-white/5 rounded-lg">No accounts found.</div>
        ) : (
          cards.map(card => (
            <div key={card._id} className="bg-linear-to-br from-slate-800 to-slate-700 text-white rounded-xl p-5 shadow-lg relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase bg-white/10 px-2 py-1 rounded inline-block">{card.cardType.replace('-', ' ')}</div>
                  <h3 className="mt-3 text-lg font-semibold">{card.accountName}</h3>
                  <div className="mt-2 text-2xl font-bold">{card.availableBalance.toLocaleString('en-US', { style: 'currency', currency: card.currency })}</div>
                  <div className="mt-1 text-sm text-white/80">Target: {card.targetBalance.toLocaleString('en-US', { style: 'currency', currency: card.currency })}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => openEdit(card)} className="p-2 bg-white/10 rounded hover:bg-white/20"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => remove(card._id)} className="p-2 bg-red-600 rounded hover:opacity-90"><Trash2 className="w-4 h-4 text-white" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editing ? 'Edit Account' : 'Create Account'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Account Name</label>
                <input value={form.accountName} onChange={e => setForm({ ...form, accountName: e.target.value })} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Card Type</label>
                <select value={form.cardType} onChange={e => setForm({ ...form, cardType: e.target.value })} className="w-full p-2 border rounded">
                  <option value="credit-card">Credit Card</option>
                  <option value="saving-account">Savings</option>
                  <option value="personal-account">Personal</option>
                  <option value="investment-card">Investments</option>
                  <option value="mine-plus">Mine+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <input value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Icon</label>
                <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Initial Balance</label>
                <input type="number" value={String(form.initialBalance)} onChange={e => setForm({ ...form, initialBalance: Number(e.target.value) })} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Balance</label>
                <input type="number" value={String(form.targetBalance)} onChange={e => setForm({ ...form, targetBalance: Number(e.target.value) })} className="w-full p-2 border rounded" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded border">Cancel</button>
              <button onClick={save} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
