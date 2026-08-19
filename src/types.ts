/**
 * 数据模型定义
 * 说明：演示版本使用本地 mock 数据；后续接入真实学术数据库时，
 * 只需替换 data/mentors.ts 的数据来源（如对接高校官网/学术 API），
 * 字段结构保持不变即可，无需改动打分与展示逻辑。
 */

/** 院校层次 */
export type SchoolLevel = '985' | '211' | '双一流' | '普通院校';

/** 职称 */
export type MentorTitle =
  | '教授'
  | '副教授'
  | '研究员'
  | '副研究员'
  | '青年研究员';

/**
 * 用户输入（首页表单提交的数据）
 */
export interface UserInput {
  /** 个人所属学科：一级学科（下拉选择）+ 二级学科（自由输入） */
  discipline: {
    level1: string;
    level2: string;
  };
  /** 已有科研成果 */
  achievements: {
    /** 已发表论文（主题/关键词，多行或逗号分隔） */
    papers: string[];
    /** 参与项目 */
    projects: string[];
    /** 专利 */
    patents: string[];
    /** 研究兴趣 */
    researchInterests: string[];
    /** 拟报考研究方向（核心输入） */
    targetDirection: string;
  };
  /** 可选过滤条件 */
  filters: {
    /** 院校层次（多选，空 = 不限） */
    schoolLevels: SchoolLevel[];
    /** 所在省/直辖市（空 = 不限） */
    region: string;
    /** 是否仅看当前招收博士的导师 */
    onlyRecruiting: boolean;
  };
}

/**
 * 导师（mock 数据集一条记录）
 * 注意：演示版导师姓名、论文/课题标题均为虚构数据，仅用于演示业务流程。
 */
export interface Mentor {
  id: string;
  /** 姓名（虚构） */
  name: string;
  /** 院校 */
  school: string;
  schoolLevel: SchoolLevel;
  /** 所在省/直辖市 */
  province: string;
  /** 院系 */
  department: string;
  title: MentorTitle;
  /** 博士招生资格 */
  isDoctoralSupervisor: boolean;
  /** 当前是否招收博士（false 时在匹配中直接排除） */
  acceptingStudents: boolean;
  /** 所属学科 */
  disciplines: {
    level1: string;
    level2: string;
  };
  /** 近5年核心研究方向（3-5 条短句，仅近5年，不参考陈旧方向） */
  researchDirections: string[];
  /** 近5年课题/项目 */
  recentTopics: string[];
  /** 近5年代表性论文（虚构标题，仅演示） */
  recentPapers: string[];
  /** 近5年发文量（用于"待注意点"的风险提示） */
  publicationCount5y: number;
  /** 备注（如招生名额紧张） */
  note?: string;
}

/**
 * 单项得分（三个子项，合计满分 100）
 * - semantic:   研究方向语义相似度，满分 50
 * - research:   科研成果契合度，满分 30
 * - discipline: 学科专业匹配，满分 20
 */
export interface ScoreBreakdown {
  semantic: number;
  research: number;
  discipline: number;
}

/** 一条导师匹配结果 */
export interface MatchResult {
  mentor: Mentor;
  /** 综合匹配分数 0-100（排序依据，降序） */
  totalScore: number;
  breakdown: ScoreBreakdown;
  /** ✅ 匹配点说明（每条导师必须非空） */
  matchPoints: string[];
  /** ⚠️ 待注意点（无风险时为 ["无特殊提示"]） */
  warnings: string[];
}
