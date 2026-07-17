/* ================================================================
   OKKOKI — Windows Phone reimagined for 2026
   Liquid-glass tile system with classic WP modes, persistent
   layout (resize/unpin/drag-reorder), lock screen, Settings,
   and built-in apps: Music, Videos, Calculator, Calendar, Notes,
   Weather, Camera, Photos. Icons: Fluent UI System Icons (MIT)
   + Simple Icons, inlined as an SVG sprite in index.html.
   ================================================================ */
(() => {
    "use strict";

    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const MONTHS = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
    const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    /* Sprite icon helper */
    const ic = (name, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

    /* ================================================================
       Contact details — replace the placeholders with real ones.
       ================================================================ */
    const CONTACT = {
        email: "hello@okkoki.com",            /* TODO: real email */
        phone: "+15550123456",                /* TODO: real phone (tel: format) */
        phoneDisplay: "+1 (555) 012-3456",
        whatsapp: "15550123456",              /* TODO: real number for wa.me */
    };

    /* ================================================================
       Settings (persisted on this device)
       ================================================================ */
    const DEFAULT_ACCENT = "#0057b7";
    const WP_COLORS = [
        ["Brand", "#0057b7"], ["Cobalt", "#0050ef"], ["Cyan", "#1ba1e2"],
        ["Teal", "#00aba9"], ["Emerald", "#008a00"], ["Green", "#60a917"],
        ["Lime", "#a4c400"], ["Yellow", "#e3c800"], ["Amber", "#f0a30a"],
        ["Orange", "#fa6800"], ["Red", "#e51400"], ["Crimson", "#a20025"],
        ["Magenta", "#d80073"], ["Violet", "#aa00ff"], ["Indigo", "#6a00ff"],
        ["Steel", "#647687"],
    ];

    function lighten(hex, amt = 0.24) {
        const n = parseInt(hex.slice(1), 16);
        const mix = (c) => Math.round(c + (255 - c) * amt);
        return `rgb(${mix(n >> 16 & 255)}, ${mix(n >> 8 & 255)}, ${mix(n & 255)})`;
    }

    const glassSupported = () =>
        (window.CSS && (CSS.supports("backdrop-filter", "blur(1px)") || CSS.supports("-webkit-backdrop-filter", "blur(1px)")));

    const getAccent = () => localStorage.getItem("okkoki_accent") || DEFAULT_ACCENT;
    const lockEnabled = () => localStorage.getItem("okkoki_lock") !== "off";

    function tileStyle() {
        const s = localStorage.getItem("okkoki_tiles");
        if (s === "glass" || s === "transparent" || s === "solid") return s;
        return glassSupported() ? "glass" : "transparent";
    }

    function setAccent(hex) {
        document.documentElement.style.setProperty("--accent", hex);
        document.documentElement.style.setProperty("--accent-lite", lighten(hex));
        localStorage.setItem("okkoki_accent", hex);
    }

    function applySettings() {
        if (getAccent() !== DEFAULT_ACCENT) setAccent(getAccent());
        document.body.dataset.tiles = tileStyle();
    }

    /* ---------------- Page block builders ---------------- */
    const p    = (t) => `<p class="metro-p">${t}</p>`;
    const big  = (t) => `<p class="metro-big">${t}</p>`;
    const small = (t) => `<p class="metro-small">${t}</p>`;
    const item = (icon, title, sub) =>
        `<div class="metro-item"><div class="metro-item-icon">${ic(icon)}</div>` +
        `<div><div class="metro-item-title">${title}</div><div class="metro-item-sub">${sub}</div></div></div>`;
    const btn = (href, icon, label, primary = false) =>
        `<a class="metro-btn${primary ? " primary" : ""}" href="${href}">${ic(icon)} ${label}</a>`;
    const openBtn = (appId, icon, label, primary = false) =>
        `<button class="metro-btn${primary ? " primary" : ""}" data-open="${appId}">${ic(icon)} ${label}</button>`;
    const social = (icon, label) => [
        `<div class="social-hero">${ic(icon)}</div>`, p(label),
        `<a class="metro-btn" href="#" onclick="return false">${ic(icon)} Follow @okkoki</a>`,
        small("Replace the link above with your real profile URL."),
    ];
    const post = (title, date, snippet) =>
        `<div class="blog-post"><div class="blog-post-title">${title}</div>` +
        `<div class="blog-post-date">${date}</div><p class="metro-p">${snippet}</p></div>`;

    /* ================================================================
       APP REGISTRY — the single source of truth.
       icon = sprite symbol id (see the inline SVG sprite in index.html)
       ================================================================ */
    const APPS = [
        { id: "services", name: "Services", icon: "rocket", page: () => [
            item("briefcase", "Website building", "Fast, modern sites that turn visitors into customers"),
            item("news", "Paid media", "Google &amp; Meta ads managed for real return, not vanity clicks"),
            item("search", "SEO &amp; growth", "Get found by the people already searching for you"),
            item("contact", "Social media", "Content and community that keep your brand top of mind"),
            openBtn("book", "book", "Book a free growth call", true),
        ]},
        { id: "book", name: "Book a Call", icon: "book", page: () => [
            big("Let's grow your business."),
            p("The first 30-minute growth call is free — we'll look at where you are, what's possible, and whether we're a fit. No pressure, no jargon."),
            btn(`https://wa.me/${CONTACT.whatsapp}`, "brand-whatsapp", "WhatsApp", true) +
            btn(`mailto:${CONTACT.email}`, "mail", "Email") +
            btn(`tel:${CONTACT.phone}`, "call", "Call"),
            /* Scheduler slot: paste a Calendly inline embed (or any form
               service snippet) inside this div and it appears here. */
            `<div id="booking-embed" class="booking-embed"></div>`,
            small("Prefer a scheduler? A Calendly embed drops straight into this page — see apps/README.md."),
        ]},
        { id: "portfolio", name: "Portfolio", icon: "briefcase", page: () => [
            p("A few of the small businesses we've helped look big:"),
            `<div class="portfolio-grid">
                <div class="pf" style="background:#e51400">Cafe kiosk</div>
                <div class="pf" style="background:#60a917">Daily fit</div>
                <div class="pf" style="background:#fa6800">Style studio</div>
                <div class="pf" style="background:#aa00ff">Book nook</div>
                <div class="pf" style="background:#0050ef">Urban eats</div>
                <div class="pf" style="background:#d80073">Glow salon</div>
            </div>`,
            small("Each square will become a case study — and future self-built apps will live on the start screen as their own tiles."),
        ]},
        { id: "about", name: "About", icon: "person", page: () => [
            big("The human behind OKKOKI."),
            p("I've spent years in digital marketing — building websites, running paid media, and growing search and social presence. OKKOKI is where that experience goes to work for small businesses that deserve to punch above their weight."),
            p("This site is also my long-term playground: every tile is an app, and over the years I'll keep shipping new ones — tools, experiments and mini-products — straight onto this start screen."),
            openBtn("book", "book", "Work with me", true),
        ]},
        { id: "blog", name: "Blog", icon: "news", page: () => [
            post("5 ways to grow your local business", "Jul 10, 2026", "Simple, low-budget moves that bring real customers through the door."),
            post("Why your shop needs a website in 2026", "Jun 28, 2026", "Your customers search online first. Here's how to be what they find."),
            post("Paid ads that actually pay", "Jun 12, 2026", "Stop boosting posts into the void — start running campaigns with purpose."),
        ]},
        { id: "contact", name: "Contact", icon: "contact", page: () => [
            item("mail", CONTACT.email, "We reply within one business day"),
            item("call", CONTACT.phoneDisplay, "Mon–Fri, 9am–6pm"),
            item("brand-whatsapp", "WhatsApp", "Quickest way to reach us"),
            btn(`mailto:${CONTACT.email}`, "mail", "Email", true) +
            btn(`https://wa.me/${CONTACT.whatsapp}`, "brand-whatsapp", "WhatsApp"),
        ]},
        { id: "music", name: "Music", icon: "music", page: () =>
            [`<div id="musicApp">${musicBody()}</div>`] },
        { id: "videos", name: "Videos", icon: "filmstrip", page: () => [
            `<video class="video-player" controls preload="metadata"
                src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"></video>`,
            item("filmstrip", "Flower (demo)", "Sample CC0 clip — replace with your showreel"),
            p("Drop your own clips here as you build them — every video becomes part of the portfolio."),
        ]},
        { id: "calculator", name: "Calculator", icon: "calculator", page: () => {
            calcReset();
            return [`<div id="calcApp">${calcBody()}</div>`];
        }},
        { id: "calendar", name: "Calendar", icon: "calendar", page: () => {
            const d = new Date(); calY = d.getFullYear(); calM = d.getMonth();
            return [`<div id="calApp">${calendarBody()}</div>`];
        }},
        { id: "notes", name: "Notes", icon: "notepad", page: () => {
            noteEditing = null;
            return [`<div id="notesApp">${notesBody()}</div>`];
        }},
        { id: "weather", name: "Weather", icon: "weather", page: () =>
            [`<div id="weatherApp"><p class="metro-p">Getting your weather…</p></div>`] },
        { id: "camera", name: "Camera", icon: "camera", page: () => [
            `<div id="cameraApp">
                <div class="cam-stage"><video id="camVideo" playsinline muted></video><div class="cam-flash" id="camFlash"></div></div>
                <div class="cam-controls">
                    <button class="cam-btn" data-cam="switch" aria-label="Switch camera">${ic("camera-switch")}</button>
                    <button class="cam-shutter" data-cam="shot" aria-label="Take photo">${ic("camera")}</button>
                    <button class="cam-btn" data-open="photos" aria-label="Open photos">${ic("photos")}</button>
                </div>
                <div id="camMsg"></div>
            </div>`,
        ]},
        { id: "photos", name: "Photos", icon: "photos", page: () =>
            [`<div id="photosApp">${photosBody()}</div>`] },
        { id: "settings", name: "Settings", icon: "gear", page: () =>
            [`<div id="settingsApp">${settingsBody()}</div>`] },
        { id: "facebook", name: "Facebook", icon: "brand-facebook",
          page: () => social("brand-facebook", "Daily tips, client wins and behind-the-scenes from OKKOKI.") },
        { id: "instagram", name: "Instagram", icon: "brand-instagram",
          page: () => social("brand-instagram", "Our freshest work, reels and brand glow-ups — in squares.") },
        { id: "twitter", name: "X", icon: "brand-x",
          page: () => social("brand-x", "Hot takes on small business, marketing and design.") },
        { id: "youtube", name: "YouTube", icon: "brand-youtube",
          page: () => social("brand-youtube", "Tutorials, case studies and growth tips for small business owners.") },
        { id: "whatsapp", name: "WhatsApp", icon: "brand-whatsapp", page: () => [
            `<div class="social-hero">${ic("brand-whatsapp")}</div>`,
            big("Chat with us directly."),
            p("Quick questions, quick answers. Message us any time."),
            btn(`https://wa.me/${CONTACT.whatsapp}`, "brand-whatsapp", "Start chat", true),
        ]},
        { id: "email", name: "Email", icon: "mail", page: () => [
            big("Let's talk about your business."),
            item("mail", CONTACT.email, "We reply within one business day"),
            btn(`mailto:${CONTACT.email}`, "mail", "Send email", true),
        ]},
        { id: "phone", name: "Phone", icon: "call", page: () => [
            big("Prefer to talk it out?"),
            item("call", CONTACT.phoneDisplay, "Mon–Fri, 9am–6pm"),
            btn(`tel:${CONTACT.phone}`, "call", "Call now", true),
        ]},
        { id: "8bit", name: "8-Bit", icon: "heart", page: () => [
            `<div class="retro-block"><span class="retro-text">OKKOKI</span></div>`,
            p("Where it all started — a love for pixels, play and personality. We bring that same retro heart to every brand we build."),
        ]},
        { id: "screensaver", name: "Screensaver", icon: "color", page: () => [
            `<div class="portfolio-grid">
                <div class="pf" style="background:#1ba1e2"></div>
                <div class="pf" style="background:#0057b7"></div>
                <div class="pf" style="background:#0050ef"></div>
                <div class="pf" style="background:#1a7fe0"></div>
            </div>`,
            p("Fifty shades of Metro blue."),
        ]},
        /* Example of a future embedded tile app — see apps/README.md */
        { id: "demo", name: "Demo App", icon: "cube", embed: "apps/demo/index.html" },
    ];

    const appById = (id) => APPS.find((a) => a.id === id);

    /* ================================================================
       START SCREEN TILES
       TILE_DEFS: per-tile config (app, live faces...) keyed by tile id.
       DEFAULT_LAYOUT: the pinned order + sizes for first-time visitors.
       The user's own layout (resizes, unpins, drag order) is persisted
       in localStorage and survives until browser data is cleared.
       ================================================================ */
    const face = (icon) => ic(icon, "icon tile-icon");
    const line = (t, sub) => `<p class="face-line">${t}</p>` + (sub ? `<p class="face-sub">${sub}</p>` : "");
    const fill = (color) => `<div style="position:absolute;inset:0;background:${color}"></div>`;

    function calFace() {
        const d = new Date();
        return `<div class="cal-face"><span class="cal-big">${d.getDate()}</span>` +
               `<span class="cal-side">${DAYS[d.getDay()]}<br>${MONTHS[d.getMonth()]} ${d.getFullYear()}</span></div>`;
    }

    function photoFaces() {
        const photos = loadPhotos();
        const faces = [face("photos")];
        photos.slice(0, 3).forEach((ph) => {
            faces.push(`<div style="position:absolute;inset:0;background:url(${ph.src}) center/cover"></div>`);
        });
        return faces;
    }

    const TILE_DEFS = {
        hero: { app: "about", label: false, live: { template: "peek" }, faces: [
            `<h1 class="retro-text">OKKOKI</h1><p class="tagline">Fueling Small Business Growth</p>`,
            line("Web &bull; Paid media &bull; SEO &bull; Social", "Digital marketing for small business"),
            line("Book a free 30-min growth call", "Tap to meet the human behind OKKOKI"),
        ]},
        services: { app: "services", live: { template: "peek" }, faces: [
            face("rocket"), line("Website building"), line("Paid media"), line("SEO &amp; social"),
        ]},
        book: { app: "book", live: { template: "peek" }, faces: [
            face("book"), line("Free 30-min growth call"),
        ]},
        portfolio: { app: "portfolio", live: { template: "flip" }, faces: [
            face("briefcase"), line("Cafe kiosk", "Web + branding"),
            line("Glow salon", "Paid media"), line("Daily fit", "SEO + social"),
        ]},
        blog: { app: "blog", live: { template: "flip" }, faces: [
            face("news"), line("5 ways to grow your local business"), line("Paid ads that actually pay"),
        ]},
        about: { app: "about" },
        contact: { app: "contact" },
        facebook:  { app: "facebook" },
        instagram: { app: "instagram" },
        twitter:   { app: "twitter" },
        youtube:   { app: "youtube" },
        screensaver: { app: "screensaver", live: { template: "flip" }, faces: [
            face("color"), fill("#1ba1e2"), fill("#aa00ff"), fill("#60a917"), fill("#fa6800"),
        ]},
        camera: { app: "camera" },
        photos: { app: "photos", live: { template: "flip" }, facesFn: photoFaces },
        music: { app: "music", live: { template: "peek" }, faces: [
            face("music"), line("Metro beats", "Built-in chiptune radio"),
        ]},
        calendar: { app: "calendar", live: { template: "flip" }, facesFn: () => [
            calFace(), line("No events today", "Tap to open the calendar"),
        ]},
        whatsapp: { app: "whatsapp" },
        email:    { app: "email" },
        phone:    { app: "phone" },
        "8bit":   { app: "8bit" },
        demo: { app: "demo", live: { template: "peek" }, faces: [
            face("cube"), line("Your future apps live here", "One folder, one registry line"),
        ]},
        calculator: { app: "calculator" },
        notes:      { app: "notes" },
        videos:     { app: "videos" },
        weather:    { app: "weather" },
        settings: { app: "settings", live: { template: "peek" }, faces: [
            face("gear"), line("Make it yours", "Style, accent &amp; more"),
        ]},
    };

    const DEFAULT_LAYOUT = [
        { id: "hero", size: "hero" },
        { id: "services", size: "medium" },
        { id: "book", size: "medium" },
        { id: "portfolio", size: "medium" },
        { id: "blog", size: "medium" },
        { id: "about", size: "medium" },
        { id: "contact", size: "medium" },
        { id: "facebook", size: "small" },
        { id: "instagram", size: "small" },
        { id: "twitter", size: "small" },
        { id: "youtube", size: "small" },
        { id: "screensaver", size: "medium" },
        { id: "camera", size: "medium" },
        { id: "photos", size: "medium" },
        { id: "music", size: "medium" },
        { id: "calendar", size: "medium" },
        { id: "whatsapp", size: "small" },
        { id: "email", size: "small" },
        { id: "phone", size: "small" },
        { id: "8bit", size: "small" },
        { id: "demo", size: "medium" },
        { id: "calculator", size: "small" },
        { id: "notes", size: "small" },
        { id: "videos", size: "small" },
        { id: "weather", size: "small" },
        { id: "settings", size: "medium" },
    ];

    const LAYOUT_KEY = "okkoki_layout_v1";
    const KNOWN_KEY = "okkoki_known_v1";

    function loadLayout() {
        let saved = null;
        try { saved = JSON.parse(localStorage.getItem(LAYOUT_KEY)); } catch { /* corrupted -> defaults */ }
        if (!Array.isArray(saved)) return DEFAULT_LAYOUT.map((t) => ({ ...t }));
        let known = [];
        try { known = JSON.parse(localStorage.getItem(KNOWN_KEY)) || []; } catch { /* ignore */ }
        const layout = saved.filter((t) => t && TILE_DEFS[t.id]);
        // Tiles added in newer versions of the site get appended; tiles the
        // user unpinned themselves (already "known") stay unpinned.
        DEFAULT_LAYOUT.forEach((d) => {
            if (!known.includes(d.id) && !layout.some((t) => t.id === d.id)) layout.push({ ...d });
        });
        return layout;
    }

    function saveLayout() {
        const entries = [];
        [...tileGrid.children].forEach((el) => {
            if (el.classList.contains("tile-group")) {
                [...el.children].forEach((t) => entries.push({ id: t.dataset.tid, size: "small" }));
            } else {
                const size = el.classList.contains("hero") ? "hero"
                    : (SIZE_CYCLE.find((s) => el.classList.contains(s)) || "medium");
                entries.push({ id: el.dataset.tid, size });
            }
        });
        localStorage.setItem(LAYOUT_KEY, JSON.stringify(entries));
        localStorage.setItem(KNOWN_KEY, JSON.stringify(DEFAULT_LAYOUT.map((d) => d.id)));
    }

    /* ---------------- DOM refs ---------------- */
    const viewport    = $("#viewport");
    const startScreen = $("#startScreen");
    const listScreen  = $("#appListScreen");
    const appScreen   = $("#appScreen");
    const tileGrid    = $("#tileGrid");
    const appListEl   = $("#appList");
    const jumpGrid    = $("#jumpGrid");
    const jumpInner   = $("#jumpInner");
    const searchInput = $("#searchApps");
    const lockScreen  = $("#lockScreen");
    const wallpaperLayer = $("#wallpaperLayer");

    /* ---------------- State ---------------- */
    let current = "start";        // 'start' | 'list' | 'app'
    let openedFrom = "start";
    let busy = false;
    let editMode = false;
    let suppressClick = false;
    let activeApp = null;
    let photosDirty = false;      // photos changed -> rebuild Photos live tile

    /* ================================================================
       Start screen rendering + unit-grid layout math
       ================================================================ */
    function tileHTML(t) {
        const def = TILE_DEFS[t.id];
        const app = appById(def.app);
        const faces = def.facesFn ? def.facesFn() : (def.faces || [face(app.icon)]);
        const live = def.live && faces.length > 1;
        const sizeCls = t.size === "hero" ? "hero" : (t.size || "medium");
        const cls = ["tile", sizeCls, "transparent", live ? `live live-${def.live.template}` : ""].join(" ").trim();
        const body = live
            ? `<div class="tile-body"><div class="live-slot slot-a">${faces[0]}</div><div class="live-slot slot-b">${faces[1]}</div></div>`
            : `<div class="tile-body"><div class="face-static">${faces[0]}</div></div>`;
        const label = def.label === false ? "" : `<span class="tile-label">${app.name}</span>`;
        return `<div class="${cls}" data-app="${app.id}" data-tid="${t.id}">${body}${label}</div>`;
    }

    function renderStart(layout) {
        layout = layout || loadLayout();
        let html = "";
        for (let i = 0; i < layout.length;) {
            if (layout[i].size === "small") {
                const chunk = [];
                while (i < layout.length && layout[i].size === "small" && chunk.length < 4) {
                    chunk.push(layout[i]); i++;
                }
                html += `<div class="tile-group">${chunk.map(tileHTML).join("")}</div>`;
            } else {
                html += tileHTML(layout[i]); i++;
            }
        }
        tileGrid.innerHTML = html;

        // Wire live tiles to their face queues
        liveTiles.length = 0;
        layout.forEach((t) => {
            const def = TILE_DEFS[t.id];
            const faces = def.facesFn ? def.facesFn() : def.faces;
            if (def.live && faces && faces.length > 1) {
                const el = $(`.tile[data-tid="${t.id}"]`, tileGrid);
                if (!el) return;
                liveTiles.push({
                    el, body: $(".tile-body", el),
                    faces, template: def.live.template,
                    idx: 0, showingA: true, animating: false,
                    due: Date.now() + 2400 + liveTiles.length * 1200 + Math.random() * 2200,
                });
            }
        });
        layoutGrid();
    }

    /* Columns/unit size so the WP math is exact at every width */
    function layoutGrid() {
        const w = viewport.clientWidth;
        const gap = 6, pad = 16;
        let cols = Math.floor((w - pad + gap) / (88 + gap));
        cols -= cols % 2;
        cols = Math.max(4, Math.min(12, cols));
        const unit = Math.min((w - pad - (cols - 1) * gap) / cols, 110);
        tileGrid.style.setProperty("--cols", cols);
        tileGrid.style.setProperty("--unit", unit.toFixed(2) + "px");
        startScreen.style.setProperty("--grid-w", (cols * unit + (cols - 1) * gap).toFixed(2) + "px");
        const hero = $(".tile.hero", tileGrid);
        if (hero) {
            hero.classList.toggle("large", cols >= 6);
            hero.classList.toggle("wide", cols < 6);
        }
    }

    /* ================================================================
       Wallpaper — glass mode: one layer blurred through the tiles;
       transparent mode: per-tile aligned background (works on iOS).
       ================================================================ */
    const PARALLAX = 0.12;
    const wallpaper = new Image();
    let wpRatio = 16 / 9;
    wallpaper.onload = () => { wpRatio = wallpaper.naturalWidth / wallpaper.naturalHeight; requestWallpaper(); };
    wallpaper.src = "windows10-background.jpg";

    function syncWallpaper() {
        const mode = document.body.dataset.tiles;
        if (mode === "glass") {
            const drift = Math.min(startScreen.scrollTop * PARALLAX, 140);
            wallpaperLayer.style.transform = `translateY(${(-drift).toFixed(1)}px)`;
            return;
        }
        if (mode === "solid") return;
        const tiles = $$(".tile.transparent", tileGrid);
        if (!tiles.length) return;
        const vp = viewport.getBoundingClientRect();
        const headroom = Math.max(0, Math.min(startScreen.scrollHeight - vp.height, vp.height)) * PARALLAX;
        const coverW = vp.width, coverH = vp.height + headroom;
        let bgW, bgH;
        if (coverW / coverH > wpRatio) { bgW = coverW; bgH = coverW / wpRatio; }
        else { bgH = coverH; bgW = coverH * wpRatio; }
        const drift = startScreen.scrollTop * PARALLAX;
        const size = `${bgW.toFixed(1)}px ${bgH.toFixed(1)}px`;
        tiles.forEach((t) => {
            const r = t.getBoundingClientRect();
            t.style.backgroundSize = size;
            t.style.backgroundPosition = `${(vp.left - r.left).toFixed(1)}px ${(vp.top - r.top - drift).toFixed(1)}px`;
        });
    }

    let wpPending = false;
    function requestWallpaper() {
        if (wpPending) return;
        wpPending = true;
        requestAnimationFrame(() => { wpPending = false; syncWallpaper(); });
    }

    startScreen.addEventListener("scroll", requestWallpaper, { passive: true });
    window.addEventListener("resize", () => { layoutGrid(); requestWallpaper(); });

    /* ================================================================
       Live tile engine
       ================================================================ */
    const liveTiles = [];

    function advanceLive(t) {
        const next = (t.idx + 1) % t.faces.length;
        t.animating = true;
        if (t.template === "flip") {
            const hidden = $(t.showingA ? ".slot-b" : ".slot-a", t.body);
            hidden.innerHTML = t.faces[next];
            t.body.classList.toggle("flipped");
            setTimeout(() => { t.idx = next; t.showingA = !t.showingA; t.animating = false; }, 720);
        } else { // peek
            $(".slot-b", t.body).innerHTML = t.faces[next];
            t.body.classList.add("peeked");
            setTimeout(() => {
                t.body.classList.add("no-anim");
                $(".slot-a", t.body).innerHTML = t.faces[next];
                t.body.classList.remove("peeked");
                void t.body.offsetWidth;
                t.body.classList.remove("no-anim");
                t.idx = next;
                t.animating = false;
            }, 780);
        }
    }

    setInterval(() => {
        if (document.hidden || busy || editMode || current !== "start") return;
        const now = Date.now();
        for (const t of liveTiles) {
            if (!t.animating && now >= t.due && tileGrid.contains(t.el)) {
                advanceLive(t);
                t.due = now + 3500 + Math.random() * 4500;
                break;
            }
        }
    }, 350);

    /* ================================================================
       Animation helpers (turnstile)
       ================================================================ */
    function animOnce(el, cls) {
        return new Promise((resolve) => {
            const done = () => { el.classList.remove(cls); el.removeEventListener("animationend", done); resolve(); };
            el.addEventListener("animationend", done);
            el.classList.add(cls);
            setTimeout(done, 600);
        });
    }

    function turnstile(els, dir, step = 25) {
        return new Promise((resolve) => {
            els = [...els];
            if (!els.length) return resolve();
            els.forEach((el, i) => {
                el.classList.remove("ts-in", "ts-out");
                void el.offsetWidth;
                el.style.animationDelay = (i * step) + "ms";
                el.classList.add(dir === "in" ? "ts-in" : "ts-out");
            });
            const total = els.length * step + (dir === "in" ? 460 : 300);
            setTimeout(() => {
                if (dir === "in") {
                    els.forEach((el) => { el.classList.remove("ts-in"); el.style.animationDelay = ""; });
                }
                resolve();
            }, total);
        });
    }

    const gridEls = () => $$(".grid-container > *, .all-apps", startScreen);
    const appEls  = () => $$("[data-anim]", appScreen);

    function showOnly(screen) {
        [startScreen, listScreen, appScreen].forEach((s) => s.classList.toggle("active", s === screen));
    }

    function refreshPhotosTileIfNeeded() {
        if (!photosDirty) return;
        photosDirty = false;
        renderStart();
    }

    /* ================================================================
       Navigation
       ================================================================ */
    async function openApp(id, tileEl) {
        const app = appById(id);
        if (!app || busy || editMode) return;
        busy = true;
        openedFrom = current;
        buildAppPage(app);

        if (current === "start") {
            if (tileEl) tileEl.classList.add("launching");
            await turnstile(gridEls(), "out", 14);
            if (tileEl) tileEl.classList.remove("launching");
        } else {
            await animOnce(listScreen, "slide-out-l");
        }

        showOnly(appScreen);
        appScreen.scrollTop = 0;
        current = "app";
        await turnstile(appEls(), "in", 55);
        busy = false;
    }

    function leaveApp() {
        stopCamera();
        activeApp = null;
    }

    async function closeApp() {
        if (busy || current !== "app") return;
        busy = true;
        leaveApp();
        await turnstile(appEls(), "out", 35);
        const dest = openedFrom === "list" ? listScreen : startScreen;
        if (dest === startScreen) refreshPhotosTileIfNeeded();
        showOnly(dest);
        current = openedFrom;
        if (dest === startScreen) {
            await turnstile(gridEls(), "in", 16);
            requestWallpaper();
        } else {
            await animOnce(listScreen, "slide-in-r");
        }
        busy = false;
    }

    async function goStart() {
        if (busy || current === "start") return;
        busy = true;
        if (current === "app") {
            leaveApp();
            await turnstile(appEls(), "out", 25);
        } else {
            await animOnce(listScreen, "slide-out-r");
        }
        refreshPhotosTileIfNeeded();
        showOnly(startScreen);
        startScreen.scrollTop = 0;
        current = "start";
        await turnstile(gridEls(), "in", 16);
        requestWallpaper();
        busy = false;
    }

    async function goList(focusSearch = false) {
        if (busy || current === "list") {
            if (focusSearch && current === "list") searchInput.focus();
            return;
        }
        busy = true;
        if (current === "app") {
            leaveApp();
            await turnstile(appEls(), "out", 25);
        }
        showOnly(listScreen);
        listScreen.scrollTop = 0;
        current = "list";
        await animOnce(listScreen, "slide-in-r");
        busy = false;
        if (focusSearch) searchInput.focus();
    }

    function goBack() {
        if (editMode) { exitEditMode(); return; }
        if (jumpGrid.classList.contains("active")) { jumpGrid.classList.remove("active"); return; }
        if (current === "app") closeApp();
        else if (current === "list") goStart();
    }

    /* ================================================================
       App pages
       ================================================================ */
    function buildAppPage(app) {
        stopCamera();
        const blocks = app.embed
            ? [`<iframe class="app-embed" src="${app.embed}" loading="lazy" title="${app.name}"></iframe>`]
            : (app.page ? app.page() : [p("Coming soon.")]);
        appScreen.innerHTML =
            `<div class="app-page">
                <header data-anim>
                    <div class="app-brand">okkoki</div>
                    <h1 class="page-title">${app.name}</h1>
                </header>
                ${blocks.map((b) => `<div class="app-block" data-anim>${b}</div>`).join("")}
            </div>`;
        activeApp = app.id;
        if (app.id === "weather") loadWeather();
        if (app.id === "camera") startCamera();
    }

    /* Buttons inside app pages that open another app (e.g. Book) */
    appScreen.addEventListener("click", async (e) => {
        const b = e.target.closest("[data-open]");
        if (!b || busy) return;
        const app = appById(b.dataset.open);
        if (!app) return;
        busy = true;
        await turnstile(appEls(), "out", 25);
        buildAppPage(app);
        appScreen.scrollTop = 0;
        await turnstile(appEls(), "in", 55);
        busy = false;
    });

    /* Delegated in-app interactions */
    appScreen.addEventListener("click", (e) => {
        const q = (sel) => e.target.closest(sel);
        let b;
        if ((b = q("[data-calc]")))    { calcKey(b.dataset.calc); return; }
        if ((b = q("[data-cal]")))     { calNav(b.dataset.cal); return; }
        if ((b = q("[data-note]")))    { noteAction(b.dataset.note, b.dataset.i); return; }
        if ((b = q("[data-track]")))   { Music.play(+b.dataset.track); return; }
        if ((b = q("[data-music]")))   { Music.playing ? Music.stop() : Music.play(); return; }
        if ((b = q("[data-weather]"))) { loadWeather(); return; }
        if ((b = q("[data-cam]")))     { cameraAction(b.dataset.cam); return; }
        if ((b = q("[data-photo]")))   { photoView = +b.dataset.photo; rerender("photosApp", photosBody); return; }
        if ((b = q("[data-pv]")))      { photoViewerAction(b.dataset.pv); return; }
        if ((b = q("[data-accent]")))  { setAccent(b.dataset.accent); rerender("settingsApp", settingsBody); return; }
        if ((b = q("[data-set-tiles]"))) {
            localStorage.setItem("okkoki_tiles", b.dataset.setTiles);
            document.body.dataset.tiles = b.dataset.setTiles;
            requestWallpaper();
            rerender("settingsApp", settingsBody);
            return;
        }
        if ((b = q("[data-lock]")))    {
            localStorage.setItem("okkoki_lock", b.dataset.lock);
            rerender("settingsApp", settingsBody);
            return;
        }
        if ((b = q("[data-reset]")))   {
            if (confirm("Reset everything? Your layout, notes, photos and settings on this device will be erased.")) {
                localStorage.clear();
                sessionStorage.clear();
                location.reload();
            }
        }
    });

    function rerender(id, bodyFn) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = bodyFn();
    }

    /* ================================================================
       APP: Music — WebAudio chiptune player
       ================================================================ */
    const Music = {
        ctx: null, playing: false, cur: 0, step: 0, timer: null,
        tracks: [
            { name: "Metro beats", info: "OKKOKI chiptune radio", bpm: 112,
              bass: [36, 0, 36, 0, 43, 0, 36, 0, 41, 0, 36, 0, 43, 0, 34, 0],
              lead: [60, 63, 65, 0, 67, 0, 65, 63, 60, 0, 58, 0, 63, 0, 0, 0] },
            { name: "8-bit hustle", info: "OKKOKI chiptune radio", bpm: 128,
              bass: [33, 0, 33, 33, 0, 33, 0, 33, 36, 0, 36, 36, 0, 36, 0, 31],
              lead: [57, 0, 60, 62, 64, 0, 62, 60, 57, 60, 62, 64, 67, 64, 62, 60] },
            { name: "Neon drive", info: "OKKOKI chiptune radio", bpm: 96,
              bass: [38, 0, 0, 38, 0, 0, 38, 0, 36, 0, 0, 36, 0, 0, 34, 0],
              lead: [62, 0, 65, 0, 69, 0, 67, 65, 62, 0, 60, 0, 65, 0, 62, 0] },
        ],
        freq(m) { return 440 * Math.pow(2, (m - 69) / 12); },
        voice(type, midi, t, dur, vol) {
            if (!midi) return;
            const o = this.ctx.createOscillator(), g = this.ctx.createGain();
            o.type = type;
            o.frequency.value = this.freq(midi);
            g.gain.setValueAtTime(vol, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + dur);
            o.connect(g).connect(this.ctx.destination);
            o.start(t); o.stop(t + dur);
        },
        tick() {
            const tr = this.tracks[this.cur], t = this.ctx.currentTime;
            this.voice("triangle", tr.bass[this.step], t, 0.22, 0.20);
            this.voice("square",   tr.lead[this.step], t, 0.15, 0.07);
            if (this.step % 4 === 2) this.voice("square", 118, t, 0.03, 0.02);
            this.step = (this.step + 1) % 16;
            const bar = $("#musicProg");
            if (bar) bar.style.width = ((this.step / 16) * 100) + "%";
        },
        play(i) {
            if (i != null && i !== this.cur) { this.cur = i; this.step = 0; }
            this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
            this.ctx.resume();
            clearInterval(this.timer);
            this.timer = setInterval(() => this.tick(), 60000 / this.tracks[this.cur].bpm / 4);
            this.playing = true;
            rerender("musicApp", musicBody);
        },
        stop() {
            clearInterval(this.timer);
            this.timer = null;
            this.playing = false;
            rerender("musicApp", musicBody);
        },
    };

    function musicBody() {
        const tr = Music.tracks[Music.cur];
        return `
        <div class="music-hero">
            <div class="music-art">${ic("music")}</div>
            <div>
                <div class="music-state">${Music.playing ? "Now playing" : "Paused"}</div>
                <div class="music-title">${tr.name}</div>
                <div class="metro-small">${tr.info}</div>
            </div>
        </div>
        <div class="music-progress"><div class="music-progress-fill" id="musicProg"></div></div>
        <div class="music-controls">
            <button class="music-play" data-music aria-label="Play or pause">
                ${ic(Music.playing ? "pause" : "play")}
            </button>
        </div>
        ${Music.tracks.map((t, i) => `
            <div class="music-track${i === Music.cur ? " active" : ""}" data-track="${i}">
                ${ic(i === Music.cur && Music.playing ? "speaker" : "music")}
                <div><div class="music-track-name">${t.name}</div>
                <div class="metro-small">${t.bpm} bpm &bull; generated live in your browser</div></div>
            </div>`).join("")}
        ${small("Three chiptune loops synthesized with the Web Audio API — no files, pure code.")}`;
    }

    /* ================================================================
       APP: Calculator
       ================================================================ */
    const Calc = { d: "0", acc: null, op: null, fresh: true };
    const calcReset = () => { Calc.d = "0"; Calc.acc = null; Calc.op = null; Calc.fresh = true; };

    function calcApply() {
        if (Calc.op == null || Calc.acc == null) return;
        const b = parseFloat(Calc.d);
        let r = Calc.acc;
        if (Calc.op === "+") r += b;
        if (Calc.op === "−") r -= b;
        if (Calc.op === "×") r *= b;
        if (Calc.op === "÷") r = b === 0 ? NaN : r / b;
        Calc.d = Number.isFinite(r) ? String(+r.toPrecision(12)) : "Error";
        Calc.acc = null; Calc.op = null; Calc.fresh = true;
    }

    function calcKey(k) {
        if (Calc.d === "Error" && k !== "C") calcReset();
        if (/^[0-9]$/.test(k)) {
            Calc.d = (Calc.fresh || Calc.d === "0") ? k : Calc.d + k;
            Calc.fresh = false;
        } else if (k === ".") {
            if (Calc.fresh) { Calc.d = "0."; Calc.fresh = false; }
            else if (!Calc.d.includes(".")) Calc.d += ".";
        } else if (k === "±") {
            if (Calc.d !== "0") Calc.d = Calc.d.startsWith("-") ? Calc.d.slice(1) : "-" + Calc.d;
        } else if (k === "%") {
            Calc.d = String(+((parseFloat(Calc.d) / 100).toPrecision(12)));
        } else if (k === "C") {
            calcReset();
        } else if (["+", "−", "×", "÷"].includes(k)) {
            if (Calc.op && !Calc.fresh) calcApply();
            if (Calc.d !== "Error") { Calc.acc = parseFloat(Calc.d); Calc.op = k; Calc.fresh = true; }
        } else if (k === "=") {
            calcApply();
        }
        const disp = $("#calcDisplay");
        if (disp) disp.textContent = Calc.d;
    }

    function calcBody() {
        const keys = ["C", "±", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", ".", "="];
        return `<div class="calc-display" id="calcDisplay">${Calc.d}</div>
        <div class="calc-grid">
            ${keys.map((k) => `<button class="calc-btn${["÷", "×", "−", "+", "="].includes(k) ? " op" : ""}${k === "0" ? " zero" : ""}" data-calc="${k}">${k}</button>`).join("")}
        </div>`;
    }

    /* ================================================================
       APP: Calendar
       ================================================================ */
    let calY = new Date().getFullYear(), calM = new Date().getMonth();

    function calNav(dir) {
        calM += dir === "next" ? 1 : -1;
        if (calM < 0) { calM = 11; calY--; }
        if (calM > 11) { calM = 0; calY++; }
        rerender("calApp", calendarBody);
    }

    function calendarBody() {
        const first = new Date(calY, calM, 1).getDay();
        const days = new Date(calY, calM + 1, 0).getDate();
        const today = new Date();
        const isThisMonth = today.getFullYear() === calY && today.getMonth() === calM;
        let cells = "";
        for (let i = 0; i < first; i++) cells += `<div class="cal-cell dim"></div>`;
        for (let d = 1; d <= days; d++) {
            cells += `<div class="cal-cell${isThisMonth && d === today.getDate() ? " today" : ""}">${d}</div>`;
        }
        return `
        <div class="cal-head">
            <button class="cal-nav" data-cal="prev" aria-label="Previous month">${ic("chevron-left")}</button>
            <span class="cal-title">${MONTHS[calM]} ${calY}</span>
            <button class="cal-nav" data-cal="next" aria-label="Next month">${ic("chevron-right")}</button>
        </div>
        <div class="cal-grid">
            ${["S", "M", "T", "W", "T", "F", "S"].map((d) => `<div class="cal-dow">${d}</div>`).join("")}
            ${cells}
        </div>
        ${small("Today is highlighted in your accent color.")}`;
    }

    /* ================================================================
       APP: Notes (saved on this device)
       ================================================================ */
    let noteEditing = null;

    function loadNotes() {
        try { return JSON.parse(localStorage.getItem("okkoki_notes")) || []; }
        catch { return []; }
    }
    const saveNotes = (n) => localStorage.setItem("okkoki_notes", JSON.stringify(n));
    const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    function noteAction(action, i) {
        const notes = loadNotes();
        if (action === "new")  noteEditing = -1;
        if (action === "open") noteEditing = +i;
        if (action === "back") noteEditing = null;
        if (action === "save") {
            const text = ($("#noteText") || {}).value || "";
            if (text.trim()) {
                if (noteEditing === -1) notes.unshift({ text, at: Date.now() });
                else notes[noteEditing] = { text, at: Date.now() };
                saveNotes(notes);
            }
            noteEditing = null;
        }
        if (action === "del") {
            notes.splice(noteEditing === -1 ? 0 : noteEditing, 1);
            saveNotes(notes);
            noteEditing = null;
        }
        rerender("notesApp", notesBody);
        if (noteEditing != null) { const ta = $("#noteText"); if (ta) ta.focus(); }
    }

    function notesBody() {
        const notes = loadNotes();
        if (noteEditing != null) {
            const n = noteEditing >= 0 ? notes[noteEditing] : null;
            return `
            <textarea id="noteText" class="note-editor" placeholder="Write a note…">${n ? esc(n.text) : ""}</textarea>
            <div>
                <button class="metro-btn primary" data-note="save">${ic("check")} Save</button>
                ${n ? `<button class="metro-btn" data-note="del">${ic("delete")} Delete</button>` : ""}
                <button class="metro-btn" data-note="back">${ic("arrow-left")} Back</button>
            </div>`;
        }
        return `
        <button class="metro-btn primary" data-note="new">${ic("add")} New note</button>
        ${notes.length ? notes.map((n, i) => `
            <div class="note-card" data-note="open" data-i="${i}">
                <div class="note-text">${esc(n.text).slice(0, 120)}${n.text.length > 120 ? "…" : ""}</div>
                <div class="metro-small">${new Date(n.at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</div>
            </div>`).join("")
        : p("No notes yet — your ideas are safe here, saved on this device.")}`;
    }

    /* ================================================================
       APP: Weather (Open-Meteo, no API key)
       ================================================================ */
    const WMO = [
        [[0], "sun", "Clear"], [[1, 2], "weather", "Partly cloudy"],
        [[3], "cloud", "Overcast"], [[45, 48], "fog", "Fog"],
        [[51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82], "rain", "Rain"],
        [[71, 73, 75, 77, 85, 86], "snow", "Snow"],
        [[95, 96, 99], "storm", "Storm"],
    ];
    const wmoIcon = (c) => (WMO.find(([codes]) => codes.includes(c)) || [null, "cloud", "Cloudy"]);

    function weatherFail(msg) {
        const el = $("#weatherApp");
        if (el) el.innerHTML = `
            <div class="social-hero">${ic("weather")}</div>
            ${p(msg)}
            <button class="metro-btn primary" data-weather>${ic("retry")} Try again</button>`;
    }

    function loadWeather() {
        const el = $("#weatherApp");
        if (!el) return;
        el.innerHTML = p("Getting your weather…");
        if (!navigator.geolocation) return weatherFail("Your browser doesn't support location — can't fetch local weather.");
        let settled = false;
        const guard = setTimeout(() => {
            if (!settled) { settled = true; weatherFail("Couldn't get your location — allow location access and try again."); }
        }, 10000);
        navigator.geolocation.getCurrentPosition(async ({ coords }) => {
            if (settled) return;
            settled = true;
            clearTimeout(guard);
            try {
                const r = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude.toFixed(3)}&longitude=${coords.longitude.toFixed(3)}` +
                    `&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`,
                    { signal: AbortSignal.timeout ? AbortSignal.timeout(9000) : undefined });
                const d = await r.json();
                const cw = d.current_weather;
                const [, icon, label] = wmoIcon(cw.weathercode);
                const days = d.daily.time.slice(0, 5).map((t, i) => {
                    const [, dic] = wmoIcon(d.daily.weathercode[i]);
                    return `<div class="weather-day">
                        <div class="metro-small">${DAYS[new Date(t + "T00:00").getDay()].slice(0, 3)}</div>
                        ${ic(dic)}
                        <div class="weather-range">${Math.round(d.daily.temperature_2m_max[i])}° <span>${Math.round(d.daily.temperature_2m_min[i])}°</span></div>
                    </div>`;
                }).join("");
                const wEl = $("#weatherApp");
                if (wEl) wEl.innerHTML = `
                    <div class="weather-now">
                        ${ic(icon)}
                        <div><div class="weather-temp">${Math.round(cw.temperature)}°</div>
                        <div class="metro-small">${label} &bull; wind ${Math.round(cw.windspeed)} km/h</div></div>
                    </div>
                    <div class="weather-days">${days}</div>
                    ${small("Powered by Open-Meteo, using your device location.")}`;
            } catch {
                weatherFail("Couldn't reach the weather service.");
            }
        }, () => {
            if (settled) return;
            settled = true;
            clearTimeout(guard);
            weatherFail("Couldn't get your location — allow location access and try again.");
        }, { timeout: 9000, maximumAge: 600000 });
    }

    /* ================================================================
       APP: Camera + Photos (stored in the browser)
       ================================================================ */
    const PHOTOS_KEY = "okkoki_photos";
    const PHOTOS_MAX = 24;
    let camStream = null;
    let camFacing = "user";
    let photoView = null;

    function loadPhotos() {
        try { return JSON.parse(localStorage.getItem(PHOTOS_KEY)) || []; }
        catch { return []; }
    }

    function savePhotos(photos) {
        while (true) {
            try {
                localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
                return true;
            } catch {
                if (!photos.length) return false;
                photos.pop(); // storage full -> drop the oldest and retry
            }
        }
    }

    function camMsg(html) {
        const el = $("#camMsg");
        if (el) el.innerHTML = html;
    }

    async function startCamera() {
        stopCamera();
        const v = $("#camVideo");
        if (!v) return;
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            return camMsg(p("This browser doesn't support the camera."));
        }
        try {
            camStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: camFacing, width: { ideal: 1280 } }, audio: false,
            });
            v.srcObject = camStream;
            v.classList.toggle("mirror", camFacing === "user");
            await v.play();
            camMsg(small("Photos are saved only in this browser — clear site data and they're gone."));
        } catch {
            camMsg(p("Couldn't access the camera — allow camera access and try again.") +
                   `<button class="metro-btn primary" data-cam="retry">${ic("retry")} Try again</button>`);
        }
    }

    function stopCamera() {
        if (camStream) {
            camStream.getTracks().forEach((t) => t.stop());
            camStream = null;
        }
    }

    function cameraAction(action) {
        if (action === "switch") {
            camFacing = camFacing === "user" ? "environment" : "user";
            startCamera();
        }
        if (action === "retry") startCamera();
        if (action === "shot") {
            const v = $("#camVideo");
            if (!v || !camStream || !v.videoWidth) return;
            const scale = Math.min(1, 1080 / Math.max(v.videoWidth, v.videoHeight));
            const c = document.createElement("canvas");
            c.width = Math.round(v.videoWidth * scale);
            c.height = Math.round(v.videoHeight * scale);
            c.getContext("2d").drawImage(v, 0, 0, c.width, c.height);
            const photos = loadPhotos();
            photos.unshift({ src: c.toDataURL("image/jpeg", 0.72), at: Date.now() });
            while (photos.length > PHOTOS_MAX) photos.pop();
            const ok = savePhotos(photos);
            photosDirty = true;
            const flash = $("#camFlash");
            if (flash) { flash.classList.remove("on"); void flash.offsetWidth; flash.classList.add("on"); }
            camMsg(ok ? small(`Saved — ${loadPhotos().length} photo${loadPhotos().length === 1 ? "" : "s"} in Photos.`)
                      : p("Storage is full — couldn't save the photo."));
        }
    }

    function photosBody() {
        const photos = loadPhotos();
        if (photoView != null && photos[photoView]) {
            const ph = photos[photoView];
            return `
            <div class="photo-view"><img src="${ph.src}" alt="Photo"></div>
            <div class="metro-small" style="margin-bottom:12px">${new Date(ph.at).toLocaleString()}</div>
            <div>
                <button class="metro-btn" data-pv="del">${ic("delete")} Delete</button>
                <button class="metro-btn" data-pv="back">${ic("arrow-left")} All photos</button>
            </div>`;
        }
        photoView = null;
        if (!photos.length) {
            return `${p("No photos yet — everything you shoot stays in this browser only.")}` +
                   openBtn("camera", "camera", "Open camera", true);
        }
        return `<div class="photo-grid">
            ${photos.map((ph, i) => `<div class="photo-cell" data-photo="${i}" style="background-image:url(${ph.src})"></div>`).join("")}
        </div>
        ${small(`${photos.length} photo${photos.length === 1 ? "" : "s"} — saved in this browser only.`)}`;
    }

    function photoViewerAction(action) {
        if (action === "del" && photoView != null) {
            const photos = loadPhotos();
            photos.splice(photoView, 1);
            savePhotos(photos);
            photosDirty = true;
            photoView = null;
        }
        if (action === "back") photoView = null;
        rerender("photosApp", photosBody);
    }

    /* ================================================================
       APP: Settings — organized WP-style
       ================================================================ */
    function settingsBody() {
        const acc = getAccent(), style = tileStyle(), lock = lockEnabled();
        const seg = (attr, val, icon, label, active) =>
            `<button class="metro-btn${active ? " primary" : ""}" data-${attr}="${val}">${ic(icon)} ${label}</button>`;
        return `
        <div class="settings-group">
            <div class="settings-label">Start + theme</div>
            ${small("Tile style")}
            <div>
                ${seg("set-tiles", "glass", "sparkle", "Glass", style === "glass")}
                ${seg("set-tiles", "transparent", "image", "Classic", style === "transparent")}
                ${seg("set-tiles", "solid", "square", "Solid", style === "solid")}
            </div>
            ${small("Accent color")}
            <div class="swatch-grid">
                ${WP_COLORS.map(([n, h]) => `<button class="swatch${h === acc ? " active" : ""}" data-accent="${h}" style="background:${h}" title="${n}" aria-label="${n}"></button>`).join("")}
            </div>
        </div>
        <div class="settings-group">
            <div class="settings-label">Lock screen</div>
            <div>
                ${seg("lock", "on", "lock", "On", lock)}
                ${seg("lock", "off", "unlock", "Off", !lock)}
            </div>
        </div>
        <div class="settings-group">
            <div class="settings-label">Storage</div>
            ${p(`${loadPhotos().length} photos &bull; ${loadNotes().length} notes &bull; layout ${localStorage.getItem(LAYOUT_KEY) ? "customized" : "default"} — all saved in this browser only.`)}
            <button class="metro-btn" data-reset>${ic("delete")} Reset everything</button>
        </div>
        <div class="settings-group">
            <div class="settings-label">About</div>
            ${p("OKKOKI OS 4.0 — Windows Phone, reimagined for 2026.")}
            ${small("Icons: Fluent UI System Icons (Microsoft, MIT) &amp; Simple Icons. Weather: Open-Meteo.")}
        </div>`;
    }

    /* ================================================================
       App list + alphabet jump grid + search
       ================================================================ */
    const LETTERS = ["#", ..."abcdefghijklmnopqrstuvwxyz"];
    const letterOf = (name) => (/^[a-z]/i.test(name) ? name[0].toLowerCase() : "#");

    function renderAppList() {
        const groups = new Map();
        [...APPS].sort((a, b) => a.name.localeCompare(b.name)).forEach((a) => {
            const l = letterOf(a.name);
            if (!groups.has(l)) groups.set(l, []);
            groups.get(l).push(a);
        });
        appListEl.innerHTML = LETTERS.filter((l) => groups.has(l)).map((l) =>
            `<div class="list-group" data-letter="${l}">
                <button class="letter-header">${l}</button>
                ${groups.get(l).map((a) =>
                    `<div class="app-item" data-app="${a.id}">
                        <div class="app-icon">${ic(a.icon)}</div>
                        <div class="app-name">${a.name}</div>
                    </div>`).join("")}
            </div>`).join("");

        jumpInner.innerHTML = LETTERS.map((l, i) =>
            `<div class="jump-cell ${groups.has(l) ? "on" : "off"}" data-letter="${l}" style="animation-delay:${i * 10}ms">${l}</div>`
        ).join("");
    }

    appListEl.addEventListener("click", (e) => {
        if (e.target.closest(".letter-header")) { jumpGrid.classList.add("active"); return; }
        const it = e.target.closest(".app-item");
        if (it) openApp(it.dataset.app, null);
    });

    jumpGrid.addEventListener("click", (e) => {
        const cell = e.target.closest(".jump-cell.on");
        jumpGrid.classList.remove("active");
        if (!cell) return;
        const group = $(`.list-group[data-letter="${cell.dataset.letter}"]`, appListEl);
        if (group) group.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    searchInput.addEventListener("input", () => {
        const q = searchInput.value.trim().toLowerCase();
        $$(".app-item", appListEl).forEach((it) => {
            const match = $(".app-name", it).textContent.toLowerCase().includes(q);
            it.style.display = match ? "" : "none";
        });
        $$(".list-group", appListEl).forEach((g) => {
            const any = $$(".app-item", g).some((it) => it.style.display !== "none");
            g.style.display = any ? "" : "none";
        });
    });

    $("#searchToggle").addEventListener("click", () => {
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input"));
        searchInput.focus();
    });

    /* ================================================================
       Tiles: tap to open, tilt on press, long-press edit mode
       ================================================================ */
    tileGrid.addEventListener("click", (e) => {
        if (suppressClick) { suppressClick = false; return; }
        if (editMode) return;
        const tile = e.target.closest(".tile[data-app]");
        if (tile) openApp(tile.dataset.app, tile);
    });

    tileGrid.addEventListener("contextmenu", (e) => e.preventDefault());

    let pressTimer = null;
    let tiltedTile = null;
    let pressX = 0, pressY = 0;

    function applyTilt(tile, e) {
        const r = tile.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - 0.5;
        const dy = (e.clientY - r.top) / r.height - 0.5;
        tile.style.transition = "transform 0.1s ease";
        tile.style.transform =
            `perspective(700px) rotateX(${(-dy * 12).toFixed(1)}deg) rotateY(${(dx * 12).toFixed(1)}deg) scale(0.975)`;
    }

    function releaseTilt() {
        if (!tiltedTile) return;
        tiltedTile.style.transition = "transform 0.18s ease";
        tiltedTile.style.transform = "";
        tiltedTile = null;
    }

    function cancelPress() {
        clearTimeout(pressTimer);
        pressTimer = null;
        releaseTilt();
    }

    tileGrid.addEventListener("pointerdown", (e) => {
        const tile = e.target.closest(".tile");
        if (!tile || editMode || busy) return;
        pressX = e.clientX; pressY = e.clientY;
        tiltedTile = tile;
        applyTilt(tile, e);
        pressTimer = setTimeout(() => {
            suppressClick = true;
            releaseTilt();
            enterEditMode(tile);
            // Keep holding -> drag to reorder (the WP gesture)
            const r = tile.getBoundingClientRect();
            drag = {
                tile, active: false,
                sx: pressX, sy: pressY,
                ox: pressX - r.left, oy: pressY - r.top,
                w: r.width, h: r.height,
                ghost: null, lastTarget: null, lastAfter: null,
            };
        }, 650);
    });

    tileGrid.addEventListener("pointermove", (e) => {
        if (!tiltedTile) return;
        if (Math.hypot(e.clientX - pressX, e.clientY - pressY) > 12) cancelPress();
        else applyTilt(tiltedTile, e);
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach((ev) =>
        tileGrid.addEventListener(ev, cancelPress)
    );

    /* ================================================================
       Edit mode: unpin / resize / drag-to-reorder
       ================================================================ */
    const overlay = document.createElement("div");
    overlay.className = "selection-overlay";
    viewport.appendChild(overlay);
    let selectedTile = null;

    function enterEditMode(tile) {
        if (editMode) return;
        editMode = true;
        selectedTile = tile;
        if (navigator.vibrate) navigator.vibrate(40);
        tile.classList.add("selected");
        $$(".tile", tileGrid).forEach((t) => { if (t !== tile) t.classList.add("floating"); });
        overlay.classList.add("active");

        const unpin = document.createElement("div");
        unpin.className = "tile-action-btn unpin-btn";
        unpin.innerHTML = ic("pin");
        unpin.addEventListener("click", (e) => { e.stopPropagation(); unpinTile(tile); });

        const resize = document.createElement("div");
        resize.className = "tile-action-btn resize-btn";
        resize.innerHTML = ic("resize");
        resize.addEventListener("click", (e) => { e.stopPropagation(); resizeTile(tile); });

        tile.append(unpin, resize);
    }

    function exitEditMode() {
        if (!editMode) return;
        editMode = false;
        if (selectedTile) {
            selectedTile.classList.remove("selected");
            $$(".tile-action-btn", selectedTile).forEach((b) => b.remove());
        }
        $$(".tile", tileGrid).forEach((t) => t.classList.remove("floating"));
        overlay.classList.remove("active");
        selectedTile = null;
        requestWallpaper();
    }

    overlay.addEventListener("click", exitEditMode);

    function unpinTile(tile) {
        tile.classList.add("removing");
        setTimeout(() => {
            const parent = tile.parentElement;
            tile.remove();
            if (parent.classList.contains("tile-group") && !parent.children.length) parent.remove();
            exitEditMode();
            saveLayout();
            requestWallpaper();
        }, 300);
    }

    const SIZE_CYCLE = ["small", "medium", "wide", "large"];

    function resizeTile(tile) {
        const cur = SIZE_CYCLE.find((s) => tile.classList.contains(s)) || "medium";
        const next = SIZE_CYCLE[(SIZE_CYCLE.indexOf(cur) + 1) % SIZE_CYCLE.length];
        tile.classList.remove("hero", ...SIZE_CYCLE);
        tile.classList.add(next);

        const group = tile.parentElement.classList.contains("tile-group") ? tile.parentElement : null;
        if (next !== "small" && group) {
            group.after(tile);
            if (!group.children.length) group.remove();
        } else if (next === "small" && !group) {
            let g = $$(".tile-group", tileGrid).find((el) => el.children.length < 4);
            if (!g) {
                g = document.createElement("div");
                g.className = "tile-group";
                tileGrid.appendChild(g);
            }
            g.appendChild(tile);
        }
        saveLayout();
        requestWallpaper();
    }

    /* ---- Drag-to-reorder (drag the selected tile in edit mode) ---- */
    let drag = null;

    tileGrid.addEventListener("pointerdown", (e) => {
        if (!editMode || busy) return;
        const tile = e.target.closest(".tile");
        if (!tile || tile !== selectedTile || e.target.closest(".tile-action-btn")) return;
        const r = tile.getBoundingClientRect();
        drag = {
            tile, active: false,
            sx: e.clientX, sy: e.clientY,
            ox: e.clientX - r.left, oy: e.clientY - r.top,
            w: r.width, h: r.height,
            ghost: null, lastTarget: null, lastAfter: null,
        };
    });

    function startDrag() {
        drag.active = true;
        suppressClick = true;
        const g = drag.tile.cloneNode(true);
        $$(".tile-action-btn", g).forEach((b) => b.remove());
        g.classList.remove("selected", "floating");
        g.classList.add("drag-ghost");
        g.style.width = drag.w + "px";
        g.style.height = drag.h + "px";
        document.body.appendChild(g);
        drag.ghost = g;
        drag.tile.classList.add("drag-src");
        overlay.style.pointerEvents = "none";
    }

    function gridChildOf(el) {
        while (el && el.parentElement !== tileGrid) el = el.parentElement;
        return el;
    }

    function moveDrag(e) {
        drag.ghost.style.left = (e.clientX - drag.ox) + "px";
        drag.ghost.style.top = (e.clientY - drag.oy) + "px";

        // Auto-scroll near the vertical edges
        const vp = viewport.getBoundingClientRect();
        if (e.clientY < vp.top + 70) startScreen.scrollTop -= 14;
        else if (e.clientY > vp.bottom - 70) startScreen.scrollTop += 14;

        const under = document.elementFromPoint(e.clientX, e.clientY);
        if (!under) return;
        const isSmall = drag.tile.classList.contains("small");
        const targetTile = under.closest(".tile");
        const targetGroup = under.closest(".tile-group");

        if (isSmall) {
            // Small tiles: reorder within/between groups, or drop at grid level
            if (targetTile && targetTile !== drag.tile && targetTile.classList.contains("small")) {
                const grp = targetTile.parentElement;
                if (grp === drag.tile.parentElement || grp.children.length < 4) {
                    const r = targetTile.getBoundingClientRect();
                    const after = e.clientX > r.left + r.width / 2;
                    placeTile(targetTile, after, grp);
                }
                return;
            }
            if (targetGroup && targetGroup !== drag.tile.parentElement && targetGroup.children.length < 4) {
                if (drag.lastTarget !== targetGroup) {
                    const src = drag.tile.parentElement;
                    targetGroup.appendChild(drag.tile);
                    cleanupGroup(src);
                    drag.lastTarget = targetGroup; drag.lastAfter = null;
                }
                return;
            }
            const child = gridChildOf(targetTile || targetGroup || under.closest("#tileGrid > *"));
            if (child && child !== drag.tile.parentElement && !child.contains(drag.tile)) {
                const r = child.getBoundingClientRect();
                const after = e.clientY > r.top + r.height / 2 || (e.clientX > r.left + r.width / 2 && e.clientY > r.top);
                if (drag.lastTarget !== child || drag.lastAfter !== after) {
                    const src = drag.tile.parentElement;
                    const g = document.createElement("div");
                    g.className = "tile-group";
                    child[after ? "after" : "before"](g);
                    g.appendChild(drag.tile);
                    cleanupGroup(src);
                    drag.lastTarget = child; drag.lastAfter = after;
                }
            }
            return;
        }

        // Medium+ tiles reorder at grid-child level (groups move as units)
        const child = gridChildOf(targetTile || targetGroup);
        if (!child || child === drag.tile) return;
        const r = child.getBoundingClientRect();
        const after = e.clientX > r.left + r.width / 2 || e.clientY > r.top + r.height / 2;
        if (drag.lastTarget === child && drag.lastAfter === after) return;
        child[after ? "after" : "before"](drag.tile);
        drag.lastTarget = child; drag.lastAfter = after;
    }

    function cleanupGroup(el) {
        if (el && el.classList && el.classList.contains("tile-group") && !el.children.length) el.remove();
    }

    function placeTile(refTile, after, grp) {
        if (drag.lastTarget === refTile && drag.lastAfter === after) return;
        const src = drag.tile.parentElement;
        refTile[after ? "after" : "before"](drag.tile);
        if (src !== grp) cleanupGroup(src);
        drag.lastTarget = refTile; drag.lastAfter = after;
    }

    function endDrag() {
        if (drag.active) {
            drag.ghost.remove();
            drag.tile.classList.remove("drag-src");
            overlay.style.pointerEvents = "";
            saveLayout();
            layoutGrid();
            requestWallpaper();
        }
        drag = null;
    }

    document.addEventListener("pointermove", (e) => {
        if (!drag) return;
        if (!drag.active) {
            if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 8) return;
            startDrag();
        }
        e.preventDefault();
        moveDrag(e);
    });

    ["pointerup", "pointercancel"].forEach((ev) =>
        document.addEventListener(ev, () => { if (drag) endDrag(); })
    );

    /* ================================================================
       Nav bar + all-apps arrow + swipe + keyboard
       ================================================================ */
    $("#navBack").addEventListener("click", goBack);
    $("#navStart").addEventListener("click", () => { exitEditMode(); goStart(); });
    $("#navSearch").addEventListener("click", () => { exitEditMode(); goList(true); });
    $("#allAppsBtn").addEventListener("click", () => goList());

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { goBack(); return; }
        if (activeApp === "calculator" && current === "app") {
            const map = { "+": "+", "-": "−", "*": "×", "/": "÷", Enter: "=", "=": "=", ".": ".", "%": "%", Backspace: "C" };
            if (/^[0-9]$/.test(e.key)) calcKey(e.key);
            else if (map[e.key]) { e.preventDefault(); calcKey(map[e.key]); }
        }
    });

    let touchStartX = 0, touchStartY = 0;
    viewport.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    viewport.addEventListener("touchend", (e) => {
        if (editMode || busy || current === "app") return;
        const dx = e.changedTouches[0].screenX - touchStartX;
        const dy = e.changedTouches[0].screenY - touchStartY;
        const angle = Math.abs(Math.atan2(dy, dx) * 180 / Math.PI);
        const horizontal = angle <= 30 || angle >= 150;
        if (!horizontal || Math.abs(dx) < 50) return;
        if (dx < 0 && current === "start") goList();
        if (dx > 0 && current === "list") goStart();
    }, { passive: true });

    /* ================================================================
       Lock screen (once per session, toggleable in Settings)
       ================================================================ */
    function initLockScreen() {
        if (!lockEnabled() || sessionStorage.getItem("okkoki_unlocked")) {
            lockScreen.remove();
            bootStart();
            return;
        }
        const tick = () => {
            const d = new Date();
            let h = d.getHours() % 12; if (h === 0) h = 12;
            $("#lockTime").textContent = `${h}:${String(d.getMinutes()).padStart(2, "0")}`;
            $("#lockDate").textContent = `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
        };
        tick();
        const clock = setInterval(tick, 15000);

        let unlocked = false;
        const unlock = () => {
            if (unlocked) return;
            unlocked = true;
            clearInterval(clock);
            sessionStorage.setItem("okkoki_unlocked", "1");
            lockScreen.classList.add("unlocking");
            setTimeout(() => lockScreen.remove(), 600);
            bootStart();
        };
        lockScreen.addEventListener("click", unlock);
        lockScreen.addEventListener("wheel", unlock, { passive: true });
        document.addEventListener("keydown", unlock, { once: true });
        let ty = 0;
        lockScreen.addEventListener("touchstart", (e) => { ty = e.changedTouches[0].screenY; }, { passive: true });
        lockScreen.addEventListener("touchend", (e) => {
            if (ty - e.changedTouches[0].screenY > 30) unlock();
        }, { passive: true });
    }

    function bootStart() {
        turnstile(gridEls(), "in", 32).then(requestWallpaper);
    }

    /* ================================================================
       Boot
       ================================================================ */
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    applySettings();
    renderStart();
    startScreen.scrollTop = 0;
    renderAppList();
    syncWallpaper();
    initLockScreen();
})();
