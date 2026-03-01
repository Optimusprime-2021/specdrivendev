package com.taskmanager.config;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskPriority;
import com.taskmanager.entity.TaskStatus;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final TaskRepository taskRepository;

    @Override
    public void run(String... args) {
        List<Task> tasks = List.of(
                Task.builder().title("Set up CI/CD pipeline").description("Configure GitHub Actions for automated builds and deployments").priority(TaskPriority.HIGH).status(TaskStatus.OPEN).build(),
                Task.builder().title("Design database schema").description("Create ER diagram and define table relationships").priority(TaskPriority.CRITICAL).status(TaskStatus.IN_PROGRESS).assignee("alice").build(),
                Task.builder().title("Implement user authentication").description("Add JWT-based auth with login and registration endpoints").priority(TaskPriority.CRITICAL).status(TaskStatus.OPEN).build(),
                Task.builder().title("Write API documentation").description("Document all REST endpoints using OpenAPI/Swagger").priority(TaskPriority.MEDIUM).status(TaskStatus.OPEN).build(),
                Task.builder().title("Add input validation").description("Validate all request bodies and query parameters").priority(TaskPriority.HIGH).status(TaskStatus.IN_PROGRESS).assignee("bob").build(),
                Task.builder().title("Create dashboard UI").description("Build the main dashboard with task overview and statistics").priority(TaskPriority.MEDIUM).status(TaskStatus.OPEN).build(),
                Task.builder().title("Fix pagination bug").description("Search results not resetting to page 0 on new query").priority(TaskPriority.HIGH).status(TaskStatus.CLOSED).assignee("charlie").build(),
                Task.builder().title("Add logging framework").description("Configure SLF4J with Logback for structured logging").priority(TaskPriority.LOW).status(TaskStatus.CLOSED).assignee("alice").build(),
                Task.builder().title("Performance testing").description("Run load tests on search endpoint with 10k records").priority(TaskPriority.MEDIUM).status(TaskStatus.OPEN).build(),
                Task.builder().title("Implement task export").description("Allow exporting filtered task lists to CSV format").priority(TaskPriority.LOW).status(TaskStatus.OPEN).build(),
                Task.builder().title("Add email notifications").description("Send email when task is assigned or status changes").priority(TaskPriority.MEDIUM).status(TaskStatus.IN_PROGRESS).assignee("diana").build(),
                Task.builder().title("Refactor service layer").description("Extract common patterns into base service class").priority(TaskPriority.LOW).status(TaskStatus.OPEN).build(),
                Task.builder().title("Set up monitoring").description("Add health checks and metrics endpoints with Actuator").priority(TaskPriority.HIGH).status(TaskStatus.OPEN).build(),
                Task.builder().title("Code review checklist").description("Create standardized code review checklist for the team").priority(TaskPriority.LOW).status(TaskStatus.CLOSED).build(),
                Task.builder().title("Migrate to PostgreSQL").description("Replace H2 with PostgreSQL for production environment").priority(TaskPriority.CRITICAL).status(TaskStatus.OPEN).build(),
                Task.builder().title("Add unit tests for service layer").description("Write JUnit 5 tests for TaskService methods").priority(TaskPriority.HIGH).status(TaskStatus.IN_PROGRESS).assignee("bob").build(),
                Task.builder().title("Implement role-based access").description("Add ADMIN and USER roles with endpoint-level authorization").priority(TaskPriority.CRITICAL).status(TaskStatus.OPEN).build(),
                Task.builder().title("Optimize search query").description("Add database indexes and optimize JPQL for search endpoint").priority(TaskPriority.MEDIUM).status(TaskStatus.CLOSED).assignee("alice").build()
        );

        taskRepository.saveAll(tasks);
        log.info("Loaded {} sample tasks into database", tasks.size());
    }
}
