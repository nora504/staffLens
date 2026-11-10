import { Link } from "react-router-dom";
import "./WorkLaneLanding.css";

const taskRows = [
  { icon: "↗", title: "Review customer requests", type: "Operations", points: "420 pts", state: "In review", tone: "amber" },
  { icon: "✳", title: "Complete quality checks", type: "Quality", points: "680 pts", state: "Ready", tone: "green" },
  { icon: "▦", title: "Update account records", type: "Data", points: "300 pts", state: "In progress", tone: "blue" },
];

function WorkLaneMark() {
  return <span className="worklane-mark" aria-hidden="true"><span>W</span></span>;
}

function ProductPreview() {
  return <div className="wl-preview-wrap" aria-label="Preview of the WorkLane employee dashboard">
    <div className="wl-preview-glow" />
    <div className="wl-preview">
      <aside className="wl-preview-sidebar">
        <div className="wl-preview-brand"><WorkLaneMark /><strong>worklane</strong></div>
        <span className="wl-preview-label">YOUR WORKSPACE</span>
        <div className="wl-preview-nav active"><i>⌂</i> My home</div>
        <div className="wl-preview-nav"><i>▤</i> My tasks <b>3</b></div>
        <div className="wl-preview-nav"><i>✦</i> My points</div>
        <div className="wl-preview-nav"><i>$</i> My earnings</div>
        <div className="wl-preview-nav"><i>◷</i> Payment history</div>
        <div className="wl-preview-person"><span className="wl-person-avatar">MC</span><span><b>Maya Chen</b><small>Team member</small></span><i>⌄</i></div>
      </aside>
      <div className="wl-preview-main">
        <div className="wl-preview-top"><span>Monday, October 19</span><span className="wl-preview-welcome">✦ &nbsp;Welcome back, Maya</span><span className="wl-top-avatar">MC</span></div>
        <div className="wl-preview-title"><span>YOUR WORK, AT A GLANCE</span><h3>A good day starts with a clear plan.</h3><p>Here’s where your tasks and progress stand today.</p></div>
        <div className="wl-preview-stats">
          <div><small>APPROVED TODAY</small><strong>1,100 <i>pts</i></strong><span>Daily goal reached ✓</span></div>
          <div><small>AVAILABLE BALANCE</small><strong>$110.00</strong><span>Ready for weekly payout</span></div>
        </div>
        <div className="wl-preview-task-heading"><b>Today’s tasks</b><span>See all →</span></div>
        <div className="wl-preview-tasks">{taskRows.map((task) => <div className="wl-preview-task" key={task.title}>
          <span className="wl-task-icon">{task.icon}</span><span className="wl-task-copy"><b>{task.title}</b><small>{task.type} · {task.points}</small></span><span className={`wl-task-state ${task.tone}`}>{task.state}</span>
        </div>)}</div>
        <div className="wl-preview-foot"><span>YOUR DAILY GOAL</span><div className="wl-goal-track"><i /></div><b>1,100 / 1,000 pts</b></div>
      </div>
    </div>
    <div className="wl-float-card wl-float-pay"><span>✦</span><div><small>POINTS CONVERTED</small><b>1,000 pts = $100</b></div><i>✓</i></div>
    <div className="wl-float-card wl-float-check"><span>✓</span><div><b>Payment confirmed</b><small>Your work, clearly recognized.</small></div></div>
  </div>;
}

