import React from "react";

const STATE_CONFIG = {
  unverified: {
    label: "Points Earned (Unverified)",
    color: "var(--color-unverified)",
    muted: "var(--color-unverified-muted)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6M12 18v6"/>
      </svg>
    ),
  },
  pending: {
    label: "Earnings Awaiting Approval",
    color: "var(--color-pending)",
    muted: "var(--color-pending-muted)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6M12 18v6"/>
      </svg>
    ),
  },
  available: {
    label: "Approved Earnings (Available)",
    color: "var(--color-available)",
    muted: "var(--color-available-muted)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"/><polyline points="22 9 16 15 12 17 9 13"/></svg>
    ),
  },
  paid: {
    label: "Paid Earnings (History)",
    color: "var(--color-paid)",
    muted: "var(--color-paid-muted)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    ),
  },
};

interface FinancialCardProps {
  state: keyof typeof STATE_CONFIG;
  value: string | number;
  subtitle?: string;
  onClick?: () => void;
}

const FinancialCard = ({ state, value, subtitle, onClick }: FinancialCardProps) => {
  const config = STATE_CONFIG[state];

  return (
    <div
      className="financial-card group relative rounded-2xl border p-4 min-w-0 cursor-pointer transition-all duration-200"
      onClick={onClick}
    >
      <div className="absolute inset-0 rounded-2xl border border-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className={`text-xs font-semibold uppercase tracking-wider min-w-0`} style={{ color: config.color }}>
            {config.label}
          </div>
          <div className="text-2xl font-bold truncate" style={{ color: config.color }}>
            {value}
          </div>
          {subtitle && <small className="text-sm opacity-70 truncate">{subtitle}</small>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0`} style={{ backgroundColor: config.muted }}>
          <span style={{ color: config.color }}>{config.icon}</span>
        </div>
      </div>
      <div className="mt-3 h-1 w-full rounded-full bg-black/10 overflow-hidden">
        <div className="h-full" style={{ width: "65%", backgroundColor: config.color }} />
      </div>
    </div>
  );
};

export default FinancialCard;
