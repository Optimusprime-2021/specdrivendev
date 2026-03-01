import { useState } from 'react';
import { createTask } from '../api/taskApi';
import styles from './TaskForm.module.css';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export default function TaskForm({ addToast, refreshStats }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3 || title.trim().length > 200) {
      newErrors.title = 'Title must be 3-200 characters';
    }
    if (!priority) {
      newErrors.priority = 'Priority is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || null,
        priority,
      });
      setTitle('');
      setDescription('');
      setPriority('');
      setErrors({});
      addToast('Task created successfully', 'success');
      refreshStats();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create task. Please try again.';
      addToast(message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">Title *</label>
        <input
          id="title"
          className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
        {errors.title && <span className={styles.error}>{errors.title}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="description">Description</label>
        <textarea
          id="description"
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          rows={4}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="priority">Priority *</label>
        <select
          id="priority"
          className={`${styles.select} ${errors.priority ? styles.inputError : ''}`}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">Select priority</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {errors.priority && <span className={styles.error}>{errors.priority}</span>}
      </div>

      <button className={styles.button} type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
