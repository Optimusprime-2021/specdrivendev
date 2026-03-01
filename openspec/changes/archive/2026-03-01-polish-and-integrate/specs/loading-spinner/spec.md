## ADDED Requirements

### Requirement: Visual spinner during task list loading
The frontend SHALL display a CSS-animated spinner in place of the task table while search results are being fetched. The spinner SHALL replace the previous "Loading..." text.

#### Scenario: Spinner shown during search fetch
- **GIVEN** the user clicks Search or the Search Tasks tab loads
- **WHEN** the API call is in progress
- **THEN** a spinning indicator is displayed where the task table would appear

#### Scenario: Spinner disappears when data loads
- **GIVEN** the spinner is displayed
- **WHEN** the API response arrives
- **THEN** the spinner is replaced by the task table (or "No tasks found" message)

### Requirement: Visual spinner during status bar loading
The frontend SHALL display a spinner inside the status bar while statistics are being fetched on initial load or refresh.

#### Scenario: Status bar shows spinner during fetch
- **GIVEN** the application loads or a task action triggers a stats refresh
- **WHEN** the stats API call is in progress
- **THEN** the status bar area displays a spinner instead of the stat counts

#### Scenario: Stats replace spinner on success
- **GIVEN** the status bar spinner is displayed
- **WHEN** the stats API response arrives
- **THEN** the spinner is replaced by the OPEN/IN_PROGRESS/CLOSED counts and progress bars

### Requirement: Per-row loading state during task actions
The frontend SHALL disable action buttons and display a small inline spinner on the active row while an assign, unassign, or close action is in progress. Other rows SHALL remain interactive.

#### Scenario: Row buttons disabled during action
- **GIVEN** the user clicks "Assign" on task ID 1
- **WHEN** the API call is in progress
- **THEN** all action buttons on task ID 1's row are disabled and a small spinner is shown, while other rows remain enabled

#### Scenario: Row re-enables after action completes
- **GIVEN** a row action is in progress for task ID 1
- **WHEN** the API call succeeds or fails
- **THEN** the spinner disappears and the row's action buttons are re-enabled
