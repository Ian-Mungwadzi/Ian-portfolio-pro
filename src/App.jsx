import { useState, useEffect, useRef } from "react";

/* ============================================================
   IAN MUNGWADZI — PROFESSIONAL PORTFOLIO
   Employer-facing. (no silliness, no memes, no jokes, no personal blog content )
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg: #faf8f3;
  --bg-alt: #f2efe7;
  --ink: #1a1a1a;
  --ink-2: #4a4a4a;
  --ink-3: #8a8580;
  --rule: #e4ded3;
  --rule-strong: #c9c2b4;
  --accent: #b84b0a;
  --accent-hover: #d05a10;
  --accent-tint: rgba(184, 75, 10, 0.08);
  --display: 'Space Grotesk', -apple-system, sans-serif;
  --body: 'Inter', -apple-system, sans-serif;
  --mono: 'JetBrains Mono', monospace;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

.pro-root {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--body);
  font-size: 15px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
}

::selection { background: var(--accent); color: var(--bg); }

/* ---------- Utility ---------- */
.wrap { max-width: 1080px; margin: 0 auto; padding: 0 32px; }
.wrap-narrow { max-width: 760px; margin: 0 auto; padding: 0 32px; }

.eyebrow {
  font-family: var(--mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-3);
}
.eyebrow .dot {
  display: inline-block; width: 6px; height: 6px;
  background: var(--accent); border-radius: 50%;
  margin-right: 8px; vertical-align: 1px;
}

h1, h2, h3, h4 { font-family: var(--display); font-weight: 600; letter-spacing: -0.015em; color: var(--ink); }

/* ---------- Nav ---------- */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 40;
  background: rgba(250, 248, 243, 0.85);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease, background 0.2s ease;
}
.nav.scrolled { border-bottom-color: var(--rule); }
.nav-inner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 32px; max-width: 1200px; margin: 0 auto;
}
.nav-logo {
  font-family: var(--display); font-weight: 600; font-size: 15px;
  color: var(--ink); text-decoration: none; letter-spacing: -0.01em;
}
.nav-logo .initials { color: var(--accent); }
.nav-links { display: flex; gap: 26px; align-items: center; }
.nav-links a {
  color: var(--ink-2); text-decoration: none; font-size: 13px; font-weight: 500;
  transition: color 0.15s ease;
}
.nav-links a:hover { color: var(--accent); }
.nav-links .cv-btn {
  border: 1px solid var(--ink); padding: 8px 16px;
  color: var(--ink); font-weight: 500;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.nav-links .cv-btn:hover { background: var(--ink); color: var(--bg); border-color: var(--ink); }

@media (max-width: 720px) {
  .nav-links a:not(.cv-btn) { display: none; }
}

/* ---------- Hero ---------- */
.hero {
  padding: 140px 0 100px;
  border-bottom: 1px solid var(--rule);
}
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 60px;
  align-items: end;
}
.hero .eyebrow { margin-bottom: 24px; }
.hero h1 {
  font-size: clamp(44px, 7vw, 76px);
  line-height: 1.02;
  font-weight: 600;
  margin-bottom: 22px;
}
.hero .role {
  font-size: clamp(18px, 2.2vw, 22px);
  color: var(--ink-2);
  font-weight: 400;
  margin-bottom: 32px;
  max-width: 640px;
}
.hero .role strong { color: var(--ink); font-weight: 600; }
.hero .meta {
  display: flex; gap: 24px; flex-wrap: wrap;
  font-size: 13px; color: var(--ink-3);
  padding-top: 20px; border-top: 1px solid var(--rule);
}
.hero .meta span::before {
  content: '';
  display: inline-block; width: 3px; height: 3px; background: var(--ink-3);
  border-radius: 50%; vertical-align: 3px; margin-right: 10px;
}
.hero .meta span:first-child::before { display: none; }

.status-pill {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--accent-tint); color: var(--accent);
  padding: 6px 12px; font-size: 12px; font-weight: 500;
  font-family: var(--mono); letter-spacing: 0.02em;
  margin-bottom: 24px;
}
.status-pill .pulse {
  width: 7px; height: 7px; background: var(--accent); border-radius: 50%;
  box-shadow: 0 0 0 0 var(--accent);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(184, 75, 10, 0.5); }
  50% { box-shadow: 0 0 0 6px rgba(184, 75, 10, 0); }
}

