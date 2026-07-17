/* ================================================================
   OKKOKI — Windows Phone experience on the web
   App registry, WP unit-grid layout, transparent-tile wallpaper
   sync with parallax, multi-face live tiles, turnstile navigation.
   ================================================================ */
(() => {
    "use strict";

    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    /* ================================================================
       Contact details — replace the placeholders with real ones.
       ================================================================ */
    const CONTACT = {
        email: "hello@okkoki.com",            /* TODO: real email */
        phone: "+15550123456",                /* TODO: real phone (tel: format) */
        phoneDisplay: "+1 (555) 012-3456",
        whatsapp: "15550123456",              /* TODO: real number for wa.me */
    };

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
        `<a class="metro-btn" href="#" onclick="return false"><i class="${icon}"></i> follow @okkoki</a>`,
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
            item("fa-solid fa-laptop-code", "website building", "fast, modern sites that turn visitors into customers"),
            item("fa-solid fa-bullhorn", "paid media", "google &amp; meta ads managed for real return, not vanity clicks"),
            item("fa-solid fa-chart-line", "seo &amp; growth", "get found by the people already searching for you"),
            item("fa-solid fa-hashtag", "social media", "content and community that keep your brand top of mind"),
            openBtn("book", "fa-solid fa-calendar-check", "book a free growth call", true),
        ]},
        { id: "book", name: "Book a Call", icon: "fa-solid fa-calendar-check", page: () => [
            big("Let's grow your business."),
            p("The first 30-minute growth call is free — we'll look at where you are, what's possible, and whether we're a fit. No pressure, no jargon."),
            btn(`https://wa.me/${CONTACT.whatsapp}`, "fa-brands fa-whatsapp", "whatsapp", true) +
            btn(`mailto:${CONTACT.email}`, "fa-solid fa-envelope", "email") +
            btn(`tel:${CONTACT.phone}`, "fa-solid fa-phone", "call"),
            /* Scheduler slot: paste a Calendly inline embed (or any form
               service snippet) inside this div and it appears here. */
            `<div id="booking-embed" class="booking-embed"></div>`,
            small("Prefer a scheduler? A Calendly embed drops straight into this page — see apps/README.md."),
        ]},
        { id: "portfolio", name: "Portfolio", icon: "fa-solid fa-folder-open", page: () => [
            p("A few of the small businesses we've helped look big:"),
            `<div class="portfolio-grid">
                <div class="pf" style="background:#e51400">cafe kiosk</div>
                <div class="pf" style="background:#60a917">daily fit</div>
                <div class="pf" style="background:#fa6800">style studio</div>
                <div class="pf" style="background:#aa00ff">book nook</div>
                <div class="pf" style="background:#0050ef">urban eats</div>
                <div class="pf" style="background:#d80073">glow salon</div>
            </div>`,
            small("Each square will become a case study — and future self-built apps will live on the start screen as their own tiles."),
        ]},
        { id: "about", name: "About", icon: "fa-solid fa-user", page: () => [
            big("The human behind OKKOKI."),
            p("I've spent years in digital marketing — building websites, running paid media, and growing search and social presence. OKKOKI is where that experience goes to work for small businesses that deserve to punch above their weight."),
            p("This site is also my long-term playground: every tile is an app, and over the years I'll keep shipping new ones — tools, experiments and mini-products — straight onto this start screen."),
            openBtn("book", "fa-solid fa-calendar-check", "work with me", true),
        ]},
        { id: "blog", name: "Blog", icon: "fa-solid fa-blog", page: () => [
            post("5 ways to grow your local business", "jul 10, 2026", "Simple, low-budget moves that bring real customers through the door."),
            post("why your shop needs a website in 2026", "jun 28, 2026", "Your customers search online first. Here's how to be what they find."),
            post("paid ads that actually pay", "jun 12, 2026", "Stop boosting posts into the void — start running campaigns with purpose."),
        ]},
        { id: "contact", name: "Contact", icon: "fa-solid fa-address-card", page: () => [
            item("fa-solid fa-envelope", CONTACT.email, "we reply within one business day"),
            item("fa-solid fa-phone", CONTACT.phoneDisplay, "mon–fri, 9am–6pm"),
            item("fa-brands fa-whatsapp", "whatsapp", "quickest way to reach us"),
            btn(`mailto:${CONTACT.email}`, "fa-solid fa-envelope", "email", true) +
            btn(`https://wa.me/${CONTACT.whatsapp}`, "fa-brands fa-whatsapp", "whatsapp"),
        ]},
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
            btn(`https://wa.me/${CONTACT.whatsapp}`, "fa-brands fa-whatsapp", "start chat", true),
        ]},
        { id: "email", name: "Email", icon: "fa-solid fa-envelope", page: () => [
            big("Let's talk about your business."),
            item("fa-solid fa-envelope", CONTACT.email, "we reply within one business day"),
            btn(`mailto:${CONTACT.email}`, "fa-solid fa-envelope", "send email", true),
        ]},
        { id: "phone", name: "Phone", icon: "fa-solid fa-phone", page: () => [
            big("Prefer to talk it out?"),
            item("fa-solid fa-phone", CONTACT.phoneDisplay, "mon–fri, 9am–6pm"),
            btn(`tel:${CONTACT.phone}`, "fa-solid fa-phone", "call now", true),
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
       variant: accent (solid blue) | transparent (wallpaper shows through).
       live: { template: 'peek' | 'flip' } with faces (face 0 = front).
       ================================================================ */
    const face = (icon) => `<i class="${icon}"></i>`;
    const line = (t, sub) => `<p class="face-line">${t}</p>` + (sub ? `<p class="face-sub">${sub}</p>` : "");
    const fill = (color) => `<div style="position:absolute;inset:0;background:${color}"></div>`;

    const START = [
        { app: "about", hero: true, variant: "transparent", label: false,
          live: { template: "peek" }, faces: [
            `<h1 class="retro-text">OKKOKI</h1><p class="tagline">Fueling Small Business Growth</p>`,
            line("web &bull; paid media &bull; seo &bull; social", "digital marketing for small business"),
            line("book a free 30-min growth call", "tap to meet the human behind okkoki"),
        ]},
        { app: "services", size: "medium", variant: "accent",
          live: { template: "peek" }, faces: [
            face("fa-solid fa-rocket"),
            line("website building"),
            line("paid media"),
            line("seo &amp; social"),
        ]},
        { app: "book", size: "medium", variant: "accent",
          live: { template: "peek" }, faces: [
            face("fa-solid fa-calendar-check"),
            line("free 30-min growth call"),
        ]},
        { app: "portfolio", size: "medium", variant: "accent",
          live: { template: "flip" }, faces: [
            face("fa-solid fa-folder-open"),
            line("cafe kiosk", "web + branding"),
            line("glow salon", "paid media"),
            line("daily fit", "seo + social"),
        ]},
        { app: "blog", size: "medium", variant: "accent",
          live: { template: "flip" }, faces: [
            face("fa-solid fa-blog"),
            line("5 ways to grow your local business"),
            line("paid ads that actually pay"),
        ]},
        { app: "about", size: "medium", variant: "transparent" },
        { app: "contact", size: "medium", variant: "accent" },
        { app: "facebook",  size: "small", variant: "transparent" },
        { app: "instagram", size: "small", variant: "transparent" },
        { app: "twitter",   size: "small", variant: "transparent" },
        { app: "youtube",   size: "small", variant: "transparent" },
        { app: "screensaver", size: "medium", variant: "accent",
          live: { template: "flip" }, faces: [
            face("fa-solid fa-table-cells"),
            fill("#1ba1e2"), fill("#aa00ff"), fill("#60a917"), fill("#fa6800"),
        ]},
        { app: "whatsapp", size: "small", variant: "transparent" },
        { app: "email",    size: "small", variant: "transparent" },
        { app: "phone",    size: "small", variant: "transparent" },
        { app: "8bit",     size: "small", variant: "transparent" },
        { app: "demo", size: "medium", variant: "accent",
          live: { template: "peek" }, faces: [
            face("fa-solid fa-cube"),
            line("your future apps live here", "one folder, one registry line"),
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

    /* ---------------- State ---------------- */
    let current = "start";        // 'start' | 'list' | 'app'
    let openedFrom = "start";
    let busy = false;
    let editMode = false;
    let suppressClick = false;

    /* ================================================================
       Start screen rendering + unit-grid layout math
       ================================================================ */
    function tileHTML(t) {
        const app = appById(t.app);
        const faces = t.faces || [face(app.icon)];
        const live = t.live && faces.length > 1;
        const cls = ["tile", t.hero ? "hero" : (t.size || "medium"),
                     t.variant || "accent",
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
    wallpaper.onload = () => { wpRatio = wallpaper.naturalWidth / wallpaper.naturalHeight; syncWallpaper(); };
    wallpaper.src = "windows10-background.jpg";

    function syncWallpaper() {
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
            : (app.page ? app.page() : [p("coming soon")]);
        appScreen.innerHTML =
            `<div class="app-page">
                <header data-anim>
                    <div class="app-brand">okkoki</div>
                    <h1 class="page-title">${app.name.toLowerCase()}</h1>
                </header>
                ${blocks.map((b) => `<div class="app-block" data-anim>${b}</div>`).join("")}
            </div>`;
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
            `<div class="jump-cell ${groups.has(l) ? "on" : "off"}" data-letter="${l}" style="animation-delay:${i * 12}ms">${l}</div>`
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
       Nav bar + all-apps arrow + swipe
       ================================================================ */
    $("#navBack").addEventListener("click", goBack);
    $("#navStart").addEventListener("click", () => { exitEditMode(); goStart(); });
    $("#navSearch").addEventListener("click", () => { exitEditMode(); goList(true); });
    $("#allAppsBtn").addEventListener("click", () => goList());

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") goBack();
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
       Boot
       ================================================================ */
    renderStart();
    layoutGrid();
    renderAppList();
    syncWallpaper();
    turnstile(gridEls(), "in", 35).then(requestWallpaper);
})();
