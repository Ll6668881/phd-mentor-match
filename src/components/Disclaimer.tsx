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
      数据库数据来源于公开学术元数据，不代表导师当年实际招生名额，仅供申博参考，务必核对院校研究生院官网。演示版使用模拟数据。
    </div>
  );
}
