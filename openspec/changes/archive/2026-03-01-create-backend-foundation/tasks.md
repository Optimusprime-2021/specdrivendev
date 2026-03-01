## 1. Project Setup

- [x] 1.1 Initialize Spring Boot 3.2 project with Maven (pom.xml with spring-boot-starter-web, spring-boot-starter-data-jpa, spring-boot-starter-validation, h2, lombok)
- [x] 1.2 Create application.yml with H2 in-memory config, JPA settings, and server port 8080
- [x] 1.3 Create base package structure: entity, repository, service, controller, exception, config

## 2. Domain Model (Backend)

- [x] 2.1 Create TaskStatus enum (OPEN, IN_PROGRESS, CLOSED)
- [x] 2.2 Create TaskPriority enum (LOW, MEDIUM, HIGH, CRITICAL)
- [x] 2.3 Create Task entity with all fields, validation annotations, Lombok annotations, and @PrePersist/@PreUpdate timestamps
- [x] 2.4 Verify entity compiles and H2 table is generated on startup

## 3. Repository Layer (Backend)

- [x] 3.1 Create TaskRepository extending JpaRepository with searchTasks query (keyword, status, priority, assignee + Pageable)
- [x] 3.2 Add countByStatus query method returning List<Object[]>

## 4. Exception Handling (Backend)

- [x] 4.1 Create ResourceNotFoundException with @ResponseStatus(NOT_FOUND)
- [x] 4.2 Create ErrorResponse record (status, message, path, timestamp)
- [x] 4.3 Create GlobalExceptionHandler with handlers for ResourceNotFoundException, MethodArgumentNotValidException, and IllegalStateException

## 5. Service Layer (Backend)

- [x] 5.1 Create TaskService with createTask, getTaskById, searchTasks methods
- [x] 5.2 Add updateTask and deleteTask methods
- [x] 5.3 Add assignTask, unassignTask, closeTask methods with business rule validation
- [x] 5.4 Add getTaskStats method returning status counts map
- [x] 5.5 Verify all service methods have @Transactional annotations and @Slf4j logging

## 6. Controller Layer (Backend)

- [x] 6.1 Create TaskController with POST /api/tasks (create) and GET /api/tasks/{id} (get by ID)
- [x] 6.2 Add GET /api/tasks (search with pagination and filters)
- [x] 6.3 Add PUT /api/tasks/{id} (update) and DELETE /api/tasks/{id} (delete)
- [x] 6.4 Add PUT /api/tasks/{id}/assign, /unassign, /close endpoints
- [x] 6.5 Add GET /api/tasks/stats endpoint
- [x] 6.6 Verify all endpoints return correct HTTP status codes (201 for create, 204 for delete, etc.)

## 7. Configuration (Backend)

- [x] 7.1 Create CorsConfig allowing http://localhost:3000 on /api/** with GET, POST, PUT, PATCH, DELETE, OPTIONS

## 8. Sample Data (Backend)

- [x] 8.1 Create DataLoader component implementing CommandLineRunner
- [x] 8.2 Seed at least 15 tasks covering all statuses, multiple priorities, and mixed assignee states
- [x] 8.3 Verify sample data loads on startup and pagination shows at least 2 pages

## 9. Smoke Test (Backend)

- [x] 9.1 Start application and verify H2 console accessible at /h2-console
- [x] 9.2 Test CRUD endpoints via curl or API client (create, get, search, update, delete)
- [x] 9.3 Test assign/unassign/close workflows and error cases (assign closed task, close closed task)
- [x] 9.4 Test stats endpoint returns correct counts
- [x] 9.5 Test search filters (keyword, status, priority) and pagination