.hero-portrait {
  aspect-ratio: 4 / 5;
  background: var(--bg-alt);
  border: 1px solid var(--rule);
  display: flex; align-items: center; justify-content: center;
  color: var(--ink-3); font-size: 11px; text-align: center;
  font-family: var(--mono); letter-spacing: 0.1em;
  padding: 20px;
  position: relative;
}
.hero-portrait::after {
  content: 'HEADSHOT'; position: absolute; bottom: 12px; right: 14px;
  font-size: 9px; letter-spacing: 0.2em; color: var(--ink-3);
}

@media (max-width: 820px) {
  .hero { padding: 120px 0 70px; }
  .hero-grid { grid-template-columns: 1fr; gap: 40px; }
  .hero-portrait { max-width: 240px; aspect-ratio: 1; }
}

/* ---------- Section base ---------- */
.section {
  padding: 100px 0;
  border-bottom: 1px solid var(--rule);
}
.section-head {
  display: flex; justify-content: space-between; align-items: baseline;
  gap: 30px; margin-bottom: 56px; flex-wrap: wrap;
}
.section-head h2 {
  font-size: clamp(28px, 4vw, 38px);
  font-weight: 600;
  letter-spacing: -0.02em;
}
.section-head .num {
  font-family: var(--mono); font-size: 12px; color: var(--ink-3);
  letter-spacing: 0.1em;
}

/* ---------- About ---------- */
.about-grid {
  display: grid; grid-template-columns: 1fr 300px; gap: 60px;
}
.about-body p {
  font-size: 17px; line-height: 1.7; color: var(--ink);
  margin-bottom: 20px; max-width: 62ch;
}
.about-body p:last-child { margin-bottom: 0; }
.about-aside {
  border-left: 1px solid var(--rule); padding-left: 24px;
  font-size: 13px;
}
.about-aside dl { display: grid; gap: 18px; }
.about-aside dt {
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.15em;
  text-transform: uppercase; color: var(--ink-3); margin-bottom: 4px;
}
.about-aside dd { color: var(--ink); font-weight: 500; }

@media (max-width: 820px) {
  .about-grid { grid-template-columns: 1fr; gap: 40px; }
  .about-aside { border-left: none; border-top: 1px solid var(--rule); padding: 24px 0 0; }
}

/* ---------- Work ---------- */
.work-list { display: grid; gap: 60px; }
.work-item { display: grid; grid-template-columns: 340px 1fr; gap: 50px; }
.work-item.featured { grid-template-columns: 1fr; gap: 30px; }

.work-media {
  
  aspect-ratio: 4 / 3;
  background: var(--bg-alt); border: 1px solid var(--rule);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.15em;
  color: var(--ink-3); text-align: center; padding: 16px;
  position: relative; overflow: hidden;
}

.hero-portrait img,
.work-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  }

.work-item.featured .work-media { aspect-ratio: 21 / 9; }

.work-body h3 {
  font-size: 24px; margin-bottom: 6px; font-weight: 600;
}
.work-item.featured .work-body h3 { font-size: 30px; }
.work-body .work-meta {
  display: flex; gap: 16px; flex-wrap: wrap;
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em;
  color: var(--ink-3); text-transform: uppercase;
  margin-bottom: 18px;
}
.work-body .work-meta .role { color: var(--accent); }
.work-body p {
  color: var(--ink-2); line-height: 1.7; margin-bottom: 14px;
  max-width: 62ch;
}
.work-body p:last-of-type { margin-bottom: 20px; }
.work-tags { display: flex; flex-wrap: wrap; gap: 8px; }
.work-tag {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.05em;
  color: var(--ink-2); border: 1px solid var(--rule-strong);
  padding: 4px 10px;
}

@media (max-width: 820px) {
  .work-item { grid-template-columns: 1fr; gap: 24px; }
}

/* ---------- Capabilities ---------- */
.caps-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px 60px;
}
.cap-group h3 {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.15em;
  text-transform: uppercase; color: var(--accent);
  padding-bottom: 12px; border-bottom: 1px solid var(--rule);
  margin-bottom: 16px; font-weight: 500;
}
.cap-group ul { list-style: none; }
.cap-group li {
  padding: 8px 0; color: var(--ink); font-size: 15px;
  border-bottom: 1px solid var(--rule);
}
.cap-group li:last-child { border-bottom: none; }
.cap-group li .sub { color: var(--ink-3); font-size: 13px; margin-left: 6px; }

@media (max-width: 620px) {
  .caps-grid { grid-template-columns: 1fr; }
}

