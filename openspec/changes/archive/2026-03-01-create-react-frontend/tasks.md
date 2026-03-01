## 1. Frontend Setup

- [x] 1.1 Scaffold React app with `npx create-react-app frontend` and verify it runs on port 3000
- [x] 1.2 Install Axios dependency (`npm install axios`)
- [x] 1.3 Create `src/api/taskApi.js` with Axios instance (baseURL `http://localhost:8080`) and all API functions: `createTask`, `searchTasks`, `assignTask`, `unassignTask`, `closeTask`, `getTaskStats`

## 2. Frontend Core Components

- [x] 2.1 Create `Toast.jsx` and `Toast.module.css` — toast notification component with auto-dismiss (3s), success/error variants, vertical stacking
- [x] 2.2 Create `StatusBar.jsx` and `StatusBar.module.css` — displays OPEN/IN_PROGRESS/CLOSED counts with colored progress bars, fetches from `/api/tasks/stats`
- [x] 2.3 Create `App.jsx` and `App.module.css` — root component with tabbed interface (Create Task / Search Tasks), status bar at top, toast container, manages active tab and stats refresh

## 3. Frontend Create Task Tab

- [x] 3.1 Create `TaskForm.jsx` and `TaskForm.module.css` — form with Title input, Description textarea, Priority dropdown (LOW/MEDIUM/HIGH/CRITICAL), inline validation (title required 3-200 chars, priority required), submit calls `POST /api/tasks`, clears on success, shows toast, triggers stats refresh

## 4. Frontend Search Tasks Tab

- [x] 4.1 Create `SearchFilters.jsx` and `SearchFilters.module.css` — keyword text input, status dropdown (All/OPEN/IN_PROGRESS/CLOSED), priority dropdown (All/LOW/MEDIUM/HIGH/CRITICAL), Search button
- [x] 4.2 Create `TaskRow.jsx` and `TaskRow.module.css` — single table row displaying ID, Title, Status badge (green OPEN, blue IN_PROGRESS, gray CLOSED), Priority, Assignee, and action controls (Assign input+button, conditional Unassign button, conditional Close button)
- [x] 4.3 Create `TaskTable.jsx` and `TaskTable.module.css` — table with header row (ID, Title, Status, Priority, Assignee, Actions), renders `TaskRow` for each task, shows "No tasks found" when empty
- [x] 4.4 Create `Pagination.jsx` and `Pagination.module.css` — Previous/Next buttons, "Page X of Y" label, disabled states for first/last page
- [x] 4.5 Create `TaskList.jsx` and `TaskList.module.css` — orchestrates SearchFilters + TaskTable + Pagination, manages filter state, current page, calls `searchTasks` API, handles row action callbacks (assign/unassign/close), refreshes list and stats after actions

## 5. Frontend Integration Testing

- [x] 5.1 Verify full workflow: create a task via form, switch to Search tab, see it in table, assign it, unassign it, close it — confirm toasts and status bar update after each action
