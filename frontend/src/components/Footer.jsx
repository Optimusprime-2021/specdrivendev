import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        &copy; {new Date().getFullYear()} Task Management System
      </p>
    </footer>
  );
}
