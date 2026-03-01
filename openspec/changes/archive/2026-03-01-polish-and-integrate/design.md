## Context

The React frontend has 9 components built with functional components, hooks, and CSS Modules. All API communication goes through a centralized `taskApi.js` module. The app uses lifted state in `App.jsx` (toasts, tab, refresh trigger) and local state in `TaskList.jsx` (filters, page, tasks). There are no error boundaries, no visual loading indicators (just text), no confirmation dialogs, and no responsive breakpoints.

## Goals / Non-Goals

**Goals:**
- Prevent full-app crashes by catching render errors in isolated boundaries
- Provide clear visual feedback (spinners) during all API operations
- Protect against accidental task closure with a confirmation step
- Make the UI usable on mobile and tablet viewports

**Non-Goals:**
- Offline support or service workers
- Skeleton/shimmer loading states (simple spinner is sufficient)
- Animations or transitions beyond what exists
- Dark mode or theming
- Making the confirmation dialog reusable for other actions beyond close (can be generalized later)

## Decisions

**Decision 1: Class-based ErrorBoundary component**

Use a class component with `componentDidCatch` and `getDerivedStateFromError`. React does not support error boundaries as functional components. The boundary renders a fallback UI ("Something went wrong" + a retry button that resets the error state). Wrap three sections: StatusBar, the active tab content (TaskForm or TaskList), and Toast.

*Alternative considered*: `react-error-boundary` library — adds a dependency for something achievable in ~30 lines. Not worth it.

**Decision 2: Pure CSS spinner (no library)**

Create a `Spinner.jsx` component that renders a `<div>` with a CSS border-based spinning animation (`@keyframes spin`). Accept an optional `size` prop (default `'medium'`). Use it in:
- `TaskList`: replace "Loading..." text when fetching tasks
- `TaskForm`: show inline spinner next to "Creating..." button text
- `StatusBar`: show while stats are loading
- Row actions: disable buttons and show spinner during assign/unassign/close

*Alternative considered*: SVG spinner or animated GIF — CSS-only is simpler, no asset files, and consistent with the CSS Modules approach.

**Decision 3: ConfirmDialog as a controlled modal component**

Create `ConfirmDialog.jsx` — a simple modal overlay with a message, "Confirm" button, and "Cancel" button. Controlled via `isOpen`, `onConfirm`, `onCancel` props. Rendered inside `TaskRow` and triggered when the user clicks "Close". The dialog message will be "Are you sure you want to close this task?".

*Alternative considered*: Browser `window.confirm()` — works but looks inconsistent across browsers and can't be styled. A custom dialog fits the app's visual style.

**Decision 4: Mobile-first responsive breakpoints**

Add two breakpoints via CSS media queries:
- **Tablet** (`max-width: 768px`): Stack search filters vertically, reduce padding, make status bar items stack in a column
- **Mobile** (`max-width: 480px`): Wrap table in a horizontally scrollable container, reduce font sizes, stack pagination controls, full-width buttons

Modify existing `.module.css` files — no new CSS files needed for responsiveness.

*Alternative considered*: CSS Grid rework — the current Flexbox layout is fine, just needs media query overrides. No need to rebuild the layout system.

**Decision 5: Action-level loading state in TaskList**

Add an `actionLoading` state (`{ [taskId]: actionType }` map) to `TaskList` to track which specific task row is performing an action. Pass this to `TaskRow` to disable buttons and show a spinner on the active action. This prevents double-clicks and gives per-row feedback.

*Alternative considered*: Global loading boolean — blocks all rows during any action, which feels sluggish when only one row is busy.

## Risks / Trade-offs

**[Risk] ErrorBoundary is a class component in a functional-component codebase** → Acceptable. React requires class components for error boundaries. It's a single utility component and won't spread the pattern. Wrap it once in `App.jsx`.

**[Risk] ConfirmDialog adds a click to the close workflow** → Intentional. Closing is irreversible (no reopen endpoint). The extra click prevents accidents.

**[Risk] Responsive CSS may break existing desktop layout** → Mitigated by using `max-width` media queries that only activate at smaller viewports. Desktop layout is untouched.
