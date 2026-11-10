import { Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("wd_admin");
    navigate("/admin/login");
  };

  return (
    <div className="admin-layout flex flex-col h-screen overflow-hidden">
      {/* Admin Header */}
      <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-sidebar-nav-bg shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
            A
          </div>
          <span className="font-semibold text-text-main text-lg tracking-tight">WorkDay Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl border border-border text-text-main text-sm font-medium hover:bg-hover-bg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Admin Sidebar */}
        <aside className="w-64 border-r border-border bg-sidebar-nav-bg shrink-0 flex flex-col">
          <div className="p-6 border-b border-border">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Admin Panel</p>
            <p className="text-text-main font-medium mt-1">System Control</p>
          </div>
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {[
              { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
              { label: "User Management", path: "/admin/users", icon: "👥" },
              { label: "Task & Point Assignment", path: "/admin/tasks", icon: "📋" },
              { label: "Verification Workflow", path: "/admin/verify", icon: "✅" },
              { label: "Earnings Calculation", path: "/admin/earnings", icon: "💰" },
              { label: "Performance Reporting", path: "/admin/reports", icon: "📈" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted text-sm font-medium transition-colors hover:bg-hover-bg hover:text-text-main"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Admin Content */}
        <main className="flex-1 overflow-y-auto bg-bg-main p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
