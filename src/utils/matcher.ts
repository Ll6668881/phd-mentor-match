import type { MatchResult, Mentor, ScoreBreakdown, UserInput } from '../types';

/**
 * ============================================================
 * 匹配打分算法（演示版）
 * ============================================================
 * 总匹配度满分 100 分，权重分配：
 *  - 研究方向语义相似度：50 分
 *     用户"拟报考研究方向 + 研究兴趣" vs 导师"近5年核心研究方向"
 *     实现：中文 Bigram 切分 + TF-IDF 加权 + 余弦相似度，再 ×50 归一化
 *  - 科研成果契合度：30 分
 *     用户"论文/项目/专利" vs 导师"近5年课题 + 近5年代表性论文"
 *     实现：中文 Bigram 切分 + TF-IDF 加权 + 加权 Jaccard 相似度，再 ×30 归一化
 *  - 学科专业匹配：20 分
 *     一级学科相同计 12 分（学科大类优先）；二级学科重合再加 8 分
 *
 * 设计原则：
 *  1. 只参考导师近 5 年研究（researchDirections/recentTopics/recentPapers 字段本身即近5年），
 *     不参考 10 年前陈旧方向；
 *  2. 同一导师以最新课题、最新论文为判断依据（recent* 字段）；
 *  3. 排除已经停止招收博士的导师（acceptingStudents === false）；
 *  4. TF-IDF 中的 IDF 以全体 mock 导师的文本为语料计算，能自动降低
 *     "研究/方法/分析" 等通用高频词的权重，突出学科特色词。
 * ============================================================
 */

/** 单个文档的 TF-IDF 权重向量（token -> weight） */
type Vec = Map<string, number>;

interface Corpus {
  /** 研究方向语料 IDF（用于语义相似度 50 分） */
  directionIdf: Map<string, number>;
  /** 课题/论文语料 IDF（用于科研成果契合度 30 分） */
  outputIdf: Map<string, number>;
}

/**
 * 文本分词：中文按相邻两字（Bigram）切分，英文单词整体保留为 token。
 * 例："深度学习 Transformer" → ["深度","度学","学习","transformer"]
 * Bigram 对短语结构敏感，能区分"图像分割"与"语音识别"，无需外部词典。
 */
export function extractTokens(text: string): string[] {
  const tokens: string[] = [];
  // 英文单词 / 数字串整体作为 token
  const enRe = /[a-zA-Z0-9]+(?:[-_][a-zA-Z0-9]+)*/g;
  let m: RegExpExecArray | null;
  while ((m = enRe.exec(text)) !== null) {
    tokens.push(m[0].toLowerCase());
  }
  // 中文字符序列做相邻两字 bigram
  const zhRe = /[\u4e00-\u9fa5]+/g;
  let zm: RegExpExecArray | null;
  while ((zm = zhRe.exec(text)) !== null) {
    const seq = zm[0];
    for (let i = 0; i < seq.length - 1; i++) {
      tokens.push(seq.slice(i, i + 2));
    }
  }
  return tokens;
}

/** 将多段文本拼接为一个文档字符串 */
function joinText(parts: string[]): string {
  return parts.filter((p) => p && p.trim()).join(' ');
}

/** 统计 token 词频 -> TF-IDF 权重向量（权重 = 词频 × IDF） */
function toTfIdfVec(tokens: string[], idf: Map<string, number>): Vec {
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
  const vec: Vec = new Map();
  for (const [t, c] of tf) vec.set(t, c * (idf.get(t) ?? 1));
  return vec;
}

/**
 * 余弦相似度（非负权重，结果 ∈ [0,1]）。
 * 衡量两个 TF-IDF 向量在方向上的重合程度，对文本长度不敏感。
 */
function cosineSimilarity(a: Vec, b: Vec): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const [t, w] of a) {
    normA += w * w;
    const bw = b.get(t);
    if (bw !== undefined) dot += w * bw;
  }
  for (const [, w] of b) normB += w * w;
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * 加权 Jaccard 相似度（用 TF-IDF 权重加权）。
 * 衡量两个文档"共同出现的术语"占"总术语"的比例，突出领域重合度，
 * 更适合"科研成果与导师课题/论文的重合领域"这一语义。
 */
function weightedJaccard(a: Vec, b: Vec): number {
  const keys = new Set([...a.keys(), ...b.keys()]);
  let inter = 0;
  let union = 0;
  for (const t of keys) {
    const wa = a.get(t) ?? 0;
    const wb = b.get(t) ?? 0;
    inter += Math.min(wa, wb);
    union += Math.max(wa, wb);
  }
  return union === 0 ? 0 : inter / union;
}

