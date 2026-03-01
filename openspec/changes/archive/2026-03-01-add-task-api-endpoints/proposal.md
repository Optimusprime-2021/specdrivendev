## Why

The task workflow endpoints (assign, unassign, close) currently use `PUT` but should use `PATCH` to follow REST conventions — these operations perform partial state transitions, not full resource replacements. Aligning HTTP methods with their semantic meaning improves API correctness and clarity for frontend consumers.

## What Changes

- Change `PUT /api/tasks/{id}/assign` to `PATCH /api/tasks/{id}/assign`
- Change `PUT /api/tasks/{id}/unassign` to `PATCH /api/tasks/{id}/unassign`
- Change `PUT /api/tasks/{id}/close` to `PATCH /api/tasks/{id}/close`
- Update CORS configuration to ensure PATCH is explicitly allowed (already configured but verified)
- No changes to request/response bodies or business logic

## Capabilities

### New Capabilities

_(none — all endpoints already exist)_

### Modified Capabilities

- `task-api`: Workflow transition endpoints change HTTP method from PUT to PATCH for assign, unassign, and close operations

## Impact

### Backend

- `TaskController.java`: Change `@PutMapping` to `@PatchMapping` on three handler methods (assign, unassign, close)
- `CorsConfig.java`: Verify PATCH is in `allowedMethods` (already present — no code change needed)
- No service or repository changes required

### Frontend

- Any frontend code calling these endpoints must update HTTP method from PUT to PATCH (currently no frontend calling these endpoints directly, but future React integration will use PATCH)

### API Endpoints Affected

| Endpoint | Current Method | New Method |
|---|---|---|
| `/api/tasks/{id}/assign` | PUT | PATCH |
| `/api/tasks/{id}/unassign` | PUT | PATCH |
| `/api/tasks/{id}/close` | PUT | PATCH |

### Rollback Strategy

Revert the three `@PatchMapping` annotations back to `@PutMapping` in `TaskController.java`. No data migration or schema changes involved — rollback is a single-file revert.
