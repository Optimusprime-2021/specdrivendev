## 1. Backend Tasks

- [x] 1.1 Change `@PutMapping("/{id}/assign")` to `@PatchMapping("/{id}/assign")` in `TaskController.java`
- [x] 1.2 Change `@PutMapping("/{id}/unassign")` to `@PatchMapping("/{id}/unassign")` in `TaskController.java`
- [x] 1.3 Change `@PutMapping("/{id}/close")` to `@PatchMapping("/{id}/close")` in `TaskController.java`
- [x] 1.4 Verify CORS config allows PATCH method in `CorsConfig.java`

## 2. Backend Tests

- [x] 2.1 Test `PATCH /api/tasks/{id}/assign` returns 200 with assignee set and status IN_PROGRESS
- [x] 2.2 Test `PATCH /api/tasks/{id}/assign` on closed task returns 409
- [x] 2.3 Test `PATCH /api/tasks/{id}/unassign` returns 200 with null assignee and status OPEN
- [x] 2.4 Test `PATCH /api/tasks/{id}/close` returns 200 with status CLOSED
- [x] 2.5 Test `PATCH /api/tasks/{id}/close` on already-closed task returns 409

## 3. Frontend Tasks

- [x] 3.1 Verify no frontend code references PUT for assign/unassign/close endpoints (no changes expected)
