## Why

The Task Management System needs a backend foundation to serve as the API layer for the React frontend. Without a backend, there is no way to persist tasks, manage state transitions, or support multi-user workflows. This is the first step in building the full-stack application.

## What Changes

- Create a Spring Boot 3.x application with Java 17 and H2 in-memory database
- Define a `Task` entity with fields: id, title, description, status, priority, assignee, createdDate, updatedDate
- Implement full CRUD REST API for tasks with filtering, pagination, and status/assignment operations
- Add a sample data loader to seed the database with test tasks on startup
- Establish the layered architecture (Controller → Service → Repository) as the foundation for all future backend work

## Capabilities

### New Capabilities
- `task-entity`: Task domain model with JPA entity, enums (TaskStatus, TaskPriority), validation constraints, and automatic timestamps
- `task-api`: RESTful API endpoints for task CRUD, search with filters (status, priority, keyword), pagination, assignment, and status transitions
- `sample-data`: DataLoader component that seeds the H2 database with sample tasks on application startup

### Modified Capabilities
_(none - greenfield project)_

## Impact

### Backend
- New Spring Boot application module with `spring-boot-starter-web`, `spring-boot-starter-data-jpa`, `h2`, and `lombok` dependencies
- New packages: `model`, `repository`, `service`, `controller`, `config`
- H2 console enabled at `/h2-console` for development
- API base path: `/api/tasks`

### Frontend
- No frontend changes in this change - frontend will consume these APIs in a subsequent change

### API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks` | Search/list tasks (paginated, filterable) |
| GET | `/api/tasks/{id}` | Get task by ID |
| PUT | `/api/tasks/{id}` | Update a task |
| DELETE | `/api/tasks/{id}` | Delete a task |
| PUT | `/api/tasks/{id}/assign` | Assign a task |
| PUT | `/api/tasks/{id}/unassign` | Unassign a task |
| PUT | `/api/tasks/{id}/close` | Close a task |
| GET | `/api/tasks/stats` | Get task count statistics |

### Rollback Strategy
- Since this is a greenfield addition with no existing backend, rollback is a full removal of the backend module
- H2 is in-memory only, so no persistent data migration concerns
