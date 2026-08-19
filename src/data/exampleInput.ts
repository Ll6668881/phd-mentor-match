import type { UserInput } from '../types';

/**
 * 内置示例测试输入（Step5）
 * 结果页的"一键填充示例"按钮使用本套输入，演示完整匹配流程。
 * 覆盖：计算机学科 + 深度学习方法方向，配合 985/双一流 过滤。
 */
export const EXAMPLE_INPUT: UserInput = {
  discipline: {
    level1: '计算机科学与技术',
    level2: '机器学习与数据挖掘',
  },
  achievements: {
    papers: [
      '基于深度学习的医学图像分割方法研究',
      '大规模预训练模型参数高效微调',
      '视网膜 OCT 图像分类',
    ],
    projects: [
      '国家自然科学基金面上项目参与（医学图像智能诊断）',
      '省级创新项目：眼底图像自动分析',
    ],
    patents: ['一种基于注意力机制的医学图像分割方法'],
    researchInterests: ['深度学习', '计算机视觉', '医学图像处理', '大语言模型微调'],
    targetDirection: '面向医学影像的深度学习方法研究',
  },
  filters: {
    schoolLevels: ['985', '双一流'],
    region: '',
    onlyRecruiting: true,
  },
};
