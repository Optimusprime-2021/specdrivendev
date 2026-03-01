# Capability: Task Dashboard

## Purpose
Provides the main dashboard layout for the task management application, including tabbed navigation, status statistics, and user feedback via toast notifications.

## Requirements

### Requirement: Tabbed interface with two tabs
The frontend SHALL display a tabbed interface with exactly two tabs: "Create Task" and "Search Tasks". The "Search Tasks" tab SHALL be active by default. Clicking a tab SHALL switch the visible content without a page reload. Each tab's content and the status bar SHALL be wrapped in an error boundary so that a crash in one section does not affect the others.

#### Scenario: Default tab on load
- **GIVEN** the user opens the application
- **WHEN** the page loads
- **THEN** the "Search Tasks" tab is active and its content is displayed

#### Scenario: Switch to Create Task tab
- **GIVEN** the "Search Tasks" tab is active
- **WHEN** the user clicks the "Create Task" tab
- **THEN** the "Create Task" form is displayed and "Search Tasks" content is hidden

#### Scenario: Switch back to Search Tasks tab
- **GIVEN** the "Create Task" tab is active
- **WHEN** the user clicks the "Search Tasks" tab
- **THEN** the search/filter interface with task table is displayed

#### Scenario: Section crash contained by error boundary
- **GIVEN** a component within the tab content throws a render error
- **WHEN** the error boundary catches it
- **THEN** the tab section shows a fallback UI while the status bar and toasts remain functional

### Requirement: Status bar with task statistics
The frontend SHALL display a status bar at the top of the page showing task counts for OPEN, IN_PROGRESS, and CLOSED statuses. Each status SHALL display as a label with its count and a colored progress bar representing its proportion of the total. The status bar SHALL refresh after every task action (create, assign, unassign, close).

#### Scenario: Status bar displays statistics on load
- **GIVEN** the backend has 5 OPEN, 3 IN_PROGRESS, and 2 CLOSED tasks
- **WHEN** the page loads
- **THEN** the status bar shows "OPEN: 5", "IN_PROGRESS: 3", "CLOSED: 2" with proportional colored progress bars

#### Scenario: Status bar refreshes after task action
- **GIVEN** the status bar shows "OPEN: 5"
- **WHEN** the user closes a task
- **THEN** the status bar refreshes and shows "OPEN: 4" and "CLOSED: 3"

#### Scenario: Status bar with no tasks
- **GIVEN** no tasks exist in the system
- **WHEN** the page loads
- **THEN** the status bar shows "OPEN: 0", "IN_PROGRESS: 0", "CLOSED: 0" with empty progress bars

#### Scenario: Status bar API error
- **GIVEN** the backend is unreachable
- **WHEN** the status bar attempts to fetch statistics
- **THEN** an error toast is displayed and the status bar shows zeroes or its previous state

### Requirement: Toast notifications for user feedback
The frontend SHALL display toast notifications for success and error outcomes of all task operations. Success toasts SHALL auto-dismiss after 3 seconds. Error toasts SHALL display the error message from the API response. Multiple toasts SHALL stack vertically.

#### Scenario: Success toast on task creation
- **GIVEN** the user submits a valid create task form
- **WHEN** the API returns 201
- **THEN** a success toast appears with message "Task created successfully" and auto-dismisses after 3 seconds

#### Scenario: Error toast on API failure
- **GIVEN** the user attempts to assign a closed task
- **WHEN** the API returns 409 with message "Cannot assign a closed task"
- **THEN** an error toast appears displaying "Cannot assign a closed task"

#### Scenario: Multiple toasts stack
- **GIVEN** a success toast is visible
- **WHEN** another action triggers a new toast
- **THEN** both toasts are visible, stacked vertically
