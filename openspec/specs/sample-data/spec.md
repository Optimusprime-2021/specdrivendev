# Capability: Sample Data

## Purpose
Defines the sample data seeding behavior that populates the database on application startup for development and demonstration purposes.

## Requirements

### Requirement: Sample data loader runs on startup
The system SHALL include a `DataLoader` component that seeds the H2 database with sample tasks when the application starts. It SHALL use `CommandLineRunner` to execute after Spring context initialization.

#### Scenario: Data loaded on application startup
- **GIVEN** the application is starting with an empty database
- **WHEN** the Spring context finishes initialization
- **THEN** sample tasks are persisted to the database and a log message confirms the count

### Requirement: Sample data covers all statuses and priorities
The sample data SHALL include tasks with every combination of `TaskStatus` (OPEN, IN_PROGRESS, CLOSED) and a variety of `TaskPriority` values (LOW, MEDIUM, HIGH, CRITICAL). Some tasks SHALL have assignees and some SHALL not.

#### Scenario: All task statuses represented
- **GIVEN** the application has started and sample data is loaded
- **WHEN** tasks are queried grouped by status
- **THEN** there is at least one task in OPEN, IN_PROGRESS, and CLOSED status

#### Scenario: Multiple priorities represented
- **GIVEN** the application has started and sample data is loaded
- **WHEN** tasks are queried grouped by priority
- **THEN** there are tasks across multiple priority levels

#### Scenario: Mixed assignee state
- **GIVEN** the application has started and sample data is loaded
- **WHEN** tasks are queried
- **THEN** some tasks have a non-null assignee and some have a null assignee

### Requirement: Sufficient sample data for pagination
The sample data SHALL include enough tasks (at least 15) to demonstrate pagination with the default page size of 10.

#### Scenario: Enough data for multiple pages
- **GIVEN** the application has started and sample data is loaded
- **WHEN** `GET /api/tasks` is called with default page size
- **THEN** `totalPages` is at least 2
