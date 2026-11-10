import { useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { localDateKey, useEmployeePortal } from "../context/EmployeePortalContext";
import "./EmployeePortal.css";

const paths = [
  { label: "Dashboard", path: "/dashboard", icon: "⌂" },
  { label: "My Tasks", path: "/dashboard/tasks", icon: "▤" },
  { label: "My Points", path: "/dashboard/points", icon: "✦" },
  { label: "My Earnings", path: "/dashboard/earnings", icon: "$" },
  { label: "Payment History", path: "/dashboard/payments", icon: "◷" },
  { label: "Performance Reports", path: "/dashboard/performance", icon: "▥" },
  { label: "Notifications", path: "/dashboard/notifications", icon: "♧" },
  { label: "Help & Support", path: "/dashboard/support", icon: "?" },
];

const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value);
const dateLabel = (value) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`));
const initials = (name = "") => name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
const statusClass = (status) => `portal-status-${String(status).toLowerCase().replace(/\s+/g, "-")}`;

function usePortalModel() {
  const { data, ratePerPoint } = useEmployeePortal();
  const employee = data.employees.find((person) => person.id === data.employeeId)
    || data.employees.find((person) => person.active)
    || { id: "", name: "Employee", email: "", role: "Employee", targetPoints: 1000 };
  const targetFor = (employeeId) => Number(data.employees.find((person) => person.id === employeeId)?.targetPoints || 1000);
  const pointsForDay = (employeeId, day) => {
    const taskPoints = data.tasks.filter((task) => task.employeeId === employeeId && task.date === day && task.status === "approved")
      .reduce((sum, task) => sum + Number(task.points), 0);
    const corrections = data.adjustments.filter((entry) => entry.employeeId === employeeId && entry.date === day)
      .reduce((sum, entry) => sum + Number(entry.points), 0);
    return Math.max(0, taskPoints + corrections);
  };
  const earningsByDay = (employeeId) => {
    const dates = new Set([
      ...data.tasks.filter((task) => task.employeeId === employeeId && task.status === "approved").map((task) => task.date),
      ...data.adjustments.filter((entry) => entry.employeeId === employeeId).map((entry) => entry.date),
    ]);
    const target = targetFor(employeeId);
    return [...dates].sort().reverse().map((day) => {
      const points = pointsForDay(employeeId, day);
      const qualified = points >= target;
      return { date: day, points, target, qualified, amount: qualified ? points * ratePerPoint : 0 };
    });
  };
  const paidDayKeys = (employeeId) => new Set(data.payments
    .filter((payment) => payment.employeeId === employeeId && payment.status === "paid")
    .flatMap((payment) => payment.dayKeys || []));
  const availableBalance = (employeeId) => {
    const paid = paidDayKeys(employeeId);
    return earningsByDay(employeeId).filter((day) => day.qualified && !paid.has(day.date))
      .reduce((sum, day) => sum + day.amount, 0);
  };
  const approvedPoints = (employeeId, day) => data.tasks
    .filter((task) => task.employeeId === employeeId && task.status === "approved" && (!day || task.date === day))
    .reduce((sum, task) => sum + Number(task.points), 0);
  return { employee, targetFor, pointsForDay, earningsByDay, paidDayKeys, availableBalance, approvedPoints };
}

function Card({ title, subtitle, action, children, className = "" }) {
  return <section className={`portal-card ${className}`}>
    <div className="portal-card-heading">
      <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
      {action}
    </div>
    {children}
  </section>;
}

function Metric({ label, value, note, icon, tone = "" }) {
  return <article className="portal-metric">
    <div className="portal-metric-top"><span>{label}</span><span className={`portal-metric-icon ${tone}`}>{icon}</span></div>
    <strong>{value}</strong><small>{note}</small>
  </article>;
}

function Status({ value }) {
  const label = value === "submitted" ? "Awaiting review" : value.charAt(0).toUpperCase() + value.slice(1);
  return <span className={`portal-status ${statusClass(value)}`}>{label}</span>;
}

function PageHeading({ title, description, admin }) {
  return <div className="portal-page-heading">
    <div><span className="portal-eyebrow">{admin ? "Company workspace" : "Employee portal"}</span><h1>{title}</h1><p>{description}</p></div>
    <span className="portal-date">{new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric" }).format(new Date())}</span>
  </div>;
}

function DataTable({ headings, children, empty = "Nothing to show yet." }) {
  return children.length
    ? <div className="portal-table-scroll"><table className="portal-table"><thead><tr>{headings.map((heading) => <th key={heading}>{heading}</th>)}</tr></thead><tbody>{children}</tbody></table></div>
    : <div className="portal-empty">{empty}</div>;
}

function EmployeeDashboard() {
  const { data } = useEmployeePortal();
  const { employee, targetFor, pointsForDay, earningsByDay, availableBalance } = usePortalModel();
  const today = localDateKey();
  const target = targetFor(employee.id);
  const todayPoints = pointsForDay(employee.id, today);
  const todayPending = data.tasks.filter((task) => task.employeeId === employee.id && task.status === "submitted").length;
  const paid = data.payments.filter((payment) => payment.employeeId === employee.id && payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const recent = data.tasks.filter((task) => task.employeeId === employee.id).slice(0, 5);
  const days = earningsByDay(employee.id);
  const qualifiedTotal = days.filter((day) => day.qualified).reduce((sum, day) => sum + day.amount, 0);
  const todayEarnings = todayPoints >= target ? todayPoints * 0.1 : 0;
  return <>
    <section className="portal-welcome">
      <div className="portal-eyebrow">Your work matters</div>
      <h2>Welcome to Your Employee Dashboard!</h2>
      <p>Your hard work deserves recognition. This dashboard gives you complete visibility into your daily performance, earned points, and payments.
        Complete your assigned tasks, accumulate points, and watch your earnings grow. Every successfully completed and approved task contributes to your overall performance and daily compensation.
        Stay productive, remain consistent, and make every working day count!</p>
      <div className="portal-welcome-note">Your daily target is {formatNumber(target)} approved points. On days you meet it, each approved point earns $0.10.</div>
    </section>
    <section className="portal-metrics">
      <Metric label="Approved points today" value={formatNumber(todayPoints)} note={`${todayPending} task${todayPending === 1 ? "" : "s"} awaiting review`} icon="✦" />
      <Metric label="Today's eligible earnings" value={money(todayEarnings)} note={todayPoints >= target ? "Daily target met" : `${formatNumber(Math.max(0, target - todayPoints))} approved points to target`} icon="$" tone="green" />
      <Metric label="Available balance" value={money(availableBalance(employee.id))} note="Eligible earnings awaiting weekly payment" icon="$" tone="amber" />
      <Metric label="Paid to date" value={money(paid)} note="Confirmed weekly payments" icon="✓" tone="green" />
    </section>
    <div className="portal-grid portal-grid-main">
      <Card title="My Tasks" subtitle="Recent assignments and reviews" action={<NavLink className="portal-inline-link" to="/dashboard/tasks">View all →</NavLink>}>
        <DataTable headings={["Task", "Points", "Status"]} empty="No assigned tasks yet.">
          {recent.map((task) => <tr key={task.id}><td><strong>{task.title}</strong><small>{dateLabel(task.date)}</small></td><td>{formatNumber(task.points)}</td><td><Status value={task.status} /></td></tr>)}
        </DataTable>
      </Card>
      <Card title="Daily performance" subtitle={dateLabel(today)}>
        <div className="portal-target-value"><strong>{formatNumber(todayPoints)} <span>/ {formatNumber(target)}</span></strong><b>{Math.min(100, Math.round(todayPoints / Math.max(1, target) * 100))}%</b></div>
        <div className="portal-progress"><span style={{ width: `${Math.min(100, todayPoints / Math.max(1, target) * 100)}%` }} /></div>
        <p className="portal-subtle">{todayPoints >= target ? "Target achieved. Today's approved points qualify for earnings." : `${formatNumber(Math.max(0, target - todayPoints))} more approved points needed. Below-target points are not carried forward.`}</p>
        <div className="portal-callout">All-time eligible earnings: <strong>{money(qualifiedTotal)}</strong>. Points awaiting approval, eligible earnings, available balance, and money paid are shown separately.</div>
      </Card>
    </div>
    <div className="portal-grid">
      <Card title="Points-to-money conversion" subtitle="The daily target must be met for that day's points to qualify." action={<NavLink className="portal-inline-link" to="/dashboard/earnings">Earnings details →</NavLink>}>
        <DataTable headings={["Approved points", "Earnings", "Requirement"]}>
          {[100, 200, 300, 500, 1000].map((points) => <tr key={points}><td>{formatNumber(points)}</td><td><strong>{money(points * 0.1)}</strong></td><td>Meet daily target</td></tr>)}
        </DataTable>
      </Card>
      <Card title="Daily Payment Policy" subtitle="Transparent, performance-based compensation">
        <Policy target={target} />
      </Card>
    </div>
  </>;
}

function Policy({ target }) {
  return <div className="portal-policy">
    <p>Employees earn compensation for successfully completed tasks after verification and approval. Approved points convert at <strong>1,000 points = $100 ($0.10 per point)</strong> on days when the daily target is met.</p>
    <ul>
      <li>The current daily target is {formatNumber(target)} approved points.</li>
      <li>Days below target remain visible in your points history but earn $0 and do not carry forward.</li>
      <li>Eligible daily earnings appear in payment history and are paid weekly after approval and administrator confirmation.</li>
      <li>Track task status and payment status in this dashboard. Report discrepancies to Support.</li>
    </ul>
    <p>We believe in transparency, accountability, and rewarding employees fairly for their contributions.</p>
  </div>;
}

function TasksPage() {
  const { data, actions } = useEmployeePortal();
  const { employee } = usePortalModel();
  const visible = data.tasks.filter((task) => task.employeeId === employee.id || task.status === "available");
  return <Card title="Assigned and available tasks" subtitle="Submit completed work for verification and approval.">
    <DataTable headings={["Task", "Points", "Assigned date", "Status", "Action"]} empty="There are no assigned or available tasks.">
      {visible.map((task) => <tr key={task.id}>
        <td><strong>{task.title}</strong><small>{task.description}</small>{task.status === "rejected" && <small className="portal-reason">Review reason: {task.rejectReason}</small>}</td>
        <td>{formatNumber(task.points)}</td><td>{dateLabel(task.date)}</td><td><Status value={task.status} /></td>
        <td>{task.status === "available" ? <button className="portal-button secondary" onClick={() => actions.claimTask(task.id)}>Claim task</button> : task.status === "assigned" ? <button className="portal-button" onClick={() => actions.submitTask(task.id)}>Submit for review</button> : "—"}</td>
      </tr>)}
    </DataTable>
    <div className="portal-callout">Only approved tasks count toward points and your daily target. Rejected tasks include the administrator's reason.</div>
  </Card>;
}

function PointsPage() {
  const { data } = useEmployeePortal();
  const { employee, approvedPoints } = usePortalModel();
  const tasks = data.tasks.filter((task) => task.employeeId === employee.id);
  const awaiting = tasks.filter((task) => task.status === "submitted").reduce((sum, task) => sum + Number(task.points), 0);
  const available = data.tasks.filter((task) => task.status === "available").reduce((sum, task) => sum + Number(task.points), 0);
  const corrections = data.adjustments.filter((entry) => entry.employeeId === employee.id);
  return <>
    <section className="portal-metrics">
      <Metric label="Approved task points" value={formatNumber(approvedPoints(employee.id))} note="Verified task completions" icon="✦" />
      <Metric label="Awaiting approval" value={formatNumber(awaiting)} note="Not included in payable totals" icon="◷" tone="amber" />
      <Metric label="Available task points" value={formatNumber(available)} note="Tasks available to claim" icon="▤" />
      <Metric label="Daily target" value={formatNumber(employee.targetPoints)} note="Approved points required per day" icon="◎" tone="green" />
    </section>
    <Card title="Task point history" subtitle="Submitted, approved, and rejected work">
      <DataTable headings={["Task", "Date", "Points", "Status", "Counted points"]} empty="Points from assigned tasks will appear here.">
        {tasks.map((task) => <tr key={task.id}><td><strong>{task.title}</strong></td><td>{dateLabel(task.date)}</td><td>{formatNumber(task.points)}</td><td><Status value={task.status} /></td><td>{task.status === "approved" ? formatNumber(task.points) : "—"}</td></tr>)}
      </DataTable>
      <div className="portal-callout">Pending task points are not approved points. Only approved points count toward the daily target and earnings.</div>
    </Card>
    <Card title="Point adjustments" subtitle="Administrator corrections with an explanation">
      <DataTable headings={["Date", "Adjustment", "Reason"]} empty="No point adjustments have been recorded.">
        {corrections.map((entry) => <tr key={entry.id}><td>{dateLabel(entry.date)}</td><td>{entry.points > 0 ? "+" : ""}{formatNumber(entry.points)}</td><td>{entry.reason}</td></tr>)}
      </DataTable>
    </Card>
  </>;
}

function EarningsPage() {
  const { data, ratePerPoint } = useEmployeePortal();
  const { employee, earningsByDay, paidDayKeys, availableBalance } = usePortalModel();
  const days = earningsByDay(employee.id);
  const paid = paidDayKeys(employee.id);
  const eligible = days.filter((day) => day.qualified).reduce((sum, day) => sum + day.amount, 0);
  const paidTotal = data.payments.filter((payment) => payment.employeeId === employee.id && payment.status === "paid").reduce((sum, payment) => sum + payment.amount, 0);
  return <>
    <section className="portal-metrics">
      <Metric label="Eligible earnings" value={money(eligible)} note="Approved points on target-met days" icon="$" tone="green" />
      <Metric label="Available balance" value={money(availableBalance(employee.id))} note="Awaiting weekly payment" icon="$" tone="amber" />
      <Metric label="Paid" value={money(paidTotal)} note="Confirmed by an administrator" icon="✓" tone="green" />
      <Metric label="Conversion rate" value={money(ratePerPoint)} note="Per approved point, when target is met" icon="↗" />
    </section>
    <Card title="Daily earnings breakdown" subtitle={`Daily target: ${formatNumber(employee.targetPoints)} approved points · 1,000 points = $100`}>
      <DataTable headings={["Work date", "Approved points", "Daily target", "Qualification", "Earnings", "Payment status"]} empty="Approved work will appear here after task review.">
        {days.map((day) => <tr key={day.date}><td>{dateLabel(day.date)}</td><td>{formatNumber(day.points)}</td><td>{formatNumber(day.target)}</td><td>{day.qualified ? <Status value="approved" /> : <Status value="below target" />}</td><td><strong>{money(day.amount)}</strong></td><td>{paid.has(day.date) ? <Status value="paid" /> : day.qualified ? <Status value="pending" /> : "—"}</td></tr>)}
      </DataTable>
      <div className="portal-callout warning">Earnings are calculated per day. Below-target points remain in your history but earn no money and do not carry forward. Submitted tasks count only after approval.</div>
    </Card>
    <Card title="Daily Payment Policy"><Policy target={employee.targetPoints} /></Card>
  </>;
}

function PaymentsPage() {
  const { data } = useEmployeePortal();
  const { employee, availableBalance } = usePortalModel();
  const payments = data.payments.filter((payment) => payment.employeeId === employee.id);
  const paid = payments.filter((payment) => payment.status === "paid").reduce((sum, payment) => sum + payment.amount, 0);
  return <>
    <section className="portal-metrics">
      <Metric label="Available balance" value={money(availableBalance(employee.id))} note="Eligible earnings not yet paid" icon="$" tone="amber" />
      <Metric label="Total paid" value={money(paid)} note="Confirmed weekly payments" icon="✓" tone="green" />
      <Metric label="Payment frequency" value="Weekly" note="After task approval and confirmation" icon="◷" />
      <Metric label="Pending task reviews" value={formatNumber(data.tasks.filter((task) => task.employeeId === employee.id && task.status === "submitted").length)} note="Submitted work awaiting approval" icon="◴" tone="amber" />
    </section>
    <Card title="Payment history" subtitle="Confirmed payments list the work dates they cover.">
      <DataTable headings={["Reference", "Payment period", "Paid date", "Amount", "Status"]} empty="No payments have been recorded. Eligible earnings appear as an available balance.">
        {payments.map((payment) => <tr key={payment.id}><td><strong>{payment.reference}</strong></td><td>{payment.period}</td><td>{dateLabel(payment.paidAt)}</td><td><strong>{money(payment.amount)}</strong></td><td><Status value={payment.status} /></td></tr>)}
      </DataTable>
      <div className="portal-callout">Only confirmed payments reduce your available balance. Contact support with the reference and work dates if a payment looks incorrect.</div>
    </Card>
  </>;
}

function PerformancePage() {
  const { data } = useEmployeePortal();
  const { employee, targetFor, pointsForDay, earningsByDay, availableBalance } = usePortalModel();
  const active = data.employees.filter((person) => person.active);
  const today = localDateKey();
  const recentDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);
    return localDateKey(date);
  });
  const people = data.isAdmin ? active : [employee];
  const maxToday = Math.max(1, ...people.map((person) => pointsForDay(person.id, today)));
  return <>
    <Card title={data.isAdmin ? "Employee performance" : "Your performance"} subtitle="Daily and rolling seven-day approved points">
      <DataTable headings={["Employee", "Today", "Daily target", "Last 7 days", "Target days", "Available balance"]} empty="No active employee data.">
        {people.map((person) => {
          const weekPoints = data.tasks.filter((task) => task.employeeId === person.id && task.status === "approved" && recentDays.includes(task.date)).reduce((sum, task) => sum + Number(task.points), 0);
          const qualifyingDays = earningsByDay(person.id).filter((day) => recentDays.includes(day.date) && day.qualified).length;
          return <tr key={person.id}><td><strong>{person.name}</strong></td><td>{formatNumber(pointsForDay(person.id, today))}</td><td>{formatNumber(targetFor(person.id))}</td><td>{formatNumber(weekPoints)}</td><td>{qualifyingDays}</td><td>{money(availableBalance(person.id))}</td></tr>;
        })}
      </DataTable>
    </Card>
    <Card title="Today's approved points" subtitle="Progress compared with the highest point total today">
      <div className="portal-bars">{people.map((person) => {
        const points = pointsForDay(person.id, today);
        return <div className="portal-bar-row" key={person.id}><div><span>{person.name}</span><strong>{formatNumber(points)} pts</strong></div><div className="portal-progress"><span style={{ width: `${Math.min(100, points / maxToday * 100)}%` }} /></div></div>;
      })}</div>
      <div className="portal-callout">Only approved tasks count toward performance reports; pending submissions are excluded.</div>
    </Card>
  </>;
}

function NotificationsPage() {
  const { data } = useEmployeePortal();
  const { employee } = usePortalModel();
  const items = data.notifications.filter((item) => !item.employeeId || item.employeeId === employee.id);
  return <Card title="Notifications" subtitle={`Task updates and payment announcements for ${employee.name}`}>
    <div className="portal-notices">{items.length ? items.map((item) => <article className="portal-notice" key={item.id}>
      <span className="portal-notice-icon">{item.kind === "payment" ? "$" : item.kind === "task" ? "▤" : "i"}</span>
      <div><strong>{item.title}</strong><p>{item.message}</p><small>{dateLabel(item.date)}</small></div>
    </article>) : <div className="portal-empty">You're all caught up. New task and payment updates will appear here.</div>}</div>
  </Card>;
}

function SupportPage() {
  const { data, actions } = useEmployeePortal();
  const { employee } = usePortalModel();
  const [submitted, setSubmitted] = useState(false);
  const requests = data.supportRequests.filter((request) => request.employeeId === employee.id);
  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    actions.addSupportRequest({
      employeeId: employee.id,
      topic: String(fields.get("topic")),
      reference: String(fields.get("reference") || "").trim(),
      message: String(fields.get("message") || "").trim(),
    });
    form.reset();
    setSubmitted(true);
  }
  return <div className="portal-grid">
    <Card title="Contact support" subtitle="Report task, points, or payment questions.">
      <form className="portal-form" onSubmit={submit}>
        <label>Topic<select name="topic" required><option>Payment discrepancy</option><option>Task review</option><option>Points correction</option><option>Account assistance</option><option>Other</option></select></label>
        <label>Payment or task reference (optional)<input name="reference" placeholder="Reference or task name" /></label>
        <label className="portal-full">How can we help?<textarea name="message" minLength="10" required placeholder="Include relevant dates and details." /></label>
        <div className="portal-full portal-form-actions"><button className="portal-button" type="submit">Send to support</button></div>
        {submitted && <p className="portal-success portal-full" role="status">Your request has been sent to the support center.</p>}
      </form>
    </Card>
    <div className="portal-stack">
      <Card title="Before you contact us"><div className="portal-policy"><ul><li>Task points count after approval.</li><li>Only days meeting your configured target qualify for earnings.</li><li>Payments are processed weekly after administrator confirmation.</li><li>Include the work date and payment reference for discrepancies.</li></ul></div></Card>
      <Card title="Your recent requests">
        <DataTable headings={["Topic", "Date", "Message"]} empty="Your submitted support requests will appear here.">
          {requests.map((request) => <tr key={request.id}><td>{request.topic}</td><td>{dateLabel(request.date)}</td><td>{request.message}</td></tr>)}
        </DataTable>
      </Card>
    </div>
  </div>;
}

function WelcomePage() {
  return <main className="portal-public-page">
    <header className="portal-public-header"><NavLink to="/dashboard/welcome" className="portal-public-brand"><img src="/Logo.png" alt="StaffLens" /></NavLink><div><NavLink className="portal-button secondary" to="/dashboard/sign-in">Employee sign in</NavLink><NavLink className="portal-button" to="/dashboard/register">Create account</NavLink></div></header>
    <section className="portal-public-hero">
      <span className="portal-eyebrow">Your work. Your progress. Your home.</span>
      <h1>A clearer view of your workday.</h1>
      <p>One place to find your tasks, follow your progress, and understand what you’ve earned. Your employee home keeps the details visible, so you always know where things stand.</p>
      <div className="portal-public-actions"><NavLink className="portal-button" to="/dashboard/register">Create your employee account <span aria-hidden="true">→</span></NavLink><NavLink className="portal-public-text-link" to="/dashboard/sign-in">Already have a profile? Sign in</NavLink></div>
      <div className="portal-public-demo">StaffLens prototype · Profile data is saved in this browser. Sign-in and admin access are demonstrations, not secure authentication.</div>
    </section>
    <section className="portal-public-features">
      <article><span>▤</span><h2>Your tasks</h2><p>See assignments, claim available work, and follow task approvals.</p></article>
      <article><span>✦</span><h2>Your progress</h2><p>Track approved points, daily targets, and weekly performance.</p></article>
      <article><span>$</span><h2>Your earnings</h2><p>See eligible earnings, available balance, and payment history separately.</p></article>
    </section>
    <footer className="portal-public-footer">A home for your workday, built around clarity and transparency.</footer>
  </main>;
}

function RegisterPage() {
  const { data, actions } = useEmployeePortal();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  function register(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const name = String(fields.get("name") || "").trim();
    const email = String(fields.get("email") || "").trim();
    const role = String(fields.get("role") || "").trim();
    const targetPoints = Number(fields.get("target"));
    if (!name || !email || !role || !Number.isInteger(targetPoints) || targetPoints < 1) {
      setError("Enter your name, email, role, and a positive whole-number daily target.");
      return;
    }
    if (data.employees.some((person) => person.email.toLowerCase() === email.toLowerCase())) {
      setError("An account with that email already exists. Please sign in instead.");
      return;
    }
    actions.registerEmployee({ name, email, role, targetPoints });
    navigate("/dashboard");
  }

  return <main className="portal-public-page">
    <header className="portal-public-header"><NavLink to="/dashboard/welcome" className="portal-public-brand"><img src="/Logo.png" alt="StaffLens" /></NavLink><NavLink className="portal-public-text-link" to="/dashboard/sign-in">Already registered? Sign in</NavLink></header>
    <section className="portal-auth-layout">
      <div className="portal-auth-aside"><span className="portal-eyebrow">Make yourself at home</span><h1>Your workday starts here.</h1><p>Create your profile to see your tasks, points, earnings, and support updates in one place.</p><div className="portal-auth-points"><span>✓&nbsp; Your own employee dashboard</span><span>✓&nbsp; Clear task approval status</span><span>✓&nbsp; Transparent earnings breakdown</span></div></div>
      <form className="portal-auth-card" onSubmit={register}>
        <span className="portal-eyebrow">New employee</span><h2>Create your account</h2><p>Set up your employee profile to get started.</p>
        <label>Full name<input name="name" autoComplete="name" required maxLength="80" placeholder="Your name" /></label>
        <label>Email address<input name="email" type="email" autoComplete="email" required placeholder="you@company.com" /></label>
        <label>Team or role<input name="role" required maxLength="80" placeholder="Your team or role" /></label>
        <label>Daily points target<input name="target" type="number" min="1" step="1" defaultValue="1000" required /><small>Your admin can change this. The default is 1,000 approved points.</small></label>
        {error && <div className="portal-auth-error" role="alert">{error}</div>}
        <button className="portal-button portal-auth-submit" type="submit">Create account</button>
        <div className="portal-auth-disclaimer">Demo only: this prototype does not verify email addresses or securely authenticate accounts. Do not enter sensitive personal information.</div>
      </form>
    </section>
  </main>;
}

function SignInPage() {
  const { data, actions } = useEmployeePortal();
  const navigate = useNavigate();
  const active = data.employees.filter((person) => person.active);
  const [selected, setSelected] = useState(active[0]?.id || "");
  function signIn(event) {
    event.preventDefault();
    actions.switchEmployee(selected);
    navigate("/dashboard");
  }
  return <main className="portal-public-page">
    <header className="portal-public-header"><NavLink to="/dashboard/welcome" className="portal-public-brand"><img src="/Logo.png" alt="StaffLens" /></NavLink><NavLink className="portal-public-text-link" to="/dashboard/register">New here? Create an account</NavLink></header>
    <section className="portal-auth-layout">
      <div className="portal-auth-aside"><span className="portal-eyebrow">Welcome back</span><h1>Your workday, all in one place.</h1><p>Choose your saved demo profile to return to your employee home.</p><div className="portal-auth-points"><span>Tasks and review updates</span><span>Points and target progress</span><span>Eligible earnings and payments</span></div></div>
      <form className="portal-auth-card" onSubmit={signIn}>
        <span className="portal-eyebrow">Employee portal</span><h2>Sign in</h2><p>Select a saved employee profile.</p>
        <label>Employee profile<select value={selected} onChange={(event) => setSelected(event.target.value)} required>{active.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.email}</option>)}</select></label>
        <button className="portal-button portal-auth-submit" disabled={!active.length}>Continue to your dashboard</button>
        <div className="portal-auth-disclaimer">Demo sign-in only. There are no passwords or secure user sessions in this browser prototype.</div>
        <NavLink className="portal-public-text-link" to="/dashboard/register">Create a new employee account</NavLink>
      </form>
    </section>
  </main>;
}

function AdminPage() {
  const { data, actions } = useEmployeePortal();
  const { targetFor, pointsForDay, earningsByDay, paidDayKeys, availableBalance, approvedPoints } = usePortalModel();
  const [paymentEmployeeId, setPaymentEmployeeId] = useState(data.employees.find((person) => person.active)?.id || "");
  const [message, setMessage] = useState("");
  const active = data.employees.filter((person) => person.active);
  const pending = data.tasks.filter((task) => task.status === "submitted");
  const today = localDateKey();
  const balances = active.reduce((sum, person) => sum + availableBalance(person.id), 0);
  const teamPoints = active.reduce((sum, person) => sum + pointsForDay(person.id, today), 0);
  const paymentDays = earningsByDay(paymentEmployeeId).filter((day) => day.qualified && !paidDayKeys(paymentEmployeeId).has(day.date));
  const paymentAmount = paymentDays.reduce((sum, day) => sum + day.amount, 0);

  function handleForm(event, callback) {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    callback(fields, form);
  }

  function addEmployee(event) {
    handleForm(event, (fields, form) => {
      const email = String(fields.get("email")).trim();
      if (data.employees.some((person) => person.email.toLowerCase() === email.toLowerCase())) {
        setMessage("An employee with that email already exists.");
        return;
      }
      actions.addEmployee({
        name: String(fields.get("name")).trim(),
        email,
        role: String(fields.get("role")).trim(),
        targetPoints: Number(fields.get("target")),
      });
      form.reset();
      setMessage("Employee added.");
    });
  }

  function addTask(event) {
    handleForm(event, (fields, form) => {
      actions.addTask({
        title: String(fields.get("title")).trim(),
        description: String(fields.get("description")).trim(),
        points: Number(fields.get("points")),
        employeeId: String(fields.get("employeeId") || ""),
      });
      form.reset();
      setMessage("Task created.");
    });
  }

  function updateEmployee(event, person) {
    handleForm(event, (fields) => {
      const name = String(fields.get("name") || "").trim();
      const email = String(fields.get("email") || "").trim();
      const role = String(fields.get("role") || "").trim();
      const targetPoints = Number(fields.get("target"));
      if (!name || !email || !role || !Number.isInteger(targetPoints) || targetPoints < 1) {
        setMessage("Enter a name, valid email, role, and positive whole-number daily target.");
        return;
      }
      if (data.employees.some((candidate) => candidate.id !== person.id && candidate.email.toLowerCase() === email.toLowerCase())) {
        setMessage("Another employee already uses that email.");
        return;
      }
      actions.updateEmployee(person.id, { name, email, role, targetPoints });
      setMessage(`${name}'s profile was updated.`);
    });
  }

  function addAdjustment(event) {
    handleForm(event, (fields, form) => {
      const points = Number(fields.get("points"));
      if (!Number.isInteger(points) || points === 0) {
        setMessage("Enter a non-zero whole-number point adjustment.");
        return;
      }
      actions.adjustPoints({
        employeeId: String(fields.get("employeeId")),
        points,
        reason: String(fields.get("reason")).trim(),
      });
      form.reset();
      setMessage("Point correction recorded.");
    });
  }

  function recordPayment(event) {
    handleForm(event, (fields, form) => {
      const employeeId = String(fields.get("employeeId"));
      const eligibleDays = earningsByDay(employeeId).filter((day) => day.qualified && !paidDayKeys(employeeId).has(day.date));
      const amount = eligibleDays.reduce((sum, day) => sum + day.amount, 0);
      const reference = String(fields.get("reference")).trim();
      if (!amount || !eligibleDays.length || !reference) {
        setMessage("Choose an employee with an eligible unpaid balance and enter a payment reference.");
        return;
      }
      const earliest = eligibleDays[eligibleDays.length - 1].date;
      const latest = eligibleDays[0].date;
      actions.recordPayment({
        employeeId,
        reference,
        amount,
        period: earliest === latest ? dateLabel(earliest) : `${dateLabel(earliest)} – ${dateLabel(latest)}`,
        dayKeys: eligibleDays.map((day) => day.date),
      });
      form.reset();
      setPaymentEmployeeId(data.employees.find((person) => person.active)?.id || "");
      setMessage("Weekly payment confirmed and recorded.");
    });
  }

  function rejectTask(task) {
    const reason = window.prompt("Enter a reason for rejecting this task:");
    if (reason === null) return;
    if (!reason.trim()) {
      setMessage("A reason is required to reject a task.");
      return;
    }
    actions.reviewTask(task.id, false, reason.trim());
    setMessage("Task rejected with a reason.");
  }

  function deactivate(person) {
    if (!window.confirm(`Deactivate ${person.name}? Existing task and payment records will be retained.`)) return;
    if (person.id === data.employeeId) {
      const replacement = active.find((candidate) => candidate.id !== person.id);
      if (replacement) actions.switchEmployee(replacement.id);
    }
    actions.deactivateEmployee(person.id);
    setMessage(`${person.name} deactivated.`);
  }

  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);
    return localDateKey(date);
  }), []);

  return <>
    <section className="portal-metrics">
      <Metric label="Active employees" value={formatNumber(active.length)} note="Employee accounts" icon="♙" />
      <Metric label="Tasks awaiting approval" value={formatNumber(pending.length)} note="Review with a reason when rejecting" icon="◷" tone="amber" />
      <Metric label="Available balances" value={money(balances)} note="Eligible earnings awaiting weekly payment" icon="$" tone="green" />
      <Metric label="Approved points today" value={formatNumber(teamPoints)} note="Across active employees" icon="✦" />
    </section>
    {message && <div className="portal-flash" role="status">{message}<button aria-label="Dismiss" onClick={() => setMessage("")}>×</button></div>}
    <div className="portal-grid">
      <Card title="Add employee" subtitle="Create a profile and set the daily points target.">
        <form className="portal-form" onSubmit={addEmployee}>
          <label>Full name<input name="name" required maxLength="80" /></label>
          <label>Email<input name="email" type="email" required /></label>
          <label>Role<input name="role" required maxLength="80" /></label>
          <label>Daily target (points)<input name="target" type="number" min="1" step="1" defaultValue="1000" required /></label>
          <div className="portal-full portal-form-actions"><button className="portal-button">Add employee</button></div>
        </form>
      </Card>
      <Card title="Assign a task" subtitle="Specify task instructions and point value.">
        <form className="portal-form" onSubmit={addTask}>
          <label className="portal-full">Task name<input name="title" required maxLength="120" /></label>
          <label>Assign to<select name="employeeId"><option value="">Available to claim</option>{active.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
          <label>Points<input name="points" type="number" min="1" step="1" required /></label>
          <label className="portal-full">Instructions<textarea name="description" minLength="5" required /></label>
          <div className="portal-full portal-form-actions"><button className="portal-button">Create task</button></div>
        </form>
      </Card>
    </div>
    <Card title="Task approvals" subtitle="Review completed tasks; rejected submissions require a reason.">
      <DataTable headings={["Task", "Employee", "Points", "Date", "Action"]} empty="No tasks are awaiting review.">
        {pending.map((task) => {
          const owner = data.employees.find((person) => person.id === task.employeeId);
          return <tr key={task.id}><td><strong>{task.title}</strong><small>{task.description}</small></td><td>{owner?.name || "Former employee"}</td><td>{formatNumber(task.points)}</td><td>{dateLabel(task.date)}</td><td><div className="portal-actions"><button className="portal-button compact success" onClick={() => { actions.reviewTask(task.id, true); setMessage("Task approved."); }}>Approve</button><button className="portal-button compact danger" onClick={() => rejectTask(task)}>Reject</button></div></td></tr>;
        })}
      </DataTable>
    </Card>
    <Card title="Admin directory" subtitle="Edit employee profiles, targets, performance settings, and account status.">
      <DataTable headings={["Employee", "Role", "Daily target", "Approved today", "Available balance", "Account controls"]} empty="Add an employee to get started.">
        {active.map((person) => <tr key={person.id}>
          <td><strong>{person.name}</strong><small>{person.email}</small></td><td>{person.role}</td>
          <td>{formatNumber(targetFor(person.id))}</td>
          <td>{formatNumber(approvedPoints(person.id, today))}</td><td>{money(availableBalance(person.id))}</td>
          <td><div className="portal-account-actions"><details><summary>Edit profile</summary><form className="portal-profile-editor" onSubmit={(event) => updateEmployee(event, person)}>
            <label>Name<input name="name" defaultValue={person.name} required maxLength="80" /></label>
            <label>Email<input name="email" type="email" defaultValue={person.email} required /></label>
            <label>Role<input name="role" defaultValue={person.role} required maxLength="80" /></label>
            <label>Daily target<input name="target" type="number" min="1" step="1" defaultValue={targetFor(person.id)} required /></label>
            <button className="portal-button compact">Save account changes</button>
          </form></details><button className="portal-button compact danger" onClick={() => deactivate(person)}>Deactivate</button></div></td>
        </tr>)}
      </DataTable>
      <div className="portal-callout">Admins can edit each employee's name, email, role, and target. Deactivation retains historical tasks and payment records. Default target is 1,000 approved points per day.</div>
    </Card>
    <div className="portal-grid">
      <Card title="Point correction" subtitle="Corrections are dated and require a reason.">
        <form className="portal-form" onSubmit={addAdjustment}>
          <label>Employee<select name="employeeId" required>{active.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
          <label>Points (+ / −)<input name="points" type="number" step="1" required placeholder="e.g. 100 or -50" /></label>
          <label className="portal-full">Reason<input name="reason" minLength="8" maxLength="240" required placeholder="Explain the justified correction" /></label>
          <div className="portal-full portal-form-actions"><button className="portal-button secondary">Record adjustment</button></div>
        </form>
        <div className="portal-callout">Corrections apply to today's target calculation. Negative adjustments cannot reduce payable points below zero.</div>
      </Card>
      <Card title="Record weekly payment" subtitle="Confirm payment and mark eligible dates as paid.">
        <form className="portal-form" onSubmit={recordPayment}>
          <label className="portal-full">Employee<select name="employeeId" required value={paymentEmployeeId} onChange={(event) => setPaymentEmployeeId(event.target.value)}>{active.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
          <label className="portal-full">Available balance<input value={money(paymentAmount)} readOnly /></label>
          <label className="portal-full">Payment reference<input name="reference" maxLength="60" required placeholder="Transaction or payroll reference" /></label>
          <div className="portal-full portal-form-actions"><button className="portal-button success" disabled={!paymentAmount}>Confirm weekly payment</button></div>
        </form>
        <div className="portal-callout">The full available balance is recorded. Payments cannot be recorded without eligible unpaid dates.</div>
      </Card>
    </div>
    <Card title="Employee performance" subtitle="Approved points and earnings visibility for this week.">
      <DataTable headings={["Employee", "Today", "Daily target", "Last 7 days", "Target days", "Eligible earnings"]} empty="No active employees.">
        {active.map((person) => {
          const weekly = data.tasks.filter((task) => task.employeeId === person.id && task.status === "approved" && weekDates.includes(task.date)).reduce((sum, task) => sum + Number(task.points), 0);
          const targetDays = earningsByDay(person.id).filter((day) => weekDates.includes(day.date) && day.qualified).length;
          const total = earningsByDay(person.id).filter((day) => day.qualified).reduce((sum, day) => sum + day.amount, 0);
          return <tr key={person.id}><td><strong>{person.name}</strong></td><td>{formatNumber(pointsForDay(person.id, today))}</td><td>{formatNumber(targetFor(person.id))}</td><td>{formatNumber(weekly)}</td><td>{targetDays}</td><td>{money(total)}</td></tr>;
        })}
      </DataTable>
    </Card>
    <Card title="Support requests" subtitle="Questions submitted through Help & Support.">
      <DataTable headings={["Topic", "Employee", "Reference", "Date", "Message"]} empty="No support requests have been submitted.">
        {data.supportRequests.map((request) => <tr key={request.id}><td>{request.topic}</td><td>{data.employees.find((person) => person.id === request.employeeId)?.name || "Former employee"}</td><td>{request.reference || "—"}</td><td>{dateLabel(request.date)}</td><td>{request.message}</td></tr>)}
      </DataTable>
    </Card>
  </>;
}

const pageMap = {
  "/dashboard": ["Dashboard", "Your work, progress, and earnings at a glance.", EmployeeDashboard],
  "/dashboard/tasks": ["My Tasks", "Review assigned and available work.", TasksPage],
  "/dashboard/points": ["My Points", "Track approved points and documented corrections.", PointsPage],
  "/dashboard/earnings": ["My Earnings", "See which approved points qualify for earnings.", EarningsPage],
  "/dashboard/payments": ["Payment History", "Review weekly payments and payment status.", PaymentsPage],
  "/dashboard/performance": ["Performance Reports", "Monitor daily and weekly productivity.", PerformancePage],
  "/dashboard/notifications": ["Notifications", "Task updates, payment announcements, and reminders.", NotificationsPage],
  "/dashboard/support": ["Help & Support", "Contact the company about tasks or payments.", SupportPage],
};

export default function EmployeePortal() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data, actions } = useEmployeePortal();
  const { employee } = usePortalModel();
  const [navOpen, setNavOpen] = useState(false);
  const route = pageMap[location.pathname] || pageMap["/dashboard"];
  const [title, description, Page] = route;
  const items = data.isAdmin ? [{ label: "Admin Dashboard", path: "/dashboard/admin", icon: "◈" }, ...paths] : paths;

  if (location.pathname === "/dashboard/welcome") return <WelcomePage />;
  if (location.pathname === "/dashboard/register") return <RegisterPage />;
  if (location.pathname === "/dashboard/sign-in") return <SignInPage />;

  return <div className="portal-shell">
    <aside className={`portal-sidebar ${navOpen ? "open" : ""}`}>
      <NavLink className="portal-brand" to="/dashboard" onClick={() => setNavOpen(false)}><img src="/Logo.png" alt="StaffLens" /></NavLink>
      <div className="portal-nav-label">{data.isAdmin ? "Administration" : "Main menu"}</div>
      <nav className="portal-nav" aria-label="Employee portal">
        {items.map((item) => <NavLink end={item.path === "/dashboard"} key={item.path} to={item.path} onClick={() => setNavOpen(false)} className={({ isActive }) => `portal-nav-link ${isActive ? "active" : ""}`}>
          <span className="portal-nav-icon">{item.icon}</span><span>{item.label}</span>
          {item.label === "Notifications" && data.notifications.some((notification) => !notification.employeeId || notification.employeeId === employee.id) && <span className="portal-nav-dot" />}
        </NavLink>)}
      </nav>
      <div className="portal-sidebar-bottom"><strong>{data.isAdmin ? "Admin workspace" : "Employee Portal"}</strong><p>{data.isAdmin ? "Review work and manage transparent weekly payments." : "Your points and payment status are visible here."}</p></div>
    </aside>
    <div className="portal-workspace">
      <header className="portal-topbar">
        <button className="portal-mobile-menu" onClick={() => setNavOpen(!navOpen)} aria-label="Toggle navigation">☰</button>
        <div className="portal-breadcrumb">StaffLens&nbsp; / &nbsp;<strong>{data.isAdmin && location.pathname === "/dashboard/admin" ? "Admin Dashboard" : title}</strong></div>
        <div className="portal-top-actions">
          {!data.isAdmin && <><label className="portal-employee-switch"><span>Demo profile</span><select aria-label="Choose demo employee profile" value={employee.id} onChange={(event) => actions.switchEmployee(event.target.value)}>{data.employees.filter((person) => person.active).map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label><button className="portal-mode-button" onClick={() => navigate("/dashboard/register")}>Register</button></>}
          <button className="portal-mode-button" onClick={() => { actions.toggleAdmin(); navigate(data.isAdmin ? "/dashboard" : "/dashboard/admin"); }}>{data.isAdmin ? "Employee view" : "Admin directory"}</button>
          <div className="portal-profile"><span className="portal-avatar">{initials(employee.name)}</span><div><strong>{employee.name}</strong><small>{data.isAdmin ? "Administrator demo" : employee.role}</small></div></div>
        </div>
      </header>
      <main className="portal-main">
        <PageHeading title={data.isAdmin && location.pathname === "/dashboard/admin" ? "Admin Dashboard" : title} description={data.isAdmin && location.pathname === "/dashboard/admin" ? "Manage employees, tasks, approvals, corrections, and weekly payments." : description} admin={data.isAdmin} />
        <div className="portal-demo-warning"><strong>Prototype mode</strong> · Profile switching and admin controls are demo-only, saved in this browser, and not protected by real authentication. No real payments are processed.</div>
        {data.isAdmin && location.pathname === "/dashboard/admin" ? <AdminPage /> : <Page />}
        <div className="portal-footer">StaffLens Employee Portal · Demo data is stored in this browser only.</div>
      </main>
    </div>
  </div>;
}
