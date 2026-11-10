import { useState } from "react";
import { Link } from "react-router-dom";

const tasks = [
  { id: "T-101", title: "Daily Data Entry – Customer Records", category: "Data Entry", points: 50, status: "pending", due: "Today", time: "15 min" },
  { id: "T-102", title: "Weekly Quality Review – Q3 Reports", category: "Review", points: 120, status: "available", due: "Friday", time: "45 min" },
  { id: "T-103", title: "Site Audit – North Branch", category: "Audit", points: 200, status: "available", due: "Oct 10", time: "2 hours" },
  { id: "T-104", title: "Customer Feedback Analysis", category: "Analysis", points: 80, status: "completed", due: "Oct 12", time: "30 min" },
  { id: "T-105", title: "Inventory Reconciliation", category: "Inventory", points: 150, status: "overdue", due: "Oct 15", time: "1 hour" },
];

const STATUS_CONFIG = {
  pending: { label: "Pending Verification", color: "var(--color-unverified)" },
  available: { label: "Available to Start", color: "var(--color-pending)" },
  completed: { label: "Completed", color: "var(--color-available)" },
  overdue: { label: "Overdue", color: "#ef4444" },
};

const MyTasks = () => {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main mb-1">My Tasks</h1>
          <p className="text-text-muted text-sm">Track and complete your assigned work</p>
        </div>
        <Link to="/tasks/new" className="px-5 py-2.5 rounded-xl bg-color-pending text-white font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Claim New Task
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {[
          { label: "All", key: "all" },
          { label: "Pending", key: "pending" },
          { label: "Available", key: "available" },
          { label: "Completed", key: "completed" },
          { label: "Overdue", key: "overdue" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap shrink-0 border
              ${filter === f.key
                ? "bg-color-pending border-color-pending text-white"
                : "border-border text-text-muted hover:bg-hover-bg"}
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Category</th>
              <th>Points</th>
              <th>Due</th>
              <th>Est. Time</th>
              <th className="text-right">Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-text-muted">
                  No tasks found for this filter.
                </td>
              </tr>
            ) : (
              filtered.map((t, i) => (
                <tr key={i}>
                  <td>
                    <div className="font-medium text-text-main">{t.title}</div>
                    <div className="text-xs text-text-muted font-mono">#{t.id}</div>
                  </td>
                  <td className="text-text-muted text-sm">{t.category}</td>
                  <td className="font-medium text-text-main">{t.points} pts</td>
                  <td className="text-text-muted text-sm">{t.due}</td>
                  <td className="text-text-muted text-sm">{t.time}</td>
                  <td className="text-right">
                    <span className={`status-badge ${t.status === "pending" ? "status-pending" : t.status === "available" ? "status-pending" : t.status === "completed" ? "status-active" : "status-inactive"}`}>
                      {STATUS_CONFIG[t.status].label}
                    </span>
                  </td>
                  <td className="text-right">
                    {t.status === "available" ? (
                      <button className="px-3 py-1.5 rounded-lg bg-color-available text-white text-xs font-semibold hover:bg-green-600 transition-colors">
                        Start Task
                      </button>
                    ) : t.status === "pending" ? (
                      <button className="px-3 py-1.5 rounded-lg border border-border text-text-muted text-xs hover:bg-hover-bg transition-colors">
                        Awaiting Review
                      </button>
                    ) : (
                      <button className="px-3 py-1.5 rounded-lg border border-border text-text-muted text-xs hover:bg-hover-bg transition-colors">
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-card mt-6">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Task Categories & Point Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Data Entry", value: "50 pts", desc: "Standard entry tasks" },
            { name: "Quality Review", value: "120 pts", desc: "Review & validation" },
            { name: "Site Audit", value: "200 pts", desc: "Field inspections" },
            { name: "Analysis", value: "80 pts", desc: "Data analysis" },
            { name: "Inventory", value: "150 pts", desc: "Stock reconciliation" },
          ].map((c, i) => (
            <div key={i} className="p-4 rounded-xl border border-border bg-black/5">
              <div className="font-semibold text-text-main">{c.name}</div>
              <div className="text-color-available font-bold">{c.value}</div>
              <div className="text-xs text-text-muted mt-1">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
