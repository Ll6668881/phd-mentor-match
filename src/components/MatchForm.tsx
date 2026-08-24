import { useMemo, useState } from 'react';
import type { UserInput } from '../types';
import { DISCIPLINE_CATEGORIES } from '../data/disciplines';
import { EXAMPLE_INPUT } from '../data/exampleInput';

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
  // ===== ① 个人专业基本信息（界面不变） =====
  const [level1, setLevel1] = useState(initial.discipline.level1);
  const [level2, setLevel2] = useState(initial.discipline.level2);
  const [papersText, setPapersText] = useState(initial.achievements.papers.join('\n'));
  const [projectsText, setProjectsText] = useState(initial.achievements.projects.join('\n'));
  const [patentsText, setPatentsText] = useState(initial.achievements.patents.join('\n'));
  const [interestsText, setInterestsText] = useState(initial.achievements.researchInterests.join('、'));
  const [targetDirection, setTargetDirection] = useState(initial.achievements.targetDirection);

  // ===== ② 目标导师资料（由用户输入，匹配对象） =====
  const t = initial.targetMentor;
  const [tName, setTName] = useState(t.name);
  const [tSchool, setTSchool] = useState(t.school);
  const [tTitle, setTTitle] = useState(t.title);
  const [tLevel1, setTLevel1] = useState(t.level1);
  const [tLevel2, setTLevel2] = useState(t.level2);
  const [tDirections, setTDirections] = useState(t.researchDirections.join('\n'));
  const [tPapers, setTPapers] = useState(t.recentPapers.join('\n'));
  const [tProjects, setTProjects] = useState(t.recentProjects.join('\n'));
  const [tWebpage, setTWebpage] = useState(t.webpage);

  const [error, setError] = useState('');

  /** 一键填充示例（演示用例） */
  const fillExample = () => {
    const e = EXAMPLE_INPUT;
    setLevel1(e.discipline.level1);
    setLevel2(e.discipline.level2);
    setPapersText(e.achievements.papers.join('\n'));
    setProjectsText(e.achievements.projects.join('\n'));
    setPatentsText(e.achievements.patents.join('\n'));
    setInterestsText(e.achievements.researchInterests.join('、'));
    setTargetDirection(e.achievements.targetDirection);
    const m = e.targetMentor;
    setTName(m.name);
    setTSchool(m.school);
    setTTitle(m.title);
    setTLevel1(m.level1);
    setTLevel2(m.level2);
    setTDirections(m.researchDirections.join('\n'));
    setTPapers(m.recentPapers.join('\n'));
    setTProjects(m.recentProjects.join('\n'));
    setTWebpage(m.webpage);
    setError('');
  };

  const canSubmit = useMemo(
    () => level1.trim() !== '' && targetDirection.trim() !== '' && tDirections.trim() !== '',
    [level1, targetDirection, tDirections],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      setError('请至少填写「一级学科」「拟报考研究方向」与「目标导师的研究方向」');
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
      targetMentor: {
        name: tName.trim(),
        school: tSchool.trim(),
        title: tTitle.trim(),
        level1: tLevel1.trim(),
        level2: tLevel2.trim(),
        researchDirections: splitLines(tDirections),
        recentPapers: splitLines(tPapers),
        recentProjects: splitLines(tProjects),
        webpage: tWebpage.trim(),
      },
      filters: { schoolLevels: [], region: '', onlyRecruiting: false },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* ===== ① 学科信息（个人） ===== */}
      <section className="rounded-xl2 bg-white p-5 shadow-soft">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-macaron-lavender text-xs font-bold text-indigo-500">1</span>
          我的学科信息
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="level1">一级学科（必填）</label>
            <select id="level1" className={inputCls} value={level1} onChange={(e) => setLevel1(e.target.value)}>
              <option value="">请选择一级学科</option>
              {DISCIPLINE_CATEGORIES.map((cat) => (
                <optgroup key={cat.code} label={`${cat.code} ${cat.category}`}>
                  {cat.disciplines.map((d) => (
                    <option key={d.code} value={d.name}>{d.name}</option>
                  ))}
                </optgroup>
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

      {/* ===== ② 已有科研成果（个人简历） ===== */}
      <section className="rounded-xl2 bg-white p-5 shadow-soft">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-macaron-lavender text-xs font-bold text-indigo-500">2</span>
          我的已有科研成果
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
          我的拟报考研究方向（必填）
        </h3>
        <input
          id="target"
          className={inputCls}
          placeholder="如：面向医学影像的深度学习方法研究"
          value={targetDirection}
          onChange={(e) => setTargetDirection(e.target.value)}
        />
      </section>

      {/* ===== ④ 目标导师资料（由用户输入） ===== */}
      <section className="rounded-xl2 border-2 border-dashed border-indigo-200 bg-white p-5 shadow-soft">
        <h3 className="mb-1 flex items-center gap-2 font-semibold text-slate-700">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-macaron-pink text-xs font-bold text-white">4</span>
          目标导师资料（心仪导师，必填）
        </h3>
        <p className="mb-4 text-xs text-slate-400">
          请从官网、导师主页等公开渠道整理心仪导师的信息填入下方；导师主页网页链接仅作参考展示，不参与算法计算。
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="tName">导师姓名</label>
            <input id="tName" className={inputCls} placeholder="如：张云帆" value={tName} onChange={(e) => setTName(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="tSchool">单位/院校</label>
            <input id="tSchool" className={inputCls} placeholder="如：浙江大学" value={tSchool} onChange={(e) => setTSchool(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="tTitle">职称</label>
            <input id="tTitle" className={inputCls} placeholder="如：教授 / 研究员" value={tTitle} onChange={(e) => setTTitle(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="tLevel2">导师所属二级学科（选填）</label>
            <input id="tLevel2" className={inputCls} placeholder="如：医学图像处理" value={tLevel2} onChange={(e) => setTLevel2(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="tLevel1">导师所属一级学科（用于学科匹配评分）</label>
            <select id="tLevel1" className={inputCls} value={tLevel1} onChange={(e) => setTLevel1(e.target.value)}>
              <option value="">请选择一级学科</option>
              {DISCIPLINE_CATEGORIES.map((cat) => (
                <optgroup key={cat.code} label={`${cat.code} ${cat.category}`}>
                  {cat.disciplines.map((d) => (
                    <option key={d.code} value={d.name}>{d.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="tDirections">导师近5年研究方向（必填，每行一条）</label>
            <textarea id="tDirections" className={inputCls} rows={3} placeholder={'如：\n医学影像人工智能分析\n深度学习方法与医学多模态数据'} value={tDirections} onChange={(e) => setTDirections(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="tPapers">导师近5年代表论文（每行一条，可写主题/标题）</label>
            <textarea id="tPapers" className={inputCls} rows={3} placeholder={'如：\nMedical Image Segmentation with Transformers\nUnsupervised Anomaly Detection in CT Scans'} value={tPapers} onChange={(e) => setTPapers(e.target.value)} />
          </div>
          <div>
            <label className={labelCls} htmlFor="tProjects">导师近5年科研项目（每行一条）</label>
            <textarea id="tProjects" className={inputCls} rows={3} placeholder={'如：\n国家自然科学基金：医学影像智能诊断\n浙江省重点研发：多模态医疗数据平台'} value={tProjects} onChange={(e) => setTProjects(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls} htmlFor="tWebpage">导师主页/资料网页（选填，仅展示参考）</label>
            <input id="tWebpage" className={inputCls} type="url" placeholder="https://..." value={tWebpage} onChange={(e) => setTWebpage(e.target.value)} />
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
          🔍 计算匹配度
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
