import styles from './Pagination.module.css';

export default function Pagination({ page, totalPages, onPageChange }) {
  const isFirst = page === 0;
  const isLast = page >= totalPages - 1;

  return (
    <div className={styles.pagination}>
      <button
        className={styles.button}
        disabled={isFirst}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className={styles.label}>
        Page {page + 1} of {Math.max(totalPages, 1)}
      </span>
      <button
        className={styles.button}
        disabled={isLast}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