/* ---------- Timeline (experience + education) ---------- */
.timeline { display: grid; gap: 0; }
.tl-item {
  display: grid; grid-template-columns: 140px 1fr;
  gap: 40px; padding: 24px 0; border-top: 1px solid var(--rule);
}
.tl-item:last-child { border-bottom: 1px solid var(--rule); }
.tl-when {
  font-family: var(--mono); font-size: 12px; letter-spacing: 0.05em;
  color: var(--ink-3);
}
.tl-body h3 { font-size: 18px; margin-bottom: 4px; font-weight: 600; }
.tl-body .org { color: var(--accent); font-size: 14px; font-weight: 500; margin-bottom: 8px; }
.tl-body p { color: var(--ink-2); font-size: 14px; max-width: 62ch; }

@media (max-width: 620px) {
  .tl-item { grid-template-columns: 1fr; gap: 8px; }
}

/* ---------- Writing ---------- */
.writing-card {
  border: 1px solid var(--rule); padding: 32px;
  display: grid; grid-template-columns: 1fr auto; gap: 30px;
  align-items: center;
  transition: border-color 0.2s ease;
}
.writing-card:hover { border-color: var(--rule-strong); }
.writing-card .tag {
  font-family: var(--mono); font-size: 10px; letter-spacing: 0.15em;
  color: var(--accent); text-transform: uppercase; margin-bottom: 8px;
}
.writing-card h3 { font-size: 22px; margin-bottom: 8px; font-weight: 600; }
.writing-card p { color: var(--ink-2); font-size: 14px; max-width: 60ch; }
.writing-card .cta {
  color: var(--ink); text-decoration: none; font-size: 13px; font-weight: 500;
  border: 1px solid var(--ink); padding: 10px 18px;
  transition: all 0.15s ease; white-space: nowrap;
}
.writing-card .cta:hover { background: var(--ink); color: var(--bg); }

@media (max-width: 620px) {
  .writing-card { grid-template-columns: 1fr; }
}

/* ---------- Contact ---------- */
.contact { padding: 100px 0; background: var(--bg-alt); border-bottom: 1px solid var(--rule); }
.contact-inner { max-width: 760px; margin: 0 auto; padding: 0 32px; }
.contact h2 {
  font-size: clamp(36px, 6vw, 56px); font-weight: 600;
  letter-spacing: -0.02em; margin-bottom: 20px; line-height: 1.05;
}
.contact h2 .accent { color: var(--accent); }
.contact-body {
  color: var(--ink-2); font-size: 17px; line-height: 1.7;
  max-width: 56ch; margin-bottom: 40px;
}
.contact-methods { display: grid; gap: 2px; }
.contact-method {
  display: grid; grid-template-columns: 120px 1fr auto;
  gap: 24px; padding: 20px 0;
  border-top: 1px solid var(--rule-strong);
  color: var(--ink); text-decoration: none; align-items: center;
  transition: padding 0.2s ease;
}
.contact-method:last-child { border-bottom: 1px solid var(--rule-strong); }
.contact-method:hover { padding-left: 12px; }
.contact-method:hover .cm-arrow { transform: translateX(4px); color: var(--accent); }
.contact-method .cm-label {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--ink-3);
}
.contact-method .cm-value { font-size: 16px; font-weight: 500; }
.contact-method .cm-arrow {
  font-family: var(--mono); color: var(--ink-3);
  transition: transform 0.2s ease, color 0.2s ease;
}

@media (max-width: 620px) {
  .contact-method { grid-template-columns: 1fr auto; }
  .contact-method .cm-label { grid-column: 1 / -1; margin-bottom: 4px; }
}

/* ---------- Footer ---------- */
.footer {
  padding: 40px 0 50px;
  font-size: 13px; color: var(--ink-3);
}
.footer-inner {
  display: flex; justify-content: space-between; gap: 30px; flex-wrap: wrap;
}
.footer .credit a { color: var(--ink-2); text-decoration: none; border-bottom: 1px solid var(--rule-strong); }
.footer .credit a:hover { color: var(--accent); border-bottom-color: var(--accent); }
.eva-easter {
  font-family: var(--mono); font-size: 11px; letter-spacing: 0.08em;
}
.eva-easter a {
  color: var(--ink-3); text-decoration: none;
  border-bottom: 1px dotted var(--rule-strong);
  transition: color 0.15s ease, border-color 0.15s ease;
}
.eva-easter a:hover { color: var(--accent); border-bottom-color: var(--accent); }

