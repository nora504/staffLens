import React from "react";

const pointsHistory = [
  { date: "Oct 31", task: "Daily Data Entry – Customer Records", points: 50, status: "verified" },
  { date: "Oct 31", task: "Weekly Quality Review – Q3 Reports", points: 120, status: "pending" },
  { date: "Oct 30", task: "Customer Feedback Analysis", points: 80, status: "verified" },
  { date: "Oct 29", task: "Inventory Reconciliation", points: 150, status: "rejected" },
  { date: "Oct 28", task: "Site Audit – North Branch", points: 200, status: "verified" },
  { date: "Oct 27", task: "Weekly Quality Review – Q2 Reports", points: 120, status: "verified" },
];

const STATUS_STYLE = {
  verified: { label: "Verified", color: "var(--color-available)" },
  pending: { label: "Pending Verification", color: "var(--color-unverified)" },
  rejected: { label: "Rejected", color: "#ef4444" },
};

const MyPoints = () => {
  const totalPoints = pointsHistory.reduce((sum, p) => sum + (p.status === "verified" ? p.points : 0), 0);
  const pendingPoints = pointsHistory.filter(p => p.status === "pending").reduce((sum, p) => sum + p.points, 0);

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main mb-1">My Points</h1>
          <p className="text-text-muted text-sm">Points earned from completed tasks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="admin-card p-5">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Total Points (Verified)</div>
          <div className="text-3xl font-bold text-text-main">{totalPoints.toLocaleString()}</div>
          <div className="text-xs text-text-muted mt-2">Convertible to earnings</div>
        </div>
        <div className="admin-card p-5">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Pending Verification</div>
          <div className="text-3xl font-bold" style={{ color: "var(--color-unverified)" }}>{pendingPoints.toLocaleString()}</div>
          <div className="text-xs text-text-muted mt-2">Awaiting review</div>
        </div>
        <div className="admin-card p-5">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Estimated Earnings</div>
          <div className="text-3xl font-bold" style={{ color: "var(--color-available)" }}>${(totalPoints * 0.01).toFixed(2)}</div>
          <div className="text-xs text-text-muted mt-2">At $0.01 per point</div>
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Task</th>
              <th className="text-right">Points</th>
              <th className="text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {pointsHistory.map((p, i) => (
              <tr key={i}>
                <td className="text-text-muted text-sm">{p.date}</td>
                <td className="text-text-main text-sm">{p.task}</td>
                <td className="text-right font-medium text-text-main">{p.points} pts</td>
                <td className="text-right">
                  <span className={`status-badge ${
                    p.status === "verified" ? "status-active" :
                    p.status === "pending" ? "status-pending" : "status-inactive"
                  }`}>
                    {STATUS_STYLE[p.status].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyPoints;
