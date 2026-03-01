## Context

The Task Management System is a greenfield full-stack application. There is currently no backend - only project scaffolding and standards exist. This change establishes the Spring Boot backend that will serve as the API layer for the React frontend.

The backend must follow the strict layered architecture defined in the coding standards: Controller → Service → Repository, using Java 17, Spring Boot 3.2, Spring Data JPA, Lombok, and H2 in-memory database.

## Goals / Non-Goals

**Goals:**
- Establish a working Spring Boot application with all layers (entity, repository, service, controller, config, exception)
- Define the Task domain model with full validation and enum types
- Provide a complete REST API for task CRUD, search, assignment, and status transitions
- Include a sample data loader so the app is usable immediately after startup
- Enable CORS for frontend development at `localhost:3000`
- Enable H2 console for database inspection during development

**Non-Goals:**
- Production database support (PostgreSQL/MySQL) - future change
- Authentication or authorization - future change
- DTOs / request-response mapping - entities used directly for this foundation; DTOs added when API stabilizes
- Frontend implementation - separate change
- Unit or integration tests - separate change
- Docker/deployment configuration - future change

## Decisions

### 1. Entities as API models (no DTOs initially)
**Decision:** Use JPA entities directly in controller request/response bodies.
**Rationale:** This is a foundation change for an in-memory dev setup. Adding DTOs now would double the class count without immediate value. DTOs should be introduced when the API contract stabilizes or when entity fields diverge from what clients need.
**Alternative considered:** Full DTO layer with MapStruct - rejected as premature for a foundation change.

### 2. H2 with create-drop strategy
**Decision:** Use `ddl-auto: create-drop` with H2 in-memory database.
**Rationale:** No persistent data needed yet. Schema is generated from entities, keeping the model as the single source of truth. Sample data loader re-seeds on every startup.
**Alternative considered:** Flyway migrations - appropriate for production but adds complexity with no benefit while using in-memory H2.

### 3. PUT for assign/unassign/close endpoints
**Decision:** Use `PUT` method for state-transition endpoints (`/assign`, `/unassign`, `/close`).
**Rationale:** The proposal defined these as PUT operations. These are idempotent state transitions on the resource, which aligns with PUT semantics. PATCH would also be valid but PUT is simpler and these operations replace specific state.
**Alternative considered:** PATCH - valid but using PUT for consistency with the proposal's endpoint table.

### 4. Sample data via CommandLineRunner
**Decision:** Implement data seeding with a `@Component` class implementing `CommandLineRunner`.
**Rationale:** Spring Boot standard pattern. Runs once on startup, easy to disable via profile. Keeps seed data separate from application logic.
**Alternative considered:** `data.sql` file - less flexible, harder to use enums and builders.

### 5. Stats endpoint returns a map
**Decision:** The `/api/tasks/stats` endpoint returns a flat JSON object with status counts and total.
**Rationale:** Simple, frontend-friendly format. No need for a complex DTO - a `Map<String, Long>` suffices.
**Alternative considered:** Custom `TaskStatsResponse` record - unnecessary complexity for a simple count map.

## Risks / Trade-offs

- **[No DTOs]** → Entities exposed directly may leak internal fields (like Hibernate proxies). Mitigated: H2/dev only; DTO layer will be added before production.
- **[In-memory database]** → All data lost on restart. Mitigated: Sample data loader re-seeds automatically; this is intentional for dev.
- **[No auth]** → All endpoints are publicly accessible. Mitigated: Development only; auth is a planned future change.
- **[No tests]** → No automated verification of behavior. Mitigated: Manual testing via H2 console and API calls; tests are a planned follow-up.
