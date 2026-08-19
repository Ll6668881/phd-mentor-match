import type { MatchResult } from '../types';
import ScoreBar from './ScoreBar';

interface Props {
  result: MatchResult;
  rank: number;
}

const LEVEL_BADGE: Record<string, string> = {
  '985': 'bg-rose-50 text-rose-500 border-rose-200',
  '211': 'bg-orange-50 text-orange-500 border-orange-200',
  '双一流': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  '普通院校': 'bg-slate-100 text-slate-500 border-slate-200',
};

/** 单条导师匹配结果卡片（完整展示全部必填字段） */
export default function ResultCard({ result, rank }: Props) {
  const { mentor, totalScore, breakdown, matchPoints, warnings } = result;

  // 分数档位配色
  const scoreColor =
    totalScore >= 70 ? 'text-emerald-500' : totalScore >= 45 ? 'text-indigo-500' : 'text-slate-400';

  return (
    <article className="overflow-hidden rounded-xl2 bg-white shadow-soft">
      {/* 头部：排名 + 基本信息 */}
      <div className="flex items-start gap-4 border-b border-purple-50 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-macaron-blue to-macaron-lavender text-lg font-bold text-indigo-500">
          {rank}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-800">{mentor.name}</h3>
            <span className="rounded-full bg-macaron-mint px-2.5 py-0.5 text-xs font-medium text-teal-600">
              {mentor.title}
            </span>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${LEVEL_BADGE[mentor.schoolLevel]}`}>
              {mentor.schoolLevel}
            </span>
            {mentor.isDoctoralSupervisor && (
              <span className="rounded-full bg-macaron-lemon px-2.5 py-0.5 text-xs font-medium text-amber-600">
                🎓 博士招生资格
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {mentor.school} · {mentor.department}
            <span className="mx-1.5 text-slate-300">|</span>
            {mentor.province}
          </p>
        </div>
        {/* 综合分数 */}
        <div className="flex shrink-0 flex-col items-center">
          <span className={`text-4xl font-bold tabular-nums ${scoreColor}`}>{totalScore}</span>
          <span className="mt-0.5 text-xs text-slate-400">综合匹配分</span>
        </div>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-2">
        <div className="space-y-4">
          {/* 近5年核心研究方向 */}
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              近5年核心研究方向
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {mentor.researchDirections.map((d, i) => (
                <span key={i} className="rounded-full bg-macaron-blue px-3 py-1 text-xs text-indigo-600">
                  {d}
                </span>
              ))}
            </div>
          </div>
          {/* 分项得分 */}
          <div className="rounded-xl bg-purple-50/60 p-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">分项得分</h4>
            <ScoreBar breakdown={breakdown} />
          </div>
          <p className="text-xs text-slate-400">
            近5年发文 {mentor.publicationCount5y} 篇 · 近5年课题 {mentor.recentTopics.length} 项
          </p>
        </div>

        <div className="space-y-4">
          {/* ✅ 匹配点 */}
          <div className="rounded-xl bg-emerald-50/70 p-4">
            <h4 className="mb-2 text-sm font-semibold text-emerald-600">✅ 匹配点</h4>
            <ul className="space-y-1.5">
              {matchPoints.map((p, i) => (
                <li key={i} className="flex gap-1.5 text-sm text-emerald-800">
                  <span className="shrink-0 text-emerald-400">·</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* ⚠️ 待注意点 */}
          <div className="rounded-xl bg-amber-50/70 p-4">
            <h4 className="mb-2 text-sm font-semibold text-amber-600">⚠️ 待注意点</h4>
            <ul className="space-y-1.5">
              {warnings.map((w, i) => (
                <li key={i} className="flex gap-1.5 text-sm text-amber-800">
                  <span className="shrink-0 text-amber-400">·</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
