## MODIFIED Requirements

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
