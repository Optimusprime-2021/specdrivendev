## Why

The React frontend is functional but lacks production polish. There are no error boundaries (a component crash takes down the entire app), loading states use plain text instead of visual spinners, closing a task is a one-click destructive action with no confirmation, and the layout breaks on smaller screens. These gaps hurt usability and resilience.

## What Changes

- Add React error boundaries around each major section (StatusBar, TaskForm, TaskList) so a crash in one section doesn't break the whole app
- Replace "Loading..." text with a reusable CSS spinner component shown during all API calls (search, create, assign, unassign, close)
- Add a confirmation dialog that appears when the user clicks "Close" on a task, requiring explicit confirmation before calling the API
- Add responsive CSS (media queries) so the layout adapts to mobile and tablet viewports — stacking filters vertically, making the table horizontally scrollable, and resizing the status bar

## Capabilities

### New Capabilities
- `error-handling-ui`: Error boundary components and fallback UI for graceful degradation
- `confirmation-dialog`: Reusable confirmation dialog component used before destructive actions
- `loading-spinner`: Reusable spinner component for visual loading feedback during API calls
- `responsive-layout`: Media queries and responsive adjustments for mobile/tablet viewports

### Modified Capabilities
- `task-list`: Adding confirmation step before close action, and loading spinner during row actions
- `task-dashboard`: Adding error boundary wrappers around major sections

## Impact

**Frontend:**
- New components: `ErrorBoundary.jsx`, `ConfirmDialog.jsx`, `Spinner.jsx` (+ CSS modules)
- Modified components: `App.jsx` (wrap sections in error boundaries), `TaskList.jsx` (spinner during actions), `TaskRow.jsx` (confirmation before close), `StatusBar.jsx` (spinner during fetch)
- Modified CSS: `App.module.css`, `SearchFilters.module.css`, `TaskTable.module.css`, `StatusBar.module.css`, `Pagination.module.css` (responsive media queries)

**Backend:** No backend changes required.

**API endpoints affected:** None — all changes are frontend-only.

**Rollback strategy:** Revert the frontend component changes. No data migration or backend state to undo.
