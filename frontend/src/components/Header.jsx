import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Task Management</h1>
      <p className={styles.tagline}>Organize, track, and complete your work</p>
    </header>
  );
}
