import { useState, useEffect, useCallback } from 'react';
import { searchTasks, assignTask, unassignTask, closeTask } from '../api/taskApi';
import SearchFilters from './SearchFilters';
import TaskTable from './TaskTable';
import Pagination from './Pagination';
import Spinner from './Spinner';
import styles from './TaskList.module.css';

export default function TaskList({ addToast, refreshStats }) {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

  const fetchTasks = useCallback(async (currentFilters, currentPage) => {
    setLoading(true);
    try {
      const { data } = await searchTasks({
        ...currentFilters,
        page: currentPage,
        size: 10,
      });
      setTasks(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchTasks(filters, page);
  }, [filters, page, fetchTasks]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setPage(0);
  };

  const handleAction = async (id, actionType, actionFn, successMessage) => {
    setActionLoading((prev) => ({ ...prev, [id]: actionType }));
    try {
      await actionFn();
      addToast(successMessage, 'success');
      fetchTasks(filters, page);
      refreshStats();
    } catch (err) {
      addToast(err.response?.data?.message || 'Action failed', 'error');
    } finally {
      setActionLoading((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const handleAssign = (id, assigneeName) => {
    if (!assigneeName) {
      addToast('Please enter an assignee name', 'error');
      return;
    }
    handleAction(id, 'assign', () => assignTask(id, assigneeName), 'Task assigned successfully');
  };

  const handleUnassign = (id) => {
    handleAction(id, 'unassign', () => unassignTask(id), 'Task unassigned successfully');
  };

  const handleClose = (id) => {
    handleAction(id, 'close', () => closeTask(id), 'Task closed successfully');
  };

  return (
    <div className={styles.container}>
      <SearchFilters onSearch={handleSearch} />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <TaskTable
            tasks={tasks}
            onAssign={handleAssign}
            onUnassign={handleUnassign}
            onClose={handleClose}
            actionLoading={actionLoading}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
