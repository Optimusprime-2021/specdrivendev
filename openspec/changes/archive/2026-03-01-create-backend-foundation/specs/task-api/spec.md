## ADDED Requirements

### Requirement: Create task endpoint
The system SHALL provide a `POST /api/tasks` endpoint that creates a new task. It SHALL validate the request body and return the created task with HTTP 201 Created.

#### Scenario: Successful task creation
- **GIVEN** a valid task payload with title "Build dashboard" and priority "HIGH"
- **WHEN** `POST /api/tasks` is called
- **THEN** the system returns HTTP 201 with the created task including auto-generated ID and timestamps

#### Scenario: Task creation with invalid title
- **GIVEN** a task payload with blank title
- **WHEN** `POST /api/tasks` is called
- **THEN** the system returns HTTP 400 with error response containing validation message

### Requirement: Get task by ID endpoint
The system SHALL provide a `GET /api/tasks/{id}` endpoint that returns a single task by its ID.

#### Scenario: Task found
- **GIVEN** a task with ID 1 exists
- **WHEN** `GET /api/tasks/1` is called
- **THEN** the system returns HTTP 200 with the task data

#### Scenario: Task not found
- **GIVEN** no task with ID 999 exists
- **WHEN** `GET /api/tasks/999` is called
- **THEN** the system returns HTTP 404 with error response `{"status": 404, "message": "Task not found with id: 999", ...}`

### Requirement: Search tasks endpoint with pagination
The system SHALL provide a `GET /api/tasks` endpoint that returns a paginated list of tasks. It SHALL support optional filters: `keyword` (searches title and description), `status`, `priority`, and `assignee`. Results SHALL be sorted by `createdDate` descending. Default page size SHALL be 10.

#### Scenario: Search with no filters
- **GIVEN** 25 tasks exist in the system
- **WHEN** `GET /api/tasks` is called without parameters
- **THEN** the system returns HTTP 200 with the first 10 tasks sorted by createdDate descending, including pagination metadata (totalElements, totalPages)

#### Scenario: Search filtered by status
- **GIVEN** tasks with mixed statuses exist
- **WHEN** `GET /api/tasks?status=OPEN` is called
- **THEN** the system returns only tasks with status OPEN, paginated

#### Scenario: Search filtered by keyword
- **GIVEN** a task with title "Fix login bug" exists
- **WHEN** `GET /api/tasks?keyword=login` is called
- **THEN** the system returns tasks where title or description contains "login" (case-insensitive)

#### Scenario: Pagination navigation
- **GIVEN** 25 tasks exist
- **WHEN** `GET /api/tasks?page=1&size=10` is called
- **THEN** the system returns tasks 11-20 with correct pagination metadata

### Requirement: Update task endpoint
The system SHALL provide a `PUT /api/tasks/{id}` endpoint that updates an existing task's fields.

#### Scenario: Successful update
- **GIVEN** a task with ID 1 exists
- **WHEN** `PUT /api/tasks/1` is called with updated title
- **THEN** the system returns HTTP 200 with the updated task and refreshed `updatedDate`

#### Scenario: Update non-existent task
- **GIVEN** no task with ID 999 exists
- **WHEN** `PUT /api/tasks/999` is called
- **THEN** the system returns HTTP 404

### Requirement: Delete task endpoint
The system SHALL provide a `DELETE /api/tasks/{id}` endpoint that removes a task.

#### Scenario: Successful deletion
- **GIVEN** a task with ID 1 exists
- **WHEN** `DELETE /api/tasks/1` is called
- **THEN** the system returns HTTP 204 No Content and the task is removed

#### Scenario: Delete non-existent task
- **GIVEN** no task with ID 999 exists
- **WHEN** `DELETE /api/tasks/999` is called
- **THEN** the system returns HTTP 404

