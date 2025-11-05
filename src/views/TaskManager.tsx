import { useEffect, useState } from 'react';
import { Plus, X, Trash2, ChevronUp, ChevronDown, Edit2 } from 'lucide-react';

type Task = {
  id: string;
  name: string;
  incentive?: string;
  // kept minimal: completion is tracked per-day in Planner
};

const STORAGE_KEY = 'finan_tasks_v1';

const API_BASE = (import.meta as any).env.VITE_API_URL ?? 'http://localhost:3000';
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);

  const [form, setForm] = useState({ name: '', incentive: '' });

  useEffect(() => {
    // Try to load from server first, fall back to localStorage
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/tasks`);
        if (!res.ok) throw new Error('Failed to fetch tasks');
        const json = await res.json();
        // normalize to frontend Task shape
            const mapped: Task[] = Array.isArray(json) ? json.map((t: any) => ({ id: t._id || t.id || String(t._id), name: t.name, incentive: t.incentive })) : [];
        setTasks(mapped);
        setOffline(false);
      } catch (e) {
        console.warn('Failed to load tasks from server, falling back to localStorage', e);
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) setTasks(JSON.parse(raw));
        } catch (le) {
          console.warn('Failed to load tasks from localStorage', le);
        }
        setOffline(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed to save tasks', e);
    }
    // If online, also persist to server
    if (!offline) {
      (async () => {
        try {
          // send bulk upsert: create missing tasks and update existing order
          // We'll iterate tasks and create/update as needed
          for (let i = 0; i < tasks.length; i++) {
            const t = tasks[i];
            // if id looks like a backend id (24 hex) we PATCH, otherwise POST
            const isServerId = /^\w{24}$/.test(t.id);
            if (isServerId) {
              await fetch(`${API_BASE}/tasks/${t.id}`,
                { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: t.name, incentive: t.incentive, order: i }) }
              ).catch(() => {});
            } else {
              const created = await fetch(`${API_BASE}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: t.name, incentive: t.incentive, order: i }) });
              if (created.ok) {
                const body = await created.json();
                // replace local id with server id
                setTasks(prev => prev.map(pt => pt.id === t.id ? { ...pt, id: body._id || body.id } : pt));
              }
            }
          }
        } catch (err) {
          // don't block UI on save errors
          console.warn('Failed to persist tasks to server', err);
        }
      })();
    }
  }, [tasks]);

  function openCreate() {
    setEditing(null);
    setForm({ name: '', incentive: '' });
    setShowAdd(true);
  }

  function openEdit(task: Task) {
    setEditing(task);
    setForm({ name: task.name, incentive: task.incentive || '' });
    setShowAdd(true);
  }

  function saveTask() {
    if (!form.name.trim()) return;
    if (editing) {
      // optimistic update
      setTasks(prev => prev.map(t => t.id === editing.id ? { ...t, name: form.name.trim(), incentive: form.incentive.trim() || undefined } : t));
      // persist
      (async () => {
        try {
          await fetch(`${API_BASE}/tasks/${editing.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name.trim(), incentive: form.incentive.trim() || undefined }) });
        } catch (err) {
          console.warn('Failed to update task on server', err);
          setOffline(true);
        }
      })();
    } else {
      const t: Task = { id: uid(), name: form.name.trim(), incentive: form.incentive.trim() || undefined };
      setTasks(prev => [t, ...prev]);
      // create on server
      (async () => {
        try {
          const res = await fetch(`${API_BASE}/tasks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: t.name, incentive: t.incentive }) });
          if (res.ok) {
            const created = await res.json();
            setTasks(prev => prev.map(pt => pt.id === t.id ? { ...pt, id: created._id || created.id } : pt));
          }
        } catch (err) {
          console.warn('Failed to create task on server', err);
          setOffline(true);
        }
      })();
    }
    setForm({ name: '', incentive: '' });
    setEditing(null);
    setShowAdd(false);
  }

  function remove(id: string) {
    if (!confirm('Delete this task?')) return;
    setTasks(prev => prev.filter(t => t.id !== id));
    // delete on server if possible
    (async () => {
      try {
        if (/^\w{24}$/.test(id)) {
          await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
        }
      } catch (err) {
        console.warn('Failed to delete task on server', err);
        setOffline(true);
      }
    })();
  }

  function moveUp(id: string) {
    setTasks(prev => {
      const i = prev.findIndex(t => t.id === id);
      if (i <= 0) return prev;
      const copy = [...prev];
      const tmp = copy[i-1];
      copy[i-1] = copy[i];
      copy[i] = tmp;
      // persist order
      (async () => {
        try {
          await Promise.all(copy.map((t, idx) => {
            if (/^\w{24}$/.test(t.id)) return fetch(`${API_BASE}/tasks/${t.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: idx }) });
            return Promise.resolve();
          }));
        } catch (err) {
          console.warn('Failed to persist order', err);
          setOffline(true);
        }
      })();
      return copy;
    });
  }

  function moveDown(id: string) {
    setTasks(prev => {
      const i = prev.findIndex(t => t.id === id);
      if (i === -1 || i >= prev.length - 1) return prev;
      const copy = [...prev];
      const tmp = copy[i+1];
      copy[i+1] = copy[i];
      copy[i] = tmp;
      // persist order
      (async () => {
        try {
          await Promise.all(copy.map((t, idx) => {
            if (/^\w{24}$/.test(t.id)) return fetch(`${API_BASE}/tasks/${t.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order: idx }) });
            return Promise.resolve();
          }));
        } catch (err) {
          console.warn('Failed to persist order', err);
          setOffline(true);
        }
      })();
      return copy;
    });
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Daily Tasks</h2>
          <p className="text-sm text-slate-500">Track habits and daily incentives</p>
        </div>
        <div>
          <button onClick={openCreate} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-6 bg-white/5 rounded-lg text-center">Loading…</div>
      ) : tasks.length === 0 ? (
        <div className="p-6 bg-white/5 rounded-lg text-center">No tasks yet. Add one to get started.</div>
      ) : (
        <div className="space-y-3">
          {tasks.map((t, idx) => (
            <div key={t.id} className="flex items-center justify-between bg-linear-to-r from-slate-50 to-white rounded-lg p-3 shadow-md border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-orange-500 to-orange-300 flex items-center justify-center text-white font-bold">{String(idx+1)}</div>
                <div className="flex flex-col">
                  <div className={`font-semibold text-slate-800`}>{t.name}</div>
                  {t.incentive && <div className="text-xs text-slate-500 mt-1"><span className="px-2 py-0.5 bg-amber-50 border border-amber-100 rounded">+ {t.incentive}</span></div>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => moveUp(t.id)} className="p-2 rounded hover:bg-slate-100"><ChevronUp className="w-4 h-4 text-slate-600" /></button>
                <button onClick={() => moveDown(t.id)} className="p-2 rounded hover:bg-slate-100"><ChevronDown className="w-4 h-4 text-slate-600" /></button>
                <button onClick={() => openEdit(t)} className="p-2 rounded hover:bg-slate-100"><Edit2 className="w-4 h-4 text-slate-600" /></button>
                <button onClick={() => remove(t.id)} className="p-2 rounded hover:bg-slate-100"><Trash2 className="w-4 h-4 text-rose-600" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAdd(false)} />
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editing ? 'Edit Task' : 'Add Task'}</h3>
              <button onClick={() => { setShowAdd(false); setEditing(null); }} className="p-2"><X className="w-5 h-5" /></button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Task name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Incentive (if done daily)</label>
                <input value={form.incentive} onChange={e => setForm({ ...form, incentive: e.target.value })} placeholder="e.g. 10 points or 1 coffee" className="w-full p-2 border rounded" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => { setShowAdd(false); setEditing(null); }} className="px-4 py-2 rounded border">Cancel</button>
              <button onClick={saveTask} className="px-4 py-2 bg-indigo-600 text-white rounded">{editing ? 'Save' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
