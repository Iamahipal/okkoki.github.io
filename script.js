/* ================================================================
   OKKOKI — Windows Phone experience on the web
   App registry, WP unit-grid layout, transparent-tile wallpaper
   sync with parallax, multi-face live tiles, turnstile navigation,
   lock screen, Settings personalization, and classic WP apps
   (Music, Videos, Calculator, Calendar, Notes, Weather).
   ================================================================ */
(() => {
    "use strict";

    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    const MONTHS = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
    const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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

    const getAccent = () => localStorage.getItem("okkoki_accent") || DEFAULT_ACCENT;
    const tilesSolid = () => localStorage.getItem("okkoki_tiles") === "solid";
    const lockEnabled = () => localStorage.getItem("okkoki_lock") !== "off";

    function setAccent(hex) {
        document.documentElement.style.setProperty("--accent", hex);
        document.documentElement.style.setProperty("--accent-lite", lighten(hex));
        localStorage.setItem("okkoki_accent", hex);
    }

    function applySettings() {
        if (getAccent() !== DEFAULT_ACCENT) setAccent(getAccent());
        document.body.classList.toggle("tiles-solid", tilesSolid());
    }

    /* ---------------- Page block builders ---------------- */
    const p    = (t) => `<p class="metro-p">${t}</p>`;
    const big  = (t) => `<p class="metro-big">${t}</p>`;
    const small = (t) => `<p class="metro-small">${t}</p>`;
    const item = (icon, title, sub) =>
        `<div class="metro-item"><div class="metro-item-icon"><i class="${icon}"></i></div>` +
        `<div><div class="metro-item-title">${title}</div><div class="metro-item-sub">${sub}</div></div></div>`;
    const btn = (href, icon, label, primary = false) =>
        `<a class="metro-btn${primary ? " primary" : ""}" href="${href}"><i class="${icon}"></i> ${label}</a>`;
    const openBtn = (appId, icon, label, primary = false) =>
        `<button class="metro-btn${primary ? " primary" : ""}" data-open="${appId}"><i class="${icon}"></i> ${label}</button>`;
    const social = (icon, label) => [
        `<div class="social-hero"><i class="${icon}"></i></div>`, p(label),
        `<a class="metro-btn" href="#" onclick="return false"><i class="${icon}"></i> Follow @okkoki</a>`,
        small("Replace the link above with your real profile URL."),
    ];
    const post = (title, date, snippet) =>
        `<div class="blog-post"><div class="blog-post-title">${title}</div>` +
        `<div class="blog-post-date">${date}</div><p class="metro-p">${snippet}</p></div>`;

    /* ================================================================
       APP REGISTRY — the single source of truth.
       Adding a future app = one entry here. Give it `page` (built-in
       metro page) OR `embed` (an iframe app under apps/<id>/).
       ================================================================ */
    const APPS = [
        { id: "services", name: "Services", icon: "fa-solid fa-rocket", page: () => [
            item("fa-solid fa-laptop-code", "Website building", "Fast, modern sites that turn visitors into customers"),
            item("fa-solid fa-bullhorn", "Paid media", "Google &amp; Meta ads managed for real return, not vanity clicks"),
            item("fa-solid fa-chart-line", "SEO &amp; growth", "Get found by the people already searching for you"),
            item("fa-solid fa-hashtag", "Social media", "Content and community that keep your brand top of mind"),
            openBtn("book", "fa-solid fa-calendar-check", "Book a free growth call", true),
        ]},
        { id: "book", name: "Book a Call", icon: "fa-solid fa-calendar-check", page: () => [
            big("Let's grow your business."),
            p("The first 30-minute growth call is free — we'll look at where you are, what's possible, and whether we're a fit. No pressure, no jargon."),
            btn(`https://wa.me/${CONTACT.whatsapp}`, "fa-brands fa-whatsapp", "WhatsApp", true) +
            btn(`mailto:${CONTACT.email}`, "fa-solid fa-envelope", "Email") +
            btn(`tel:${CONTACT.phone}`, "fa-solid fa-phone", "Call"),
            /* Scheduler slot: paste a Calendly inline embed (or any form
               service snippet) inside this div and it appears here. */
            `<div id="booking-embed" class="booking-embed"></div>`,
            small("Prefer a scheduler? A Calendly embed drops straight into this page — see apps/README.md."),
        ]},
        { id: "portfolio", name: "Portfolio", icon: "fa-solid fa-folder-open", page: () => [
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
        { id: "about", name: "About", icon: "fa-solid fa-user", page: () => [
            big("The human behind OKKOKI."),
            p("I've spent years in digital marketing — building websites, running paid media, and growing search and social presence. OKKOKI is where that experience goes to work for small businesses that deserve to punch above their weight."),
            p("This site is also my long-term playground: every tile is an app, and over the years I'll keep shipping new ones — tools, experiments and mini-products — straight onto this start screen."),
            openBtn("book", "fa-solid fa-calendar-check", "Work with me", true),
        ]},
        { id: "blog", name: "Blog", icon: "fa-solid fa-blog", page: () => [
            post("5 ways to grow your local business", "Jul 10, 2026", "Simple, low-budget moves that bring real customers through the door."),
            post("Why your shop needs a website in 2026", "Jun 28, 2026", "Your customers search online first. Here's how to be what they find."),
            post("Paid ads that actually pay", "Jun 12, 2026", "Stop boosting posts into the void — start running campaigns with purpose."),
        ]},
        { id: "contact", name: "Contact", icon: "fa-solid fa-address-card", page: () => [
            item("fa-solid fa-envelope", CONTACT.email, "We reply within one business day"),
            item("fa-solid fa-phone", CONTACT.phoneDisplay, "Mon–Fri, 9am–6pm"),
            item("fa-brands fa-whatsapp", "WhatsApp", "Quickest way to reach us"),
            btn(`mailto:${CONTACT.email}`, "fa-solid fa-envelope", "Email", true) +
            btn(`https://wa.me/${CONTACT.whatsapp}`, "fa-brands fa-whatsapp", "WhatsApp"),
        ]},
        { id: "music", name: "Music", icon: "fa-solid fa-music", page: () =>
            [`<div id="musicApp">${musicBody()}</div>`] },
        { id: "videos", name: "Videos", icon: "fa-solid fa-film", page: () => [
            `<video class="video-player" controls preload="metadata"
                src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"></video>`,
            item("fa-solid fa-film", "Flower (demo)", "Sample CC0 clip — replace with your showreel"),
            p("Drop your own clips here as you build them — every video becomes part of the portfolio."),
        ]},
        { id: "calculator", name: "Calculator", icon: "fa-solid fa-calculator", page: () => {
            calcReset();
            return [`<div id="calcApp">${calcBody()}</div>`];
        }},
        { id: "calendar", name: "Calendar", icon: "fa-solid fa-calendar", page: () => {
            const d = new Date(); calY = d.getFullYear(); calM = d.getMonth();
            return [`<div id="calApp">${calendarBody()}</div>`];
        }},
        { id: "notes", name: "Notes", icon: "fa-solid fa-note-sticky", page: () => {
            noteEditing = null;
            return [`<div id="notesApp">${notesBody()}</div>`];
        }},
        { id: "weather", name: "Weather", icon: "fa-solid fa-cloud-sun", page: () =>
            [`<div id="weatherApp"><p class="metro-p">Getting your weather…</p></div>`] },
        { id: "settings", name: "Settings", icon: "fa-solid fa-gear", page: () =>
            [`<div id="settingsApp">${settingsBody()}</div>`] },
        { id: "facebook", name: "Facebook", icon: "fa-brands fa-facebook-f",
          page: () => social("fa-brands fa-facebook-f", "Daily tips, client wins and behind-the-scenes from OKKOKI.") },
        { id: "instagram", name: "Instagram", icon: "fa-brands fa-instagram",
          page: () => social("fa-brands fa-instagram", "Our freshest work, reels and brand glow-ups — in squares.") },
        { id: "twitter", name: "Twitter", icon: "fa-brands fa-twitter",
          page: () => social("fa-brands fa-twitter", "Hot takes on small business, marketing and design.") },
        { id: "youtube", name: "YouTube", icon: "fa-brands fa-youtube",
          page: () => social("fa-brands fa-youtube", "Tutorials, case studies and growth tips for small business owners.") },
        { id: "whatsapp", name: "WhatsApp", icon: "fa-brands fa-whatsapp", page: () => [
            `<div class="social-hero"><i class="fa-brands fa-whatsapp"></i></div>`,
            big("Chat with us directly."),
            p("Quick questions, quick answers. Message us any time."),
            btn(`https://wa.me/${CONTACT.whatsapp}`, "fa-brands fa-whatsapp", "Start chat", true),
        ]},
        { id: "email", name: "Email", icon: "fa-solid fa-envelope", page: () => [
            big("Let's talk about your business."),
            item("fa-solid fa-envelope", CONTACT.email, "We reply within one business day"),
            btn(`mailto:${CONTACT.email}`, "fa-solid fa-envelope", "Send email", true),
        ]},
        { id: "phone", name: "Phone", icon: "fa-solid fa-phone", page: () => [
            big("Prefer to talk it out?"),
            item("fa-solid fa-phone", CONTACT.phoneDisplay, "Mon–Fri, 9am–6pm"),
            btn(`tel:${CONTACT.phone}`, "fa-solid fa-phone", "Call now", true),
        ]},
        { id: "8bit", name: "8-Bit", icon: "fa-solid fa-heart", page: () => [
            `<div class="retro-block"><span class="retro-text">OKKOKI</span></div>`,
            p("Where it all started — a love for pixels, play and personality. We bring that same retro heart to every brand we build."),
        ]},
        { id: "screensaver", name: "Screensaver", icon: "fa-solid fa-table-cells", page: () => [
            `<div class="portfolio-grid">
                <div class="pf" style="background:#1ba1e2"></div>
                <div class="pf" style="background:#0057b7"></div>
                <div class="pf" style="background:#0050ef"></div>
                <div class="pf" style="background:#1a7fe0"></div>
            </div>`,
            p("Fifty shades of Metro blue."),
        ]},
        /* Example of a future embedded tile app — see apps/README.md */
        { id: "demo", name: "Demo App", icon: "fa-solid fa-cube", embed: "apps/demo/index.html" },
    ];

    const appById = (id) => APPS.find((a) => a.id === id);

    /* ================================================================
       START SCREEN LAYOUT — which tiles are pinned, in order.
       Sizes: small (1x1) · medium (2x2) · wide (4x2) · large (4x4).
       hero: wide on 4-column phones, large on 6+ column screens.
       All tiles transparent by default (uniform WP 8.1 look); the
       Settings app can switch the whole Start to solid accent.
       ================================================================ */
    const face = (icon) => `<i class="${icon}"></i>`;
    const line = (t, sub) => `<p class="face-line">${t}</p>` + (sub ? `<p class="face-sub">${sub}</p>` : "");
    const fill = (color) => `<div style="position:absolute;inset:0;background:${color}"></div>`;

    function calFace() {
        const d = new Date();
        return `<div class="cal-face"><span class="cal-big">${d.getDate()}</span>` +
               `<span class="cal-side">${DAYS[d.getDay()]}<br>${MONTHS[d.getMonth()]} ${d.getFullYear()}</span></div>`;
    }

    const START = [
        { app: "about", hero: true, label: false,
          live: { template: "peek" }, faces: [
            `<h1 class="retro-text">OKKOKI</h1><p class="tagline">Fueling Small Business Growth</p>`,
            line("Web &bull; Paid media &bull; SEO &bull; Social", "Digital marketing for small business"),
            line("Book a free 30-min growth call", "Tap to meet the human behind OKKOKI"),
        ]},
        { app: "services", size: "medium",
          live: { template: "peek" }, faces: [
            face("fa-solid fa-rocket"),
            line("Website building"),
            line("Paid media"),
            line("SEO &amp; social"),
        ]},
        { app: "book", size: "medium",
          live: { template: "peek" }, faces: [
            face("fa-solid fa-calendar-check"),
            line("Free 30-min growth call"),
        ]},
        { app: "portfolio", size: "medium",
          live: { template: "flip" }, faces: [
            face("fa-solid fa-folder-open"),
            line("Cafe kiosk", "Web + branding"),
            line("Glow salon", "Paid media"),
            line("Daily fit", "SEO + social"),
        ]},
        { app: "blog", size: "medium",
          live: { template: "flip" }, faces: [
            face("fa-solid fa-blog"),
            line("5 ways to grow your local business"),
            line("Paid ads that actually pay"),
        ]},
        { app: "about", size: "medium" },
        { app: "contact", size: "medium" },
        { app: "facebook",  size: "small" },
        { app: "instagram", size: "small" },
        { app: "twitter",   size: "small" },
        { app: "youtube",   size: "small" },
        { app: "screensaver", size: "medium",
          live: { template: "flip" }, faces: [
            face("fa-solid fa-table-cells"),
            fill("#1ba1e2"), fill("#aa00ff"), fill("#60a917"), fill("#fa6800"),
        ]},
        { app: "music", size: "medium",
          live: { template: "peek" }, faces: [
            face("fa-solid fa-music"),
            line("Metro beats", "Built-in chiptune radio"),
        ]},
        { app: "calendar", size: "medium",
          live: { template: "flip" }, faces: [
            calFace(),
            line("No events today", "Tap to open the calendar"),
        ]},
        { app: "whatsapp", size: "small" },
        { app: "email",    size: "small" },
        { app: "phone",    size: "small" },
        { app: "8bit",     size: "small" },
        { app: "demo", size: "medium",
          live: { template: "peek" }, faces: [
            face("fa-solid fa-cube"),
            line("Your future apps live here", "One folder, one registry line"),
        ]},
        { app: "calculator", size: "small" },
        { app: "notes",      size: "small" },
        { app: "videos",     size: "small" },
        { app: "weather",    size: "small" },
        { app: "settings", size: "medium",
          live: { template: "peek" }, faces: [
            face("fa-solid fa-gear"),
            line("Make it yours", "Accent color &amp; tile style"),
        ]},
    ];

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

    /* ---------------- State ---------------- */
    let current = "start";        // 'start' | 'list' | 'app'
    let openedFrom = "start";
    let busy = false;
    let editMode = false;
    let suppressClick = false;
    let activeApp = null;         // id of the open app

    /* ================================================================
       Start screen rendering + unit-grid layout math
       ================================================================ */
    function tileHTML(t) {
        const app = appById(t.app);
        const faces = t.faces || [face(app.icon)];
        const live = t.live && faces.length > 1;
        const cls = ["tile", t.hero ? "hero" : (t.size || "medium"),
                     t.variant || "transparent",
                     live ? `live live-${t.live.template}` : ""].join(" ").trim();
        const body = live
            ? `<div class="tile-body"><div class="live-slot slot-a">${faces[0]}</div><div class="live-slot slot-b">${faces[1]}</div></div>`
            : `<div class="tile-body"><div class="face-static">${faces[0]}</div></div>`;
        const label = t.label === false ? "" : `<span class="tile-label">${app.name}</span>`;
        return `<div class="${cls}" data-app="${app.id}">${body}${label}</div>`;
    }

    function renderStart() {
        // Consecutive small tiles pack into 2x2 groups (one medium footprint)
        let html = "";
        for (let i = 0; i < START.length;) {
            if (!START[i].hero && (START[i].size || "medium") === "small") {
                const chunk = [];
                while (i < START.length && (START[i].size || "medium") === "small" && chunk.length < 4) {
                    chunk.push(START[i]); i++;
                }
                html += `<div class="tile-group">${chunk.map(tileHTML).join("")}</div>`;
            } else {
                html += tileHTML(START[i]); i++;
            }
        }
        tileGrid.innerHTML = html;

        // Wire live tiles to their face queues
        liveTiles.length = 0;
        const els = $$(".tile", tileGrid);
        START.forEach((t, i) => {
            if (t.live && t.faces && t.faces.length > 1) {
                liveTiles.push({
                    el: els[i],
                    body: $(".tile-body", els[i]),
                    faces: t.faces,
                    template: t.live.template,
                    idx: 0,
                    showingA: true,
                    animating: false,
                    due: Date.now() + 2600 + liveTiles.length * 1400 + Math.random() * 2500,
                });
            }
        });
    }

    /* Columns/unit size so the WP math is exact at every width:
       cols is even (mediums are 2 units), unit fills the row. */
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
       Transparent tiles — shared wallpaper alignment + parallax.
       Works everywhere (incl. iOS) unlike background-attachment:fixed.
       ================================================================ */
    const PARALLAX = 0.12;
    const wallpaper = new Image();
    let wpRatio = 16 / 9;
    wallpaper.onload = () => { wpRatio = wallpaper.naturalWidth / wallpaper.naturalHeight; requestWallpaper(); };
    wallpaper.src = "windows10-background.jpg";

    function syncWallpaper() {
        if (document.body.classList.contains("tiles-solid")) return;
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
       Live tile engine — multi-face queues, flip & peek templates,
       organic randomized scheduling.
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
                t.due = now + 4500 + Math.random() * 5000;
                break; // one tile per tick keeps motion organic, never synchronized
            }
        }
    }, 420);

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
            const total = els.length * step + (dir === "in" ? 500 : 300);
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
        await turnstile(appEls(), "in", 60);
        busy = false;
    }

    async function closeApp() {
        if (busy || current !== "app") return;
        busy = true;
        activeApp = null;
        await turnstile(appEls(), "out", 35);
        const dest = openedFrom === "list" ? listScreen : startScreen;
        showOnly(dest);
        current = openedFrom;
        if (dest === startScreen) {
            await turnstile(gridEls(), "in", 18);
            requestWallpaper();
        } else {
            await animOnce(listScreen, "slide-in-r");
        }
        busy = false;
    }

    async function goStart() {
        if (busy || current === "start") return;
        busy = true;
        activeApp = null;
        if (current === "app") {
            await turnstile(appEls(), "out", 25);
        } else {
            await animOnce(listScreen, "slide-out-r");
        }
        showOnly(startScreen);
        startScreen.scrollTop = 0;
        current = "start";
        await turnstile(gridEls(), "in", 18);
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
            activeApp = null;
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
       App pages (built-in metro pages or embedded iframe apps)
       ================================================================ */
    function buildAppPage(app) {
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
        await turnstile(appEls(), "in", 60);
        busy = false;
    });

    /* Delegated in-app interactions (calculator, calendar, notes,
       music, weather retry, settings) */
    appScreen.addEventListener("click", (e) => {
        const q = (sel) => e.target.closest(sel);
        let b;
        if ((b = q("[data-calc]")))    { calcKey(b.dataset.calc); return; }
        if ((b = q("[data-cal]")))     { calNav(b.dataset.cal); return; }
        if ((b = q("[data-note]")))    { noteAction(b.dataset.note, b.dataset.i); return; }
        if ((b = q("[data-track]")))   { Music.play(+b.dataset.track); return; }
        if ((b = q("[data-music]")))   { Music.playing ? Music.stop() : Music.play(); return; }
        if ((b = q("[data-weather]"))) { loadWeather(); return; }
        if ((b = q("[data-accent]")))  { setAccent(b.dataset.accent); rerender("settingsApp", settingsBody); return; }
        if ((b = q("[data-tiles]")))   {
            localStorage.setItem("okkoki_tiles", b.dataset.tiles);
            document.body.classList.toggle("tiles-solid", b.dataset.tiles === "solid");
            requestWallpaper();
            rerender("settingsApp", settingsBody);
            return;
        }
        if ((b = q("[data-lock]")))    {
            localStorage.setItem("okkoki_lock", b.dataset.lock);
            rerender("settingsApp", settingsBody);
        }
    });

    function rerender(id, bodyFn) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = bodyFn();
    }

    /* ================================================================
       CLASSIC APP: Music — WebAudio chiptune player (Zune vibes)
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
            if (this.step % 4 === 2) this.voice("square", 118, t, 0.03, 0.02); // hat
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
            <div class="music-art"><i class="fa-solid fa-music"></i></div>
            <div>
                <div class="music-state">${Music.playing ? "Now playing" : "Paused"}</div>
                <div class="music-title">${tr.name}</div>
                <div class="metro-small">${tr.info}</div>
            </div>
        </div>
        <div class="music-progress"><div class="music-progress-fill" id="musicProg"></div></div>
        <div class="music-controls">
            <button class="music-play" data-music aria-label="Play or pause">
                <i class="fa-solid ${Music.playing ? "fa-pause" : "fa-play"}"></i>
            </button>
        </div>
        ${Music.tracks.map((t, i) => `
            <div class="music-track${i === Music.cur ? " active" : ""}" data-track="${i}">
                <i class="fa-solid ${i === Music.cur && Music.playing ? "fa-volume-high" : "fa-music"}"></i>
                <div><div class="music-track-name">${t.name}</div>
                <div class="metro-small">${t.bpm} bpm &bull; generated live in your browser</div></div>
            </div>`).join("")}
        ${small("Three chiptune loops synthesized with the Web Audio API — no files, pure code.")}`;
    }

    /* ================================================================
       CLASSIC APP: Calculator
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
       CLASSIC APP: Calendar
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
            <button class="cal-nav" data-cal="prev" aria-label="Previous month"><i class="fa-solid fa-chevron-left"></i></button>
            <span class="cal-title">${MONTHS[calM]} ${calY}</span>
            <button class="cal-nav" data-cal="next" aria-label="Next month"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
        <div class="cal-grid">
            ${["S", "M", "T", "W", "T", "F", "S"].map((d) => `<div class="cal-dow">${d}</div>`).join("")}
            ${cells}
        </div>
        ${small("Today is highlighted in your accent color.")}`;
    }

    /* ================================================================
       CLASSIC APP: Notes (saved on this device)
       ================================================================ */
    let noteEditing = null; // null = list view, -1 = new, n = editing note n

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
                <button class="metro-btn primary" data-note="save"><i class="fa-solid fa-check"></i> Save</button>
                ${n ? `<button class="metro-btn" data-note="del"><i class="fa-solid fa-trash"></i> Delete</button>` : ""}
                <button class="metro-btn" data-note="back"><i class="fa-solid fa-arrow-left"></i> Back</button>
            </div>`;
        }
        return `
        <button class="metro-btn primary" data-note="new"><i class="fa-solid fa-plus"></i> New note</button>
        ${notes.length ? notes.map((n, i) => `
            <div class="note-card" data-note="open" data-i="${i}">
                <div class="note-text">${esc(n.text).slice(0, 120)}${n.text.length > 120 ? "…" : ""}</div>
                <div class="metro-small">${new Date(n.at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</div>
            </div>`).join("")
        : p("No notes yet — your ideas are safe here, saved on this device.")}`;
    }

    /* ================================================================
       CLASSIC APP: Weather (Open-Meteo, no API key)
       ================================================================ */
    const WMO = [
        [[0], "fa-sun", "Clear"], [[1, 2], "fa-cloud-sun", "Partly cloudy"],
        [[3], "fa-cloud", "Overcast"], [[45, 48], "fa-smog", "Fog"],
        [[51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82], "fa-cloud-rain", "Rain"],
        [[71, 73, 75, 77, 85, 86], "fa-snowflake", "Snow"],
        [[95, 96, 99], "fa-cloud-bolt", "Storm"],
    ];
    const wmoIcon = (c) => (WMO.find(([codes]) => codes.includes(c)) || [null, "fa-cloud", "Cloudy"]);

    function weatherFail(msg) {
        const el = $("#weatherApp");
        if (el) el.innerHTML = `
            <div class="social-hero"><i class="fa-solid fa-cloud-sun"></i></div>
            ${p(msg)}
            <button class="metro-btn primary" data-weather><i class="fa-solid fa-rotate-right"></i> Try again</button>`;
    }

    function loadWeather() {
        const el = $("#weatherApp");
        if (!el) return;
        el.innerHTML = p("Getting your weather…");
        if (!navigator.geolocation) return weatherFail("Your browser doesn't support location — can't fetch local weather.");
        // Some browsers leave the permission prompt unresolved forever —
        // guard with our own timer so the page never hangs on "Getting…".
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
                    const [, ic] = wmoIcon(d.daily.weathercode[i]);
                    return `<div class="weather-day">
                        <div class="metro-small">${DAYS[new Date(t + "T00:00").getDay()].slice(0, 3)}</div>
                        <i class="fa-solid ${ic}"></i>
                        <div class="weather-range">${Math.round(d.daily.temperature_2m_max[i])}° <span>${Math.round(d.daily.temperature_2m_min[i])}°</span></div>
                    </div>`;
                }).join("");
                const wEl = $("#weatherApp");
                if (wEl) wEl.innerHTML = `
                    <div class="weather-now">
                        <i class="fa-solid ${icon}"></i>
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
       Settings app body
       ================================================================ */
    function settingsBody() {
        const acc = getAccent(), solid = tilesSolid(), lock = lockEnabled();
        return `
        ${big("Make it yours.")}
        <div class="settings-label">Accent color</div>
        <div class="swatch-grid">
            ${WP_COLORS.map(([n, h]) => `<button class="swatch${h === acc ? " active" : ""}" data-accent="${h}" style="background:${h}" title="${n}" aria-label="${n}"></button>`).join("")}
        </div>
        <div class="settings-label">Tile style</div>
        <div>
            <button class="metro-btn${!solid ? " primary" : ""}" data-tiles="transparent"><i class="fa-solid fa-image"></i> Transparent</button>
            <button class="metro-btn${solid ? " primary" : ""}" data-tiles="solid"><i class="fa-solid fa-square"></i> Solid</button>
        </div>
        <div class="settings-label">Lock screen</div>
        <div>
            <button class="metro-btn${lock ? " primary" : ""}" data-lock="on"><i class="fa-solid fa-lock"></i> On</button>
            <button class="metro-btn${!lock ? " primary" : ""}" data-lock="off"><i class="fa-solid fa-lock-open"></i> Off</button>
        </div>
        ${small("Choices are saved on this device.")}`;
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
                        <div class="app-icon"><i class="${a.icon}"></i></div>
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
       Edit mode: unpin / resize (small -> medium -> wide -> large)
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
        unpin.innerHTML = '<i class="fa-solid fa-thumbtack fa-rotate-90"></i>';
        unpin.addEventListener("click", (e) => { e.stopPropagation(); unpinTile(tile); });

        const resize = document.createElement("div");
        resize.className = "tile-action-btn resize-btn";
        resize.innerHTML = '<i class="fa-solid fa-expand"></i>';
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
            // Join a small-group with space; otherwise start a new one at the
            // end of the grid so no hole is left where the tile used to be
            // (dense flow backfills the vacated 2x2 area).
            let g = $$(".tile-group", tileGrid).find((el) => el.children.length < 4);
            if (!g) {
                g = document.createElement("div");
                g.className = "tile-group";
                tileGrid.appendChild(g);
            }
            g.appendChild(tile);
        }
        requestWallpaper();
    }

    /* ================================================================
       Nav bar + all-apps arrow + swipe + keyboard
       ================================================================ */
    $("#navBack").addEventListener("click", goBack);
    $("#navStart").addEventListener("click", () => { exitEditMode(); goStart(); });
    $("#navSearch").addEventListener("click", () => { exitEditMode(); goList(true); });
    $("#allAppsBtn").addEventListener("click", () => goList());

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") { goBack(); return; }
        // Calculator keyboard input
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
        turnstile(gridEls(), "in", 35).then(requestWallpaper);
    }

    /* ================================================================
       Boot
       ================================================================ */
    applySettings();
    renderStart();
    layoutGrid();
    renderAppList();
    syncWallpaper();
    initLockScreen();
})();
