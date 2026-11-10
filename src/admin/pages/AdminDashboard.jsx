import React from "react";

const AdminDashboard = () => {
  const stats = [
    { title: "Total Users", value: "1,244", subtitle: "Active employees", color: "var(--color-pending)" },
    { title: "Pending Verification", value: "23", subtitle: "Tasks awaiting review", color: "var(--color-unverified)" },
    { title: "Approved Earnings", value: "$4,850", subtitle: "Available for withdrawal", color: "var(--color-available)" },
    { title: "Paid Out", value: "$12,400", subtitle: "This month", color: "var(--color-paid)" },
  ];

  const recentUsers = [
    { name: "Sarah Chen", id: "EMP-001", role: "Employee", status: "active", points: 1240, earnings: "$124.00" },
    { name: "Marcus Reed", id: "EMP-002", role: "Employee", status: "active", points: 980, earnings: "$98.00" },
    { name: "Elena Vasquez", id: "EMP-003", role: "Manager", status: "active", points: 2100, earnings: "$210.00" },
    { name: "David Kim", id: "EMP-004", role: "Employee", status: "inactive", points: 450, earnings: "$45.00" },
  ];

  return (
    <div className="admin-section">
      <div className="admin-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p className="text-text-muted text-sm">System overview and controls</p>
        </div>
        <Link to="/admin/users" className="px-4 py-2 rounded-xl bg-color-pending text-white text-sm font-semibold hover:bg-blue-600 transition-colors">
          Manage Users
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="admin-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">{s.title}</h3>
                <p className="text-2xl font-bold text-text-main">{s.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ backgroundColor: s.color + "20" }}>
                <span style={{ color: s.color, fontSize: "20px" }}>{i === 0 ? "👥" : i === 1 ? "⏳" : i === 2 ? "✅" : "💵"}</span>
              </div>
            </div>
            <p className="text-xs text-text-muted">{s.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Recent User Activity</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>ID</th>
              <th>Role</th>
              <th>Status</th>
              <th>Points</th>
              <th>Earnings</th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((u, i) => (
              <tr key={i}>
                <td>{u.name}</td>
                <td className="text-text-muted">{u.id}</td>
                <td>{u.role}</td>
                <td>
                  <span className={`status-badge ${u.status === "active" ? "status-active" : "status-inactive"}`}>
                    {u.status}
                  </span>
                </td>
                <td>{u.points.toLocaleString()}</td>
                <td>{u.earnings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