export default function WorkLaneLanding() {
  return <main className="worklane-landing">
    <header className="wl-header">
      <Link to="/" className="wl-brand" aria-label="WorkLane home"><WorkLaneMark /><span>worklane</span></Link>
      <nav className="wl-nav" aria-label="Main navigation">
        <a href="#how-it-works">How it works</a><a href="#your-workplace">Your workplace</a><a href="#fair-pay">Fair pay, made clear</a>
      </nav>
      <div className="wl-header-actions"><Link className="wl-sign-in" to="/login">Sign in</Link><Link className="wl-button wl-button-dark wl-nav-cta" to="/register">Join your team <span>↗</span></Link></div>
    </header>

    <section className="wl-hero">
      <div className="wl-hero-copy">
        <div className="wl-kicker"><span /> THE WORKDAY, WORKING FOR YOU</div>
        <h1>Good work deserves <span>to be seen.</span></h1>
        <p className="wl-hero-description">A thoughtful home for your tasks, your progress, and what you’ve earned. Know what’s next, see what counts, and feel good about the work you do.</p>
        <div className="wl-hero-actions"><Link to="/register" className="wl-button wl-button-dark">Find your place <span>↗</span></Link><a className="wl-watch-link" href="#how-it-works"><span className="wl-play">↓</span> Take a look around</a></div>
        <div className="wl-proof"><div className="wl-proof-avatars"><span>J</span><span>M</span><span>A</span><span>K</span></div><span>A better workday starts with a little more clarity.</span></div>
      </div>
      <ProductPreview />
      <div className="wl-hero-decoration wl-decoration-one" />
      <div className="wl-hero-decoration wl-decoration-two" />
    </section>

    <section className="wl-principles" id="your-workplace">
      <div><span className="wl-principle-icon coral">✳</span><p><strong>Your work, in one place</strong><small>Tasks, updates, and next steps—without the guesswork.</small></p></div>
      <div><span className="wl-principle-icon lilac">✦</span><p><strong>Progress you can follow</strong><small>See approved points and your daily goal as they change.</small></p></div>
      <div><span className="wl-principle-icon mint">$</span><p><strong>Pay that makes sense</strong><small>Know what’s pending, what’s available, and what’s paid.</small></p></div>
    </section>

    <section className="wl-how" id="how-it-works">
      <div className="wl-section-heading"><span className="wl-kicker"><span /> A LITTLE MORE IN CONTROL</span><h2>Make every working day <em>count.</em></h2><p>WorkLane gives you a clear path from the task in front of you to the progress you’ve made.</p></div>
      <div className="wl-steps">
        <article><span className="wl-step-number">01</span><div className="wl-step-icon task">▤</div><h3>Know what’s yours</h3><p>See assigned work and available tasks together. Understand what each task asks for before you begin.</p></article>
        <article><span className="wl-step-number">02</span><div className="wl-step-icon points">✦</div><h3>See your progress</h3><p>Submit finished work and follow it through review. Approved points and waiting tasks stay distinct.</p></article>
        <article><span className="wl-step-number">03</span><div className="wl-step-icon earnings">$</div><h3>Understand your earnings</h3><p>See how approved points become daily earnings, what is available, and what has already been paid.</p></article>
      </div>
    </section>

    <section className="wl-pay-section" id="fair-pay">
      <div className="wl-pay-copy"><span className="wl-kicker"><span /> FAIRNESS SHOULD BE EASY TO SEE</span><h2>No mystery math.<br /><em>Just clear numbers.</em></h2><p>Your dashboard separates points earned, work awaiting approval, approved earnings, and payments already made—so your effort never disappears into a confusing balance.</p><Link className="wl-text-cta" to="/register">See your own workspace <span>→</span></Link></div>
      <div className="wl-rate-card"><div className="wl-rate-top"><span className="wl-rate-icon">✦</span><span className="wl-rate-badge">A CLEAR, SHARED RATE</span></div><div className="wl-rate-equation"><div><strong>1,000</strong><small>approved points</small></div><span>=</span><div><strong>$100</strong><small>in earnings</small></div></div><div className="wl-rate-divider" /><div className="wl-rate-detail"><span>Daily target</span><strong>1,000 approved points</strong></div><div className="wl-rate-detail"><span>Payment timing</span><strong>Weekly, after approval</strong></div><p>Based on the current example rate. Your team’s published policy determines your actual terms.</p><div className="wl-rate-sparkle">✳</div></div>
    </section>

    <section className="wl-quote"><span>“</span><p>Good work is easier to do when you can see where it’s going.</p><small>That’s the idea behind WorkLane.</small></section>

    <section className="wl-final-cta"><div className="wl-final-orbit" /><span className="wl-kicker">YOUR WORKDAY, WITH A LITTLE MORE YOU IN IT</span><h2>Ready to find your rhythm?</h2><p>Come on in. Your workspace is waiting.</p><Link to="/register" className="wl-button wl-button-light">Join your team <span>↗</span></Link></section>

    <footer className="wl-footer"><Link to="/" className="wl-brand"><WorkLaneMark /><span>worklane</span></Link><span>A clearer place for the work you do.</span><div><Link to="/login">Sign in</Link><Link to="/register">Join your team</Link><a href="#fair-pay">Payment clarity</a></div><small>© {new Date().getFullYear()} WorkLane</small></footer>
  </main>;
}
