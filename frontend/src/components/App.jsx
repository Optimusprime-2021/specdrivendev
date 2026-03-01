import { useState, useCallback } from 'react';
import ErrorBoundary from './ErrorBoundary';
import Header from './Header';
import Footer from './Footer';
import StatusBar from './StatusBar';
import Toast from './Toast';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import styles from './App.module.css';

let toastId = 0;

export default function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    setToasts((prev) => [...prev, { id: ++toastId, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshStats = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const handleStatsError = useCallback((message) => {
    addToast(message, 'error');
  }, [addToast]);

  return (
    <div className={styles.app}>
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>

      <main className={styles.main}>
        <ErrorBoundary>
          <StatusBar
            refreshTrigger={refreshTrigger}
            onError={handleStatsError}
          />
        </ErrorBoundary>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'search' ? styles.active : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Search Tasks
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'create' ? styles.active : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Task
          </button>
        </div>

        <ErrorBoundary>
          <div className={styles.content}>
            {activeTab === 'create' && (
              <TaskForm addToast={addToast} refreshStats={refreshStats} />
            )}
            {activeTab === 'search' && (
              <TaskList addToast={addToast} refreshStats={refreshStats} />
            )}
          </div>
        </ErrorBoundary>

        <ErrorBoundary>
          <Toast toasts={toasts} removeToast={removeToast} />
        </ErrorBoundary>
      </main>

      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </div>
  );
}