/**
 * 以全体 mock 导师文本为语料构建 IDF。
 * IDF 机制：在越多导师文本中出现的 token，权重越低（如"研究""方法"），
 * 学科特色词（如"图神经""医学影像"）权重更高。
 */
export function buildCorpus(mentors: Mentor[]): Corpus {
  const dirDocs = mentors.map((m) => extractTokens(joinText(m.researchDirections)));
  const outDocs = mentors.map((m) =>
    extractTokens(joinText([...m.recentTopics, ...m.recentPapers])),
  );
  const idfOf = (docs: string[][]): Map<string, number> => {
    const df = new Map<string, number>();
    for (const doc of docs) {
      for (const t of new Set(doc)) df.set(t, (df.get(t) ?? 0) + 1);
    }
    const idf = new Map<string, number>();
    const n = docs.length;
    for (const [t, count] of df) {
      // 平滑逆文档频率：ln((N+1)/(df+1)) + 1
      idf.set(t, Math.log((n + 1) / (count + 1)) + 1);
    }
    return idf;
  };
  return { directionIdf: idfOf(dirDocs), outputIdf: idfOf(outDocs) };
}

/** 取前 N 个命中关键词（用于匹配点可解释性展示） */
function topHits(a: Vec, b: Vec, n = 3): string[] {
  return [...a.keys()]
    .filter((t) => b.has(t))
    .sort((x, y) => (a.get(y) ?? 0) - (a.get(x) ?? 0))
    .slice(0, n);
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * 计算单个导师的匹配结果。
 * @param user   用户输入
 * @param mentor 导师（已通过招生/过滤条件筛选）
 * @param corpus 全量 IDF 语料
 */
export function calculateMatch(user: UserInput, mentor: Mentor, corpus: Corpus): MatchResult {
  const { targetDirection, researchInterests } = user.achievements;
  const { papers, projects, patents } = user.achievements;

  // ---------- ① 研究方向语义相似度（满分 50 分） ----------
  const userDirText = joinText([targetDirection, ...researchInterests]);
  const mentorDirText = joinText(mentor.researchDirections);
  const dirCos = cosineSimilarity(
    toTfIdfVec(extractTokens(userDirText), corpus.directionIdf),
    toTfIdfVec(extractTokens(mentorDirText), corpus.directionIdf),
  );
  // 演示版增强：Bigram 余弦值普遍偏低（0~0.7），轻度放大提升分数可读性，
  // 保持单调性（不改变排序），cap 到 1 再归一化到 50 分。
  const enhancedCos = Math.min(1, dirCos * 1.35);
  const semanticScore = clamp(Math.round(enhancedCos * 50 * 100) / 100, 0, 50);

  // ---------- ② 科研成果契合度（满分 30 分） ----------
  const userResText = joinText([...papers, ...projects, ...patents]);
  const mentorResText = joinText([...mentor.recentTopics, ...mentor.recentPapers]);
  const resJaccard = weightedJaccard(
    toTfIdfVec(extractTokens(userResText), corpus.outputIdf),
    toTfIdfVec(extractTokens(mentorResText), corpus.outputIdf),
  );
  // 演示版增强：加权 Jaccard 同样偏低，轻度放大提升可读性（保持排序单调）。
  const enhancedJaccard = Math.min(1, resJaccard * 1.35);
  const researchScore = clamp(Math.round(enhancedJaccard * 30 * 100) / 100, 0, 30);

  // ---------- ③ 学科专业匹配（满分 20 分） ----------
  let disciplineScore = 0;
  const sameLevel1 = user.discipline.level1 !== '' && user.discipline.level1 === mentor.disciplines.level1;
  if (sameLevel1) disciplineScore += 12; // 学科大类优先：一级学科相同即基础分
  const userL2 = user.discipline.level2.trim();
  const mentorL2 = mentor.disciplines.level2;
  let l2Matched = false;
  if (userL2 && mentorL2) {
    const a = new Set(extractTokens(userL2));
    const b = new Set(extractTokens(mentorL2));
    l2Matched = [...a].some((t) => b.has(t)) || mentorL2.includes(userL2) || userL2.includes(mentorL2);
  }
  if (l2Matched) disciplineScore += 8; // 二级学科高度匹配再加分

  // ---------- 综合分（100 分制） ----------
  const totalScore = clamp(Math.round(semanticScore + researchScore + disciplineScore), 0, 100);
  const breakdown: ScoreBreakdown = { semantic: semanticScore, research: researchScore, discipline: disciplineScore };

  // ---------- ✅ 匹配点说明（逐条生成，保证每条导师均非空） ----------
  const matchPoints: string[] = [];
  const uDirVec = toTfIdfVec(extractTokens(userDirText), corpus.directionIdf);
  const mDirVec = toTfIdfVec(extractTokens(mentorDirText), corpus.directionIdf);
  const uResVec = toTfIdfVec(extractTokens(userResText), corpus.outputIdf);
  const mResVec = toTfIdfVec(extractTokens(mentorResText), corpus.outputIdf);

  if (sameLevel1) {
    matchPoints.push(`学科对口：您的「${user.discipline.level1}」与导师一级学科一致`);
  }
  if (l2Matched) {
    matchPoints.push(`二级学科高度匹配：您的「${userL2}」与导师二级学科「${mentorL2}」重合`);
  }
  if (dirCos >= 0.45) {
    matchPoints.push(`研究方向高度重合：您的「${targetDirection}」与导师近5年主攻的「${mentor.researchDirections[0]}」方向一致`);
  } else if (dirCos >= 0.25) {
    matchPoints.push(`研究方向较为契合：您的拟报考方向与导师近5年方向「${mentor.researchDirections[0]}」相关度较高`);
  } else if (dirCos > 0) {
    const hits = topHits(uDirVec, mDirVec);
    matchPoints.push(`研究方向存在一定关联：命中「${hits.join('、')}」等关键术语`);
  } else {
    matchPoints.push('研究方向重合度较低：您拟报考方向与导师近5年主攻方向交集有限');
  }
  if (resJaccard >= 0.3) {
    matchPoints.push(`科研成果高度契合：您的「${papers[0] || projects[0] || patents[0] || '已有成果'}」与导师近5年课题「${mentor.recentTopics[0]}」领域一致`);
  } else if (resJaccard >= 0.15) {
    matchPoints.push('科研成果部分契合：您的论文/项目/专利与导师近5年课题、论文存在交叉领域');
  } else if (resJaccard > 0) {
    const hits = topHits(uResVec, mResVec);
    matchPoints.push(`科研成果存在少量关联：与导师近5年产出命中「${hits.join('、')}」等共同主题`);
  } else {
    matchPoints.push('科研成果关联较弱：您已有成果与导师近5年课题/论文领域交集有限');
  }

  // ---------- ⚠️ 待注意点（客观风险提示，无风险则标"无特殊提示"） ----------
  const warnings: string[] = [];
  if (mentor.note) warnings.push(mentor.note);
  if (mentor.publicationCount5y < 5) warnings.push('近5年发文偏少，科研产出请进一步核实');
  if (mentor.isDoctoralSupervisor && !mentor.acceptingStudents) {
    warnings.push('该导师当前暂停招收博士，请以官网招生信息为准');
  }
  if (semanticScore < 10 && totalScore > 0) {
    warnings.push('研究方向重合度有限，当前匹配主要来自学科与成果层面，报考前建议深入了解导师方向');
  }
  if (warnings.length === 0) warnings.push('无特殊提示');

  return { mentor, totalScore, breakdown, matchPoints, warnings };
}

/**
 * 主入口：过滤候选导师 -> 逐条打分 -> 按综合分降序 -> 严格取 Top10。
 * @returns results 按匹配度降序的匹配结果（最多10条）；totalCandidates 过滤后的候选总量
 */
export function matchAll(
  user: UserInput,
  mentors: Mentor[],
): { results: MatchResult[]; totalCandidates: number } {
  const corpus = buildCorpus(mentors);

  // 过滤：排除已经停止招收博士的导师
  const candidates = mentors.filter((m) => m.acceptingStudents);
  const filtered = candidates.filter((m) => {
    // 院校层次过滤（多选，空 = 不限）
    if (user.filters.schoolLevels.length > 0 && !user.filters.schoolLevels.includes(m.schoolLevel)) return false;
    // 地区过滤（空 = 不限）
    if (user.filters.region && m.province !== user.filters.region) return false;
    return true;
  });

  // 打分 + 按综合匹配分数降序 + 严格 Top10
  const results = filtered
    .map((m) => calculateMatch(user, m, corpus))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10);

  return { results, totalCandidates: filtered.length };
}
