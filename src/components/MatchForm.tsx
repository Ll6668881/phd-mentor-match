import { useMemo, useState } from 'react';
import type { SchoolLevel, UserInput } from '../types';
import { LEVEL1_DISCIPLINES } from '../data/disciplines';
import { REGIONS } from '../data/regions';
import { EXAMPLE_INPUT } from '../data/exampleInput';

const SCHOOL_LEVELS: SchoolLevel[] = ['985', '211', '双一流', '普通院校'];

interface Props {
  initial: UserInput;
  onSubmit: (input: UserInput) => void;
}

/** 将多行文本解析为字符串数组（每行一条） */
const splitLines = (s: string): string[] =>
  s
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean);

/** 将研究兴趣解析为数组（支持逗号/顿号/分号/换行分隔） */
const splitInterests = (s: string): string[] =>
  s
    .split(/[,，、;；\n]/)
    .map((t) => t.trim())
    .filter(Boolean);

const inputCls =
  'w-full rounded-xl border border-purple-100 bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-softer outline-none transition focus:border-purple-300 focus:ring-2 focus:ring-purple-100 placeholder:text-slate-300';

const labelCls = 'mb-1.5 block text-sm font-medium text-slate-600';

export default function MatchForm({ initial, onSubmit }: Props) {
  const [level1, setLevel1] = useState(initial.discipline.level1);
  const [level2, setLevel2] = useState(initial.discipline.level2);
  const [papersText, setPapersText] = useState(initial.achievements.papers.join('\n'));
  const [projectsText, setProjectsText] = useState(initial.achievements.projects.join('\n'));
  const [patentsText, setPatentsText] = useState(initial.achievements.patents.join('\n'));
  const [interestsText, setInterestsText] = useState(initial.achievements.researchInterests.join('、'));
  const [targetDirection, setTargetDirection] = useState(initial.achievements.targetDirection);
  const [schoolLevels, setSchoolLevels] = useState<SchoolLevel[]>(initial.filters.schoolLevels);
  const [region, setRegion] = useState(initial.filters.region);
  const [onlyRecruiting, setOnlyRecruiting] = useState(initial.filters.onlyRecruiting);
  const [error, setError] = useState('');

  const toggleLevel = (lv: SchoolLevel) =>
    setSchoolLevels((prev) => (prev.includes(lv) ? prev.filter((x) => x !== lv) : [...prev, lv]));

  /** 一键填充示例（Step5 演示用例） */
  const fillExample = () => {
    setLevel1(EXAMPLE_INPUT.discipline.level1);
    setLevel2(EXAMPLE_INPUT.discipline.level2);
    setPapersText(EXAMPLE_INPUT.achievements.papers.join('\n'));
    setProjectsText(EXAMPLE_INPUT.achievements.projects.join('\n'));
    setPatentsText(EXAMPLE_INPUT.achievements.patents.join('\n'));
    setInterestsText(EXAMPLE_INPUT.achievements.researchInterests.join('、'));
    setTargetDirection(EXAMPLE_INPUT.achievements.targetDirection);
    setSchoolLevels(EXAMPLE_INPUT.filters.schoolLevels);
    setRegion(EXAMPLE_INPUT.filters.region);
    setOnlyRecruiting(EXAMPLE_INPUT.filters.onlyRecruiting);
    setError('');
  };

  const canSubmit = useMemo(
    () => level1.trim() !== '' && targetDirection.trim() !== '',
    [level1, targetDirection],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setError('请至少填写「一级学科」与「拟报考研究方向」');
      return;
    }
    setError('');
    onSubmit({
      discipline: { level1: level1.trim(), level2: level2.trim() },
      achievements: {
        papers: splitLines(papersText),
        projects: splitLines(projectsText),
        patents: splitLines(patentsText),
        researchInterests: splitInterests(interestsText),
        targetDirection: targetDirection.trim(),
      },
      filters: { schoolLevels, region, onlyRecruiting },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ===== ① 学科信息 ===== */}
      <section className="rounded-xl2 bg-white p-5 shadow-soft">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-macaron-lavender text-xs font-bold text-indigo-500">1</span>
          学科信息
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="level1">一级学科（必填）</label>
            <select id="level1" className={inputCls} value={level1} onChange={(e) => setLevel1(e.target.value)}>
              <option value="">请选择一级学科</option>
              {LEVEL1_DISCIPLINES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls} htmlFor="level2">二级学科（选填，自由输入）</label>
            <input
              id="level2"
              className={inputCls}
              placeholder="如：机器学习与数据挖掘"
              value={level2}
              onChange={(e) => setLevel2(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ===== ② 科研成果 ===== */}
      <section className="rounded-xl2 bg-white p-5 shadow-soft">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-macaron-lavender text-xs font-bold text-indigo-500">2</span>
          已有科研成果
        </h3>
        <div className="space-y-4">
          <div>
            <label className={labelCls} htmlFor="papers">论文（每行一条，可写主题/关键词）</label>
            <textarea id="papers" className={inputCls} rows={3} placeholder={'如：\n基于深度学习的医学图像分割\n大规模预训练模型微调方法'} value={papersText} onChange={(e) => setPapersText(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="projects">参与项目（每行一条）</label>
              <textarea id="projects" className={inputCls} rows={3} placeholder={'如：\n国家自然科学基金面上项目参与\n省级创新项目'} value={projectsText} onChange={(e) => setProjectsText(e.target.value)} />
            </div>
            <div>
              <label className={labelCls} htmlFor="patents">专利（每行一条）</label>
              <textarea id="patents" className={inputCls} rows={3} placeholder={'如：\n一种基于注意力机制的分割方法'} value={patentsText} onChange={(e) => setPatentsText(e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls} htmlFor="interests">研究兴趣（用逗号/顿号分隔）</label>
            <input id="interests" className={inputCls} placeholder="如：深度学习、计算机视觉、医学图像处理" value={interestsText} onChange={(e) => setInterestsText(e.target.value)} />
          </div>
        </div>
      </section>

      {/* ===== ③ 拟报考方向 ===== */}
      <section className="rounded-xl2 bg-white p-5 shadow-soft">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-macaron-lavender text-xs font-bold text-indigo-500">3</span>
          拟报考研究方向（必填）
        </h3>
        <input
          id="target"
          className={inputCls}
          placeholder="如：面向医学影像的深度学习方法研究"
          value={targetDirection}
          onChange={(e) => setTargetDirection(e.target.value)}
        />
      </section>

      {/* ===== ④ 可选过滤条件 ===== */}
      <section className="rounded-xl2 bg-white p-5 shadow-soft">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-macaron-lavender text-xs font-bold text-indigo-500">4</span>
          过滤条件（选填）
        </h3>
        <div className="space-y-4">
          <div>
            <span className={labelCls}>院校层次（可多选，不选 = 不限）</span>
            <div className="flex flex-wrap gap-2">
              {SCHOOL_LEVELS.map((lv) => (
                <button
                  key={lv}
                  type="button"
                  onClick={() => toggleLevel(lv)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition ${
                    schoolLevels.includes(lv)
                      ? 'border-indigo-300 bg-indigo-50 font-medium text-indigo-600'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200'
                  }`}
                >
                  {lv}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls} htmlFor="region">所在地区</label>
              <select id="region" className={inputCls} value={region} onChange={(e) => setRegion(e.target.value)}>
                <option value="">不限地区</option>
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-2 pb-2.5 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={onlyRecruiting}
                  onChange={(e) => setOnlyRecruiting(e.target.checked)}
                  className="h-4 w-4 accent-indigo-500"
                />
                仅查看当前招收博士的导师
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* 提交区 */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full rounded-full bg-gradient-to-r from-indigo-400 to-pink-400 px-10 py-3 font-semibold text-white shadow-soft transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          🔍 开始匹配
        </button>
        <button
          type="button"
          onClick={fillExample}
          className="w-full rounded-full border border-indigo-200 bg-white px-6 py-3 text-sm font-medium text-indigo-500 transition hover:bg-indigo-50 sm:w-auto"
        >
          ✨ 一键填入示例
        </button>
      </div>
      {error && <p className="text-center text-sm font-medium text-rose-500">{error}</p>}
    </form>
  );
}
