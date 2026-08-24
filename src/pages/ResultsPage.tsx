import type { TargetMatchResult, UserInput } from '../types';
import ScoreBar from '../components/ScoreBar';
import Disclaimer from '../components/Disclaimer';

interface Props {
  input: UserInput;
  result: TargetMatchResult;
  onBack: () => void;
}

const isValidUrl = (u: string): boolean => /^https?:\/\/.+/i.test(u);

/** 结果页：用户与目标导师的匹配度分析 */
export default function ResultsPage({ input, result, onBack }: Props) {
  const m = input.targetMentor;
  const { totalScore, breakdown, matchPoints, warnings } = result;

  // 分数档位配色
  const scoreColor =
    totalScore >= 70 ? 'text-emerald-500' : totalScore >= 45 ? 'text-indigo-500' : 'text-slate-400';
  const scoreRing =
    totalScore >= 70
      ? 'from-emerald-100 to-teal-100'
      : totalScore >= 45
        ? 'from-indigo-100 to-pink-100'
        : 'from-slate-100 to-purple-100';

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-8">
      {/* 头部 */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">与目标导师的匹配度分析</h2>
          <p className="mt-1 text-sm text-slate-500">
            我的学科：<span className="font-medium text-slate-600">{input.discipline.level1 || '未填'}</span>
            {input.discipline.level2 && (
              <>
                {' '}
                · <span className="font-medium text-slate-600">{input.discipline.level2}</span>
              </>
            )}
            {' '}
            · 拟报考方向：<span className="font-medium text-slate-600">{input.achievements.targetDirection}</span>
          </p>
        </div>
        <button
          onClick={onBack}
          className="rounded-full border border-indigo-200 bg-white px-5 py-2 text-sm font-medium text-indigo-500 transition hover:bg-indigo-50"
        >
          ← 重新填写
        </button>
      </header>

      {/* 目标导师资料卡 */}
      <section className="overflow-hidden rounded-xl2 bg-white shadow-soft">
        <div className="flex flex-wrap items-center gap-4 border-b border-purple-50 bg-gradient-to-r from-macaron-blue/40 to-macaron-lavender/40 px-5 py-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 text-lg font-bold text-white">
            {m.name ? m.name.slice(0, 1) : '导'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-800">{m.name || '未填姓名'}</h3>
              {m.title && (
                <span className="rounded-full bg-macaron-mint px-2.5 py-0.5 text-xs font-medium text-teal-600">
                  {m.title}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {m.school || '未填单位'}
              {m.level1 && (
                <>
                  {' '}
                  · <span className="font-medium text-slate-600">{m.level1}</span>
                  {m.level2 && ` / ${m.level2}`}
                </>
              )}
            </p>
          </div>
          {/* 综合匹配分 */}
          <div className="flex shrink-0 flex-col items-center rounded-2xl bg-white/70 px-5 py-3 shadow-softer">
            <span className={`text-4xl font-bold tabular-nums ${scoreColor}`}>{totalScore}</span>
            <span className="mt-0.5 text-xs text-slate-400">综合匹配分 / 100</span>
          </div>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-2">
          <div className="space-y-4">
            {/* 分项得分 */}
            <div className="rounded-xl bg-purple-50/60 p-4">
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">分项得分</h4>
              <ScoreBar breakdown={breakdown} />
            </div>
            {/* 导师近5年研究方向 */}
            {m.researchDirections.length > 0 && (
              <div>
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  目标导师近5年研究方向
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {m.researchDirections.map((d, i) => (
                    <span key={i} className="rounded-full bg-macaron-blue px-3 py-1 text-xs text-indigo-600">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
      </section>

      {/* 导师资料明细 */}
      <section className="rounded-xl2 bg-white p-5 shadow-soft">
        <h4 className="mb-3 font-semibold text-slate-700">目标导师资料明细（按您填写的信息）</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          {m.recentPapers.length > 0 && (
            <div>
              <h5 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">近5年代表论文</h5>
              <ul className="list-disc space-y-1 pl-4 text-sm text-slate-600">
                {m.recentPapers.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          {m.recentProjects.length > 0 && (
            <div>
              <h5 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">近5年科研项目</h5>
              <ul className="list-disc space-y-1 pl-4 text-sm text-slate-600">
                {m.recentProjects.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          {m.webpage && (
            <div className="sm:col-span-2">
              <h5 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">导师主页 / 资料网页</h5>
              <a
                href={m.webpage}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-indigo-500 underline decoration-indigo-200 underline-offset-2 hover:text-indigo-700"
              >
                {m.webpage}
              </a>
              <p className="mt-1 text-xs text-slate-400">网页链接仅作参考展示，不参与匹配度计算，请自行核对内容。</p>
            </div>
          )}
        </div>
        {!isValidUrl(m.webpage) && m.webpage && (
          <p className="mt-2 text-xs text-amber-500">注意：填写的网页链接格式不完整，将按纯文本展示。</p>
        )}
      </section>

      {/* 计算口径说明 */}
      <div className={`rounded-xl2 bg-gradient-to-r ${scoreRing} px-5 py-3 text-sm text-slate-600`}>
        匹配度按「研究方向语义相似度 50 分 + 科研成果契合度 30 分 + 学科专业匹配 20 分」计算，
        基于您填写的个人简历、报考方向与目标导师资料（近5年论文/项目/方向）。
      </div>

      <Disclaimer compact />
      <p className="pb-4 text-center text-xs text-slate-400">
        匹配结果基于您填写的目标导师资料，仅供参考 · 请务必结合官网招生简章与导师主页核实
      </p>
    </div>
  );
}
