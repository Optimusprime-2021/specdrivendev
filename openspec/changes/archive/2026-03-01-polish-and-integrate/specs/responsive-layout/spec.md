## ADDED Requirements

### Requirement: Tablet layout at 768px breakpoint
The frontend SHALL adapt its layout for viewports at or below 768px width. The search filter bar SHALL stack its inputs vertically. The status bar items SHALL stack in a column. General padding and margins SHALL reduce to fit smaller screens.

#### Scenario: Filters stack vertically on tablet
- **GIVEN** the viewport width is 768px or less
- **WHEN** the Search Tasks tab is active
- **THEN** the keyword input, status dropdown, priority dropdown, and Search button are stacked vertically with full width

#### Scenario: Status bar stacks on tablet
- **GIVEN** the viewport width is 768px or less
- **WHEN** the page loads
- **THEN** the status bar items (OPEN, IN_PROGRESS, CLOSED) are displayed in a single column instead of a row

### Requirement: Mobile layout at 480px breakpoint
The frontend SHALL adapt its layout for viewports at or below 480px width. The task table SHALL be wrapped in a horizontally scrollable container. Font sizes SHALL be reduced. Pagination controls SHALL stack. Action buttons SHALL be full width.

#### Scenario: Table scrolls horizontally on mobile
- **GIVEN** the viewport width is 480px or less
- **WHEN** the task table renders
- **THEN** the table is inside a horizontally scrollable container so all columns are accessible

#### Scenario: Pagination stacks on mobile
- **GIVEN** the viewport width is 480px or less
- **WHEN** pagination renders
- **THEN** the Previous button, page label, and Next button are stacked vertically

#### Scenario: Desktop layout unchanged
- **GIVEN** the viewport width is above 768px
- **WHEN** the page renders
- **THEN** the layout is identical to the current horizontal arrangement
