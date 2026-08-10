# GUSS — Global Update Set Studio

Create a ServiceNow IDE-style UI Page called **GUSS** (Global Update Set Studio) in the global scope.

- **Name:** `GUSS`
- **URL:** `guss.do`

## Layout

Full-viewport, dark-themed app consisting of:

- A **resizable left sidebar** — default width `330px`, draggable ±50px.
- A **main content area**.

**Sidebar:** shows a collapsible tree of the current update set's artifacts, grouped by type.
- Folder icons — amber
- File icons — blue
- Each leaf is named by its target record name

**Main area:**
- Top bar with a reload button and update set context info
- Tab strip
- Content viewer that loads artifact records in iframes when clicked

## Empty / Landing State

When no tabs are open, show a centered GUSS splash containing:

- Title and subtitle
- A divider
- An **update set dropdown**, filtered to:
  ```
  application=global^state=in progress^parent=NULL^base_update_set=NULL
  ```
- A **"Make current set"** button that calls `UpdateSetAjax` with `sysparm_type=changeUpdateSet`, using the session token from `window.GUSS_CONTEXT.userToken`

Below the dropdown, show a teal-styled italic callout:

> Only showing global update sets that are in progress and not part of batch sets.

## Add New Artifact

- A `+` button in the sidebar header opens a dropdown menu of artifact types (Script Include, Business Rule, UI Page, etc.).
- The menu is driven by a `sys_properties` record named `spie.guss.update_set_studio.create_artifacts`, containing a JSON array of objects:
  ```json
  { "label": "...", "icon": "...", "tableName": "..." }
  ```
- Clicking a menu item opens a new-record form for that table in a new tab.

## Folder Detail Tabs

Clicking a type folder opens an inline HTML tab listing all artifacts of that type, with each artifact's action label shown as italic **"(New or modified file)"**.

## Script Include

**`GlobalUpdateSetStudioAJAX`** — client-callable, global scope.

| Method | Purpose |
|---|---|
| `getCreateArtifactsPropertyValue()` | Reads the sys_properties artifact menu config |
| `makeCurrentUpdateSet()` | Sets the session's current update set |

## CSS

- Stored separately in a `content_css` record named `global_update_set_studio`.
- Linked from the UI page via a `.cssdbx` URL.
- Dark theme using CSS custom properties, e.g.:
  ```css
  --bg: #111827;
  --panel: #1f2937;
  ```
- Includes a teal callout style: `.guss-empty-note`

## Navigation

Application menu **"GUSS"** with two modules:

1. **Update Set Studio** → `/guss.do`
2. **Styles** → link to the `content_css` record
