import type { MatchResult, UserInput } from '../types';
import ResultCard from '../components/ResultCard';
import Disclaimer from '../components/Disclaimer';

interface Props {
  input: UserInput;
  results: MatchResult[];
  totalCandidates: number;
  onBack: () => void;
}

/** 结果页：Top10 导师列表 */
export default function ResultsPage({ input, results, totalCandidates, onBack }: Props) {
  const limited = totalCandidates > results.length;

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">匹配结果</h2>
          <p className="mt-1 text-sm text-slate-500">
            一级学科：<span className="font-medium text-slate-600">{input.discipline.level1 || '未填'}</span>
            {input.discipline.level2 && (
              <>
                {' '}
                · 二级学科：<span className="font-medium text-slate-600">{input.discipline.level2}</span>
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

      {/* 候选总量标注：严格 Top10，不足 10 人时如实标注 */}
      <div className="rounded-xl2 border border-indigo-100 bg-gradient-to-r from-macaron-blue/60 to-macaron-lavender/60 px-5 py-3 text-sm text-indigo-700">
        {limited ? (
          <>
            共筛选出 <strong>{totalCandidates}</strong> 位候选导师（已排除不招收博士的导师），
            按匹配度降序展示匹配度最高的 <strong>Top 10</strong>。
          </>
        ) : (
          <>
            共筛选出 <strong>{totalCandidates}</strong> 位候选导师（已排除不招收博士的导师），
            不足 10 人，已全部如实展示。
          </>
        )}
      </div>

      {/* 列表 */}
      <div className="space-y-5">
        {results.map((r, i) => (
          <ResultCard key={r.mentor.id} result={r} rank={i + 1} />
        ))}
      </div>

      <Disclaimer compact />
      <p className="pb-4 text-center text-xs text-slate-400">
        数据为演示用 mock 数据，匹配结果仅供参考 · 建议结合官网招生简章与导师主页核实
      </p>
    </div>
  );
}
