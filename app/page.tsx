"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AssistantPreview } from "../components/assistant-preview";
import styles from "./page.module.css";

/* ── Data ── */

const stats = [
  { value: "25+", label: "Official sources indexed" },
  { value: "<3s", label: "Average response time" },
  { value: "100%", label: "Cited answers" },
];

const features = [
  {
    icon: "📊",
    title: "Expense ratios & fees",
    description:
      "Get exact expense ratios, exit loads, and fee structures pulled directly from official scheme documents.",
  },
  {
    icon: "🔒",
    title: "ELSS & lock-in details",
    description:
      "Understand lock-in periods, tax-saving eligibility, and redemption rules for ELSS and other scheme types.",
  },
  {
    icon: "💰",
    title: "SIP & investment minimums",
    description:
      "Find minimum SIP amounts, lumpsum requirements, and additional purchase thresholds instantly.",
  },
  {
    icon: "📈",
    title: "Benchmarks & risk ratings",
    description:
      "Access riskometer categories, benchmark indices, and fund classification details from SEBI filings.",
  },
  {
    icon: "📄",
    title: "Statement & tax documents",
    description:
      "Step-by-step guidance on downloading capital gains statements, account summaries, and tax documents.",
  },
  {
    icon: "🛡️",
    title: "Safe & transparent",
    description:
      "No personal data collected. No investment advice given. Every answer links back to its official source.",
  },
];

const steps = [
  {
    number: "01",
    title: "Ask a question",
    description:
      "Type any factual question about mutual fund schemes — expense ratios, exit loads, SIP minimums, or tax documents.",
  },
  {
    number: "02",
    title: "Get a cited answer",
    description:
      "Receive a clear, concise answer sourced from official AMC factsheets, SEBI filings, and AMFI records.",
  },
  {
    number: "03",
    title: "Verify the source",
    description:
      "Every response includes a direct link to the official document so you can verify the information yourself.",
  },
];

const trustPoints = [
  "Answers sourced exclusively from official AMC, SEBI, and AMFI documents",
  "No personal information collected — no PAN, Aadhaar, or account details",
  "No investment advice or buy/sell recommendations, ever",
  "Every answer includes a verifiable source link",
  "No return calculations or performance comparisons",
  "Opinionated questions are politely declined with helpful redirects",
];

/* ── Animation variants ── */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.5 } },
};

const stagger = (delay = 0) => ({
  hidden: {},
  show:   { transition: { staggerChildren: 0.09, delayChildren: delay } },
});

const cardHover = {
  rest:  { y: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  hover: { y: -5, boxShadow: "0 12px 36px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,208,156,0.2)", transition: { duration: 0.22, ease: "easeOut" } },
};

/* ── Scroll-reveal hook ── */
function useFadeIn(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: threshold });
  return { ref, inView };
}

/* ══════════════════════════════════════════════════ */

