## MODIFIED Requirements

### Requirement: Assign task endpoint
The system SHALL provide a `PATCH /api/tasks/{id}/assign` endpoint that sets the assignee and transitions status to `IN_PROGRESS`. It SHALL reject assignment of closed tasks.

#### Scenario: Successful assignment
- **GIVEN** a task with ID 1 exists with status OPEN
- **WHEN** `PATCH /api/tasks/1/assign` is called with `{"assignee": "alice"}`
- **THEN** the system returns HTTP 200, assignee is "alice", and status is `IN_PROGRESS`

#### Scenario: Assign closed task rejected
- **GIVEN** a task with ID 1 exists with status CLOSED
- **WHEN** `PATCH /api/tasks/1/assign` is called
- **THEN** the system returns HTTP 409 with message "Cannot assign a closed task"

### Requirement: Unassign task endpoint
The system SHALL provide a `PATCH /api/tasks/{id}/unassign` endpoint that clears the assignee and transitions status back to `OPEN`.

#### Scenario: Successful unassignment
- **GIVEN** a task with ID 1 is assigned to "alice" with status IN_PROGRESS
- **WHEN** `PATCH /api/tasks/1/unassign` is called
- **THEN** the system returns HTTP 200, assignee is null, and status is `OPEN`

### Requirement: Close task endpoint
The system SHALL provide a `PATCH /api/tasks/{id}/close` endpoint that transitions a task to `CLOSED` status. It SHALL reject closing an already-closed task.

#### Scenario: Successful close
- **GIVEN** a task with ID 1 exists with status OPEN
- **WHEN** `PATCH /api/tasks/1/close` is called
- **THEN** the system returns HTTP 200 and status is `CLOSED`

#### Scenario: Close already-closed task rejected
- **GIVEN** a task with ID 1 already has status CLOSED
- **WHEN** `PATCH /api/tasks/1/close` is called
- **THEN** the system returns HTTP 409 with message "Task is already closed"
