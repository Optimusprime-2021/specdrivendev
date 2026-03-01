## Context

The Task Management System has a complete Spring Boot backend with REST endpoints for CRUD, workflow transitions (assign/unassign/close), and statistics. CORS is configured for `http://localhost:3000`. No frontend exists yet. The project standards specify React 18 with Axios and CSS Modules.

## Goals / Non-Goals

**Goals:**
- Build a functional React 18 SPA that consumes all existing backend endpoints
- Provide a tabbed UI with task creation and task search/management
- Show real-time task statistics in a status bar
- Give user feedback via toast notifications on every action

**Non-Goals:**
- Authentication or user management (no login)
- State management libraries (Redux, Zustand) — local state with hooks is sufficient
- Routing (React Router) — a single page with tabs is enough
- Server-side rendering or static site generation
- Unit/integration testing of React components (can be added later)
- Responsive/mobile design — desktop-first

## Decisions

**Decision 1: Create React App for project scaffolding**

Use `npx create-react-app frontend` for zero-config setup. This provides webpack, babel, dev server on port 3000, and hot reload out of the box.

*Alternative considered*: Vite — faster dev server, but CRA is more aligned with the project's stated React 18 + react-scripts stack. The project context specifies `react-scripts`.

**Decision 2: CSS Modules for styling (no UI framework)**

Use CSS Modules (`.module.css`) as specified in project standards. No external UI library (MUI, Ant Design, etc.).

*Rationale*: Keeps the dependency footprint small, avoids learning curve, and follows the project's stated conventions.

**Decision 3: Axios for HTTP calls via a centralized API module**

Create a single `api/taskApi.js` module that exports functions for each endpoint. All components call these functions instead of using Axios directly.

*Rationale*: Centralizes base URL config, error handling, and makes future changes (auth headers, interceptors) easy.

**Decision 4: Component architecture**

```
frontend/src/
├── api/
│   └── taskApi.js            # All API calls
├── components/
│   ├── App.jsx                # Root: tabs + status bar + toast container
│   ├── StatusBar.jsx          # OPEN/IN_PROGRESS/CLOSED counts + progress bars
│   ├── TaskForm.jsx           # Create Task tab
│   ├── TaskList.jsx           # Search Tasks tab (filters + table + pagination)
│   ├── TaskTable.jsx          # Table grid with row actions
│   ├── TaskRow.jsx            # Single table row with action buttons
│   ├── Pagination.jsx         # Previous/Next + Page X of Y
│   ├── SearchFilters.jsx      # Keyword, status, priority filter bar
│   └── Toast.jsx              # Toast notification component
├── App.module.css
└── components/*.module.css    # Per-component styles
```

*Rationale*: Each component has a single responsibility. `TaskList` orchestrates search state, delegates rendering to `TaskTable` and `Pagination`. `App` manages global state (active tab, stats refresh trigger, toast queue).

**Decision 5: State management with lifted state and callbacks**

- `App` holds: active tab, toast queue, stats refresh counter
- `TaskList` holds: search filters, current page, task results
- `TaskForm` holds: form field values, validation errors
- Actions (assign/unassign/close) trigger a callback to refresh both the task list and stats

*Rationale*: With only two tabs and one data entity, prop drilling is minimal. No need for Context or external state management.

**Decision 6: Toast implementation — simple internal component**

A lightweight `Toast` component with auto-dismiss (3 seconds). Managed via a `toasts` array in `App` state. No external toast library.

*Rationale*: Only need success/error messages. A 30-line component is simpler than adding a dependency.

## Risks / Trade-offs

**[Risk] Backend not running when frontend starts** → The UI will show error toasts when API calls fail. No crash — all calls are in try/catch.

**[Risk] CRA is considered legacy tooling** → Acceptable for this project scope. Migration to Vite is straightforward if needed later.

**[Risk] No loading states could feel unresponsive** → Each API call will show a brief loading indicator or disable buttons during requests.
