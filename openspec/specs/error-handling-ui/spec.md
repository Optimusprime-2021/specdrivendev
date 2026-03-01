# Capability: Error Handling UI

## Purpose
Provides error boundary components that isolate failures in major UI sections, preventing a crash in one area from taking down the entire application.

## Requirements

### Requirement: Error boundary around major sections
The frontend SHALL wrap each major section (StatusBar, active tab content, Toast container) in a React error boundary. If a component within a boundary throws a render error, the boundary SHALL display a fallback UI with the message "Something went wrong" and a "Try Again" button. Clicking "Try Again" SHALL reset the error state and re-render the component. Other sections outside the crashed boundary SHALL remain functional.

#### Scenario: Component crash shows fallback
- **GIVEN** the TaskList component throws an unhandled render error
- **WHEN** the error boundary catches it
- **THEN** the TaskList section displays "Something went wrong" with a "Try Again" button, while the StatusBar and Toast container remain functional

#### Scenario: Try Again resets the boundary
- **GIVEN** an error boundary is displaying the fallback UI
- **WHEN** the user clicks "Try Again"
- **THEN** the boundary resets its error state and attempts to re-render the original component

#### Scenario: Multiple boundaries are independent
- **GIVEN** the StatusBar boundary has caught an error
- **WHEN** the user switches tabs or interacts with the TaskList
- **THEN** the TaskList section works normally and is unaffected by the StatusBar error
