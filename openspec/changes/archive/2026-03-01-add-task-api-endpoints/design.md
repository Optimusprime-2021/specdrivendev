## Context

The Task Management System exposes REST endpoints for task lifecycle management. Three workflow-transition endpoints (assign, unassign, close) currently use `@PutMapping` but perform partial state updates rather than full resource replacements. The HTTP specification defines PUT as a full replacement and PATCH as a partial modification, making PATCH the semantically correct method for these operations.

The CORS configuration already includes PATCH in `allowedMethods`, so no infrastructure changes are needed.

## Goals / Non-Goals

**Goals:**
- Change assign, unassign, and close endpoints from PUT to PATCH in `TaskController`
- Update the `task-api` spec to reflect the correct HTTP methods
- Maintain identical request/response behavior — only the HTTP method changes

**Non-Goals:**
- Changing the full update endpoint (`PUT /api/tasks/{id}`) — this correctly uses PUT for full replacement
- Modifying service logic, repository queries, or entity structure
- Adding new endpoints or changing request/response schemas
- Frontend changes (no frontend code currently calls these endpoints)

## Decisions

**Decision 1: Change only the annotation, not the method signatures**

The `@PutMapping` annotation on three methods in `TaskController` will be replaced with `@PatchMapping`. Method names, parameters, return types, and service calls remain unchanged.

*Rationale*: The business logic is correct — only the HTTP method binding is wrong. Minimal change reduces risk.

*Alternative considered*: Keeping both PUT and PATCH mappings for backward compatibility. Rejected because there are no known consumers depending on PUT for these endpoints, and dual mappings create confusion.

**Decision 2: No CORS changes needed**

`CorsConfig` already allows PATCH in `allowedMethods`. Verified — no changes required.

## Risks / Trade-offs

**[Risk] Existing API consumers may break** → Mitigated by the fact that no frontend code currently calls these endpoints via PUT. The React frontend is not yet integrated with these workflow endpoints.

**[Risk] API documentation or tests reference PUT** → No external API docs exist yet. Any tests using PUT for these endpoints will need updating.
