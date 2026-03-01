## Why

The Task Management System has a fully functional backend API but no user interface. A React frontend is needed to let users create, search, manage, and monitor tasks without using raw API calls.

## What Changes

- Create a new React 18 application in `frontend/` with Create React App
- Add a tabbed interface with "Create Task" and "Search Tasks" tabs
- Implement a search/filter bar with keyword, status, and priority filters
- Build a table grid displaying task data with color-coded status badges and inline row actions (assign, unassign, close)
- Add pagination controls (Previous/Next, Page X of Y, 10 per page)
- Add a status bar at the top showing OPEN/IN_PROGRESS/CLOSED counts with colored progress bars, refreshed after every action
- Add toast notifications for success and error feedback on all operations
- Connect to the backend API at `http://localhost:8080` via Axios

## Capabilities

### New Capabilities

- `task-dashboard`: Overall UI shell — tabbed interface (Create Task / Search Tasks), status bar with live task statistics and progress bars, toast notification system
- `task-list`: Search Tasks tab — filter bar (keyword, status, priority), table grid with columns (ID, Title, Status badge, Priority, Assignee, Actions), row actions (Assign, Unassign, Close), pagination controls
- `task-create-form`: Create Task tab — form with title, description, priority fields, validation, and submission feedback

### Modified Capabilities

_(none — this is a new frontend; no existing spec requirements change)_

## Impact

### Backend

- No backend code changes required
- Consumes existing endpoints: `POST /api/tasks`, `GET /api/tasks`, `GET /api/tasks/{id}`, `PATCH /api/tasks/{id}/assign`, `PATCH /api/tasks/{id}/unassign`, `PATCH /api/tasks/{id}/close`, `GET /api/tasks/stats`
- CORS already configured for `http://localhost:3000`

### Frontend

- New `frontend/` directory with React 18 application
- Dependencies: react, react-dom, axios, react-scripts
- Runs on `http://localhost:3000` (Create React App default)

### API Endpoints Consumed

| Endpoint | Method | Usage |
|---|---|---|
| `/api/tasks` | POST | Create task form submission |
| `/api/tasks` | GET | Search with filters + pagination |
| `/api/tasks/{id}/assign` | PATCH | Assign action on table row |
| `/api/tasks/{id}/unassign` | PATCH | Unassign action on table row |
| `/api/tasks/{id}/close` | PATCH | Close action on table row |
| `/api/tasks/stats` | GET | Status bar statistics |

### Rollback Strategy

Delete the `frontend/` directory. No backend changes to revert.
