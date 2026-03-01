# Java & Spring Boot Coding Standards

> **Location:** `openspec/standards/java-coding-standards.md`
> **Referenced by:** `openspec/config.yaml` context section
> **Scope:** All Java backend code in the Task Management System

---

## 1. Package Structure

```
com.taskmanager/
├── entity/          # JPA entities and enums only
├── repository/      # Spring Data JPA interfaces only
├── service/         # Business logic, @Transactional
├── controller/      # REST endpoints, @RestController
├── dto/             # Request/Response DTOs (record classes)
├── exception/       # Custom exceptions + @ControllerAdvice
├── config/          # Spring configuration beans
└── util/            # Utility/helper classes (static methods)
```

---

## 2. Architecture Rules (STRICT)

| Rule | Description | Violation Example |
|------|-------------|-------------------|
| **Controller → Service → Repository** | Strict layered dependency flow | Controller calling Repository directly |
| **Controllers: HTTP only** | Validation, mapping, HTTP status codes. NO business logic | `if (task.getStatus() == CLOSED) throw...` in Controller |
| **Services: Logic only** | Business rules, transactions. NO HttpServletRequest, NO ResponseEntity | Returning `ResponseEntity` from Service |
| **Repositories: Data only** | Spring Data JPA queries. NEVER injected into Controllers | `@Autowired TaskRepository` in Controller |
| **No circular dependencies** | Services may call other Services but never circularly | ServiceA → ServiceB → ServiceA |

### Dependency Diagram

```
┌─────────────────────┐
│     Controller       │  ← @RestController, @RequestMapping
│  (HTTP + Validation) │  ← Returns ResponseEntity<T>
└──────────┬──────────┘
           │ calls
           ▼
┌─────────────────────┐
│      Service         │  ← @Service, @Transactional
│  (Business Logic)    │  ← Throws custom exceptions
└──────────┬──────────┘
           │ calls
           ▼
┌─────────────────────┐
│    Repository        │  ← extends JpaRepository<T, ID>
│   (Data Access)      │  ← Spring Data query methods
└──────────┬──────────┘
           │ maps to
           ▼
┌─────────────────────┐
│      Entity          │  ← @Entity, @Table
│   (JPA Mapping)      │  ← @Data, @Builder (Lombok)
└─────────────────────┘
```

---

## 3. Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| **Package** | lowercase, dot-separated | `com.taskmanager.service` |
| **Class** | PascalCase, noun | `TaskService`, `TaskController` |
| **Interface** | PascalCase, noun/adjective | `TaskRepository`, `Cacheable` |
| **Method** | camelCase, verb-first | `createTask()`, `findByStatus()` |
| **Variable** | camelCase, descriptive | `taskStatus`, `pageNumber` |
| **Constant** | UPPER_SNAKE_CASE | `MAX_TITLE_LENGTH`, `DEFAULT_PAGE_SIZE` |
| **Enum** | PascalCase class, UPPER values | `TaskStatus.OPEN`, `TaskPriority.HIGH` |
| **Boolean** | `is`/`has`/`can` prefix | `isActive`, `hasAssignee` |
| **Collections** | Plural noun | `tasks`, `statusCounts` |
| **DTO Record** | `{Action}{Entity}Request/Response` | `CreateTaskRequest`, `TaskResponse` |

---

## 4. Entity Standards

```java
@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    @Size(min = 3, max = 200, message = "Title must be 3-200 characters")
    @NotBlank(message = "Title is required")
    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TaskStatus status = TaskStatus.OPEN;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskPriority priority;

    private String assignee;

    @Column(updatable = false)
    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }
}
```

### Entity Rules

- **MUST** use `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor` (Lombok)
- **MUST** use `@Builder.Default` for all enum fields with default values
- **MUST** use `@Enumerated(EnumType.STRING)` — never ordinal
- **MUST** include `@PrePersist` and `@PreUpdate` for audit timestamps
- **MUST** use Bean Validation annotations (`@NotBlank`, `@Size`, `@NotNull`)
- **MUST NOT** contain business logic methods
- **SHOULD** use `@Column(nullable = false)` to match DB constraints

---

## 5. Repository Standards

```java
public interface TaskRepository extends JpaRepository<Task, Long> {

    Page<Task> findByStatus(TaskStatus status, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE " +
           "(:keyword IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           " OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:status IS NULL OR t.status = :status) " +
           "AND (:priority IS NULL OR t.priority = :priority) " +
           "AND (:assignee IS NULL OR t.assignee = :assignee)")
    Page<Task> searchTasks(
            @Param("keyword") String keyword,
            @Param("status") TaskStatus status,
            @Param("priority") TaskPriority priority,
            @Param("assignee") String assignee,
            Pageable pageable);

    @Query("SELECT t.status, COUNT(t) FROM Task t GROUP BY t.status")
    List<Object[]> countByStatus();
}
```

### Repository Rules

- **MUST** extend `JpaRepository<Entity, IdType>`
- **MUST** use Spring Data naming conventions when possible (`findByStatus`)
- **MUST** use `@Query` with JPQL for complex queries (never native SQL unless required)
- **MUST** use `Page<T>` return type for all list queries — no `List<T>` for pageable results
- **MUST** use `@Param` annotations for named parameters
- **MUST NOT** contain business logic — only data access queries

---

## 6. Service Standards

```java
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
}
```

### Service Rules

