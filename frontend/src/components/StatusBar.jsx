import { useEffect, useState } from 'react';
import { getTaskStats } from '../api/taskApi';
import Spinner from './Spinner';
import styles from './StatusBar.module.css';

const STATUS_CONFIG = [
  { key: 'OPEN', label: 'OPEN', color: '#28a745' },
  { key: 'IN_PROGRESS', label: 'IN_PROGRESS', color: '#007bff' },
  { key: 'CLOSED', label: 'CLOSED', color: '#6c757d' },
];

export default function StatusBar({ refreshTrigger, onError }) {
  const [stats, setStats] = useState({ OPEN: 0, IN_PROGRESS: 0, CLOSED: 0, TOTAL: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data } = await getTaskStats();
        setStats(data);
      } catch (err) {
        if (onError) {
          onError(err.response?.data?.message || 'Failed to load statistics');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [refreshTrigger, onError]);

  const { TOTAL } = stats;

  if (loading) {
    return (
      <div className={styles.bar}>
        <Spinner size="small" />
      </div>
    );
  }

  return (
    <div className={styles.bar}>
      {STATUS_CONFIG.map(({ key, label, color }) => {
        const count = stats[key] || 0;
        const pct = TOTAL > 0 ? (count / TOTAL) * 100 : 0;
        return (
          <div key={key} className={styles.item}>
            <span className={styles.label}>{label}: {count}</span>
            <div className={styles.track}>
              <div
                className={styles.fill}
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
