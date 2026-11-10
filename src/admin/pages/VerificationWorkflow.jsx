import { useState } from "react";

const REASON_CODES = [
  { code: "INCOMPLETE_WORK", label: "Incomplete Work", desc: "Task not fully completed" },
  { code: "QUALITY_ISSUE", label: "Quality Issue", desc: "Work does not meet quality standards" },
  { code: "DUPLICATE_SUBMISSION", label: "Duplicate Submission", desc: "Work already submitted/credited" },
  { code: "POLICY_VIOLATION", label: "Policy Violation", desc: "Violates company or safety policy" },
  { code: "INSUFFICIENT_EVIDENCE", label: "Insufficient Evidence", desc: "Missing proof/screenshots/documentation" },
  { code: "OTHER", label: "Other", desc: "Custom reason (specify below)" },
];

const submissions = [
  { id: "V-1001", employee: "Sarah Chen", task: "Daily Data Entry", points: 50, submitted: "2 hours ago", evidence: "screenshot_001.png" },
  { id: "V-1002", employee: "Marcus Reed", task: "Weekly Quality Review", points: 120, submitted: "5 hours ago", evidence: "report_q3.pdf" },
  { id: "V-1003", employee: "Priya Sharma", task: "Site Audit – North Branch", points: 200, submitted: "1 day ago", evidence: "audit_north.jpg" },
  { id: "V-1004", employee: "David Kim", task: "Customer Feedback Analysis", points: 80, submitted: "2 days ago", evidence: null },
];

const VerificationWorkflow = () => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  return (
    <div className="admin-section">
      <div className="admin-header">
        <div>
          <h2>Verification Workflow</h2>
          <p className="text-text-muted text-sm">Approve or reject submitted tasks with reason codes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Task</th>
                <th>Points</th>
                <th>Submitted</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s, i) => (
                <tr key={i}>
                  <td className="font-mono text-xs text-text-muted">{s.id}</td>
                  <td className="text-text-main">{s.employee}</td>
                  <td className="text-text-secondary text-sm">{s.task}</td>
                  <td className="font-medium text-text-main">{s.points} pts</td>
                  <td className="text-text-muted text-xs">{s.submitted}</td>
                  <td className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        className="px-3 py-1.5 rounded-lg bg-color-available/10 text-color-available text-xs font-semibold hover:bg-color-available/20 transition-colors"
                        onClick={() => alert(`Approved ${s.id} — ${s.points} points converted to earnings`)}
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500/20 transition-colors"
                        onClick={() => {
                          const reason = prompt("Reject task. Select reason:\n" + REASON_CODES.map(r => `${r.code}: ${r.label}`).join("\n") + "\n\nOr type custom reason:");
                          if (reason) alert(`Rejected ${s.id}. Reason: ${reason}`);
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Reject with Reason Code</h3>
          <p className="text-text-muted text-sm mb-4">Select a standardized reason code when rejecting a submission.</p>
          <div className="space-y-3">
            {REASON_CODES.map((r) => (
              <button
                key={r.code}
                onClick={() => {
                  setSelectedReason(r.code);
                  setCustomReason("");
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-colors
                  ${selectedReason === r.code ? "border-color-pending bg-color-pending/10 text-color-pending" : "border-border text-text-muted hover:bg-hover-bg"}`}
              >
                <span>
                  <span className="font-semibold text-text-main">{r.label}</span>
                  <br />
                  <span className="text-xs text-text-muted">{r.desc}</span>
                </span>
                <span className={`text-xs font-mono ${selectedReason === r.code ? "text-color-pending" : "text-text-muted"}`}>
                  {r.code}
                </span>
              </button>
            ))}
            {selectedReason === "OTHER" && (
              <div className="pt-2">
                <label className="block text-xs font-semibold text-text-muted mb-1 uppercase tracking-wider">Custom Reason</label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border bg-black/5 text-text-main focus:border-color-pending focus:outline-none transition-colors"
                  placeholder="Enter custom rejection reason..."
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationWorkflow;
