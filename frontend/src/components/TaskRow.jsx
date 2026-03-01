import { useState } from 'react';
import Spinner from './Spinner';
import ConfirmDialog from './ConfirmDialog';
import styles from './TaskRow.module.css';

const STATUS_CLASSES = {
  OPEN: styles.badgeOpen,
  IN_PROGRESS: styles.badgeInProgress,
  CLOSED: styles.badgeClosed,
};

export default function TaskRow({ task, onAssign, onUnassign, onClose, isActionLoading }) {
  const [assignee, setAssignee] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAssign = () => {
    onAssign(task.id, assignee.trim());
    if (assignee.trim()) {
      setAssignee('');
    }
  };

  const handleCloseClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmClose = () => {
    setShowConfirm(false);
    onClose(task.id);
  };

  return (
    <>
      <tr className={styles.row}>
        <td className={styles.cell}>{task.id}</td>
        <td className={styles.cell}>{task.title}</td>
        <td className={styles.cell}>
          <span className={`${styles.badge} ${STATUS_CLASSES[task.status]}`}>
            {task.status}
          </span>
        </td>
        <td className={styles.cell}>{task.priority}</td>
        <td className={styles.cell}>{task.assignee || '—'}</td>
        <td className={styles.cell}>
          <div className={styles.actions}>
            {isActionLoading ? (
              <Spinner size="small" />
            ) : (
              <>
                <div className={styles.assignGroup}>
                  <input
                    className={styles.assignInput}
                    type="text"
                    placeholder="Assignee"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    disabled={isActionLoading}
                  />
                  <button
                    className={styles.actionBtn}
                    onClick={handleAssign}
                    disabled={isActionLoading}
                  >
                    Assign
                  </button>
                </div>
                {task.assignee && (
                  <button
                    className={`${styles.actionBtn} ${styles.unassignBtn}`}
                    onClick={() => onUnassign(task.id)}
                    disabled={isActionLoading}
                  >
                    Unassign
                  </button>
                )}
                {task.status !== 'CLOSED' && (
                  <button
                    className={`${styles.actionBtn} ${styles.closeBtn}`}
                    onClick={handleCloseClick}
                    disabled={isActionLoading}
                  >
                    Close
                  </button>
                )}
              </>
            )}
          </div>
        </td>
      </tr>
      <ConfirmDialog
        isOpen={showConfirm}
        message="Are you sure you want to close this task?"
        onConfirm={handleConfirmClose}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
