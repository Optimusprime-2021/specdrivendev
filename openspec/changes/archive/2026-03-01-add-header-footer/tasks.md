## 1. Header Component

- [x] 1.1 Create `Header.jsx` and `Header.module.css` — gradient blue background, centered "Task Management" title in large white bold text, tagline "Organize, track, and complete your work" below in smaller white text, responsive at 768px and 480px

## 2. Footer Component

- [x] 2.1 Create `Footer.jsx` and `Footer.module.css` — light gray background, centered copyright text in small muted font, responsive at 768px and 480px

## 3. Layout Integration

- [x] 3.1 Update `App.jsx` to import and render `Header` at the top (before StatusBar) and `Footer` at the bottom (after Toast), wrap both in ErrorBoundary
- [x] 3.2 Update `App.module.css` to add sticky footer layout — `min-height: 100vh`, `display: flex`, `flex-direction: column` on `.app`, `flex: 1` on a main content wrapper

## 4. Verification

- [x] 4.1 Build the project and verify no compilation errors
- [x] 4.2 Verify header displays with gradient, title, and tagline at all breakpoints
- [x] 4.3 Verify footer sticks to bottom on short content and scrolls naturally on long content