export default function Home() {
  const { ref: featRef, inView: featIn } = useFadeIn();
  const { ref: stepsRef, inView: stepsIn } = useFadeIn();
  const { ref: assistRef, inView: assistIn } = useFadeIn();
  const { ref: trustRef, inView: trustIn } = useFadeIn();
  const { scrollY } = useScroll();
  const floatingBotOpacity = useTransform(scrollY, [120, 280], [0, 1]);
  const floatingBotY = useTransform(scrollY, [120, 280], [24, 0]);

  return (
    <main className={styles.page}>

      {/* ── HEADER ── */}
      <motion.header
        className={styles.header}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className={styles.headerInner}>
          <a className={styles.logo} href="#top">
            <span className={styles.logoMark}>F</span>
            <span className={styles.logoText}>FundIntel</span>
          </a>

          <nav className={styles.nav} aria-label="Primary">
            {["Features", "How it works", "Try it", "Trust & safety"].map((label, i) => (
              <motion.a
                key={label}
                href={`#${["features","how-it-works","assistant","trust"][i]}`}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
              >
                {label}
              </motion.a>
            ))}
          </nav>

          <motion.a
            className={styles.headerCta}
            href="#assistant"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            Try the assistant
          </motion.a>
        </div>
      </motion.header>

      {/* ── HERO ── */}
      <section className={styles.hero} id="top">
        <div className={styles.heroBackground}>
          <div className={styles.heroOrb1} />
          <div className={styles.heroOrb2} />
          <div className={styles.heroOrb3} />
          <div className={styles.heroGrid} />
          <div className={styles.heroNoise} />
        </div>

        <div className={styles.heroInner}>
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            animate="show"
            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
          >
            <motion.div className={styles.heroBadge} variants={fadeUp}>
              <span className={styles.badgeDot} />
              Powered by official AMC &amp; SEBI documents
            </motion.div>

            <motion.h1 className={styles.heroTitle} variants={fadeUp}>
              Instant answers to your
              <br />
              <span className={styles.heroHighlight}>mutual fund questions</span>
            </motion.h1>

            <motion.p className={styles.heroSubtitle} variants={fadeUp}>
              Ask about expense ratios, exit loads, SIP minimums, ELSS lock-in periods, and more.
              Every answer is sourced from official documents and includes a citation you can verify.
            </motion.p>

            <motion.div className={styles.heroActions} variants={fadeUp}>
              <a className={styles.ctaPrimary} href="#assistant">
                Ask a question
                <span className={styles.ctaArrow}>→</span>
              </a>
              <a className={styles.ctaSecondary} href="#how-it-works">
                See how it works
              </a>
            </motion.div>

            <motion.div className={styles.heroChips} variants={fadeUp}>
              {[
                { label: "Expense ratio", value: "0.22%", change: "Direct plan", up: true },
                { label: "Min SIP", value: "₹100", change: "Nifty 50 Index", up: true },
                { label: "ELSS lock-in", value: "3 years", change: "Tax saving", up: null },
                { label: "Exit load", value: "Nil", change: "After 1Y", up: true },
              ].map((chip, i) => (
                <motion.div
                  key={chip.label}
                  className={styles.chip}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.85 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
                >
                  <span className={styles.chipDot} />
                  <span className={styles.chipLabel}>{chip.label}</span>
                  <span className={styles.chipValue}>{chip.value}</span>
                  {chip.up === true && <span className={styles.chipUp}>↑</span>}
                </motion.div>
              ))}
            </motion.div>

            <motion.div className={styles.statsRow} variants={fadeUp}>
              {stats.map((stat, i) => (
                <motion.div
                  className={styles.statItem}
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1, duration: 0.45 }}
                >
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <motion.section
        className={styles.trustBar}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <div className={styles.trustBarInner}>
          {[
            "Official AMC factsheets",
            "SEBI scheme documents",
            "AMFI regulatory records",
            "Zero personal data collected",
          ].map((item, i) => (
            <span key={item} style={{ display: "contents" }}>
              {i > 0 && <span className={styles.trustDivider} />}
              <span className={styles.trustTag}>
                <span className={styles.trustTagDot} />
                {item}
              </span>
            </span>
          ))}
        </div>
      </motion.section>

      {/* ── FEATURES ── */}
      <section className={styles.section} id="features">
        <div className={styles.sectionInner} ref={featRef}>
          <motion.div
            className={styles.sectionHeaderCenter}
            variants={stagger(0)}
            initial="hidden"
            animate={featIn ? "show" : "hidden"}
          >
            <motion.span className={styles.sectionLabel} variants={fadeUp}>Features</motion.span>
            <motion.h2 className={styles.sectionTitle} variants={fadeUp}>
              Everything you need to know about your mutual fund schemes
            </motion.h2>
            <motion.p className={styles.sectionSubtitle} variants={fadeUp}>
              From fees and lock-in periods to statements and risk ratings — get
              fact-checked answers in seconds, not hours of document searching.
            </motion.p>
          </motion.div>

          <motion.div
            className={styles.featureGrid}
            variants={stagger(0.05)}
            initial="hidden"
            animate={featIn ? "show" : "hidden"}
          >
            {features.map((f) => (
              <motion.article
                className={styles.featureCard}
                key={f.title}
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <span className={styles.featureIconWrap}>{f.icon}</span>
                <h3 className={styles.featureCardTitle}>{f.title}</h3>
                <p className={styles.featureCardText}>{f.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className={styles.sectionAlt} id="how-it-works">
        <div className={styles.sectionInner} ref={stepsRef}>
          <motion.div
            className={styles.sectionHeaderCenter}
            variants={stagger(0)}
            initial="hidden"
            animate={stepsIn ? "show" : "hidden"}
          >
            <motion.span className={styles.sectionLabel} variants={fadeUp}>How it works</motion.span>
            <motion.h2 className={styles.sectionTitle} variants={fadeUp}>
              Get verified answers in three simple steps
            </motion.h2>
          </motion.div>

          <motion.div
            className={styles.stepsGrid}
            variants={stagger(0.1)}
            initial="hidden"
            animate={stepsIn ? "show" : "hidden"}
          >
            {steps.map((step) => (
              <motion.article
                className={styles.stepCard}
                key={step.number}
                variants={fadeUp}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.description}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── ASSISTANT PREVIEW ── */}
      <section className={styles.section} id="assistant">
        <div className={styles.sectionInner} ref={assistRef}>
          <motion.div
            className={styles.sectionHeaderCenter}
            variants={stagger(0)}
            initial="hidden"
            animate={assistIn ? "show" : "hidden"}
          >
            <motion.span className={styles.sectionLabel} variants={fadeUp}>Try it now</motion.span>
            <motion.h2 className={styles.sectionTitle} variants={fadeUp}>
              See how FundIntel answers your questions
            </motion.h2>
            <motion.p className={styles.sectionSubtitle} variants={fadeUp}>
              Select an example question below or explore the different types of
              queries the assistant can handle.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={assistIn ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <AssistantPreview />
          </motion.div>
        </div>
      </section>

      {/* ── TRUST & SAFETY ── */}
      <section className={styles.sectionAlt} id="trust">
        <div className={styles.sectionInner} ref={trustRef}>
          <div className={styles.trustGrid}>
            <motion.div
              className={styles.trustContent}
              variants={stagger(0)}
              initial="hidden"
              animate={trustIn ? "show" : "hidden"}
            >
              <motion.span className={styles.sectionLabel} variants={fadeUp}>Trust &amp; safety</motion.span>
              <motion.h2 className={styles.sectionTitle} variants={fadeUp}>
                Built with transparency at every layer
              </motion.h2>
              <motion.p className={styles.sectionSubtitle} variants={fadeUp}>
                FundIntel is designed to give you facts, not opinions.
                Your privacy and trust are non-negotiable.
              </motion.p>
            </motion.div>

            <motion.div
              className={styles.trustList}
              variants={stagger(0.07)}
              initial="hidden"
              animate={trustIn ? "show" : "hidden"}
            >
              {trustPoints.map((point) => (
                <motion.div
                  className={styles.trustItem}
                  key={point}
                  variants={fadeUp}
                  whileHover={{ x: 4, transition: { duration: 0.18 } }}
                >
                  <span className={styles.checkIcon}>✓</span>
                  <p>{point}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerTop}>
            <div>
              <a className={styles.footerBrandLogo} href="#top">
                <span className={styles.footerLogoMark}>F</span>
                <span className={styles.footerLogoText}>FundIntel</span>
              </a>
              <p className={styles.footerTagline}>
                Facts-only mutual fund intelligence.
                <br />
                No advice. No personal data. Just answers.
              </p>
            </div>
            <nav className={styles.footerNav}>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#assistant">Try the assistant</a>
              <a href="#trust">Trust &amp; safety</a>
            </nav>
          </div>

          <div className={styles.footerDivider} />

          <div className={styles.footerBottom}>
            <p className={styles.disclaimer}>
              FundIntel provides factual information sourced from official AMC, SEBI,
              and AMFI documents. This is not investment advice. Mutual fund investments
              are subject to market risks. Please read all scheme-related documents
              carefully before investing. Past performance is not indicative of future results.
            </p>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} FundIntel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <motion.a
        className={styles.floatingBot}
        href="#assistant"
        aria-label="Open the FundIntel assistant"
        style={{ opacity: floatingBotOpacity, y: floatingBotY }}
        initial={{ opacity: 0, y: 24 }}
      >
        <span className={styles.floatingBotIcon}>◎</span>
        <span className={styles.floatingBotTextWrap}>
          <span className={styles.floatingBotLabel}>Chat now</span>
          <span className={styles.floatingBotText}>Open FundIntel assistant</span>
        </span>
      </motion.a>

    </main>
  );
}
