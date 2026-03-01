# page-footer

## Purpose
Defines the application footer displayed at the bottom of every page, including copyright text, sticky footer behavior, and responsive styling.

## Requirements

### Requirement: Page footer with copyright text
The frontend SHALL display a footer bar at the bottom of the page with a light gray background. The footer SHALL contain centered copyright text in small muted font. The footer SHALL stick to the bottom of the viewport when the page content is shorter than the screen height (sticky footer pattern). The footer SHALL be responsive at tablet and mobile breakpoints.

#### Scenario: Footer visible on page load
- **GIVEN** the user opens the application
- **WHEN** the page loads
- **THEN** a light gray footer is displayed at the bottom with copyright text

#### Scenario: Footer stays at bottom on short content
- **GIVEN** the page content is shorter than the viewport height
- **WHEN** the page renders
- **THEN** the footer is positioned at the bottom of the viewport, not immediately after the content

#### Scenario: Footer scrolls with long content
- **GIVEN** the page content exceeds the viewport height
- **WHEN** the user scrolls to the bottom
- **THEN** the footer appears below all content, not overlapping it
