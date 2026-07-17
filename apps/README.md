# Embeddable tile apps

This folder is where future self-built apps live. Each app is a self-contained
static page in its own subfolder (`apps/<id>/index.html`) that gets embedded
into the site as a tile — the Windows Phone shell (turnstile animations, back
button, app list, search) is provided for free.

## Adding a new app

1. Create `apps/<id>/index.html` — any static HTML/CSS/JS works. It renders
   inside an `<iframe>`, so it's fully sandboxed from the shell.

2. Register it in the `APPS` array in `script.js`:

   ```js
   { id: "myapp", name: "My App", icon: "fa-solid fa-cube", embed: "apps/myapp/index.html" },
   ```

   That alone puts it in the all-apps list (searchable, jump-grid, the works).

3. Optionally pin it to the Start screen by adding an entry to the `START`
   array in `script.js`:

   ```js
   { app: "myapp", size: "medium", variant: "accent" },
   ```

   - `size`: `small` (1×1) · `medium` (2×2) · `wide` (4×2) · `large` (4×4)
   - `variant`: `accent` (solid brand blue) or `transparent` (the shared
     wallpaper shows through, WP 8.1 style)
   - To make it a **live tile**, add `live: { template: "flip" | "peek" }`
     and a `faces: [...]` array of HTML strings — face 0 is the resting
     front (usually `face("fa-solid fa-cube")`), and the engine cycles
     through the rest on an organic randomized schedule.

## Booking embed

The Book a Call page has an empty `<div id="booking-embed">` slot. To switch
from contact links to a real scheduler, paste a Calendly inline embed (or any
form service snippet) into that div in the `book` entry of `APPS` in
`script.js`.

## Example

`apps/demo/` is a minimal working example, registered as "Demo App" in the
all-apps list.
