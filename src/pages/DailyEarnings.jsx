import React from "react";

const dailyEarnings = [
  { date: "Oct 31", points: 170, rate: "$0.01", earnings: "$1.70", status: "verified" },
  { date: "Oct 30", points: 280, rate: "$0.01", earnings: "$2.80", status: "verified" },
  { date: "Oct 29", points: 150, rate: "$0.01", earnings: "$1.50", status: "rejected" },
  { date: "Oct 28", points: 320, rate: "$0.01", earnings: "$3.20", status: "verified" },
  { date: "Oct 27", points: 200, rate: "$0.01", earnings: "$2.00", status: "verified" },
];

const DailyEarnings = () => {
  const today = dailyEarnings[0];
  const weeklyTotal = dailyEarnings
    .filter(d => d.status === "verified")
    .reduce((sum, d) => sum + d.earnings, 0);

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main mb-1">Daily Earnings</h1>
          <p className="text-text-muted text-sm">Your earnings converted from verified points</p>
        </div>
      </div>

      <div className="admin-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Today's Earnings</div>
            <div className="text-4xl font-bold" style={{ color: "var(--color-available)" }}>{today.earnings}</div>
            <div className="text-text-muted text-sm mt-2">{today.points} points verified at ${today.rate} per point</div>
          </div>
          <div className="px-6 py-4 rounded-2xl border border-border bg-black/5 text-center">
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Weekly Total</div>
            <div className="text-2xl font-bold text-text-main">${weeklyTotal.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Daily Breakdown</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th className="text-right">Points</th>
              <th className="text-right">Rate</th>
              <th className="text-right">Earnings</th>
              <th className="text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {dailyEarnings.map((d, i) => (
              <tr key={i}>
                <td className="text-text-muted text-sm">{d.date}</td>
                <td className="text-right text-text-muted text-sm">{d.points} pts</td>
                <td className="text-right text-text-muted text-sm">{d.rate}</td>
                <td className="text-right font-medium text-text-main">{d.earnings}</td>
                <td className="text-right">
                  <span className={`status-badge ${
                    d.status === "verified" ? "status-active" :
                    d.status === "rejected" ? "status-inactive" : "status-pending"
                  }`}>
                    {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card mt-6">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Conversion Rate</h3>
        <div className="p-4 rounded-xl border border-border bg-black/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-main">Base Rate</span>
            <span className="text-sm font-bold text-text-main">$0.01 per point</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-main">Model</span>
            <span className="text-sm text-text-muted">Task-Based Value</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-main">Rounding</span>
            <span className="text-sm text-text-muted">Nearest cent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyEarnings;