- **MUST** use `@RequiredArgsConstructor` for constructor injection (Lombok)
- **MUST** use `@Slf4j` for logging (Lombok)
- **MUST** annotate read methods: `@Transactional(readOnly = true)`
- **MUST** annotate write methods: `@Transactional`
- **MUST** log at method entry with parameters: `log.info("Creating task: title={}", ...)`
- **MUST** log at method exit with result: `log.info("Task created: id={}", ...)`
- **MUST** throw custom exceptions: `ResourceNotFoundException`, `IllegalStateException`
- **MUST NOT** throw generic `RuntimeException` or `Exception`
- **MUST NOT** use `HttpServletRequest`, `ResponseEntity`, or any HTTP concepts
- **MUST NOT** catch and swallow exceptions silently
- **SHOULD** validate business rules before performing operations
- **SHOULD** return `Optional<T>` only when null is a valid business outcome

---

## 7. Controller Standards

```java
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@Slf4j
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        Task created = taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    @GetMapping
    public ResponseEntity<Page<Task>> searchTasks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(required = false) String assignee,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.DESC, "createdDate"));
        return ResponseEntity.ok(
                taskService.searchTasks(keyword, status, priority,
                        assignee, pageable));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<Task> assignTask(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(
                taskService.assignTask(id, body.get("assignee")));
    }

    @PatchMapping("/{id}/unassign")
    public ResponseEntity<Task> unassignTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.unassignTask(id));
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<Task> closeTask(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.closeTask(id));
    }
}
```

### Controller Rules

- **MUST** use `@RestController` + `@RequestMapping("/api/{resource}")`
- **MUST** return `ResponseEntity<T>` for all endpoints
- **MUST** use correct HTTP status codes:
  - `POST` → `201 Created` (`HttpStatus.CREATED`)
  - `GET` → `200 OK`
  - `PUT/PATCH` → `200 OK`
  - `DELETE` → `204 No Content`
- **MUST** use `@Valid` on all `@RequestBody` parameters
- **MUST** use `@RequestParam(required = false)` for optional filters
- **MUST** use `@RequestParam(defaultValue = "...")` for pagination defaults
- **MUST** delegate ALL logic to Service layer
- **MUST NOT** call Repository directly
- **MUST NOT** contain `if/else` business logic
- **MUST NOT** perform data transformation (use Service or DTO mapper)

---

## 8. Exception Handling Standards

```java
// Custom Exception
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

// Global Exception Handler
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException ex, HttpServletRequest request) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorResponse.of(404, ex.getMessage(),
                        request.getRequestURI()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));
        log.warn("Validation failed: {}", message);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(400, message,
                        request.getRequestURI()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalState(
            IllegalStateException ex, HttpServletRequest request) {
        log.warn("Illegal state: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ErrorResponse.of(409, ex.getMessage(),
                        request.getRequestURI()));
    }
}

// Error Response DTO
public record ErrorResponse(
        int status,
        String message,
        String path,
        LocalDateTime timestamp) {

    public static ErrorResponse of(int status, String message, String path) {
        return new ErrorResponse(status, message, path, LocalDateTime.now());
    }
}
```

### Error Response JSON Format

```json
{
    "status": 404,
    "message": "Task not found with id: 99",
    "path": "/api/tasks/99",
    "timestamp": "2026-03-01T14:30:00"
}
```

---

## 9. Logging Standards

| Level | When to Use | Example |
|-------|-------------|---------|
| `log.info()` | Service method entry/exit, state changes | `log.info("Creating task: title={}", title)` |
| `log.debug()` | Detailed flow, query params, intermediate values | `log.debug("Search params: keyword={}", keyword)` |
| `log.warn()` | Expected errors (not found, validation failed) | `log.warn("Task not found: id={}", id)` |
| `log.error()` | Unexpected errors with stack trace | `log.error("Unexpected error processing task", ex)` |

### Logging Rules

- **MUST** use `@Slf4j` (Lombok) — never `LoggerFactory.getLogger()`
- **MUST** use parameterized messages: `log.info("Task: {}", id)` — never string concatenation
- **MUST** log at service entry with input parameters
- **MUST** log at service exit with key result data (id, count)
- **MUST** log exceptions at `warn` (expected) or `error` (unexpected) level
- **MUST NOT** log sensitive data (passwords, tokens, PII)
- **MUST NOT** use `System.out.println()` anywhere

---

## 10. H2 Database Configuration

```yaml
# src/main/resources/application.yml
spring:
  datasource:
    url: jdbc:h2:mem:taskdb
    driver-class-name: org.h2.Driver
    username: sa
    password:
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
    properties:
      hibernate:
        format_sql: true
  h2:
    console:
      enabled: true
      path: /h2-console

server:
  port: 8080
```

---

## 11. CORS Configuration

```java
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT",
                                "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

---

## 12. Dependencies (pom.xml)

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
</dependencies>
```

---

## Quick Reference Card

| Layer | Annotation | Returns | Injects |
|-------|-----------|---------|---------|
| **Entity** | `@Entity @Data @Builder` | — | — |
| **Repository** | `extends JpaRepository` | `Page<T>`, `Optional<T>` | — |
| **Service** | `@Service @Transactional @Slf4j` | Entity / Page | Repository |
| **Controller** | `@RestController @RequestMapping` | `ResponseEntity<T>` | Service |
| **Exception** | `@RestControllerAdvice` | `ResponseEntity<ErrorResponse>` | — |
| **Config** | `@Configuration @Bean` | — | — |
