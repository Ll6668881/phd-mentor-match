/**
 * 全国一级学科专业目录及名称代码表
 * 数据来源：官方 PDF《全国一级学科专业目录及名称代码表》
 *   https://jw.cdcas.edu.cn/rootfiles/2025/03/27/1744175516295131-1744175517195465.pdf
 * 覆盖 12 个门类共 88 个一级学科；special 标记 ☆（国防特色/重点建设学科）。
 * 二级学科由用户在表单中自由输入。
 */

export interface Level1DisciplineEntry {
  /** 一级学科名称 */
  name: string;
  /** 一级学科代码 */
  code: string;
  /** 是否为 ☆ 标记学科 */
  special?: boolean;
}

export interface DisciplineCategory {
  /** 门类名称 */
  category: string;
  /** 门类代码 */
  code: string;
  disciplines: Level1DisciplineEntry[];
}

export const DISCIPLINE_CATEGORIES: DisciplineCategory[] = [
  {
    category: '哲学',
    code: '01',
    disciplines: [{ name: '哲学', code: '0101' }],
  },
  {
    category: '经济学',
    code: '02',
    disciplines: [
      { name: '理论经济学', code: '0201' },
      { name: '应用经济学', code: '0202' },
    ],
  },
  {
    category: '法学',
    code: '03',
    disciplines: [
      { name: '法学', code: '0301' },
      { name: '政治学', code: '0302' },
      { name: '社会学', code: '0303' },
      { name: '民族学', code: '0304' },
    ],
  },
  {
    category: '教育学',
    code: '04',
    disciplines: [
      { name: '教育学', code: '0401' },
      { name: '心理学', code: '0402' },
      { name: '体育学', code: '0403' },
    ],
  },
  {
    category: '文学',
    code: '05',
    disciplines: [
      { name: '中国语言文学', code: '0501' },
      { name: '外国语言文学', code: '0502' },
      { name: '新闻传播学', code: '0503' },
      { name: '艺术学', code: '0504' },
    ],
  },
  {
    category: '历史学',
    code: '06',
    disciplines: [{ name: '历史学', code: '0601' }],
  },
  {
    category: '理学',
    code: '07',
    disciplines: [
      { name: '数学', code: '0701' },
      { name: '物理学', code: '0702' },
      { name: '化学', code: '0703' },
      { name: '天文学', code: '0704' },
      { name: '地理学', code: '0705' },
      { name: '大气科学', code: '0706' },
      { name: '海洋科学', code: '0707' },
      { name: '地球物理学', code: '0708' },
      { name: '地质学', code: '0709' },
      { name: '生物学', code: '0710' },
      { name: '系统科学', code: '0711' },
      { name: '科学技术史', code: '0712', special: true },
    ],
  },
  {
    category: '工学',
    code: '08',
    disciplines: [
      { name: '力学', code: '0801' },
      { name: '机械工程', code: '0802' },
      { name: '光学工程', code: '0803', special: true },
      { name: '仪器科学与技术', code: '0804' },
      { name: '材料科学与工程', code: '0805' },
      { name: '冶金工程', code: '0806' },
      { name: '动力工程及工程热物理', code: '0807' },
      { name: '电气工程', code: '0808' },
      { name: '电子科学与技术', code: '0809' },
      { name: '信息与通信工程', code: '0810' },
      { name: '控制科学与工程', code: '0811' },
      { name: '计算机科学与技术', code: '0812' },
      { name: '建筑学', code: '0813' },
      { name: '土木工程', code: '0814' },
      { name: '水利工程', code: '0815' },
      { name: '测绘科学与技术', code: '0816' },
      { name: '化学工程与技术', code: '0817' },
      { name: '地质资源与地质工程', code: '0818' },
      { name: '矿业工程', code: '0819' },
      { name: '石油与天然气工程', code: '0820' },
      { name: '纺织科学与工程', code: '0821' },
      { name: '轻工技术与工程', code: '0822' },
      { name: '交通运输工程', code: '0823' },
      { name: '船舶与海洋工程', code: '0824' },
      { name: '航空宇航科学与技术', code: '0825' },
      { name: '兵器科学与技术', code: '0826' },
      { name: '核科学与技术', code: '0827' },
      { name: '农业工程', code: '0828' },
      { name: '林业工程', code: '0829' },
      { name: '环境科学与工程', code: '0830' },
      { name: '生物医学工程', code: '0831', special: true },
      { name: '食品科学与工程', code: '0832' },
    ],
  },
  {
    category: '农学',
    code: '09',
    disciplines: [
      { name: '作物学', code: '0901' },
      { name: '园艺学', code: '0902' },
      { name: '农业资源利用', code: '0903' },
      { name: '植物保护', code: '0904' },
      { name: '畜牧学', code: '0905' },
      { name: '兽医学', code: '0906' },
      { name: '林学', code: '0907' },
      { name: '水产', code: '0908' },
    ],
  },
  {
    category: '医学',
    code: '10',
    disciplines: [
      { name: '基础医学', code: '1001' },
      { name: '临床医学', code: '1002' },
      { name: '口腔医学', code: '1003' },
      { name: '公共卫生与预防医学', code: '1004' },
      { name: '中医学', code: '1005' },
      { name: '中西医结合', code: '1006' },
      { name: '药学', code: '1007' },
      { name: '中药学', code: '1008', special: true },
    ],
  },
  {
    category: '军事学',
    code: '11',
    disciplines: [
      { name: '军事思想及军事历史', code: '1101' },
      { name: '战略学', code: '1102' },
      { name: '战役学', code: '1103' },
      { name: '战术学', code: '1104' },
      { name: '军队指挥学', code: '1105' },
      { name: '军制学', code: '1106' },
      { name: '军队政治工作学', code: '1107', special: true },
      { name: '军事后勤学与军事装备学', code: '1108' },
    ],
  },
  {
    category: '管理学',
    code: '12',
    disciplines: [
      { name: '管理科学与工程', code: '1201', special: true },
      { name: '工商管理', code: '1202' },
      { name: '农林经济管理', code: '1203' },
      { name: '公共管理', code: '1204' },
      { name: '图书馆、情报与档案管理', code: '1205' },
    ],
  },
];

/** 全部一级学科名称（扁平列表，供下拉选项使用） */
export const LEVEL1_DISCIPLINES: string[] = DISCIPLINE_CATEGORIES.flatMap((c) =>
  c.disciplines.map((d) => d.name),
);

export type Level1Discipline = (typeof LEVEL1_DISCIPLINES)[number];
