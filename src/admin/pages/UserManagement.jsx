import { useState } from "react";
import { Link } from "react-router-dom";

const UserManagement = () => {
  const [search, setSearch] = useState("");

  const users = [
    { name: "Sarah Chen", id: "EMP-001", email: "sarah@company.com", role: "Employee", status: "active", joined: "2026-01-15" },
    { name: "Marcus Reed", id: "EMP-002", email: "marcus@company.com", role: "Employee", status: "active", joined: "2026-02-03" },
    { name: "Elena Vasquez", id: "EMP-003", email: "elena@company.com", role: "Manager", status: "active", joined: "2026-01-10" },
    { name: "David Kim", id: "EMP-004", email: "david@company.com", role: "Employee", status: "inactive", joined: "2026-03-01" },
    { name: "Priya Sharma", id: "EMP-005", email: "priya@company.com", role: "Employee", status: "active", joined: "2026-02-20" },
    { name: "James Wilson", id: "EMP-006", email: "james@company.com", role: "Admin", status: "active", joined: "2026-01-05" },
  ];

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-section">
      <div className="admin-header">
        <div>
          <h2>User Management</h2>
          <p className="text-text-muted text-sm">Create, edit, and manage employee accounts</p>
        </div>
        <Link to="/admin/users/new" className="px-4 py-2 rounded-xl bg-color-pending text-white text-sm font-semibold hover:bg-blue-600 transition-colors">
          + Add User
        </Link>
      </div>

      <div className="admin-card mb-6">
        <input
          type="text"
          placeholder="Search users by name, email, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border bg-black/5 text-text-main focus:border-color-pending focus:outline-none transition-colors"
        />
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>ID</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={i}>
                <td>{u.name}</td>
                <td className="text-text-muted">{u.email}</td>
                <td className="text-text-muted">{u.id}</td>
                <td>{u.role}</td>
                <td>
                  <span className={`status-badge ${u.status === "active" ? "status-active" : "status-inactive"}`}>
                    {u.status}
                  </span>
                </td>
                <td>{u.joined}</td>
                <td className="text-right">
                  <button className="text-text-muted hover:text-color-pending transition-colors text-sm">Edit</button>
                  <span className="mx-2 text-text-muted">|</span>
                  <button className="text-text-muted hover:text-red-500 transition-colors text-sm">Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
            <h3>No users found</h3>
            <p>Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
