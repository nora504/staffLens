import React from "react";

const EarningsCalculation = () => {
  const config = {
    baseRate: "100 points = $1.00",
    model: "Task-Based Value",
    rounding: "Nearest cent",
    minimumWithdrawal: "$10.00",
  };

  const recentCalculations = [
    { employee: "Sarah Chen", points: 1240, rate: "$0.01", earnings: "$12.40", status: "approved", date: "Oct 31" },
    { employee: "Marcus Reed", points: 980, rate: "$0.01", earnings: "$9.80", status: "pending", date: "Oct 31" },
    { employee: "Priya Sharma", points: 2100, rate: "$0.01", earnings: "$21.00", status: "approved", date: "Oct 30" },
    { employee: "David Kim", points: 450, rate: "$0.01", earnings: "$4.50", status: "rejected", date: "Oct 30" },
  ];

  return (
    <div className="admin-section">
      <div className="admin-header">
        <div>
          <h2>Earnings Calculation</h2>
          <p className="text-text-muted text-sm">Configure and review automated points-to-money conversion</p>
        </div>
      </div>

      <div className="admin-grid mb-8">
        {[
          { title: "Conversion Model", value: config.model, desc: "Points-to-money calculation method" },
          { title: "Base Rate", value: config.baseRate, desc: "Standard points-to-cash rate" },
          { title: "Rounding Rule", value: config.rounding, desc: "Applied to final earnings amount" },
          { title: "Min. Withdrawal", value: config.minimumWithdrawal, desc: "Threshold for payout eligibility" },
        ].map((c, i) => (
          <div key={i} className="admin-card">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">{c.title}</h3>
            <p className="text-lg font-bold text-text-main">{c.value}</p>
            <p className="text-xs text-text-muted mt-1">{c.desc}</p>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Recent Calculations</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Points</th>
              <th>Rate</th>
              <th>Earnings</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentCalculations.map((c, i) => (
              <tr key={i}>
                <td>{c.employee}</td>
                <td className="text-text-muted">{c.points.toLocaleString()}</td>
                <td className="text-text-muted">{c.rate}</td>
                <td className="font-medium">{c.earnings}</td>
                <td>
                  <span className={`status-badge ${
                    c.status === "approved" ? "status-active" :
                    c.status === "pending" ? "status-pending" : "status-inactive"
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td>{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EarningsCalculation;
