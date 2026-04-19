"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import s from "./page.module.css";

/* ─── Data ─── */

const stats = [
  { value: "25+", label: "Official sources indexed" },
  { value: "<3s", label: "Average response time" },
  { value: "100%", label: "Cited answers" },
];

const features = [
  {
    icon: "📊",
    title: "Live Expense Ratios",
    text: "Get exact expense ratios sourced from official AMC fact sheets — no estimation, no guesswork.",
  },
  {
    icon: "🔒",
    title: "ELSS & Lock-in Periods",
    text: "Instantly know lock-in periods and tax-saving eligibility with direct SEBI citations.",
  },
  {
    icon: "💰",
    title: "SIP Minimums & Limits",
    text: "Minimum SIP amounts, lumpsum thresholds, and transaction limits — straight from the source.",
  },
  {
    icon: "📈",
    title: "Benchmark Comparisons",
    text: "Which index does your fund track? Performance benchmarks cited from official fund documents.",
  },
  {
    icon: "📄",
    title: "Statements & Downloads",
    text: "Step-by-step guidance for CAS, capital gains, and account statements from AMFI & AMCs.",
  },
  {
    icon: "🛡️",
    title: "Safe & Transparent",
    text: "Every answer includes a citation. No hallucinations — if we don't have the data, we say so.",
  },
];

const steps = [
  {
    num: "01",
    title: "Ask any question",
    text: "Type a question about any Groww mutual fund — expense ratios, exit loads, SIP minimums, or anything else.",
  },
  {
    num: "02",
    title: "Get a cited answer",
    text: "Receive a precise answer backed by an official AMC, SEBI, or AMFI document with a clickable citation.",
  },
  {
    num: "03",
    title: "Verify the source",
    text: "Click the citation link to view the original document yourself — full transparency, zero guesswork.",
  },
];

const trustPoints = [
  "Every answer cites an official AMC, SEBI, or AMFI source document.",
  "Expense ratios, exit loads, lock-in periods — all sourced from official fact sheets.",
  "If the information isn't in our verified database, we'll tell you instead of guessing.",
  "No user data is stored. Your queries are processed in real-time and never logged.",
  "Built on retrieval-augmented generation — answers are grounded in documents, not imagination.",
  "Sources are refreshed regularly so you always get up-to-date information.",
];

const chipData = [
  { value: "0.44%", label: "Groww Nifty 50 ER", up: false },
  { value: "24.31%", label: "Large Cap 1Y Return", up: true },
  { value: "₹100", label: "Min SIP Amount", up: false },
  { value: "0%", label: "Exit Load (ELSS)", up: false },
];

/* ─── Framer Motion variants ─── */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.08 },
  }),
};

