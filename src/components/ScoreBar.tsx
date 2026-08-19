import type { ScoreBreakdown } from '../types';

/** 分项得分条（语义50 / 科研30 / 学科20 的可视化） */
export default function ScoreBar({ breakdown }: { breakdown: ScoreBreakdown }) {
  const items: { key: keyof ScoreBreakdown; label: string; max: number; color: string; bg: string }[] = [
    { key: 'semantic', label: '研究方向语义相似度', max: 50, color: 'bg-indigo-400', bg: 'bg-indigo-100' },
    { key: 'research', label: '科研成果契合度', max: 30, color: 'bg-teal-400', bg: 'bg-teal-100' },
    { key: 'discipline', label: '学科专业匹配', max: 20, color: 'bg-pink-400', bg: 'bg-pink-100' },
  ];
  return (
    <div className="space-y-2">
      {items.map((it) => {
        const v = breakdown[it.key];
        const pct = Math.min(100, (v / it.max) * 100);
        return (
          <div key={it.key} className="flex items-center gap-3 text-xs">
            <span className="w-32 shrink-0 text-slate-500">{it.label}</span>
            <div className={`h-2.5 flex-1 overflow-hidden rounded-full ${it.bg}`}>
              <div className={`h-full rounded-full ${it.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
            </div>
            <span className="w-16 shrink-0 text-right font-medium tabular-nums text-slate-600">
              {v} / {it.max}
            </span>
          </div>
        );
      })}
    </div>
  );
}
