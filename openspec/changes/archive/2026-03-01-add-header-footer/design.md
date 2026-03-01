## Context

The app currently renders directly into a `div.app` container with StatusBar, tabs, content, and Toast. There is no visual header identifying the application and no footer. The page feels incomplete on short content because nothing anchors the bottom.

## Goals / Non-Goals

**Goals:**
- Add a visually appealing header with "Task Management" title and a short tagline
- Add a minimal footer with copyright text
- Use a sticky footer pattern so the footer sits at the viewport bottom when content is short
- Keep both responsive at existing breakpoints (768px, 480px)

**Non-Goals:**
- Navigation links in the header (only tabs exist, they stay where they are)
- Logo or icon assets (text-only branding)
- Dark mode header/footer variants
- User profile or settings in the header

## Decisions

**Decision 1: Header with gradient background**

Use a linear gradient from `#007bff` to `#0056b3` (matching the existing blue accent color). White text. Title "Task Management" in large font, a small tagline "Organize, track, and complete your work" below it. Centered text.

*Alternative considered*: Flat solid color — gradient gives more visual depth for minimal effort.

**Decision 2: Minimal footer with muted style**

Light gray background (`#f8f9fa`, matching StatusBar), centered text with small font, copyright line. Keeps the footer unobtrusive.

*Alternative considered*: Footer with links/social icons — overkill for an internal task management tool.

**Decision 3: Sticky footer via flexbox on body/root**

Apply `min-height: 100vh` and `display: flex; flex-direction: column` to the `.app` container. The main content area gets `flex: 1` so the footer is pushed to the bottom. This is the standard modern sticky footer pattern.

*Alternative considered*: `position: fixed` footer — obscures content on scroll, bad UX.

**Decision 4: Header and Footer as simple presentational components**

Both are pure presentational components with no state, no props, and no logic. Just JSX + CSS Module. Keeps them trivial and easy to maintain.

## Risks / Trade-offs

**[Risk] Header adds vertical space, reducing content area** → Header is ~80px tall, acceptable for a desktop app. At mobile breakpoints, reduce padding/font to minimize impact.

**[Risk] Sticky footer requires layout change on `.app`** → Only adds flex properties to the existing container. No structural HTML changes needed beyond adding the two components.
