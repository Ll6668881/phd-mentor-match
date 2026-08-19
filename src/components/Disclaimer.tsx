/**
 * 免责声明组件（严格约束规则 1：必须显著提示）
 * 页面顶部与结果页底部均需展示。
 */
export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`rounded-xl border border-amber-200 bg-amber-50/80 text-amber-800 ${
        compact ? 'px-4 py-2 text-xs' : 'px-5 py-3 text-sm'
      }`}
    >
      <span className="font-semibold">⚠️ 免责声明：</span>
      本工具匹配结果仅供申博参考，不能替代官网招生简章、导师真实招生情况，不保证导师实际招生名额。演示版使用模拟数据。
    </div>
  );
}
