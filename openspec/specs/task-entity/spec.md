# Capability: Task Entity

## Purpose
Defines the Task JPA entity, its fields, validation rules, enums, and automatic timestamp behavior.

## Requirements

### Requirement: Task entity with auto-generated ID
The system SHALL store tasks as JPA entities with an auto-generated `Long` primary key using `GenerationType.IDENTITY`.

#### Scenario: New task receives auto-generated ID
- **GIVEN** a task is created without an ID
- **WHEN** the task is persisted to the database
- **THEN** the system assigns a unique auto-incremented `Long` ID

### Requirement: Task title validation
The system SHALL require a title field that is non-blank, minimum 3 characters, and maximum 200 characters.

#### Scenario: Valid title accepted
- **GIVEN** a task with title "Fix login bug" (14 characters)
- **WHEN** the task is persisted
- **THEN** the task is saved successfully

#### Scenario: Blank title rejected
- **GIVEN** a task with a blank or empty title
- **WHEN** the task is validated
- **THEN** the system rejects it with message "Title is required"

#### Scenario: Title too short rejected
- **GIVEN** a task with title "AB" (2 characters)
- **WHEN** the task is validated
- **THEN** the system rejects it with message "Title must be 3-200 characters"

#### Scenario: Title too long rejected
- **GIVEN** a task with title exceeding 200 characters
- **WHEN** the task is validated
- **THEN** the system rejects it with message "Title must be 3-200 characters"

### Requirement: Task description is optional
The system SHALL accept an optional description field with a maximum length of 2000 characters.

#### Scenario: Task created without description
- **GIVEN** a task with no description
- **WHEN** the task is persisted
- **THEN** the task is saved with description as null

#### Scenario: Task created with valid description
- **GIVEN** a task with a description under 2000 characters
- **WHEN** the task is persisted
- **THEN** the task is saved with the provided description

### Requirement: Task status enum with default
The system SHALL use a `TaskStatus` enum with values `OPEN`, `IN_PROGRESS`, `CLOSED`. New tasks SHALL default to `OPEN`. Status MUST be stored as a string in the database.

#### Scenario: New task defaults to OPEN
- **GIVEN** a task is created without specifying status
- **WHEN** the task is persisted
- **THEN** the task status is `OPEN`

#### Scenario: Status stored as string
- **GIVEN** a task with status `IN_PROGRESS`
- **WHEN** queried from the database
- **THEN** the status column contains the string "IN_PROGRESS" (not an ordinal)

### Requirement: Task priority enum
The system SHALL use a `TaskPriority` enum with values `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`. Priority MUST be stored as a string and is required.

#### Scenario: Task created with priority
- **GIVEN** a task with priority `HIGH`
- **WHEN** the task is persisted
- **THEN** the priority is stored as the string "HIGH"

#### Scenario: Task without priority rejected
- **GIVEN** a task with no priority specified
- **WHEN** the task is validated
- **THEN** the system rejects it as priority is required

### Requirement: Task assignee is nullable
The system SHALL store an optional `assignee` field as a nullable `String`.

#### Scenario: Task created without assignee
- **GIVEN** a task with no assignee
- **WHEN** the task is persisted
- **THEN** the assignee field is null

#### Scenario: Task with assignee
- **GIVEN** a task assigned to "alice"
- **WHEN** the task is persisted
- **THEN** the assignee field contains "alice"

### Requirement: Automatic timestamps
The system SHALL automatically set `createdDate` on entity creation and `updatedDate` on both creation and every update, using `LocalDateTime`. The `createdDate` field SHALL NOT be modifiable after creation.

#### Scenario: Timestamps set on creation
- **GIVEN** a new task is being created
- **WHEN** the task is persisted
- **THEN** both `createdDate` and `updatedDate` are set to the current time

#### Scenario: Only updatedDate changes on update
- **GIVEN** an existing task created at time T1
- **WHEN** the task is updated at time T2
- **THEN** `createdDate` remains T1 and `updatedDate` is set to T2
