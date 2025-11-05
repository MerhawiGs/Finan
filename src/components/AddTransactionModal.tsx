import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useCardContext } from '../contexts/CardContext';

const API = import.meta.env.VITE_API_URL; 
// const API = import.meta.env.VITE_API_URL ?? 'https://finan-back-qmph.onrender.com';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddTransactionModal({ open, onClose }: Props) {
  const { selectedCardId } = useCardContext();
  const [card, setCard] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState<number | ''>('');
  const [remark, setRemark] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!open) return;
    if (!selectedCardId) {
      setCard(null);
      return;
    }
    let mounted = true;
    const fetchCard = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/cards/${selectedCardId}`);
        if (!res.ok) throw new Error('Failed to fetch card');
        const data = await res.json();
        if (!mounted) return;
        setCard(data);
      } catch (err) {
        setCard(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
    return () => { mounted = false; };
  }, [open, selectedCardId]);

  const save = () => {
    if (!amount || amount <= 0) {
      alert('Enter a valid amount');
      return;
    }
    // prevent creating an expense if card has no balance or insufficient funds
    if (type === 'expense') {
      const bal = Number(card?.availableBalance ?? 0);
      if (bal <= 0) {
        alert('Selected card has no available balance to create an expense');
        return;
      }
      if (Number(amount) > bal) {
        alert('Amount exceeds available card balance');
        return;
      }
    }
    const txn = {
      type,
      amount: Number(amount),
      remark,
    };

    // POST to backend transaction endpoint
    (async () => {
      try {
        if (!selectedCardId) {
          alert('No card selected');
          return;
        }
        const body = { ...txn, category, title };
        const res = await fetch(`${API}/cards/${selectedCardId}/transaction`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const bodyErr = await res.json().catch(() => ({}));
          throw new Error(bodyErr.message || 'Failed to save transaction');
        }
        const data = await res.json();
        console.log('Transaction saved:', data);
        // notify other components (Cards) to refresh
        try { window.dispatchEvent(new CustomEvent('transaction:created', { detail: data })); } catch {}
        onClose();
      } catch (err: any) {
        alert('Save failed: ' + (err.message || String(err)));
      }
    })();
  };

  const amountNum = typeof amount === 'number' ? amount : 0;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Transaction</h3>
          <button onClick={onClose} className="p-2"><X className="w-5 h-5" /></button>
        </div>

        {loading ? (
          <div>Loading card...</div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded bg-gray-50">
              <div>
                <div className="text-sm text-gray-500">Account</div>
                <div className="font-semibold">{card?.accountName ?? 'No card selected'}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Balance</div>
                <div className="font-semibold">{card ? card.availableBalance.toLocaleString('en-US', { style: 'currency', currency: card.currency }) : '-'}</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded" placeholder="e.g. Grocery shopping" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <div className="flex gap-2">
                <button onClick={() => setType('expense')} className={`px-3 py-1 rounded ${type === 'expense' ? 'bg-red-100 border' : 'bg-white border'} border-gray-200`}>Expense</button>
                <button onClick={() => setType('income')} className={`px-3 py-1 rounded ${type === 'income' ? 'bg-green-100 border' : 'bg-white border'} border-gray-200`}>Income</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded">
                <option>Groceries</option>
                <option>Housing</option>
                <option>Income</option>
                <option>Investments</option>
                <option>Food & Drink</option>
                <option>Transportation</option>
                <option>Utilities</option>
                <option>Entertainment</option>
                <option>Education</option>
                <option>Health</option>
                <option>Technology</option>
                <option>Business</option>
                <option>Gifts</option>
                <option>Uncategorized</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))} className="w-full p-2 border rounded" />
              {type === 'expense' && (
                <div className="text-xs mt-1">
                  <span className="text-slate-500">Available: {card ? card.availableBalance.toLocaleString('en-US', { style: 'currency', currency: card.currency }) : '-'}</span>
                  {card && card.availableBalance <= 0 && <div className="text-xs text-red-600">This card has no available balance — cannot create an expense.</div>}
                  {card && amountNum > card.availableBalance && <div className="text-xs text-red-600">Entered amount exceeds available balance.</div>}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Remark</label>
              <textarea value={remark} onChange={e => setRemark(e.target.value)} className="w-full p-2 border rounded" rows={3} />
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
              <button
                onClick={save}
                disabled={loading || amountNum <= 0 || (type === 'expense' && (!card || Number(card.availableBalance) <= 0 || amountNum > Number(card.availableBalance)))}
                className={`px-4 py-2 text-white rounded ${loading ? 'bg-slate-300' : 'bg-indigo-600'} ${(type === 'expense' && (!card || Number(card.availableBalance) <= 0 || amountNum > Number(card.availableBalance))) || amountNum <= 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
