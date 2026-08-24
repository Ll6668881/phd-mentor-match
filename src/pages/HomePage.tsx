import type { UserInput } from '../types';
import Disclaimer from '../components/Disclaimer';
import MatchForm from '../components/MatchForm';

interface Props {
  initial: UserInput;
  onSubmit: (input: UserInput) => void;
}

/** 首页：表单页 */
export default function HomePage({ initial, onSubmit }: Props) {
  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 py-8">
      {/* Hero */}
      <header className="text-center">
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-macaron-blue via-macaron-lavender to-macaron-pink text-3xl shadow-soft">
          🎓
        </div>
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">博士生导师匹配系统</h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          输入你的简历与报考方向，再填入心仪导师的资料（研究方向、论文、项目、主页等），
          直接计算你与目标导师的匹配度
        </p>
      </header>

      <Disclaimer />

      <MatchForm initial={initial} onSubmit={onSubmit} />
    </div>
  );
}
