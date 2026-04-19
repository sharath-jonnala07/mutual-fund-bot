import styles from "./assistant-preview.module.css";

export default function AssistantPreview() {
  return (
    <section className={styles.preview} aria-label="Assistant preview">
      <div className={styles.card}>
        <p className={styles.label}>FundIntel preview</p>
        <p className={styles.text}>
          Ask about expense ratios, exit loads, SIP minimums, and other
          verified mutual fund facts.
        </p>
      </div>
    </section>
  );
}
