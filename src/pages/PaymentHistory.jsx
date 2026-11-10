import React from "react";

const transactions = [
  { date: "Oct 31", type: "Earnings", description: "Daily Data Entry – Customer Records", amount: "+$1.70", status: "paid" },
  { date: "Oct 31", type: "Earnings", description: "Weekly Quality Review – Q3 Reports", amount: "+$1.20", status: "pending" },
  { date: "Oct 30", type: "Earnings", description: "Customer Feedback Analysis", amount: "+$0.80", status: "paid" },
  { date: "Oct 29", type: "Adjustment", description: "Inventory Reconciliation – Rejected", amount: "-$1.50", status: "rejected" },
  { date: "Oct 28", type: "Earnings", description: "Site Audit – North Branch", amount: "+$2.00", status: "paid" },
  { date: "Oct 27", type: "Payout", description: "Bank Transfer Withdrawal", amount: "-$50.00", status: "paid" },
  { date: "Oct 27", type: "Earnings", description: "Weekly Quality Review – Q2 Reports", amount: "+$1.20", status: "paid" },
];

const PaymentHistory = () => {
  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main mb-1">Payment History</h1>
          <p className="text-text-muted text-sm">Complete record of all earnings and payouts</p>
        </div>
      </div>

      <div className="admin-card p-5">
        <div className="flex flex-wrap gap-4">
          {[
            { label: "All", key: "all" },
            { label: "Paid", key: "paid" },
            { label: "Pending", key: "pending" },
            { label: "Rejected", key: "rejected" },
          ].map((f) => (
            <button
              key={f.key}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                border-border text-text-muted hover:bg-hover-bg"
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Description</th>
              <th className="text-right">Amount</th>
              <th className="text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i}>
                <td className="text-text-muted text-sm">{t.date}</td>
                <td className="text-text-muted text-sm capitalize">{t.type}</td>
                <td className="text-text-main text-sm">{t.description}</td>
                <td className="text-right font-medium" style={{ color: t.amount.startsWith("+") ? "var(--color-available)" : "var(--color-unverified)" }}>
                  {t.amount}
                </td>
                <td className="text-right">
                  <span className={`status-badge ${
                    t.status === "paid" ? "status-active" :
                    t.status === "pending" ? "status-pending" : "status-inactive"
                  }`}>
                    {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
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

export default PaymentHistory;
