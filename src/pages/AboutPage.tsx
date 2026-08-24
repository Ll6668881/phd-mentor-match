import Disclaimer from '../components/Disclaimer';

const WEIGHTS = [
  { key: '研究方向语义相似度', weight: 50, desc: '用户拟报考方向 + 研究兴趣，与目标导师近5年研究方向的文本相似度。', method: '中文 Bigram 切分 + TF-IDF 加权 + 余弦相似度，归一化到 50 分。' },
  { key: '科研成果契合度', weight: 30, desc: '用户论文/项目/专利，与目标导师近5年论文、近5年科研项目的重合领域。', method: '中文 Bigram 切分 + TF-IDF 加权 + 加权 Jaccard 相似度，归一化到 30 分。' },
  { key: '学科专业匹配', weight: 20, desc: '一级学科相同计基础分，二级学科高度匹配再加分。', method: '一级学科一致 +12 分；二级学科方向重合再 +8 分。' },
];

/** 算法说明页 */
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-8">
      <header>
        <h2 className="text-xl font-bold text-slate-800">匹配算法说明</h2>
        <p className="mt-1 text-sm text-slate-500">本页面介绍匹配打分算法的原理、实现方式与局限性</p>
      </header>
      {/* 总分构成 */}
      <section className="rounded-xl2 bg-white p-5 shadow-soft">
        <h3 className="mb-4 font-semibold text-slate-700">综合匹配分数构成（满分 100 分）</h3>
        <div className="space-y-3">
          {WEIGHTS.map((w) => (
            <div key={w.key} className="flex gap-4 rounded-xl bg-purple-50/50 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-pink-400 text-sm font-bold text-white">
                {w.weight}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-slate-700">{w.key}</p>
                <p className="mt-0.5 text-sm text-slate-500">{w.desc}</p>
                <p className="mt-1 text-xs text-indigo-500">{w.method}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 相似度实现细节 */}
      <section className="rounded-xl2 bg-white p-5 shadow-soft">
        <h3 className="mb-3 font-semibold text-slate-700">语义相似度的演示实现（Bigram TF-IDF）</h3>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-600">
          <li><strong>分词：</strong>中文按相邻两字（Bigram）切分（如"医学影像"→"医学/学影/影像"），英文单词整体保留，对短语结构敏感，无需外部词典。</li>
          <li><strong>加权：</strong>单导师模式以"你的文本 + 导师文本"双方构成微型语料计算 TF-IDF，自动降低"研究、方法、分析"等通用高频词权重，突出学科特色词。</li>
          <li><strong>相似度：</strong>研究方向采用余弦相似度；科研成果采用加权 Jaccard（更贴合"重合领域"语义）。</li>
        </ol>
      </section>

      {/* 输入与计算流程 */}
      <section className="rounded-xl2 bg-white p-5 shadow-soft">
        <h3 className="mb-3 font-semibold text-slate-700">使用流程</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">
          <li>① 填写<strong>我的学科信息</strong>（一级学科下拉 + 二级学科自由输入）。</li>
          <li>② 填写<strong>我的已有科研成果</strong>（论文 / 项目 / 专利 / 研究兴趣），相当于个人学术简历。</li>
          <li>③ 填写<strong>拟报考研究方向</strong>，作为方向匹配的核心输入。</li>
          <li>④ 填写<strong>目标导师资料</strong>（姓名、单位、职称、所属学科、近5年研究方向 / 代表论文 / 科研项目、主页网页）。导师信息需你自行从官网、导师主页等公开渠道整理；主页网页仅作参考展示、不参与算法计算。</li>
          <li>系统据此直接计算你与这位导师的匹配度，输出综合分、三项子分与匹配点 / 待注意点。</li>
        </ul>
      </section>

      {/* 局限与升级方向 */}
      <section className="rounded-xl2 bg-white p-5 shadow-soft">
        <h3 className="mb-3 font-semibold text-slate-700">局限性说明与后续升级方向</h3>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">
          <li>Bigram 相似度不识别同义改写（如"深度学习"="神经网络"），属于演示级实现，未接入真实 NLP 模型。</li>
          <li>匹配度完全取决于<strong>你填写的导师资料</strong>的准确与完整程度；资料不全时结果参考价值有限，请务必核对官网。</li>
          <li>升级方向：可替换为向量嵌入（Embedding）模型或大语言模型做语义匹配；导师数据可对接高校官网 / 学术数据库 API 自动获取，无需手工填写。</li>
        </ul>
      </section>

      <Disclaimer />
    </div>
  );
}
