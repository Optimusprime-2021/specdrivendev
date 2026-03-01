# Capability: Task Create Form

## Purpose
Provides the task creation form with input fields, client-side validation, and API submission with user feedback.

## Requirements

### Requirement: Create task form with fields
The frontend SHALL display a form in the "Create Task" tab with three fields: Title (text input, required), Description (textarea, optional), and Priority (dropdown with options LOW, MEDIUM, HIGH, CRITICAL, required). The form SHALL include a "Create Task" submit button.

#### Scenario: Form renders with empty fields
- **GIVEN** the user navigates to the Create Task tab
- **WHEN** the form renders
- **THEN** the Title input is empty, Description is empty, and Priority dropdown has no selection or a placeholder

#### Scenario: Priority dropdown options
- **GIVEN** the form is displayed
- **WHEN** the user opens the Priority dropdown
- **THEN** the options are LOW, MEDIUM, HIGH, and CRITICAL

### Requirement: Form validation before submission
The frontend SHALL validate that Title is non-empty and between 3-200 characters, and that Priority is selected, before submitting to the API. Validation errors SHALL be displayed inline next to the relevant field.

#### Scenario: Submit with empty title
- **GIVEN** the title field is empty
- **WHEN** the user clicks "Create Task"
- **THEN** the form does not submit and shows "Title is required" below the title field

#### Scenario: Submit with title too short
- **GIVEN** the title field contains "AB" (2 characters)
- **WHEN** the user clicks "Create Task"
- **THEN** the form does not submit and shows "Title must be 3-200 characters" below the title field

#### Scenario: Submit without priority
- **GIVEN** the title is valid but no priority is selected
- **WHEN** the user clicks "Create Task"
- **THEN** the form does not submit and shows "Priority is required" below the priority field

### Requirement: Form submission and feedback
The frontend SHALL submit the form data as a JSON POST to `/api/tasks`. On success (201), the form SHALL clear all fields, show a success toast, and refresh the status bar. On error, the form SHALL show an error toast with the API error message.

#### Scenario: Successful task creation
- **GIVEN** the user fills in title "Build dashboard", description "Create main UI", priority "HIGH"
- **WHEN** the user clicks "Create Task"
- **THEN** the system calls `POST /api/tasks`, the form clears, a success toast shows "Task created successfully", and the status bar refreshes

#### Scenario: API validation error
- **GIVEN** the frontend validation passes but the API rejects the payload
- **WHEN** the API returns 400 with a validation message
- **THEN** an error toast displays the API error message

#### Scenario: Network error on submission
- **GIVEN** the backend is unreachable
- **WHEN** the user submits the form
- **THEN** an error toast shows "Failed to create task. Please try again."
