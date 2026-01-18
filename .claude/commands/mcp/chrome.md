# /chrome — Browser Automation & DevTools

> **MCP WRAPPER** — This is documentation only. After reading, you MUST use the MCP tools:
> → Tools: `mcp__chrome-devtools__*` (see list below)

Control Chrome browser for testing, debugging, and automation.

## Tools

**Navigation & Pages**
- `list_pages` — List open pages
- `select_page` — Switch to a page
- `new_page` — Open new page with URL
- `close_page` — Close a page
- `navigate_page` — Navigate, reload, back/forward

**Interaction**
- `click` — Click element
- `hover` — Hover over element
- `fill` — Fill input/textarea/select
- `fill_form` — Fill multiple form elements
- `press_key` — Keyboard input
- `drag` — Drag and drop
- `upload_file` — Upload file through input
- `handle_dialog` — Accept/dismiss browser dialogs

**Inspection**
- `take_snapshot` — A11y tree snapshot (preferred over screenshot)
- `take_screenshot` — Visual screenshot
- `list_network_requests` — Network activity
- `get_network_request` — Request details
- `list_console_messages` — Console logs
- `get_console_message` — Message details
- `evaluate_script` — Run JavaScript in page

**Performance**
- `performance_start_trace` — Start performance recording
- `performance_stop_trace` — Stop recording
- `performance_analyze_insight` — Analyze specific insight

**Emulation**
- `emulate` — CPU throttling, network conditions, geolocation
- `resize_page` — Change viewport size
- `wait_for` — Wait for text to appear

## When to Use
- Testing UI interactions
- Debugging frontend issues
- Performance profiling
- Automating browser tasks

Claude will use these tools when you ask to interact with a browser.
