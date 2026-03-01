package com.taskmanager.service;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskPriority;
import com.taskmanager.entity.TaskStatus;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {

    private final TaskRepository taskRepository;

    @Transactional
    public Task createTask(Task task) {
        log.info("Creating task: title={}", task.getTitle());
        Task saved = taskRepository.save(task);
        log.info("Task created: id={}", saved.getId());
        return saved;
    }

    @Transactional(readOnly = true)
    public Task getTaskById(Long id) {
        log.debug("Fetching task: id={}", id);
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Task not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Page<Task> searchTasks(String keyword, TaskStatus status,
                                   TaskPriority priority, String assignee,
                                   Pageable pageable) {
        log.info("Searching tasks: keyword={}, status={}, priority={}",
                keyword, status, priority);
        return taskRepository.searchTasks(keyword, status, priority,
                assignee, pageable);
    }

    @Transactional
    public Task updateTask(Long id, Task taskDetails) {
        log.info("Updating task: id={}", id);
        Task task = getTaskById(id);
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setPriority(taskDetails.getPriority());
        task.setAssignee(taskDetails.getAssignee());
        Task updated = taskRepository.save(task);
        log.info("Task updated: id={}", updated.getId());
        return updated;
    }

    @Transactional
    public void deleteTask(Long id) {
        log.info("Deleting task: id={}", id);
        Task task = getTaskById(id);
        taskRepository.delete(task);
        log.info("Task deleted: id={}", id);
    }

    @Transactional
    public Task assignTask(Long id, String assignee) {
        log.info("Assigning task {} to {}", id, assignee);
        Task task = getTaskById(id);
        if (task.getStatus() == TaskStatus.CLOSED) {
            throw new IllegalStateException("Cannot assign a closed task");
        }
        task.setAssignee(assignee);
        task.setStatus(TaskStatus.IN_PROGRESS);
        return taskRepository.save(task);
    }

    @Transactional
    public Task unassignTask(Long id) {
        log.info("Unassigning task {}", id);
        Task task = getTaskById(id);
        task.setAssignee(null);
        task.setStatus(TaskStatus.OPEN);
        return taskRepository.save(task);
    }

    @Transactional
    public Task closeTask(Long id) {
        log.info("Closing task {}", id);
        Task task = getTaskById(id);
        if (task.getStatus() == TaskStatus.CLOSED) {
            throw new IllegalStateException("Task is already closed");
        }
        task.setStatus(TaskStatus.CLOSED);
        return taskRepository.save(task);
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getTaskStats() {
        log.info("Fetching task statistics");
        List<Object[]> results = taskRepository.countByStatus();
        Map<String, Long> stats = new LinkedHashMap<>();
        stats.put("OPEN", 0L);
        stats.put("IN_PROGRESS", 0L);
        stats.put("CLOSED", 0L);
        for (Object[] row : results) {
            TaskStatus status = (TaskStatus) row[0];
            Long count = (Long) row[1];
            stats.put(status.name(), count);
        }
        long total = stats.values().stream().mapToLong(Long::longValue).sum();
        stats.put("TOTAL", total);
        log.info("Task stats: {}", stats);
        return stats;
    }
}
