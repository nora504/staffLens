import React, { useState } from "react";

const PAYMENT_METHODS = [
  { id: "zelle", label: "Zelle", icon: "💵", color: "available" },
  { id: "bitcoin", label: "Bitcoin", icon: "₿", color: "pending" },
  { id: "wire", label: "Wire Transfer", icon: "🏦", color: "unverified" },
  { id: "cashapp", label: "Cash App", icon: "📱", color: "available" },
  { id: "paypal", label: "PayPal", icon: "🅿️", color: "pending" },
];

const getColorClasses = (color, active) => {
  const base = `border border-border text-text-muted hover:bg-hover-bg transition-colors`;
  if (!active) return base;
  const c = color === "available" ? "color-available" : color === "pending" ? "color-pending" : "color-unverified";
  return `border-${c} bg-${c}/10 text-${c}`;
};

const AvailableBalance = () => {
  const balance = 47.60;
  const availableToWithdraw = balance >= 10 ? balance : 0;
  const [withdrawMethod, setWithdrawMethod] = useState(null);
  const [depositMethod, setDepositMethod] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main mb-1">Available Balance</h1>
          <p className="text-text-muted text-sm">Approved earnings ready for withdrawal</p>
        </div>
        <div className="flex gap-3">
          {availableToWithdraw > 0 && (
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-5 py-2.5 rounded-xl bg-color-available text-white font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Withdraw
            </button>
          )}
          <button
            onClick={() => setShowDepositModal(true)}
            className="px-5 py-2.5 rounded-xl border border-border text-text-main hover:bg-hover-bg transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Deposit
          </button>
        </div>
      </div>

      <div className="admin-card p-6 text-center">
        <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Approved Earnings</div>
        <div className="text-5xl font-bold" style={{ color: "var(--color-available)" }}>${balance.toFixed(2)}</div>
        <div className="text-text-muted text-sm mt-2">Available for immediate withdrawal</div>
        {availableToWithdraw > 0 ? (
          <div className="mt-4 p-3 rounded-xl bg-color-available/10 border border-color-available/20">
            <div className="text-xs font-semibold text-color-available mb-1">✓ Eligible for withdrawal</div>
            <div className="text-xs text-text-muted">Minimum threshold: $10.00</div>
          </div>
        ) : (
          <div className="mt-4 p-3 rounded-xl bg-color-unverified/10 border border-color-unverified/20">
            <div className="text-xs font-semibold text-color-unverified mb-1">Below withdrawal threshold</div>
            <div className="text-xs text-text-muted">Keep earning to reach $10.00 minimum</div>
          </div>
        )}
      </div>

      <div className="admin-card">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Recent Withdrawals</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th className="text-right">Amount</th>
              <th className="text-right">Method</th>
              <th className="text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { date: "Oct 25", amount: "$50.00", method: "Zelle", status: "paid" },
              { date: "Oct 18", amount: "$35.00", method: "PayPal", status: "paid" },
              { date: "Oct 11", amount: "$22.00", method: "Wire Transfer", status: "paid" },
            ].map((w, i) => (
              <tr key={i}>
                <td className="text-text-muted text-sm">{w.date}</td>
                <td className="text-right font-medium text-text-main">{w.amount}</td>
                <td className="text-right text-text-muted text-sm">{w.method}</td>
                <td className="text-right">
                  <span className="status-badge status-active">Paid</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowWithdrawModal(false)}>
          <div className="bg-card-bg border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-main">Withdraw Earnings</h2>
              <button onClick={() => setShowWithdrawModal(false)} className="text-text-muted hover:text-text-main">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Available Balance</label>
                <div className="text-2xl font-bold text-text-main">${balance.toFixed(2)}</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Withdraw Amount</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border bg-black/5 text-text-main focus:border-color-pending focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setWithdrawMethod(m.id)}
                      className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl ${getColorClasses(m.color, withdrawMethod === m.id)}`}
                    >
                      <span className="text-2xl">{m.icon}</span>
                      <span className="text-sm font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 py-3 rounded-xl border border-border text-text-muted hover:bg-hover-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!withdrawMethod || !withdrawAmount || parseFloat(withdrawAmount) > availableToWithdraw}
                  onClick={() => {
                    const method = PAYMENT_METHODS.find(m => m.id === withdrawMethod);
                    alert(`Withdrawal of $${withdrawAmount} via ${method.label} submitted successfully.`);
                    setShowWithdrawModal(false);
                  }}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors
                    ${withdrawMethod && withdrawAmount && parseFloat(withdrawAmount) <= availableToWithdraw
                      ? "bg-color-available text-white hover:bg-green-600"
                      : "bg-border text-text-muted cursor-not-allowed"
                  }`}
                >
                  Confirm Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowDepositModal(false)}>
          <div className="bg-card-bg border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-text-main">Deposit Funds</h2>
              <button onClick={() => setShowDepositModal(false)} className="text-text-muted hover:text-text-main">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Deposit Amount</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border bg-black/5 text-text-main focus:border-color-pending focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setDepositMethod(m.id)}
                      className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl ${getColorClasses(m.color, depositMethod === m.id)}`}
                    >
                      <span className="text-2xl">{m.icon}</span>
                      <span className="text-sm font-medium">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 py-3 rounded-xl border border-border text-text-muted hover:bg-hover-bg transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!depositMethod || !depositAmount}
                  onClick={() => {
                    const method = PAYMENT_METHODS.find(m => m.id === depositMethod);
                    alert(`Deposit of $${depositAmount} via ${method.label} submitted successfully.`);
                    setShowDepositModal(false);
                  }}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors
                    ${depositMethod && depositAmount
                      ? "bg-color-pending text-white hover:bg-blue-600"
                      : "bg-border text-text-muted cursor-not-allowed"
                  }`}
                >
                  Confirm Deposit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableBalance;
