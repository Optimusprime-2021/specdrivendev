## ADDED Requirements

### Requirement: Application header with title and tagline
The frontend SHALL display a header bar at the top of the page with a gradient blue background (matching the app's primary color #007bff). The header SHALL contain the title "Task Management" in large white bold text and a tagline "Organize, track, and complete your work" in smaller white text below it. Both lines SHALL be centered. The header SHALL be responsive, reducing font sizes and padding at tablet (768px) and mobile (480px) breakpoints.

#### Scenario: Header visible on page load
- **GIVEN** the user opens the application
- **WHEN** the page loads
- **THEN** a blue gradient header is displayed at the top with "Task Management" as the title and the tagline below it

#### Scenario: Header responsive at tablet
- **GIVEN** the viewport width is 768px or less
- **WHEN** the header renders
- **THEN** the title and tagline font sizes are reduced and padding is decreased

#### Scenario: Header responsive at mobile
- **GIVEN** the viewport width is 480px or less
- **WHEN** the header renders
- **THEN** the title and tagline font sizes are further reduced to fit the narrow viewport
