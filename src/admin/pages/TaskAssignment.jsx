import React from "react";

const TaskAssignment = () => {
  const tasks = [
    { task: "Daily Data Entry", assignee: "Sarah Chen", points: 50, due: "Today", status: "open" },
    { task: "Weekly Quality Review", assignee: "Marcus Reed", points: 120, due: "Friday", status: "open" },
    { task: "Site Audit – North Branch", assignee: "Priya Sharma", points: 200, due: "Oct 10", status: "assigned" },
    { task: "Customer Feedback Analysis", assignee: "Sarah Chen", points: 80, due: "Oct 12", status: "open" },
    { task: "Inventory Reconciliation", assignee: "David Kim", points: 150, due: "Oct 15", status: "overdue" },
  ];

  return (
    <div className="admin-section">
      <div className="admin-header">
        <div>
          <h2>Task & Point Assignment</h2>
          <p className="text-text-muted text-sm">Assign tasks and set point values for employees</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-color-pending text-white text-sm font-semibold hover:bg-blue-600 transition-colors">
          + Create Task
        </button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Assigned To</th>
              <th>Points</th>
              <th>Due Date</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, i) => (
              <tr key={i}>
                <td>{t.task}</td>
                <td className="text-text-muted">{t.assignee}</td>
                <td className="font-medium text-text-main">{t.points} pts</td>
                <td>{t.due}</td>
                <td>
                  <span className={`status-badge ${t.status === "open" ? "status-pending" : t.status === "assigned" ? "status-pending" : "status-active"}`}>
                    {t.status}
                  </span>
                </td>
                <td className="text-right">
                  <button className="text-text-muted hover:text-color-pending transition-colors text-sm">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card mt-6">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Bulk Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="px-4 py-3 rounded-xl border border-border text-text-main hover:bg-hover-bg transition-colors text-sm">
            Assign to All Team Members
          </button>
          <button className="px-4 py-3 rounded-xl border border-border text-text-main hover:bg-hover-bg transition-colors text-sm">
            Set Default Point Values
          </button>
          <button className="px-4 py-3 rounded-xl border border-border text-text-main hover:bg-hover-bg transition-colors text-sm">
            Export Task List (CSV)
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskAssignment;
