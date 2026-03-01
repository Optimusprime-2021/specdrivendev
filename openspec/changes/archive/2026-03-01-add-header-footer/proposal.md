## Why

The application currently has no branded header or footer, making it look like an unfinished prototype. Adding a polished header with the app title "Task Management" and a footer with copyright/credit info gives the page a professional, complete appearance.

## What Changes

- Add a header component at the top of the page with the title "Task Management", a subtitle tagline, and a clean branded look (gradient or colored background)
- Add a footer component at the bottom of the page with copyright text and a subtle design
- Adjust the overall page layout so the footer stays at the bottom (sticky footer pattern) even when content is short
- Ensure both header and footer are responsive at tablet and mobile breakpoints

## Capabilities

### New Capabilities
- `page-header`: Branded header bar with application title and tagline displayed at the top of the page
- `page-footer`: Footer bar with copyright text displayed at the bottom of the page

### Modified Capabilities
None — this is purely additive layout. No existing requirements change.

## Impact

**Frontend:**
- New components: `Header.jsx` + `Header.module.css`, `Footer.jsx` + `Footer.module.css`
- Modified: `App.jsx` (add Header and Footer to layout), `App.module.css` (sticky footer layout with min-height)

**Backend:** No backend changes required.

**API endpoints affected:** None.

**Rollback strategy:** Remove the Header and Footer component imports from `App.jsx` and revert the CSS layout changes. No data or backend state to undo.