/* ─── Page Component ─── */

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "dark" | "light" | null;
    if (saved === "dark") {
      setTheme("dark");
      document.documentElement.removeAttribute("data-theme");
    } else {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
    localStorage.setItem("theme", next);
  };

  return (
    <div className={s.page}>
      {/* ─── HEADER ─── */}
      <header className={s.header}>
        <div className={s.headerInner}>
          <div className={s.logo}>
            <span className={s.logoMark}>FI</span>
            <span className={s.logoText}>FundIntel</span>
          </div>
          <nav className={s.nav}>
            <a href="#features" className={s.navLink}>Features</a>
            <a href="#how-it-works" className={s.navLink}>How it works</a>
            <a href="#trust" className={s.navLink}>Trust</a>
          </nav>
          <div className={s.headerActions}>
            <button
              className={s.themeToggle}
              onClick={toggleTheme}
              aria-label="Toggle light/dark mode"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
            <Link href="/chat" className={s.headerCta}>
              Ask a question
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className={s.hero}>
        <div className={s.heroBackground}>
          <div className={s.heroOrb1} />
          <div className={s.heroOrb2} />
          <div className={s.heroOrb3} />
          <div className={s.heroOrb4} />
          <div className={s.heroGrid} />
          <div className={s.heroNoise} />
        </div>

        <div className={s.heroInner}>
          <motion.div
            className={s.heroBadge}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className={s.badgeDot} />
            AI-Powered Mutual Fund Intelligence
          </motion.div>

          <motion.h1
            className={s.heroTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Get{" "}
            <span className={s.heroHighlight}>Instant Answers</span>{" "}
            to Mutual Fund Questions
          </motion.h1>

          <motion.p
            className={s.heroSubtitle}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Expense ratios, exit loads, SIP minimums, and more — sourced
            directly from official AMC, SEBI, and AMFI documents with full
            citations.
          </motion.p>

          <motion.div
            className={s.heroActions}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/chat" className={s.ctaPrimary}>
              Start asking <span className={s.ctaArrow}>→</span>
            </Link>
            <a href="#features" className={s.ctaSecondary}>
              Learn more
            </a>
          </motion.div>

          {/* Glass stat chips */}
          <motion.div
            className={s.heroChips}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {chipData.map((c, i) => (
              <div key={i} className={s.chip}>
                <span className={s.chipDot} />
                <span className={s.chipValue}>{c.value}</span>
                <span className={s.chipLabel}>{c.label}</span>
                {c.up && <span className={s.chipUp}>▲</span>}
              </div>
            ))}
          </motion.div>

          {/* Stats row */}
          <motion.div
            className={s.statsRow}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {stats.map((st, i) => (
              <div key={i} className={s.statItem}>
                <span className={s.statValue}>{st.value}</span>
                <span className={s.statLabel}>{st.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <div className={s.trustBar}>
        <div className={s.trustBarInner}>
          <span className={s.trustTag}>
            <span className={s.trustTagDot} />
            Official AMC Data
          </span>
          <span className={s.trustDivider} />
          <span className={s.trustTag}>
            <span className={s.trustTagDot} />
            SEBI Verified
          </span>
          <span className={s.trustDivider} />
          <span className={s.trustTag}>
            <span className={s.trustTagDot} />
            AMFI Sourced
          </span>
          <span className={s.trustDivider} />
          <span className={s.trustTag}>
            <span className={s.trustTagDot} />
            No Data Stored
          </span>
          <span className={s.trustDivider} />
          <span className={s.trustTag}>
            <span className={s.trustTagDot} />
            Real-time Processing
          </span>
        </div>
      </div>

      {/* ─── FEATURES ─── */}
      <section id="features" className={s.section}>
        <div className={s.sectionInner}>
          <div className={s.sectionHeaderCenter}>
            <motion.span
              className={s.sectionLabel}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Features
            </motion.span>
            <motion.h2
              className={s.sectionTitle}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
            >
              Everything you need,{" "}
              <span className={s.heroHighlight}>nothing you don&apos;t</span>
            </motion.h2>
            <motion.p
              className={s.sectionSubtitle}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
            >
              Zero fluff. Zero guesswork. Only verified facts from official
              sources — delivered in seconds.
            </motion.p>
          </div>

          <div className={s.featureGrid}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                className={s.featureCard}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div className={s.featureIconWrap}>{f.icon}</div>
                <h3 className={s.featureCardTitle}>{f.title}</h3>
                <p className={s.featureCardText}>{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className={s.sectionAlt}>
        <div className={s.sectionInner}>
          <div className={s.sectionHeaderCenter}>
            <motion.span
              className={s.sectionLabel}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              How it works
            </motion.span>
            <motion.h2
              className={s.sectionTitle}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
            >
              Three steps to{" "}
              <span className={s.heroHighlight}>verified answers</span>
            </motion.h2>
          </div>

          <div className={s.stepsGrid}>
            {steps.map((st, i) => (
              <motion.div
                key={i}
                className={s.stepCard}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <span className={s.stepNumber}>{st.num}</span>
                <h3 className={s.stepTitle}>{st.title}</h3>
                <p className={s.stepText}>{st.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST SECTION ─── */}
      <section id="trust" className={s.section}>
        <div className={s.sectionInner}>
          <div className={s.trustGrid}>
            <div className={s.trustContent}>
              <motion.span
                className={s.sectionLabel}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                Trust & safety
              </motion.span>
              <motion.h2
                className={s.sectionTitle}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={1}
              >
                Built for{" "}
                <span className={s.heroHighlight}>accuracy</span>
              </motion.h2>
              <motion.p
                className={s.sectionSubtitle}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={2}
              >
                We don&apos;t hallucinate. If we don&apos;t know, we say so.
                Every answer comes with a verifiable citation.
              </motion.p>
            </div>

            <div className={s.trustList}>
              {trustPoints.map((t, i) => (
                <motion.div
                  key={i}
                  className={s.trustItem}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                >
                  <span className={s.checkIcon}>✓</span>
                  <p>{t}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className={`${s.section} ${s.ctaSection}`}>
        <div className={s.sectionInner}>
          <motion.div
            className={s.ctaCard}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className={s.ctaCardTitle}>
              Ready to get instant answers?
            </h2>
            <p className={s.ctaCardText}>
              Ask about expense ratios, exit loads, SIP minimums, lock-in
              periods, and more — all backed by official sources.
            </p>
            <div className={s.ctaCardActions}>
              <Link href="/chat" className={s.ctaPrimaryLarge}>
                Open FundIntel Chat <span className={s.ctaArrow}>→</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className={s.footer}>
        <div className={s.footerInner}>
          <div className={s.footerTop}>
            <div>
              <div className={s.footerBrandLogo}>
                <span className={s.footerLogoMark}>FI</span>
                <span className={s.footerLogoText}>FundIntel</span>
              </div>
              <p className={s.footerTagline}>
                AI-powered mutual fund intelligence. Verified facts from
                official AMC, SEBI &amp; AMFI documents.
              </p>
            </div>
            <nav className={s.footerNav}>
              <a href="#features">Features</a>
              <Link href="/chat">Chat</Link>
            </nav>
          </div>
          <div className={s.footerDivider} />
          <div className={s.footerBottom}>
            <p className={s.disclaimer}>
              Disclaimer: FundIntel provides information sourced from official
              documents for educational purposes only. This is not financial
              advice. Always verify with official sources and consult a
              qualified financial advisor before making investment decisions.
            </p>
            <p className={s.copyright}>
              © {new Date().getFullYear()} FundIntel — Mutual Fund Intelligence
            </p>
          </div>
        </div>
      </footer>

      {/* ─── FLOATING CHAT PILL ─── */}
      <Link href="/chat" className={s.floatingBot}>
        <span className={s.floatingBotIcon}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </span>
        <span className={s.floatingBotText}>Ask FundIntel</span>
      </Link>
    </div>
  );
}
