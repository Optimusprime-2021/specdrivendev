## 1. Reusable Components

- [x] 1.1 Create `Spinner.jsx` and `Spinner.module.css` — CSS-animated border spinner with optional `size` prop (`small`/`medium`), centered by default
- [x] 1.2 Create `ErrorBoundary.jsx` — class component with `getDerivedStateFromError`/`componentDidCatch`, fallback UI ("Something went wrong" + "Try Again" button that resets error state)
- [x] 1.3 Create `ConfirmDialog.jsx` and `ConfirmDialog.module.css` — modal overlay with message, "Confirm" button, "Cancel" button, controlled via `isOpen`/`onConfirm`/`onCancel` props, blocks background clicks

## 2. Integrate Error Boundaries

- [x] 2.1 Wrap StatusBar, active tab content, and Toast container in separate `ErrorBoundary` instances in `App.jsx`

## 3. Loading Spinners Integration

- [x] 3.1 Replace "Loading..." text in `TaskList.jsx` with `Spinner` component during search fetch
- [x] 3.2 Add loading state to `StatusBar.jsx` — show `Spinner` while stats API call is in progress, replace with stats on success
- [x] 3.3 Add `actionLoading` state map to `TaskList.jsx` tracking per-row action in progress, pass to `TaskRow` via props
- [x] 3.4 Update `TaskRow.jsx` to disable all action buttons and show small inline `Spinner` when its row has an active action

## 4. Confirmation Dialog Integration

- [x] 4.1 Update `TaskRow.jsx` to open `ConfirmDialog` when "Close" is clicked instead of calling `onClose` directly; call `onClose` only on confirm

## 5. Responsive CSS

- [x] 5.1 Add tablet breakpoint (`max-width: 768px`) media queries to `SearchFilters.module.css` (stack filters vertically) and `StatusBar.module.css` (column layout)
- [x] 5.2 Add mobile breakpoint (`max-width: 480px`) media queries to `TaskTable.module.css` (horizontal scroll wrapper), `Pagination.module.css` (vertical stack), and `TaskRow.module.css` (full-width action buttons)
- [x] 5.3 Add base responsive tweaks to `App.module.css` — reduce max-width and padding at smaller breakpoints

## 6. Bug Fix

- [x] 6.1 Fix empty-assignee validation in `TaskRow.jsx` — when assignee is empty, call `onAssign` with empty string so `TaskList.handleAssign` shows the error toast "Please enter an assignee name" (currently silently blocked by TaskRow guard)

## 7. Verification

- [x] 7.1 Verify error boundary: temporarily throw in a component, confirm fallback renders, confirm "Try Again" recovers, confirm other sections unaffected
- [x] 7.2 Verify spinners: confirm spinner shows during task list fetch, status bar load, and per-row actions; confirm spinner disappears on completion
- [x] 7.3 Verify confirmation dialog: click Close on a task, confirm dialog appears, test both Confirm (task closes) and Cancel (no API call)
- [x] 7.4 Verify responsive layout: resize browser to 768px and 480px, confirm filters stack, table scrolls horizontally, pagination stacks
- [x] 7.5 Verify empty-assignee fix: click Assign with empty input, confirm error toast appears
