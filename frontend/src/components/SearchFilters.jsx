import { useState } from 'react';
import styles from './SearchFilters.module.css';

const STATUSES = ['OPEN', 'IN_PROGRESS', 'CLOSED'];
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export default function SearchFilters({ onSearch }) {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch({
      keyword: keyword.trim() || undefined,
      status: status || undefined,
      priority: priority || undefined,
    });
  };

  return (
    <form className={styles.bar} onSubmit={handleSearch}>
      <input
        className={styles.input}
        type="text"
        placeholder="Search by keyword..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <select
        className={styles.select}
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <select
        className={styles.select}
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="">All Priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      <button className={styles.button} type="submit">Search</button>
    </form>
  );
}
