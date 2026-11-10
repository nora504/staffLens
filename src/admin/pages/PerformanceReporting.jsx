import React from "react";

const PerformanceReporting = () => {
  const kpis = [
    { title: "Avg. Completion Rate", value: "94%", trend: "+5%", positive: true },
    { title: "Approval Rate", value: "87%", trend: "+2%", positive: true },
    { title: "Avg. Task Value", value: "$11.40", trend: "-1%", positive: false },
    { title: "Active Users", value: "1,180", trend: "+12%", positive: true },
  ];

  return (
    <div className="admin-section">
      <div className="admin-header">
        <div>
          <h2>Performance Reporting</h2>
          <p className="text-text-muted text-sm">Team and individual performance analytics</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-border text-text-sm text-text-main hover:bg-hover-bg transition-colors text-sm">
            Export CSV
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-color-pending text-white text-sm font-semibold hover:bg-blue-600 transition-colors text-sm">
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((k, i) => (
          <div key={i} className="admin-card">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">{k.title}</h3>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-text-main">{k.value}</span>
              <span className={`text-xs font-semibold ${k.positive ? "text-color-available" : "text-red-500"}`}>
                {k.trend}
              </span>
            </div>
            <p className="text-xs text-text-muted">vs. last period</p>
          </div>
        ))}
      </div>

      <div className="admin-grid">
        <div className="lg:col-span-2 admin-card">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Top Performers (This Month)</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Employee</th>
                <th>Tasks Completed</th>
                <th>Points Earned</th>
                <th>Earnings</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, name: "Sarah Chen", tasks: 48, points: 2100, earnings: "$21.00" },
                { rank: 2, name: "Marcus Reed", tasks: 42, points: 1850, earnings: "$18.50" },
                { rank: 3, name: "Priya Sharma", tasks: 38, points: 1620, earnings: "$16.20" },
              ].map((p, i) => (
                <tr key={i}>
                  <td className="font-bold text-text-main">#{p.rank}</td>
                  <td>{p.name}</td>
                  <td className="text-text-muted">{p.tasks}</td>
                  <td className="text-text-muted">{p.points.toLocaleString()}</td>
                  <td className="font-medium text-text-main">{p.earnings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border text-text-main hover:bg-hover-bg transition-colors text-sm">
              <span>Generate Monthly Report</span>
              <span className="text-text-muted text-xs">→</span>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border text-text-main hover:bg-hover-bg transition-colors text-sm">
              <span>Send Performance Digests</span>
              <span className="text-text-muted text-xs">→</span>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-border text-text-main hover:bg-hover-bg transition-colors text-sm">
              <span>Review Low Performers</span>
              <span className="text-text-muted text-xs">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceReporting;
