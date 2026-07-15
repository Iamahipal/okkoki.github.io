/* ================================================================
   OKKOKI — Windows Phone Metro UI
   Turnstile open/close, tile tilt, live tiles, app list, edit mode.
   ================================================================ */
(() => {
    "use strict";

    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

    /* ---------------- App data ---------------- */
    const p    = (t) => `<p class="metro-p">${t}</p>`;
    const big  = (t) => `<p class="metro-big">${t}</p>`;
    const item = (icon, title, sub) =>
        `<div class="metro-item"><div class="metro-item-icon"><i class="${icon}"></i></div>` +
        `<div><div class="metro-item-title">${title}</div><div class="metro-item-sub">${sub}</div></div></div>`;
    const person = (color, initials, name, role) =>
        `<div class="metro-item"><div class="avatar" style="background:${color}">${initials}</div>` +
        `<div><div class="metro-item-title">${name}</div><div class="metro-item-sub">${role}</div></div></div>`;
    const social = (icon, label) =>
        [`<div class="social-hero"><i class="${icon}"></i></div>`, p(label),
         `<a class="metro-btn" href="#" onclick="return false">follow @okkoki</a>`];
    const post = (title, date, snippet) =>
        `<div class="blog-post"><div class="blog-post-title">${title}</div>` +
        `<div class="blog-post-date">${date}</div><p class="metro-p">${snippet}</p></div>`;

    const MONTHS = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
    const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const APPS = [
        { id: "8bit", name: "8-Bit", icon: "fa-solid fa-heart", blocks: () => [
            `<div class="retro-block"><span class="retro-text">OKKOKI</span></div>`,
            p("Where it all started — a love for pixels, play and personality. We bring that same retro heart to every brand we build."),
        ]},
        { id: "blog", name: "Blog", icon: "fa-solid fa-blog", blocks: () => [
            post("5 ways to grow your local business", "jul 10, 2026", "Simple, low-budget moves that bring real customers through the door."),
            post("why your shop needs a website in 2026", "jun 28, 2026", "Your customers search online first. Here's how to be what they find."),
            post("social media that actually sells", "jun 12, 2026", "Stop posting into the void — start posting with purpose."),
        ]},
        { id: "calendar", name: "Calendar", icon: "fa-solid fa-calendar", blocks: () => {
            const d = new Date();
            return [
                `<p class="big-date">${d.getDate()}</p><p class="big-date-sub">${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getFullYear()}</p>`,
                item("fa-solid fa-mug-hot", "free growth call", "book a 30-min chat about your business"),
                p("No more events today."),
            ];
        }},
        { id: "camera", name: "Camera", icon: "fa-solid fa-camera", blocks: () => [
            `<div class="social-hero"><i class="fa-solid fa-camera"></i></div>`,
            p("Product photography and brand shoots that make small businesses look big."),
        ]},
        { id: "email", name: "Email", icon: "fa-solid fa-envelope", blocks: () => [
            big("Let's talk about your business."),
            item("fa-solid fa-envelope", "hello@okkoki.com", "we reply within one business day"),
            `<a class="metro-btn" href="mailto:hello@okkoki.com">send email</a>`,
        ]},
        { id: "facebook", name: "Facebook", icon: "fa-brands fa-facebook-f", blocks: () =>
            social("fa-brands fa-facebook-f", "Daily tips, client wins and behind-the-scenes from the OKKOKI team.") },
        { id: "instagram", name: "Instagram", icon: "fa-brands fa-instagram", blocks: () =>
            social("fa-brands fa-instagram", "Our freshest work, reels and brand glow-ups — in squares.") },
        { id: "maps", name: "Maps", icon: "fa-solid fa-location-dot", blocks: () => [
            `<div class="social-hero"><i class="fa-solid fa-location-dot"></i></div>`,
            big("We work with small businesses everywhere."),
            p("Fully remote, globally available. Wherever you are, we can help you grow."),
        ]},
        { id: "mission", name: "Mission", icon: "fa-solid fa-bullseye", blocks: () => [
            big("Fueling small business growth."),
            p("OKKOKI exists to give small businesses the digital firepower of big brands — websites, social media and branding that punch above their weight."),
            p("We believe every corner shop, studio and startup deserves to be found, remembered and loved."),
        ]},
        { id: "music", name: "Music", icon: "fa-solid fa-music", blocks: () => [
            `<div class="social-hero"><i class="fa-solid fa-music"></i></div>`,
            big("now playing — metro beats"),
            p("The soundtrack of the grind. Volume up, business growing."),
        ]},
        { id: "note", name: "Note", icon: "fa-solid fa-note-sticky", blocks: () => [
            big("Ideas worth writing down:"),
            p("&bull; A website is your hardest-working employee.<br>&bull; Consistency beats virality.<br>&bull; Your brand is what people say when you're not in the room."),
        ]},
        { id: "people", name: "People", icon: "fa-solid fa-users", blocks: () => [
            person("#60a917", "AK", "arjun k.", "founder &amp; strategy"),
            person("#fa6800", "SR", "sana r.", "design lead"),
            person("#aa00ff", "MJ", "mike j.", "social media"),
            person("#d80073", "YOU", "your business", "the next success story"),
        ]},
        { id: "phone", name: "Phone", icon: "fa-solid fa-phone", blocks: () => [
            big("Prefer to talk it out?"),
            item("fa-solid fa-phone", "+1 (555) 012-3456", "mon–fri, 9am–6pm"),
            `<a class="metro-btn" href="tel:+15550123456">call now</a>`,
        ]},
        { id: "portfolio", name: "Portfolio", icon: "fa-solid fa-folder-open", blocks: () => [
            `<div class="portfolio-grid">
                <div class="pf" style="background:#e51400">cafe kiosk</div>
                <div class="pf" style="background:#60a917">daily fit</div>
                <div class="pf" style="background:#fa6800">style studio</div>
                <div class="pf" style="background:#aa00ff">book nook</div>
                <div class="pf" style="background:#0050ef">urban eats</div>
                <div class="pf" style="background:#d80073">glow salon</div>
            </div>`,
        ]},
        { id: "recorder", name: "Recorder", icon: "fa-solid fa-microphone", blocks: () => [
            `<div class="social-hero"><i class="fa-solid fa-microphone"></i></div>`,
            p("Voice notes, podcasts, brand stories — we help you say it loud and clear."),
        ]},
        { id: "screensaver", name: "Screensaver", icon: "fa-solid fa-table-cells", blocks: () => [
            `<div class="portfolio-grid">
                <div class="pf" style="background:#1ba1e2"></div>
                <div class="pf" style="background:#0057b7"></div>
                <div class="pf" style="background:#0050ef"></div>
                <div class="pf" style="background:#1a7fe0"></div>
            </div>`,
            p("Fifty shades of Metro blue."),
        ]},
        { id: "service", name: "Service", icon: "fa-solid fa-users-gear", blocks: () => [
            item("fa-solid fa-laptop-code", "web development", "fast, modern websites that convert visitors"),
            item("fa-solid fa-hashtag", "social media marketing", "content and campaigns that build community"),
            item("fa-solid fa-pen-nib", "branding &amp; design", "logos and identities people remember"),
            item("fa-solid fa-chart-line", "seo &amp; growth", "get found by the customers searching for you"),
        ]},
        { id: "twitter", name: "Twitter", icon: "fa-brands fa-twitter", blocks: () =>
            social("fa-brands fa-twitter", "Hot takes on small business, marketing and design — 280 characters at a time.") },
        { id: "whatsapp", name: "WhatsApp", icon: "fa-brands fa-whatsapp", blocks: () => [
            `<div class="social-hero"><i class="fa-brands fa-whatsapp"></i></div>`,
            big("Chat with us directly."),
            p("Quick questions, quick answers. Message us any time."),
            `<a class="metro-btn" href="#" onclick="return false">start chat</a>`,
        ]},
        { id: "youtube", name: "YouTube", icon: "fa-brands fa-youtube", blocks: () =>
            social("fa-brands fa-youtube", "Tutorials, case studies and growth tips for small business owners.") },
    ];

    const appById = (id) => APPS.find((a) => a.id === id);

    /* ---------------- DOM refs ---------------- */
    const viewport     = $("#viewport");
    const startScreen  = $("#startScreen");
    const listScreen   = $("#appListScreen");
    const appScreen    = $("#appScreen");
    const tileGrid     = $("#tileGrid");
    const appListEl    = $("#appList");
    const jumpGrid     = $("#jumpGrid");
    const searchInput  = $("#searchApps");

    /* ---------------- State ---------------- */
    let current = "start";        // 'start' | 'list' | 'app'
    let openedFrom = "start";     // where the open app returns to
    let busy = false;             // animation lock
    let editMode = false;
    let suppressClick = false;    // eat the click after a long-press

    /* ================================================================
       Animation helpers
       ================================================================ */
    function animOnce(el, cls) {
        return new Promise((resolve) => {
            const done = () => { el.classList.remove(cls); el.removeEventListener("animationend", done); resolve(); };
            el.addEventListener("animationend", done);
            el.classList.add(cls);
            setTimeout(done, 600); // safety net
        });
    }

    /* Staggered turnstile on a set of elements. dir: 'in' | 'out' */
    function turnstile(els, dir, step = 25) {
        return new Promise((resolve) => {
            els = [...els];
            if (!els.length) return resolve();
            els.forEach((el, i) => {
                el.classList.remove("ts-in", "ts-out");
                void el.offsetWidth; // restart animation
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
       Screen navigation
       ================================================================ */
    async function openApp(id, tileEl) {
        const app = appById(id);
        if (!app || busy || editMode) return;
        busy = true;
        openedFrom = current;
        buildAppPage(app);

        if (current === "start") {
            if (tileEl) tileEl.classList.add("launching");
            await turnstile(gridEls(), "out", 18);
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
            await turnstile(gridEls(), "in", 22);
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
        await turnstile(gridEls(), "in", 22);
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
        if (current === "app") closeApp();
        else if (current === "list") goStart();
    }

    /* ================================================================
       App page builder
       ================================================================ */
    function buildAppPage(app) {
        const blocks = app.blocks ? app.blocks() : [p("coming soon")];
        appScreen.innerHTML =
            `<div class="app-page">
                <header data-anim>
                    <div class="app-brand">okkoki</div>
                    <h1 class="page-title">${app.name.toLowerCase()}</h1>
                </header>
                ${blocks.map((b) => `<div class="app-block" data-anim>${b}</div>`).join("")}
            </div>`;
    }

    /* ================================================================
       App list + alphabet jump grid
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

        jumpGrid.innerHTML = LETTERS.map((l, i) =>
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

    /* Search */
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
       Start screen: tap to open, tilt on press, long-press edit mode
       ================================================================ */
    tileGrid.addEventListener("click", (e) => {
        if (suppressClick) { suppressClick = false; return; }
        if (editMode) return;
        const tile = e.target.closest(".tile[data-app]");
        if (tile) openApp(tile.dataset.app, tile);
    });

    tileGrid.addEventListener("contextmenu", (e) => e.preventDefault());

    /* --- Tilt (WP signature press effect) + long-press detection --- */
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
        if (Math.hypot(e.clientX - pressX, e.clientY - pressY) > 12) cancelPress(); // it's a scroll
        else applyTilt(tiltedTile, e);
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach((ev) =>
        tileGrid.addEventListener(ev, cancelPress)
    );

    /* ================================================================
       Edit mode (long-press): unpin & resize
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
    }

    overlay.addEventListener("click", exitEditMode);

    function unpinTile(tile) {
        tile.classList.add("removing");
        setTimeout(() => {
            const parent = tile.parentElement;
            tile.remove();
            if (parent.classList.contains("small-grid") && parent.children.length === 0) parent.remove();
            exitEditMode();
        }, 300);
    }

    /* Cycle small -> regular -> medium -> large -> small */
    function resizeTile(tile) {
        if (tile.classList.contains("small")) {
            tile.classList.remove("small");
            const smallGrid = tile.parentElement;
            if (smallGrid.classList.contains("small-grid")) {
                smallGrid.after(tile);
                if (smallGrid.children.length === 0) smallGrid.remove();
            }
        } else if (tile.classList.contains("medium")) {
            tile.classList.remove("medium");
            tile.classList.add("large");
        } else if (tile.classList.contains("large")) {
            tile.classList.remove("large");
            tile.classList.add("small");
            let grid = $$(".small-grid", tileGrid).find((g) => g.children.length < 4);
            if (!grid) {
                grid = document.createElement("div");
                grid.className = "small-grid";
                tileGrid.appendChild(grid);
            }
            grid.appendChild(tile);
        } else {
            tile.classList.add("medium");
        }
    }

    /* ================================================================
       Live tiles
       ================================================================ */
    function fillCalendarTile() {
        const d = new Date();
        $("#calDay").textContent = d.getDate();
        $("#calWeekday").textContent = DAYS[d.getDay()];
        $("#calMonth").textContent = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    }

    setInterval(() => {
        if (current !== "start" || busy || editMode || document.hidden) return;
        const lives = $$(".tile.live", tileGrid);
        if (!lives.length) return;
        const t = lives[Math.floor(Math.random() * lives.length)];
        t.classList.toggle("flipped");
    }, 3200);

    /* ================================================================
       Status bar clock
       ================================================================ */
    function tickClock() {
        const d = new Date();
        let h = d.getHours() % 12;
        if (h === 0) h = 12;
        $("#statusClock").textContent = `${h}:${String(d.getMinutes()).padStart(2, "0")}`;
    }
    tickClock();
    setInterval(tickClock, 15000);

    /* ================================================================
       Nav bar + all-apps arrow + swipe
       ================================================================ */
    $("#navBack").addEventListener("click", goBack);
    $("#navStart").addEventListener("click", () => { exitEditMode(); goStart(); });
    $("#navSearch").addEventListener("click", () => { exitEditMode(); goList(true); });
    $("#allAppsBtn").addEventListener("click", () => goList());

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
    renderAppList();
    fillCalendarTile();
    turnstile(gridEls(), "in", 40);   // WP boot animation
})();
