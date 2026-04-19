"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import s from "./page.module.css";

/* ─── Types ─── */

interface Citation {
  title: string;
  url: string;
  publisher?: string;
  document_type?: string;
  updated_at?: string;
}

interface Message {
  role: "user" | "assistant" | "error";
  text: string;
  citation?: Citation;
  latency_ms?: number;
}

/* ─── Constants ─── */

const exampleQuestions = [
  "What is the expense ratio of Groww Large Cap Fund?",
  "What is the lock-in period for Groww ELSS Tax Saver Fund?",
  "How do I download my capital gains statement?",
  "What is the minimum SIP amount for Groww Nifty 50 ETF?",
];

/* ─── Component ─── */

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

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

  /* Auto-resize textarea */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const sendMessage = async (question?: string) => {
    const q = (question ?? input).trim();
    if (!q || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json();

      if (data.status === "answer" || data.status === "refusal" || data.status === "insufficient_data" || data.status === "error") {
        setMessages((prev) => [
          ...prev,
          {
            role: data.status === "error" ? "error" : "assistant",
            text: data.answer || "Something went wrong. Please try again.",
            citation: data.citation,
            latency_ms: data.latency_ms,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "error",
            text: data.answer || "Something went wrong. Please try again.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "error", text: "Network error — please check your connection." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className={s.page}>
      {/* ─── HEADER ─── */}
      <header className={s.chatHeader}>
        <div className={s.headerLeft}>
          <Link href="/" prefetch={false} className={s.backLink} aria-label="Back to home">
            ←
          </Link>
          <div className={s.headerBrand}>
            <span className={s.headerLogoMark}>FI</span>
            <span className={s.headerTitle}>FundIntel</span>
          </div>
        </div>
        <div className={s.headerRight}>
          <button
            className={s.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle light/dark mode"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <div className={s.statusPill}>
            <span className={s.statusDot} />
            Online
          </div>
        </div>
      </header>

      {/* ─── EMPTY STATE ─── */}
      {isEmpty && !loading && (
        <div className={s.emptyState}>
          <div className={s.emptyIcon}>
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
          </div>
          <h1 className={s.emptyTitle}>What would you like to know?</h1>
          <p className={s.emptySubtitle}>
            Ask about expense ratios, exit loads, SIP minimums, lock-in periods
            — all sourced from official documents.
          </p>
          <div className={s.suggestions}>
            {exampleQuestions.map((q, i) => (
              <button
                key={i}
                className={s.suggestion}
                onClick={() => sendMessage(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── MESSAGES ─── */}
      {!isEmpty && (
        <div className={s.messagesArea}>
          <div className={s.messagesInner}>
            {messages.map((msg, i) => {
              if (msg.role === "user") {
                return (
                  <div key={i} className={s.userRow}>
                    <div className={s.userBubble}>{msg.text}</div>
                  </div>
                );
              }

              if (msg.role === "error") {
                return (
                  <div key={i} className={s.assistantRow}>
                    <div className={s.errorBubble}>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                );
              }

              return (
                <div key={i} className={s.assistantRow}>
                  <div className={s.assistantBubble}>
                    <p>{msg.text}</p>
                  </div>
                  {msg.citation?.url && (
                    <a
                      href={msg.citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={s.citationCard}
                    >
                      <span className={s.citationIcon}>📄</span>
                      <div className={s.citationBody}>
                        <span className={s.citationTitle}>
                          {msg.citation.title}
                        </span>
                        <span className={s.citationMeta}>
                          {[
                            msg.citation.publisher,
                            msg.citation.document_type,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                          {msg.citation.updated_at &&
                            ` · ${msg.citation.updated_at}`}
                        </span>
                      </div>
                    </a>
                  )}
                  {msg.latency_ms != null && (
                    <span className={s.latencyTag}>
                      ⚡ {msg.latency_ms}ms
                    </span>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className={s.assistantRow}>
                <div className={s.loadingDots}>
                  <span className={s.loadingDot} />
                  <span className={s.loadingDot} />
                  <span className={s.loadingDot} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>
      )}

      {/* ─── INPUT BAR ─── */}
      <div className={s.inputBar}>
        <div className={s.inputInner}>
          <textarea
            ref={inputRef}
            className={`${s.inputField} ${input ? s.inputFieldHasValue : ""}`}
            placeholder="Ask a mutual fund question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className={s.sendButton}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            aria-label="Send message"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
