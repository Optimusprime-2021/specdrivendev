## MODIFIED Requirements

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
