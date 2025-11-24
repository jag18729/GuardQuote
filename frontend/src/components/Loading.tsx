import styles from "./Loading.module.css";

export default function Loading() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.glowCircle}></div>
      <div className={styles.loader}></div>
      <h2 className={styles.message}>Analyzing your security needs...</h2>
      <p className={styles.subtext}>We're crafting a tailored recommendation...</p>
    </div>
  );
}