### Requirement: Assign task endpoint
The system SHALL provide a `PUT /api/tasks/{id}/assign` endpoint that sets the assignee and transitions status to `IN_PROGRESS`. It SHALL reject assignment of closed tasks.

#### Scenario: Successful assignment
- **GIVEN** a task with ID 1 exists with status OPEN
- **WHEN** `PUT /api/tasks/1/assign` is called with `{"assignee": "alice"}`
- **THEN** the system returns HTTP 200, assignee is "alice", and status is `IN_PROGRESS`

#### Scenario: Assign closed task rejected
- **GIVEN** a task with ID 1 exists with status CLOSED
- **WHEN** `PUT /api/tasks/1/assign` is called
- **THEN** the system returns HTTP 409 with message "Cannot assign a closed task"

### Requirement: Unassign task endpoint
The system SHALL provide a `PUT /api/tasks/{id}/unassign` endpoint that clears the assignee and transitions status back to `OPEN`.

#### Scenario: Successful unassignment
- **GIVEN** a task with ID 1 is assigned to "alice" with status IN_PROGRESS
- **WHEN** `PUT /api/tasks/1/unassign` is called
- **THEN** the system returns HTTP 200, assignee is null, and status is `OPEN`

### Requirement: Close task endpoint
The system SHALL provide a `PUT /api/tasks/{id}/close` endpoint that transitions a task to `CLOSED` status. It SHALL reject closing an already-closed task.

#### Scenario: Successful close
- **GIVEN** a task with ID 1 exists with status OPEN
- **WHEN** `PUT /api/tasks/1/close` is called
- **THEN** the system returns HTTP 200 and status is `CLOSED`

#### Scenario: Close already-closed task rejected
- **GIVEN** a task with ID 1 already has status CLOSED
- **WHEN** `PUT /api/tasks/1/close` is called
- **THEN** the system returns HTTP 409 with message "Task is already closed"

### Requirement: Task statistics endpoint
The system SHALL provide a `GET /api/tasks/stats` endpoint that returns task counts grouped by status plus a total count.

#### Scenario: Stats with mixed statuses
- **GIVEN** 5 OPEN, 3 IN_PROGRESS, and 2 CLOSED tasks exist
- **WHEN** `GET /api/tasks/stats` is called
- **THEN** the system returns HTTP 200 with `{"OPEN": 5, "IN_PROGRESS": 3, "CLOSED": 2, "TOTAL": 10}`

#### Scenario: Stats with no tasks
- **GIVEN** no tasks exist
- **WHEN** `GET /api/tasks/stats` is called
- **THEN** the system returns HTTP 200 with `{"OPEN": 0, "IN_PROGRESS": 0, "CLOSED": 0, "TOTAL": 0}`

### Requirement: CORS support for frontend
The system SHALL allow cross-origin requests from `http://localhost:3000` on all `/api/**` endpoints, supporting GET, POST, PUT, PATCH, DELETE, and OPTIONS methods.

#### Scenario: Frontend CORS request accepted
- **GIVEN** a request originates from `http://localhost:3000`
- **WHEN** any API endpoint is called
- **THEN** the response includes appropriate CORS headers allowing the request

### Requirement: Global error handling
The system SHALL handle exceptions globally via `@ControllerAdvice` and return a consistent JSON error format: `{status, message, path, timestamp}`.

#### Scenario: Resource not found error
- **GIVEN** a request for a non-existent resource
- **WHEN** the request is processed
- **THEN** the system returns HTTP 404 with `{"status": 404, "message": "...", "path": "/api/tasks/...", "timestamp": "..."}`

#### Scenario: Validation error
- **GIVEN** a request with invalid input
- **WHEN** the request is validated
- **THEN** the system returns HTTP 400 with field-level error messages joined in the message field

#### Scenario: Business rule violation
- **GIVEN** a request that violates a business rule (e.g., closing a closed task)
- **WHEN** the request is processed
- **THEN** the system returns HTTP 409 with the violation message