/* ---------- Reveal on scroll ---------- */
.reveal { opacity: 0; transform: translateY(12px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
  .status-pill .pulse { animation: none; }
  html { scroll-behavior: auto; }
}
`;



const ABOUT = [
  "I'm a final-year Mechanical Engineering student at Northumbria University and Team Principal of the university's debut Formula Student programme. My work sits at the intersection of engineering design, race-side data analysis, and multidisciplinary team leadership.",
  "I'm most at home in the loop between simulation and physical validation — CAD in SolidWorks and Fusion 360, structural work in ABAQUS, data pipelines in Python and MATLAB, and setup decisions made at the trackside with telemetry in front of me.",
  "Targeting graduate race engineering roles for the 2027 intake. Based in Newcastle-upon-Tyne, open to relocating.",
];

const WORK = [
  {
    id: "01",
    featured: true,
    image: "/images/NUFS_Header_Image.png",
    title: "Northumbria Formula Student",
    role: "Team Principal",
    period: "September 2025 — September 2026",
    body: [
      "Founding leadership of Northumbria University's debut Formula Student campaign. Responsible for engineering direction, sponsorship acquisition, and operational deliverables across a multidisciplinary team spanning chassis, powertrain, aerodynamics, electronics, and business.",
      "Building the team's technical baseline from scratch — component selection, design reviews, budget modelling, and the sponsorship pipeline needed to fund it. Working towards FSUK competition readiness.",
    ],
    tags: ["Team Leadership", "SolidWorks", "Project Management", "Sponsorship"],
  },
  {
    id: "02",
    image: "/images/rap-riders.jpg",
    title: "RAP Riders Academy",
    role: "Pit Crew / Race Engineer",
    period: "2024",
    body: [
      "Supported rider Hudson Kai Cooper across the Teesside legs of the FIM MiniGP and FreeTech Endurance Junior Talent Cup.",
      "Analysed rider telemetry — GPS traces, throttle and brake application, lap times and sector splits — to identify performance trends and inform race strategy. Adjusted suspension, gearing, and tyre setup in response to live data and rider feedback, improving competitiveness across multiple race weekends.",
    ],
    tags: ["Telemetry", "Data Analysis", "Race Setup", "Live Ops"],
  },
  {
    id: "03",
    image: "/images/lm-wind-power.jpeg",
    title: "LM Wind Power × GE Renewable Energy",
    role: "Design Engineer Intern",
    period: "2021 — 2022",
    body: [
      "Remote design engineering placement delivered through the Industrial Cadets programme, culminating in a Gold award.",
      "Interpreted finite element stress simulations of wind turbine blade components and recommended design and material changes to improve product lifecycle. Presented findings to a mixed audience of engineers and programme sponsors.",
    ],
    tags: ["FEA", "Materials", "Simulation", "Technical Communication"],
  },
  {
    id: "04",
    image: "/images/papaya-turn-one.jpg",
    title: "Papaya Turn One",
    role: "Co-Founder / Director",
    period: "2021 — 2025",
    body: [
      "Co-founded a small motorsport media company and racing team, grown from the QE Motorsport society. Directed brand identity, media output, and early operational strategy.",
      "Working towards the establishment of the UK's first dedicated student racing team — a longer-term project running alongside Formula Student.",
    ],
    tags: ["Motorsport", "Media", "Strategy"],
  },
];

const CAPABILITIES = [
  {
    group: "Engineering & Simulation",
    items: [
      { name: "SolidWorks", sub: "CAD, part & assembly modelling" },
      { name: "Fusion 360", sub: "CAD, generative design" },
      { name: "ABAQUS", sub: "finite element analysis" },
      { name: "MATLAB", sub: "modelling, signal processing" },
    ],
  },
  {
    group: "Programming & Data",
    items: [
      { name: "Python", sub: "data pipelines, analysis, tooling" },
      { name: "C#", sub: "application development" },
      { name: "Data analysis", sub: "telemetry, statistics" },
      { name: "Git / GitHub", sub: "version control, collaboration" },
    ],
  },
  {
    group: "Motorsport",
    items: [
      { name: "Telemetry analysis", sub: "GPS, sector, driver inputs" },
      { name: "Race strategy", sub: "live decision-making" },
      { name: "Setup development", sub: "suspension, gearing, tyres" },
      { name: "Trackside ops", sub: "pit crew experience" },
    ],
  },
  {
    group: "Qualifications & Affiliations",
    items: [
      { name: "Motorsport UK", sub: "Race Marshal" },
      { name: "Industrial Cadet", sub: "Gold level" },
      { name: "IMechE", sub: "Student Member" },
      { name: "EDT", sub: "Most Innovative Project" },
    ],
  },
];

const TIMELINE = [
  {
    when: "2025 — Present",
    title: "Team Principal — Formula Student",
    org: "Northumbria University",
    body: "Leading the university's debut Formula Student campaign end-to-end.",
  },
  {
    when: "2023 — Present",
    title: "BEng Mechanical Engineering",
    org: "Northumbria University, Newcastle-upon-Tyne",
    body: "Statics & dynamics, thermodynamics, applied engineering approaches, engineering project management. Student member of the IMechE.",
  },
  {
    when: "2024",
    title: "Pit Crew / Race Engineer",
    org: "RAP Riders Academy",
    body: "Telemetry analysis and setup work supporting a junior rider across FIM MiniGP and FreeTech Endurance Junior Talent Cup weekends.",
  },
  {
    when: "2021 — 2025",
    title: "Co-Founder / Director",
    org: "Papaya Turn One",
    body: "Motorsport media company and racing team, grown from the QE Motorsport society.",
  },
  {
    when: "2021 — 2022",
    title: "Design Engineer Intern",
    org: "LM Wind Power / GE Renewable Energy",
    body: "Remote FEA-driven design work via the Industrial Cadets programme.",
  },
  {
    when: "2021 — 2023",
    title: "A-Levels — Chemistry, Physics, Computer Science",
    org: "Queen Elizabeth Sixth Form College, Darlington",
    body: "Industrial Cadet Gold. Team awarded Most Innovative Project by EDT. President of QE Radio and QE Motorsport.",
  },
];

/* ============================================================
   COMPONENTS
   ============================================================ */

function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > threshold);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [threshold]);
  return scrolled;
}

function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${seen ? "in" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Portfolio() {
  const scrolled = useScrolled();

  return (
    <div className="pro-root">
      <style>{CSS}</style>

      {/* Nav */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#top" className="nav-logo">
            <span className="initials">IM</span>&nbsp;&nbsp;Ian Mungwadzi
          </a>
          <div className="nav-links">
            <a href="#work">Work</a>
            <a href="#capabilities">Capabilities</a>
            <a href="#experience">Experience</a>
            <a href="#writing">Writing</a>
            <a href="#contact">Contact</a>
            <a href="/cv.pdf" className="cv-btn" download>CV ↓</a>
          </div>
        </div>
      </nav>

      <main id="top">
        {/* Hero */}
        <header className="hero">
          <div className="wrap">
            <div className="hero-grid">
              <div>
                <div className="eyebrow"><span className="dot" />Portfolio / 2026</div>
                <div style={{ height: 24 }} />
                <div className="status-pill">
                  <span className="pulse" />Available — graduate roles, 2027 intake
                </div>
                <h1>Ian Mungwadzi</h1>
                <p className="role">
                  <strong>Mechanical engineering</strong>, final year at Northumbria University.
                  Team Principal of Northumbria's debut Formula Student programme. Design, simulation,
                  and race-side data analysis.
                </p>
                <div className="meta">
                  <span>BEng Mechanical Engineering</span>
                  <span>Newcastle-upon-Tyne, UK</span>
                  <span>Open to relocation</span>
                </div>
              </div>
              <div className="hero-portrait">
                <img src="/images/headshot.jpg" alt="Ian Mungwadzi" />
              </div>
            </div>
          </div>
        </header>

        {/* About */}
        <section className="section" id="about">
          <div className="wrap">
            <div className="section-head">
              <h2>About</h2>
              <span className="num">§01</span>
            </div>
            <Reveal>
              <div className="about-grid">
                <div className="about-body">
                  {ABOUT.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                <aside className="about-aside">
                  <dl>
                    <div>
                      <dt>Currently</dt>
                      <dd>Final year, BEng Mechanical Engineering</dd>
                    </div>
                    <div>
                      <dt>Leading</dt>
                      <dd>Northumbria Formula Student</dd>
                    </div>
                    <div>
                      <dt>Seeking</dt>
                      <dd>Race engineering, 2027 graduate intake</dd>
                    </div>
                    <div>
                      <dt>Based</dt>
                      <dd>Newcastle-upon-Tyne, UK</dd>
                    </div>
                  </dl>
                </aside>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Work */}
        <section className="section" id="work">
          <div className="wrap">
            <div className="section-head">
              <h2>Selected work</h2>
              <span className="num">§02</span>
            </div>
            <div className="work-list">
              {WORK.map((w) => (
                <Reveal key={w.id}>
                  <article className={`work-item ${w.featured ? "featured" : ""}`}>
                    <div className="work-media">
                      <img src={w.image} alt={w.title} />
                    </div>
                    <div className="work-body">
                      <div className="work-meta">
                        <span>N°{w.id}</span>
                        <span className="role">{w.role}</span>
                        <span>{w.period}</span>
                      </div>
                      <h3>{w.title}</h3>
                      {w.body.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                      <div className="work-tags">
                        {w.tags.map((t) => (
                          <span className="work-tag" key={t}>{t}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="section" id="capabilities">
          <div className="wrap">
            <div className="section-head">
              <h2>Capabilities</h2>
              <span className="num">§03</span>
            </div>
            <Reveal>
              <div className="caps-grid">
                {CAPABILITIES.map((c) => (
                  <div className="cap-group" key={c.group}>
                    <h3>{c.group}</h3>
                    <ul>
                      {c.items.map((it) => (
                        <li key={it.name}>
                          {it.name}<span className="sub">— {it.sub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Experience & Education */}
        <section className="section" id="experience">
          <div className="wrap">
            <div className="section-head">
              <h2>Experience & Education</h2>
              <span className="num">§04</span>
            </div>
            <div className="timeline">
              {TIMELINE.map((t, i) => (
                <Reveal key={i} delay={i * 30}>
                  <div className="tl-item">
                    <div className="tl-when">{t.when}</div>
                    <div className="tl-body">
                      <h3>{t.title}</h3>
                      <div className="org">{t.org}</div>
                      <p>{t.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Writing */}
        <section className="section" id="writing">
          <div className="wrap">
            <div className="section-head">
              <h2>Writing</h2>
              <span className="num">§05</span>
            </div>
            <Reveal>
              <div className="writing-card">
                <div>
                  <div className="tag">Essay — In progress</div>
                  <h3>A War By Any Other Name</h3>
                  <p>
                    An essay on grey zone warfare — the space between diplomacy and open conflict where
                    modern state competition increasingly takes place. Examines contemporary case studies
                    and the policy responses they invite.
                  </p>
                </div>
                <a href="#" className="cta" onClick={(e) => e.preventDefault()}>Read (PDF) →</a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Contact */}
        <section className="contact" id="contact">
          <div className="contact-inner">
            <Reveal>
              <h2>Let's <span className="accent">talk.</span></h2>
              <p className="contact-body">
                I'm actively looking for graduate race engineering opportunities for the 2027 intake,
                and open to conversations about internships, projects, or anything adjacent.
                The quickest way to reach me is by email.
              </p>
              <div className="contact-methods">
                <a className="contact-method" href="mailto:me@ianmungwadzi.com">
                  <span className="cm-label">Email</span>
                  <span className="cm-value">me@ianmungwadzi.com</span>
                  <span className="cm-arrow">→</span>
                </a>
                <a className="contact-method" href="https://www.linkedin.com/in/ian-mungwadzi-/" target="_blank" rel="noreferrer">
                  <span className="cm-label">LinkedIn</span>
                  <span className="cm-value">/in/ian-mungwadzi-</span>
                  <span className="cm-arrow">↗</span>
                </a>
                <a className="contact-method" href="https://github.com/Ian-Mungwadzi" target="_blank" rel="noreferrer">
                  <span className="cm-label">GitHub</span>
                  <span className="cm-value">/Ian-Mungwadzi</span>
                  <span className="cm-arrow">↗</span>
                </a>
                <a className="contact-method" href="/cv.pdf" download>
                  <span className="cm-label">CV</span>
                  <span className="cm-value">Download PDF</span>
                  <span className="cm-arrow">↓</span>
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="wrap">
            <div className="footer-inner">
              <div className="credit">
                © 2026 Ian Mungwadzi — Built with <a href="https://react.dev" target="_blank" rel="noreferrer">React</a> and <a href="https://vercel.com" target="_blank" rel="noreferrer">Vercel</a>.
              </div>
              <div className="eva-easter">
                <a href="https://eva.ianmungwadzi.com" target="_blank" rel="noreferrer">
                  → Also: a stylised variant of this site (弐号機)
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
