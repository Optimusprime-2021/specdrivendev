# Capability: Confirmation Dialog

## Purpose
Provides a modal confirmation dialog that requires explicit user confirmation before performing destructive or irreversible task actions.

## Requirements

### Requirement: Confirmation dialog before closing a task
The frontend SHALL display a confirmation dialog when the user clicks the "Close" button on a task row. The dialog SHALL show the message "Are you sure you want to close this task?" with "Confirm" and "Cancel" buttons. The dialog SHALL appear as a modal overlay preventing interaction with the page behind it. Clicking "Confirm" SHALL proceed with the close API call. Clicking "Cancel" SHALL dismiss the dialog without any API call.

#### Scenario: Close button opens confirmation dialog
- **GIVEN** a task with status OPEN is displayed in the table
- **WHEN** the user clicks the "Close" button
- **THEN** a modal dialog appears with the message "Are you sure you want to close this task?" and "Confirm" and "Cancel" buttons

#### Scenario: Confirm closes the task
- **GIVEN** the confirmation dialog is open for task ID 1
- **WHEN** the user clicks "Confirm"
- **THEN** the system calls `PATCH /api/tasks/1/close`, the dialog dismisses, the table refreshes, and a success toast appears

#### Scenario: Cancel dismisses the dialog
- **GIVEN** the confirmation dialog is open
- **WHEN** the user clicks "Cancel"
- **THEN** the dialog dismisses and no API call is made

#### Scenario: Dialog blocks background interaction
- **GIVEN** the confirmation dialog is open
- **WHEN** the user attempts to click a button or link behind the overlay
- **THEN** the click is blocked and the dialog remains open
