---
name: ux-patterns
description:
  React UX component patterns. Use when building React
  components including tabs, table grids with row actions,
  pagination controls, status bars with progress indicators,
  search filter bars, and form inputs. Provides reusable
  JSX patterns with specific visual behaviors.
---

# UX Component Patterns

## Tabbed Interface Pattern
Use state-driven tabs, NOT react-router:
```jsx
const [activeTab, setActiveTab] = useState('tab1');

<div className="tabs">
  {tabs.map(tab => (
    <button
      key={tab.key}
      className={activeTab === tab.key ? 'active' : ''}
      onClick={() => setActiveTab(tab.key)}>
      {tab.label}
    </button>
  ))}
</div>
{activeTab === 'tab1' && <Tab1Content />}
{activeTab === 'tab2' && <Tab2Content />}
```
- Active tab: bold text + blue bottom border (3px)
- Only active tab rendered (not hidden via display:none)
- Switching tabs refreshes data

## Table Grid with Row Actions Pattern
```jsx
// Columns defined by config; actions in last column
<table>
  <thead>
    <tr>{columns.map(col => <th key={col.key}>{col.label}</th>)}</tr>
  </thead>
  <tbody>
    {rows.map(row => (
      <tr key={row.id}>
        {columns.map(col => <td key={col.key}>{col.render(row)}</td>)}
        <td className="actions">
          <div className="action-row">
            {actions.filter(a => a.visible(row)).map(action => (
              <button key={action.key} className={`btn-${action.key}`}
                onClick={() => action.handler(row)}>
                {action.label}
              </button>
            ))}
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```
- Status badges with colors:
  Use a color map for statuses, e.g. `{ active: '#3498db', pending: '#f39c12', done: '#27ae60' }`
  White text, border-radius: 12px, padding: 2px 10px
- Inline inputs (e.g. assignment field) go inside the action-row
- Conditional actions: use `visible(row)` to show/hide per-row buttons
- Row hover: light gray background (#f9f9f9)

## Pagination Pattern
```jsx
<div className="pagination">
  <button
    disabled={page === 0}
    onClick={() => onPageChange(page - 1)}>
    ◀ Previous
  </button>
  <span>
    Page {page + 1} of {totalPages} ({totalElements} total)
  </span>
  <button
    disabled={page >= totalPages - 1}
    onClick={() => onPageChange(page + 1)}>
    Next ▶
  </button>
</div>
```
- Default 10 items per page (configurable via PAGE_SIZE constant)
- Disabled state on first page (Previous) / last page (Next)
- New search always resets to page 0

## Status Bar Pattern
```jsx
// Horizontal bar at TOP of app showing live counts with progress bars
<div className="status-bar">
  {statuses.map(status => (
    <div key={status.key} className="stat">
      <span className="count">{status.count}</span>
      <span className="label">{status.label}</span>
      <div className="progress-bar" style={{
        width: `${(status.count / total) * 100}%`,
        backgroundColor: status.color
      }} />
    </div>
  ))}
  <div className="stat total">
    <span className="count">{total}</span>
    <span className="label">Total</span>
  </div>
</div>
```
- Refreshes after EVERY mutating action (create, update, delete)
- Use consistent color map across status badges and progress bars
- Progress bars show proportional width relative to total

## Form Pattern
- Text input: required fields use `minLength` / `maxLength` validation
- Textarea: optional, with `maxLength` constraint
- Dropdown select: use for enum/category fields
- Submit button: disabled while loading (show spinner)
- Success: green toast message + clear form fields
- Error: red toast with `error.message` from API

## Search Filter Bar Pattern
- Keyword: text input (searches across relevant text fields)
- Filter dropdowns: one per filterable enum field (include "All" default option)
- Search button: triggers API call, resets page to 0
- Clear button: resets all filter inputs to defaults