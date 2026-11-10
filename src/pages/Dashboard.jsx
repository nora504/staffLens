import { Link } from "react-router-dom";
import FinancialCard from "../components/FinancialCard";
import { useDashboard } from "../context/DataContext";

const welcomeMessage = {
  title: "Welcome to Your WorkLane Dashboard",
  body:
    "You're set up for success. This dashboard is your single source of truth for tracking tasks, points, and earnings—everything you need to monitor your performance and get paid accurately, on time.\n\nEvery task you complete earns verified points that convert directly into earnings. Stay focused, hit your targets, and watch your balance grow.",
  cta: "View My Tasks",
};

const dailyPaymentPolicy = {
  title: "How You Get Paid",
  intro:
    "Our payment process is designed to be fair, transparent, and predictable. Here's exactly how it works:",
  steps: [
    { num: "1", title: "Earn points daily", body: "Complete assigned tasks to earn points. Points are recorded the same day you finish the work." },
    { num: "2", title: "Verification window", body: "All points are reviewed within 24 hours. Once verified, they convert to earnings at the published points-to-cash rate." },
    { num: "3", title: "Approval & payout", body: "Verified earnings await manager approval. Approved earnings become available for withdrawal on the next scheduled payday." },
    { num: "4", title: "Transparency you can trust", body: "You can see every transaction—pending, approved, and paid—in your Payment History. Nothing is hidden." },
  ],
  schedule: "Payments are processed every Friday.",
  threshold: "Minimum withdrawal threshold: $10.00",
  cta: "Visit Support Center",
};

const Dashboard = () => {
  const { stats } = useDashboard();

  const financialData = [
    {
      state: "unverified",
      value: stats?.totalTasks ? stats.totalTasks : 0,
      subtitle: "Points earned, awaiting verification",
      to: "/points",
    },
    {
      state: "pending",
      value: "$0.00",
      subtitle: "Earnings awaiting manager approval",
      to: "/earnings",
    },
    {
      state: "available",
      value: "$0.00",
      subtitle: "Approved, ready for withdrawal",
      to: "/balance",
    },
    {
      state: "paid",
      value: "$0.00",
      subtitle: "Paid out to your account",
      to: "/history",
    },
  ];

  return (
    <div className="space-y-6 p-4">
      {/* Welcome Section */}
      <div className="admin-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-text-main mb-2">{welcomeMessage.title}</h1>
            <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
              {welcomeMessage.body}
            </p>
          </div>
          <Link to="/tasks" className="px-6 py-3 rounded-xl bg-(--primary) text-white font-semibold hover:bg-(--primary-hover) transition-colors flex items-center gap-2">
            {welcomeMessage.cta}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Financial State Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {financialData.map((card, i) => (
          <FinancialCard key={i} state={card.state} value={card.value} subtitle={card.subtitle} onClick={() => {}} />
        ))}
      </div>

      {/* Daily Payment Policy */}
      <div className="admin-card rounded-2xl p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-color-available/10 flex items-center justify-center shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--color-available)" }}>
              <path d="M20 6H9a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2z"/><polyline points="22 9 16 15 12 17 9 13"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-main mb-2">{dailyPaymentPolicy.title}</h2>
            <p className="text-text-secondary text-sm mb-4">{dailyPaymentPolicy.intro}</p>
            <ol className="space-y-4">
              {dailyPaymentPolicy.steps.map((step) => (
                <div key={step.num} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-(--primary) text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <div className="font-semibold text-text-main text-sm">{step.title}</div>
                    <div className="text-text-muted text-sm">{step.body}</div>
                  </div>
                </div>
              ))}
            </ol>
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between items-start text-sm">
                <div>
                  <div className="font-semibold text-text-main">{dailyPaymentPolicy.schedule}</div>
                  <div className="text-text-muted">{dailyPaymentPolicy.threshold}</div>
                </div>
                <Link to="/support" className="text-(--primary) text-sm font-semibold hover:underline">
                  {dailyPaymentPolicy.cta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Check Today's Tasks", to: "/tasks", icon: "📋" },
          { label: "Review My Points", to: "/points", icon: "⭐" },
          { label: "View Available Balance", to: "/balance", icon: "💰" },
        ].map((action, i) => (
          <Link
            key={i}
            to={action.to}
            className="admin-card p-4 hover:bg-hover-bg transition-colors cursor-pointer"
          >
            <div className="text-2xl mb-2">{action.icon}</div>
            <div className="font-semibold text-text-main">{action.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
