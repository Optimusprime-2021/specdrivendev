import TaskRow from './TaskRow';
import styles from './TaskTable.module.css';

export default function TaskTable({ tasks, onAssign, onUnassign, onClose, actionLoading }) {
  if (!tasks || tasks.length === 0) {
    return <p className={styles.empty}>No tasks found</p>;
  }

  return (
    <div className={styles.wrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.header}>ID</th>
          <th className={styles.header}>Title</th>
          <th className={styles.header}>Status</th>
          <th className={styles.header}>Priority</th>
          <th className={styles.header}>Assignee</th>
          <th className={styles.header}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onAssign={onAssign}
            onUnassign={onUnassign}
            onClose={onClose}
            isActionLoading={!!actionLoading[task.id]}
          />
        ))}
      </tbody>
    </table>
    </div>
  );
}
