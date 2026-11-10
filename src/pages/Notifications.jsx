import React from "react";

const notifications = [
  { id: 1, title: "Task Approved", body: "Your 'Daily Data Entry' task has been approved. +50 points added.", time: "2 hours ago", type: "success", read: false },
  { id: 2, title: "Payment Processed", body: "Your withdrawal of $50.00 has been processed and sent to your bank account.", time: "5 hours ago", type: "info", read: false },
  { id: 3, title: "Task Rejected", body: "Your 'Inventory Reconciliation' task was rejected. Reason: Insufficient Evidence.", time: "1 day ago", type: "warning", read: true },
  { id: 4, title: "New Task Available", body: "A new 'Site Audit' task worth 200 points has been assigned to you.", time: "2 days ago", type: "info", read: true },
  { id: 5, title: "Payday Reminder", body: "Payments are processed every Friday. Ensure your earnings are approved by Thursday.", time: "3 days ago", type: "info", read: true },
];

const TYPE_CONFIG = {
  success: { color: "var(--color-available)", icon: "✅" },
  info: { color: "var(--color-pending)", icon: "ℹ️" },
  warning: { color: "#f59e0b", icon: "⚠️" },
};

const Notifications = () => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main mb-1">Notifications</h1>
          <p className="text-text-muted text-sm">Stay updated on your tasks and earnings</p>
        </div>
        {unreadCount > 0 && (
          <span className="px-3 py-1 rounded-full bg-color-pending text-white text-xs font-bold">
            {unreadCount} Unread
          </span>
        )}
      </div>

      <div className="admin-card">
        {notifications.map((n, i) => (
          <div key={i} className={`flex items-start gap-4 p-4 border-b border-border hover:bg-hover-bg transition-colors last:border-0 ${!n.read ? "bg-black/5" : ""}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${TYPE_CONFIG[n.type].color + "20"}`} style={{ color: TYPE_CONFIG[n.type].color }}>
              {TYPE_CONFIG[n.type].icon}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <div className="font-semibold text-text-main text-sm">{n.title}</div>
                <div className="text-xs text-text-muted">{n.time}</div>
              </div>
              <div className="text-text-secondary text-sm">{n.body}</div>
              {!n.read && (
                <div className="mt-2">
                  <span className="text-xs font-semibold" style={{ color: "var(--color-pending)" }}>New</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
