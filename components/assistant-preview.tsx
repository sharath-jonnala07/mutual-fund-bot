"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./assistant-preview.module.css";

type ApiCitation = {
  title: string;
  url: string;
  publisher: string;
  document_type: string;
  updated_at: string;
};

type ApiResponse = {
  status: "answer" | "refusal" | "insufficient_data" | "error";
  answer: string;
  citation?: ApiCitation | null;
  last_updated_from_sources?: string;
  refusal_reason?: string | null;
  error_code?: string | null;
  latency_ms?: number | null;
};

type BadgeType = "fact" | "process" | "declined" | "warning" | "error" | "setup";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  badge?: string;
  badgeType?: BadgeType;
  citation?: ApiCitation | null;
  sourceDate?: string;
  isPending?: boolean;
  canRetry?: boolean;
};

const exampleQuestions = [
  "What is the expense ratio of Groww Large Cap Fund?",
  "What is the lock-in period for Groww ELSS Tax Saver Fund?",
  "How do I download my capital gains statement?",
];

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    text:
      "Ask about Groww Large Cap Fund, Groww ELSS Tax Saver Fund, Groww Banking and Financial Services Fund, or Groww Nifty 50 Index Fund and I will answer from indexed official sources only.",
    badge: "Ready for official facts",
    badgeType: "fact",
  },
];

const badgeConfig: Record<ApiResponse["status"], { label: string; type: BadgeType }> = {
  answer: { label: "Factual answer", type: "fact" },
  refusal: { label: "Query declined", type: "declined" },
  insufficient_data: { label: "Need narrower source", type: "warning" },
  error: { label: "Service unavailable", type: "error" },
};

function buildAssistantMessage(data: ApiResponse, id: string): Message {
  const config =
    data.error_code === "corpus_not_indexed"
      ? { label: "Corpus setup needed", type: "setup" as const }
      : badgeConfig[data.status];

  const sourceDate =
    data.error_code === "corpus_not_indexed"
      ? "Add verified sources and run ingestion to unlock answers."
      : data.last_updated_from_sources;

  return {
    id,
    role: "assistant",
    text: data.answer,
    badge: config.label,
    badgeType: config.type,
    citation: data.citation,
    sourceDate,
    canRetry: data.status === "error" && data.error_code !== "corpus_not_indexed",
  };
}

export function AssistantPreview() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  async function submitQuestion(rawQuestion: string) {
    const trimmed = rawQuestion.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const userId = crypto.randomUUID();
    const pendingId = crypto.randomUUID();

    setQuestion("");
    setIsLoading(true);
    setLastQuestion(trimmed);
    setMessages((current) => [
      ...current,
      {
        id: userId,
        role: "user",
        text: trimmed,
      },
      {
        id: pendingId,
        role: "assistant",
        text: "Searching the indexed official documents…",
        badge: "Retrieving sources",
        badgeType: "process",
        isPending: true,
      },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: trimmed }),
      });

      const data = (await response.json()) as ApiResponse;
      const nextMessage = buildAssistantMessage(data, pendingId);

      setMessages((current) =>
        current.map((message) => (message.id === pendingId ? nextMessage : message)),
      );
    } catch {
      setMessages((current) =>
        current.map((message) =>
          message.id === pendingId
            ? {
                id: pendingId,
                role: "assistant",
                text:
                  "The assistant could not reach the FastAPI microservice. Start the backend or check the proxy configuration and try again.",
                badge: "Service unavailable",
                badgeType: "error",
                canRetry: true,
              }
            : message,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitQuestion(question);
  }

  return (
    <div className={styles.preview}>
      <div className={styles.previewHeader}>
        <div className={styles.windowDots}>
          <span className={styles.dotRed} />
          <span className={styles.dotYellow} />
          <span className={styles.dotGreen} />
        </div>
        <span className={styles.previewTitle}>FundIntel Assistant</span>
        <span className={styles.previewLive}>Live assistant</span>
      </div>

      <div className={styles.welcomePanel}>
        <div>
          <p className={styles.welcomeEyebrow}>Mutual Fund FAQ assistant</p>
          <h3 className={styles.welcomeTitle}>Ask a real question against the RAG service</h3>
          <p className={styles.welcomeText}>
            Every supported answer returns one official source. Scope is limited to four
            Groww schemes, and advice, performance, and personal-data requests are declined.
          </p>
        </div>
        <div className={styles.promptRail}>
          {exampleQuestions.map((prompt) => (
            <button
              key={prompt}
              className={styles.promptButton}
              type="button"
              onClick={() => void submitQuestion(prompt)}
              disabled={isLoading}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.conversation}>
        <div className={styles.conversationInner}>
          <AnimatePresence initial={false}>
            {messages.map((message) =>
              message.role === "user" ? (
                <motion.div
                  key={message.id}
                  className={styles.userMsg}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className={styles.userBubble}>
                    <p>{message.text}</p>
                  </div>
                  <span className={styles.userAvatar}>You</span>
                </motion.div>
              ) : (
                <motion.div
                  key={message.id}
                  className={styles.aiMsg}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24 }}
                >
                  {message.badge && message.badgeType && (
                    <span className={`${styles.aiBadge} ${styles[`badge_${message.badgeType}`]}`}>
                      {message.badge}
                    </span>
                  )}
                  <div className={styles.aiTextWrap}>
                    <p className={styles.aiText}>{message.text}</p>
                    {message.isPending && (
                      <span className={styles.pendingDots} aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </span>
                    )}
                  </div>

                  {message.citation && (
                    <a
                      className={styles.citation}
                      href={message.citation.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className={styles.citationIcon}>↗</span>
                      <span className={styles.citationLink}>{message.citation.title}</span>
                      <span className={styles.citationDate}>{message.sourceDate ?? message.citation.updated_at}</span>
                    </a>
                  )}

                  {!message.citation && message.sourceDate && (
                    <div className={styles.metaLine}>{message.sourceDate}</div>
                  )}

                  {message.canRetry && lastQuestion && !isLoading && (
                    <button
                      className={styles.retryButton}
                      type="button"
                      onClick={() => void submitQuestion(lastQuestion)}
                    >
                      Retry last question
                    </button>
                  )}
                </motion.div>
              ),
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>
      </div>

      <form className={styles.composer} onSubmit={handleSubmit}>
        <label className={styles.composerLabel} htmlFor="fundintel-question">
          Facts-only. No investment advice.
        </label>
        <div className={styles.composerRow}>
          <input
            id="fundintel-question"
            className={styles.composerInput}
            placeholder="Ask about expense ratio, exit load, minimum SIP, lock-in, benchmark, or statements for the supported Groww schemes"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            disabled={isLoading}
          />
          <button className={styles.sendButton} type="submit" disabled={isLoading || !question.trim()}>
            {isLoading ? "Working…" : "Send"}
          </button>
        </div>
      </form>

      <div className={styles.previewFooter}>
        <span className={styles.footerPill}>Facts only</span>
        <span className={styles.footerDot} />
        <span className={styles.footerPill}>No investment advice</span>
        <span className={styles.footerDot} />
        <span className={styles.footerPill}>One official citation per answer</span>
      </div>
    </div>
  );
}
