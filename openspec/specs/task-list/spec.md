# Capability: Task List

## Purpose
Provides the search, filtering, display, and workflow actions for browsing and managing tasks in the Search Tasks tab.

## Requirements

### Requirement: Search filter bar
The frontend SHALL display a filter bar at the top of the Search Tasks tab with three filter controls: a keyword text input, a status dropdown (All, OPEN, IN_PROGRESS, CLOSED), and a priority dropdown (All, LOW, MEDIUM, HIGH, CRITICAL). A "Search" button SHALL trigger the search. Filters SHALL reset pagination to page 0 when applied.

#### Scenario: Search by keyword
- **GIVEN** the Search Tasks tab is active
- **WHEN** the user enters "login" in the keyword field and clicks Search
- **THEN** the table displays only tasks matching "login" in title or description

#### Scenario: Filter by status
- **GIVEN** tasks with mixed statuses exist
- **WHEN** the user selects "OPEN" from the status dropdown and clicks Search
- **THEN** the table displays only tasks with status OPEN

#### Scenario: Filter by priority
- **GIVEN** tasks with mixed priorities exist
- **WHEN** the user selects "HIGH" from the priority dropdown and clicks Search
- **THEN** the table displays only tasks with priority HIGH

#### Scenario: Combined filters
- **GIVEN** tasks exist with various statuses and priorities
- **WHEN** the user selects status "OPEN" and priority "HIGH" and clicks Search
- **THEN** the table displays only OPEN tasks with HIGH priority

#### Scenario: Clear filters shows all tasks
- **GIVEN** the user has active filters applied
- **WHEN** the user clears all filter fields and clicks Search
- **THEN** the table displays all tasks (unfiltered, paginated)

### Requirement: Task table grid with columns
The frontend SHALL display search results in a table with columns: ID, Title, Status, Priority, Assignee, and Actions. The Status column SHALL display a color-coded badge (green for OPEN, blue for IN_PROGRESS, gray for CLOSED). Rows SHALL be sorted by creation date descending (as returned by the API).

#### Scenario: Table displays task data
- **GIVEN** the search returns tasks
- **WHEN** the table renders
- **THEN** each row shows the task's ID, title, status badge, priority, assignee (or empty), and action buttons

#### Scenario: Status badge colors
- **GIVEN** a task with status OPEN
- **WHEN** the row renders
- **THEN** the status column shows a green badge with text "OPEN"

#### Scenario: Empty assignee display
- **GIVEN** a task with no assignee
- **WHEN** the row renders
- **THEN** the assignee column is empty or shows a dash

#### Scenario: No results message
- **GIVEN** a search returns zero results
- **WHEN** the table renders
- **THEN** a message "No tasks found" is displayed instead of an empty table

### Requirement: Row actions for task workflow
The frontend SHALL display action controls at the bottom of each table row. Each row SHALL have: an Assign control (text input for assignee name + "Assign" button), an "Unassign" button (visible only if the task has an assignee), and a "Close" button (visible only if the task status is not CLOSED). Clicking "Close" SHALL open a confirmation dialog instead of calling the API directly. After any action succeeds, the task list and status bar SHALL refresh. While an action is in progress for a row, that row's action buttons SHALL be disabled and a spinner SHALL be shown.

#### Scenario: Assign a task
- **GIVEN** a task with ID 1 exists with status OPEN
- **WHEN** the user enters "alice" in the assign input and clicks "Assign"
- **THEN** the system calls `PATCH /api/tasks/1/assign` with `{"assignee": "alice"}`, the table refreshes showing the task as IN_PROGRESS assigned to "alice", and a success toast appears

#### Scenario: Assign with empty name
- **GIVEN** the assign text input is empty
- **WHEN** the user clicks "Assign"
- **THEN** the system does not call the API and shows an error toast "Please enter an assignee name"

#### Scenario: Unassign button visibility
- **GIVEN** a task assigned to "alice"
- **WHEN** the row renders
- **THEN** the "Unassign" button is visible

#### Scenario: Unassign button hidden when no assignee
- **GIVEN** a task with no assignee
- **WHEN** the row renders
- **THEN** the "Unassign" button is not displayed

#### Scenario: Unassign a task
- **GIVEN** a task assigned to "alice" with status IN_PROGRESS
- **WHEN** the user clicks "Unassign"
- **THEN** the system calls `PATCH /api/tasks/1/unassign`, the table refreshes showing the task as OPEN with no assignee, and a success toast appears

#### Scenario: Close button visibility
- **GIVEN** a task with status OPEN
- **WHEN** the row renders
- **THEN** the "Close" button is visible

#### Scenario: Close button hidden when already closed
- **GIVEN** a task with status CLOSED
- **WHEN** the row renders
- **THEN** the "Close" button is not displayed

#### Scenario: Close a task via confirmation
- **GIVEN** a task with ID 1 and status OPEN
- **WHEN** the user clicks "Close" and then confirms in the dialog
- **THEN** the system calls `PATCH /api/tasks/1/close`, the table refreshes showing the task as CLOSED, and a success toast appears

#### Scenario: Action fails with API error
- **GIVEN** the user attempts to assign a closed task
- **WHEN** the API returns 409
- **THEN** an error toast shows the API error message and the table state is unchanged

#### Scenario: Row shows loading state during action
- **GIVEN** the user clicks "Assign" on task ID 1
- **WHEN** the API call is in progress
- **THEN** all action buttons on task ID 1's row are disabled and a spinner is shown

### Requirement: Pagination controls
The frontend SHALL display pagination controls below the table with "Previous" and "Next" buttons, and a "Page X of Y" label. Page size SHALL be fixed at 10. The "Previous" button SHALL be disabled on page 1. The "Next" button SHALL be disabled on the last page.

#### Scenario: First page disables Previous
- **GIVEN** results are on page 1 of 3
- **WHEN** the pagination renders
- **THEN** "Previous" is disabled, "Next" is enabled, and label shows "Page 1 of 3"

#### Scenario: Last page disables Next
- **GIVEN** results are on page 3 of 3
- **WHEN** the pagination renders
- **THEN** "Previous" is enabled, "Next" is disabled, and label shows "Page 3 of 3"

#### Scenario: Navigate to next page
- **GIVEN** the user is on page 1
- **WHEN** the user clicks "Next"
- **THEN** the table loads page 2 results and label updates to "Page 2 of 3"

#### Scenario: Single page hides pagination
- **GIVEN** results fit on one page (10 or fewer)
- **WHEN** the pagination renders
- **THEN** both "Previous" and "Next" are disabled and label shows "Page 1 of 1"
