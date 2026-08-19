import { useState } from 'react';
import type { MatchResult, UserInput } from './types';
import { MENTORS } from './data/mentors';
import { EXAMPLE_INPUT } from './data/exampleInput';
import { matchAll } from './utils/matcher';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import AboutPage from './pages/AboutPage';

type Page = 'home' | 'results' | 'about';

const NAV: { key: Page; label: string }[] = [
  { key: 'home', label: '🏠 匹配' },
  { key: 'about', label: '📖 算法说明' },
];

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [lastInput, setLastInput] = useState<UserInput>(EXAMPLE_INPUT);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [totalCandidates, setTotalCandidates] = useState(0);

  /** 首页表单提交：本地完成全部匹配计算（无后端） */
  const handleSubmit = (input: UserInput) => {
    const { results: r, totalCandidates: t } = matchAll(input, MENTORS);
    setLastInput(input);
    setResults(r);
    setTotalCandidates(t);
    setPage('results');
    window.scrollTo({ top: 0 });
  };

  const goHome = () => {
    setPage('home');
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-10 border-b border-purple-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <button onClick={goHome} className="flex items-center gap-2 text-base font-bold text-slate-800">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-macaron-blue to-macaron-pink text-lg shadow-softer">
              🎓
            </span>
            博导匹配助手
          </button>
          <div className="flex gap-1">
            {NAV.map((n) => (
              <button
                key={n.key}
                onClick={() => {
                  setPage(n.key);
                  window.scrollTo({ top: 0 });
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  page === n.key ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-purple-50'
                }`}
              >
                {n.label}
              </button>
            ))}
            {results.length > 0 && (
              <button
                onClick={() => {
                  setPage('results');
                  window.scrollTo({ top: 0 });
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  page === 'results' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-purple-50'
                }`}
              >
                📊 匹配结果
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 页面内容 */}
      <main className="flex-1">
        {page === 'home' && <HomePage initial={lastInput} onSubmit={handleSubmit} />}
        {page === 'results' && (
          <ResultsPage input={lastInput} results={results} totalCandidates={totalCandidates} onBack={goHome} />
        )}
        {page === 'about' && <AboutPage />}
      </main>

      {/* 底部 */}
      <footer className="border-t border-purple-100 bg-white/60 py-5 text-center text-xs text-slate-400">
        博士生导师筛选匹配系统（演示版） · 匹配结果仅供申博参考，不能替代官网招生简章与导师真实招生情况
      </footer>
    </div>
  );
}
