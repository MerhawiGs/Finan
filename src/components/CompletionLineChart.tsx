import { useEffect, useMemo, useState } from 'react';

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

function shortDayLabel(d: Date) {
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

export default function CompletionLineChart() {
  const [history, setHistory] = useState<Record<string, Record<string, boolean>>>({});
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  useEffect(() => {
    // fetch aggregated per-task history from backend to build per-task map
    async function load() {
      try {
        const API_BASE = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';
        const res = await fetch(`${API_BASE}/planner/history`);
        if (!res.ok) throw new Error('Failed to load planner history');
        const arr = await res.json();
        // arr is list of { dateISO, taskId, completed }
        const map: Record<string, Record<string, boolean>> = {};
        for (const item of arr) {
          map[item.dateISO] = map[item.dateISO] || {};
          map[item.dateISO][item.taskId] = !!item.completed;
        }
        setHistory(map);
      } catch (e) {
        // fallback to localStorage if backend not available
        try {
          const raw = localStorage.getItem('finan_task_history_v1');
          if (raw) setHistory(JSON.parse(raw));
          else setHistory({});
        } catch (ee) { setHistory({}); }
      }
    }

    load();
    // refresh periodically to keep chart in sync with backend changes
    const id = window.setInterval(load, 5000);
    return () => window.clearInterval(id);
  }, []);

  const days = useMemo(() => getLastNDates(7), []);

  const data = useMemo(() => {
    return days.map(d => {
      const iso = d.toISOString().slice(0, 10);
      const dayRecord = history[iso] || {};
      const count = Object.values(dayRecord).filter(Boolean).length;
      return { iso, label: shortDayLabel(d), count };
    });
  }, [days, history]);

  // SVG chart sizing
  const width = 600;
  const height = 160;
  const padding = 24;

  const maxVal = Math.max(1, ...data.map(d => d.count));

  const points = data.map((d, i) => {
    const x = padding + (i * (width - padding * 2)) / (data.length - 1 || 1);
    const y = padding + (1 - d.count / maxVal) * (height - padding * 2);
    return { x, y };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mt-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-3">Weekly Task Completions</h3>
      <div className="overflow-x-auto">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="w-full max-w-3xl">
          {/* grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
            <line key={i} x1={padding} x2={width - padding} y1={(padding + t * (height - padding * 2)).toString()} y2={(padding + t * (height - padding * 2)).toString()} stroke="#eef2ff" strokeWidth={1} />
          ))}

          {/* polyline path */}
          <path d={pathD} fill="none" stroke="#4f46e5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {/* area under curve subtle */}
          <path d={`${pathD} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`} fill="rgba(79,70,229,0.06)" />

          {/* points */}
          {points.map((p, idx) => (
            <g key={idx} onMouseEnter={() => setHoverIndex(idx)} onMouseLeave={() => setHoverIndex(null)}>
              <circle cx={p.x} cy={p.y} r={6} fill="#6366f1" stroke="#fff" strokeWidth={1.5} style={{ cursor: 'pointer' }} />
              {/* show hover label inside SVG when hovered */}
              {hoverIndex === idx && (
                <g>
                  <rect x={p.x - 26} y={p.y - 36} rx={4} ry={4} width={52} height={22} fill="#111827" opacity={0.95} />
                  <text x={p.x} y={p.y - 22} fontSize={12} textAnchor="middle" fill="#ffffff">{data[idx].count} done</text>
                </g>
              )}
            </g>
          ))}

          {/* x labels */}
          {data.map((d, i) => {
            const x = padding + (i * (width - padding * 2)) / (data.length - 1 || 1);
            return (
              <text key={d.iso} x={x} y={height - 6} fontSize={11} textAnchor="middle" fill="#475569">{d.label}</text>
            );
          })}

          {/* y labels */}
          {[0, 0.5, 1].map((t, i) => {
            const val = Math.round(t * maxVal);
            const y = padding + (1 - t) * (height - padding * 2);
            return (
              <text key={i} x={6} y={y + 4} fontSize={11} fill="#94a3b8">{val}</text>
            );
          })}
        </svg>
      </div>
      <div className="mt-3 text-xs text-slate-500">Shows number of tasks marked completed per day for the last 7 days.</div>
    </div>
  );
}
