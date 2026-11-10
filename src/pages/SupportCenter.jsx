import React from "react";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "How do I earn points?",
    a: "Complete assigned tasks from the My Tasks page. Each task has a published point value. Points are recorded the same day you finish the work.",
  },
  {
    q: "How do points convert to earnings?",
    a: "Points convert at the published rate (currently $0.01 per point). Once a task is verified, its points are converted to earnings.",
  },
  {
    q: "How long does verification take?",
    a: "All submitted tasks are reviewed within 24 hours. You'll receive a notification when your task is approved or rejected.",
  },
  {
    q: "When do I get paid?",
    a: "Approved earnings become available for withdrawal on the next scheduled payday (every Friday). Minimum withdrawal threshold is $10.00.",
  },
  {
    q: "Why was my task rejected?",
    a: "Rejections include a reason code (e.g., Incomplete Work, Quality Issue, Insufficient Evidence). Check your Notifications for details and resubmit if applicable.",
  },
  {
    q: "How do I withdraw my earnings?",
    a: "Go to Available Balance. If your balance is $10.00 or more, you can request a withdrawal to your bank account.",
  },
];

const SupportCenter = () => {
  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main mb-1">Support Center</h1>
          <p className="text-text-muted text-sm">Get help with your account, tasks, and payments</p>
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-color-pending text-white font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2H16l-4-4 4-4h6.5a2 2 0 0 1 2 2v1z"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="16" y1="19" x2="2" y2="19"/><line x1="1" y1="8" x2="1" y2="14"/><line x1="1" y1="14" x2="7" y2="14"/>
          </svg>
          Submit a Ticket
        </button>
      </div>

      <div className="admin-card">
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search help articles..."
              className="w-full px-4 py-3 rounded-xl border bg-black/5 text-text-main focus:border-color-pending focus:outline-none transition-colors pl-10"
            />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-3 text-text-muted">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-black/5 hover:bg-hover-bg transition-colors"
              >
                <span className="font-medium text-text-main">{faq.q}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <div className="px-5 pb-4 text-text-secondary text-sm border-t border-border">
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card p-6 text-center">
        <div className="text-2xl mb-3">📧</div>
        <h3 className="font-semibold text-text-main mb-2">Still need help?</h3>
        <p className="text-text-muted text-sm mb-4">Contact our support team directly</p>
        <div className="flex justify-center gap-3">
          <Link to="/support/ticket" className="px-5 py-3 rounded-xl border border-border text-text-main hover:bg-hover-bg transition-colors">
            Open a Support Ticket
          </Link>
          <a href="mailto:support@company.com" className="px-5 py-3 rounded-xl border border-border text-text-main hover:bg-hover-bg transition-colors">
            Email Support
          </a>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">Policy Reference</div>
          <Link to="/dashboard" className="text-color-pending text-sm font-semibold hover:underline">
            Read the Daily Payment Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;
