(() => {
  // assets/site/runtime.js
  (function() {
    window.DM = window.DM || {};
    window.DM.config = {
      apiCreatePage: "/api/create-page",
      apiDeletePage: "/api/delete-page",
      searchIndex: "/search-index.json",
      notesJson: "/notes.json",
      redirectDashboard: "/index.html",
      searchPage: "/search.html"
    };
    window.DM.keys = {
      createPageForm: "createPageForm",
      createPageStatus: "createPageStatus",
      deletePageForm: "deletePageForm",
      deletePageConfirm: "deletePageConfirm",
      deletePageStatus: "deletePageStatus",
      searchBox: "searchBox",
      searchResults: "searchResults",
      btnEditPage: "btnEditPage",
      editPageModal: "editPageModal",
      editPageContent: "editPageContent",
      saveSession: "saveSession",
      bookmarkPage: "bookmarkPage",
      topBar: "top"
    };
  })();

  // assets/site/icons.js
  (function() {
    window.DM = window.DM || {};
    window.DM.icons = window.DM.icons || {};
    function svgIcon(name, size = 16) {
      const icons = {
        search: `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" stroke-width="1.5"/>
      </svg>`,
        close: `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="currentColor">
        <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" stroke-width="2"/>
        <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" stroke-width="2"/>
      </svg>`,
        link: `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1v14M1 8h14"/>
      </svg>`
      };
      return icons[name] || "";
    }
    window.DM.icons.svgIcon = svgIcon;
    window.svgIcon = svgIcon;
  })();

  // assets/site/tags-and-pins.js
  function initPinToggle() {
    window.togglePin = function(rel) {
      const pins = JSON.parse(localStorage.getItem("pins") || "[]");
      const i = pins.indexOf(rel);
      if (i >= 0) pins.splice(i, 1);
      else pins.push(rel);
      localStorage.setItem("pins", JSON.stringify(pins));
      document.querySelectorAll("[data-pin]").forEach((el) => {
        if (el.dataset.rel && el.dataset.rel !== rel) return;
        if (window.svgIcon) {
          el.innerHTML = pins.includes(rel) ? window.svgIcon("star-fill", 18) : window.svgIcon("star", 18);
        } else {
          el.textContent = pins.includes(rel) ? "\u2605" : "\u2606";
        }
      });
    };
  }
  var TAG_CLASS_MAP = {
    pc: "tag-pc",
    npc: "tag-npc",
    location: "tag-location",
    arc: "tag-arc",
    planning: "tag-planning"
  };
  function initTagColorization() {
    document.querySelectorAll(".tag").forEach((el) => {
      for (const tag in TAG_CLASS_MAP) {
        if (el.textContent && el.textContent.match(new RegExp(`#?${tag}\b`, "i"))) {
          el.classList.add(TAG_CLASS_MAP[tag]);
        }
      }
    });
  }

  // assets/site/modals.js
  (function() {
    function initDelegatedModals() {
      if (window.__dmDelegatedModalsInit) return;
      window.__dmDelegatedModalsInit = true;
      document.addEventListener("submit", async function(e) {
        const form = e.target;
        if (!(form instanceof HTMLFormElement)) return;
        if (form.id === "createPageForm") {
          e.preventDefault();
          const status = document.getElementById("createPageStatus");
          if (status) {
            status.textContent = "Creating page...";
            status.className = "info";
          }
          const formData = new FormData(form);
          const data = Object.fromEntries(formData.entries());
          try {
            const resp = await fetch("/api/create-page", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data)
            });
            const result = await resp.json();
            if (resp.ok && result.url) {
              if (status) {
                status.textContent = "Page created! Redirecting...";
                status.className = "success";
              }
              setTimeout(() => {
                window.location.href = result.url;
              }, 1e3);
            } else {
              if (status) {
                status.textContent = result.error || "Failed to create page";
                status.className = "error";
              }
            }
          } catch (err) {
            if (status) {
              status.textContent = "Network error: " + err.message;
              status.className = "error";
            }
          }
          return;
        }
        if (form.id === "deletePageForm") {
          e.preventDefault();
          const confirmInput = document.getElementById("deletePageConfirm");
          const status = document.getElementById("deletePageStatus");
          if (status) {
            status.textContent = "Deleting page...";
            status.className = "info";
          }
          try {
            const resp = await fetch("/api/delete-page", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: window.location.pathname })
            });
            if (resp.ok) {
              if (status) {
                status.textContent = "Page deleted. Redirecting...";
                status.className = "success";
              }
              setTimeout(() => {
                window.location.href = "/index.html";
              }, 1e3);
            } else {
              if (status) {
                status.textContent = "Failed to delete page";
                status.className = "error";
              }
            }
          } catch (err) {
            if (status) {
              status.textContent = "Network error: " + err.message;
              status.className = "error";
            }
          }
          return;
        }
      }, true);
    }
    window.initDelegatedModals = initDelegatedModals;
    initDelegatedModals();
  })();

  // assets/site/shortcuts.js
  window.DM = window.DM || {};
  window.DM.shortcuts = window.DM.shortcuts || {};
  window.DM.shortcuts.init = function() {
    if (window.__dmShortcutsInit) return;
    window.__dmShortcutsInit = true;
    document.addEventListener("keydown", function(e) {
      const active = document.activeElement;
      const isTyping = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable);
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.key.toLowerCase() === "b") {
        if (!isTyping) {
          document.body.classList.toggle("blurred");
          e.preventDefault();
        }
      }
      if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === "s") {
        if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT" || active.isContentEditable)) {
          return;
        }
        if (window.saveSessionSnapshot) {
          e.preventDefault();
          window.saveSessionSnapshot();
        }
      }
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && (e.key.toLowerCase() === "c" || e.key.toLowerCase() === "q")) {
        if (!isTyping) {
          document.body.classList.toggle("collapsed");
          e.preventDefault();
        }
      }
      if (e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey && e.key.toLowerCase() === "d") {
        if (!isTyping) {
          const btn = document.querySelector(".bookmark-btn");
          if (btn) {
            btn.click();
            e.preventDefault();
          }
        }
      }
    });
  };

  // assets/site/topbar.js
  function initTopbarButtons() {
    const header = document.querySelector(".top");
    if (!header) return;
    const search = header.querySelector(".search");
    if (!search) return;
    let bookmarkBtn = document.getElementById("bookmarkPage");
    if (!bookmarkBtn) {
      bookmarkBtn = document.createElement("button");
      bookmarkBtn.id = "bookmarkPage";
      bookmarkBtn.className = "bookmark-btn";
      bookmarkBtn.type = "button";
      bookmarkBtn.title = "Bookmark this page";
      bookmarkBtn.innerHTML = "\u2606";
      bookmarkBtn.setAttribute("data-rel", decodeURIComponent(location.pathname.replace(/^\//, "")).replace(/\.html$/i, ".md"));
      search.insertAdjacentElement("afterend", bookmarkBtn);
    }
    if (!bookmarkBtn.dataset.dmBound) {
      bookmarkBtn.addEventListener("click", function(e) {
        e.preventDefault();
        if (typeof window.addFavorite === "function") {
          window.addFavorite();
        }
      });
      bookmarkBtn.dataset.dmBound = "1";
    }
    let saveBtn = document.getElementById("saveSession");
    if (!saveBtn) {
      saveBtn = document.createElement("button");
      saveBtn.id = "saveSession";
      saveBtn.className = "save-session-btn";
      saveBtn.type = "button";
      saveBtn.title = "Save session notes snapshot";
      saveBtn.innerHTML = "\u{1F4BE}";
      bookmarkBtn.insertAdjacentElement("afterend", saveBtn);
    }
    if (!saveBtn.dataset.dmBound) {
      saveBtn.addEventListener("click", function(e) {
        e.preventDefault();
        if (typeof window.saveSessionSnapshot === "function") {
          window.saveSessionSnapshot();
        }
      });
      saveBtn.dataset.dmBound = "1";
    }
  }

  // assets/site/hovercard.js
  function initHovercard() {
    if (window.__dmHovercardInit) return;
    window.__dmHovercardInit = true;
    let hover = document.getElementById("__hovercard");
    if (!hover) {
      hover = document.createElement("div");
      hover.id = "__hovercard";
      hover.className = "hovercard";
      document.body.appendChild(hover);
    }
    document.body.addEventListener("mousemove", (e) => {
      hover.style.left = e.pageX + 12 + "px";
      hover.style.top = e.pageY + 12 + "px";
    });
    document.body.addEventListener("mouseover", (e) => {
      const a = e.target.closest("a");
      if (!a || !a.href || !a.pathname.endsWith(".html")) {
        hover.style.display = "none";
        return;
      }
      let parent = a.parentElement;
      while (parent) {
        if (parent.classList && parent.classList.contains("left")) {
          hover.style.display = "none";
          return;
        }
        parent = parent.parentElement;
      }
      const id = a.pathname.replace(/^\//, "").replace(/\.html$/i, ".md");
      const notes = window.NOTES || window.getNotes && window.getNotes();
      const n = notes && notes.find((n2) => n2.id === id);
      if (n) {
        hover.innerHTML = "<strong>" + n.title + '</strong><div class="meta">' + (n.tags || []).map((t) => "#" + t).join(" ") + "</div>";
        hover.style.display = "block";
      } else {
        hover.style.display = "none";
      }
    });
    document.body.addEventListener("mouseout", (e) => {
      hover.style.display = "none";
    });
  }

  // assets/site/sidebar/split-click.js
  function bindSplitClickNavigation(leftRoot) {
    if (!leftRoot || leftRoot.dataset.dmSplitClickBound) return;
    leftRoot.dataset.dmSplitClickBound = "1";
    leftRoot.querySelectorAll(".nav-details > summary").forEach((summary) => {
      if (summary.dataset.dmSplitClickBound) return;
      summary.dataset.dmSplitClickBound = "1";
      summary.addEventListener("mousedown", (e) => {
        if (e.button === 1 || e.button === 0 && e.ctrlKey) {
          const link = summary.querySelector("a, .nav-item");
          if (link && link.href) window.open(link.href, "_blank");
          e.preventDefault();
        } else if (e.button === 0 && !e.ctrlKey && !e.metaKey) {
          const link = summary.querySelector("a, .nav-item");
          if (link && link.href && !summary.classList.contains("active")) {
            window.location.href = link.href;
          }
        }
      });
    });
  }

  // assets/site/sidebar/recents.js
  function bindRecents(leftRoot) {
    if (!leftRoot || leftRoot.dataset.dmRecentsBound) return;
    leftRoot.dataset.dmRecentsBound = "1";
    const RECENTS_KEY = "dmRecents";
    const recentsList = leftRoot.querySelector("#navRecents, #navFav");
    if (!recentsList) return;
    function getRecents() {
      try {
        return JSON.parse(localStorage.getItem(RECENTS_KEY) || "[]");
      } catch (e) {
        return [];
      }
    }
    function saveRecents(list) {
      localStorage.setItem(RECENTS_KEY, JSON.stringify(list));
    }
    function renderRecents() {
      const recents2 = getRecents();
      recentsList.innerHTML = recents2.map((r) => `<li><a href="${r.href}">${r.title}</a></li>`).join("");
    }
    const page = { href: location.pathname, title: document.title };
    let recents = getRecents();
    if (!recents.find((r) => r.href === page.href)) {
      recents.unshift(page);
      if (recents.length > 10) recents = recents.slice(0, 10);
      saveRecents(recents);
    }
    renderRecents();
  }

  // assets/site/sidebar/filters.js
  function bindNavQuickFilter(leftRoot) {
    if (!leftRoot || leftRoot.dataset.dmQuickFilterBound) return;
    leftRoot.dataset.dmQuickFilterBound = "1";
    const input = leftRoot.querySelector("#navQuick");
    const navSections = leftRoot.querySelectorAll(".nav-list, .nav-sections");
    if (!input || !navSections.length) return;
    input.addEventListener("input", () => {
      const val = input.value.trim().toLowerCase();
      navSections.forEach((list) => {
        list.querySelectorAll("li").forEach((li) => {
          const text = li.textContent.toLowerCase();
          li.style.display = val && !text.includes(val) ? "none" : "";
        });
      });
    });
  }
  function bindSectionMiniFilters(leftRoot) {
    if (!leftRoot || leftRoot.dataset.dmMiniFiltersBound) return;
    leftRoot.dataset.dmMiniFiltersBound = "1";
    leftRoot.querySelectorAll(".nav-mini-input").forEach((input) => {
      if (input.dataset.dmMiniFilterBound) return;
      input.dataset.dmMiniFilterBound = "1";
      input.addEventListener("input", () => {
        const val = input.value.trim().toLowerCase();
        const section = input.closest("details");
        if (!section) return;
        section.querySelectorAll(".nav-list li").forEach((li) => {
          const text = li.textContent.toLowerCase();
          li.style.display = val && !text.includes(val) ? "none" : "";
        });
      });
    });
  }
  function bindOnlySectionToggle(leftRoot) {
    if (!leftRoot || leftRoot.dataset.dmOnlySectionBound) return;
    leftRoot.dataset.dmOnlySectionBound = "1";
    leftRoot.querySelectorAll(".nav-only").forEach((btn) => {
      if (btn.dataset.dmOnlySectionBound) return;
      btn.dataset.dmOnlySectionBound = "1";
      btn.addEventListener("click", (e) => {
        const section = btn.closest("details");
        if (!section) return;
        leftRoot.querySelectorAll(".nav-details").forEach((d) => {
          d.style.display = d === section ? "" : "none";
        });
        if (!leftRoot.querySelector(".nav-only-reset")) {
          const reset = document.createElement("button");
          reset.textContent = "Show all";
          reset.className = "chip nav-only-reset";
          reset.addEventListener("click", () => {
            leftRoot.querySelectorAll(".nav-details").forEach((d) => {
              d.style.display = "";
            });
            reset.remove();
          });
          section.parentNode.insertBefore(reset, section.nextSibling);
        }
      });
    });
  }

  // assets/site/sidebar/init.js
  function initSidebar(leftRoot) {
    if (!leftRoot) leftRoot = document.querySelector(".left, .sidebar, #leftDrawer");
    if (!leftRoot) return;
    bindSplitClickNavigation(leftRoot);
    bindRecents(leftRoot);
    bindNavQuickFilter(leftRoot);
    bindSectionMiniFilters(leftRoot);
    bindOnlySectionToggle(leftRoot);
  }

  // assets/site/right-drawer.js
  function initRightDrawer() {
    const right = document.querySelector(".right");
    const toggle = document.getElementById("drawerToggle");
    const pin = document.getElementById("drawerPin");
    const reveal = document.getElementById("drawerReveal");
    const KEY_PINNED = "drawerPinned";
    const KEY_OPEN = "drawerOpen";
    let pinned = JSON.parse(localStorage.getItem(KEY_PINNED) || "false");
    let open = JSON.parse(localStorage.getItem(KEY_OPEN) || "true");
    function updateUI() {
      if (!right) return;
      if (pinned) {
        right.classList.remove("collapsed");
        document.body.classList.remove("drawer-collapsed");
        pin.setAttribute("aria-pressed", "true");
        localStorage.setItem(KEY_OPEN, "true");
        open = true;
      } else {
        pin.setAttribute("aria-pressed", "false");
        if (!open) {
          right.classList.add("collapsed");
          document.body.classList.add("drawer-collapsed");
        } else {
          right.classList.remove("collapsed");
          document.body.classList.remove("drawer-collapsed");
        }
      }
    }
    if (pin) {
      pin.addEventListener("click", () => {
        pinned = !pinned;
        localStorage.setItem(KEY_PINNED, JSON.stringify(pinned));
        updateUI();
      });
    }
    if (toggle) {
      toggle.addEventListener("click", () => {
        if (pinned) return;
        open = !open;
        localStorage.setItem(KEY_OPEN, JSON.stringify(open));
        updateUI();
      });
    }
    if (reveal) {
      reveal.addEventListener("click", () => {
        open = true;
        localStorage.setItem(KEY_OPEN, "true");
        updateUI();
      });
    }
    updateUI();
    window.initRightDrawer = initRightDrawer;
  }
  if (typeof window !== "undefined") {
    window.initRightDrawer = initRightDrawer;
  }

  // assets/site/panels.js
  function initPanelResizers() {
    const container = document.querySelector(".right-split");
    const res = document.querySelector(".pane-resizer-h");
    const KEY_SPLIT = "rightPaneSplit";
    if (!container || !res) return;
    const saved = localStorage.getItem(KEY_SPLIT);
    function initSplit() {
      const rect = container.getBoundingClientRect();
      const minPx = 120;
      const maxPx = Math.max(minPx, rect.height - 120);
      let val = "30%";
      if (saved && /^(\d+)(px|%)$/.test(saved)) {
        if (saved.endsWith("%")) {
          const pct = parseFloat(saved);
          let px = rect.height * ((isNaN(pct) ? 50 : pct) / 100);
          if (px < minPx) px = Math.min(rect.height / 2, minPx);
          if (px > maxPx) px = Math.max(rect.height / 2, maxPx);
          val = px + "px";
        } else {
          let px = parseFloat(saved);
          if (isNaN(px)) px = rect.height / 2;
          if (px < minPx) px = Math.min(rect.height / 2, minPx);
          if (px > maxPx) px = Math.max(rect.height / 2, maxPx);
          val = px + "px";
        }
      }
      container.style.setProperty("--pane-top-h", val);
    }
    initSplit();
    function onDown(e) {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const startY = e.clientY;
      const cur = getComputedStyle(container).getPropertyValue("--pane-top-h").trim();
      const startPx = cur.endsWith("%") ? rect.height * parseFloat(cur) / 100 : parseFloat(cur) || rect.height / 2;
      function onMove(ev) {
        const dy = ev.clientY - startY;
        let h = startPx + dy;
        const min = 120;
        const max = rect.height - 120;
        if (h < min) h = min;
        if (h > max) h = max;
        const val = h + "px";
        container.style.setProperty("--pane-top-h", val);
        try {
          localStorage.setItem(KEY_SPLIT, val);
        } catch (e2) {
        }
      }
      function onUp() {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      }
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    }
    res.addEventListener("mousedown", onDown);
  }
  try {
    window.initPanelResizers = initPanelResizers;
  } catch (e) {
  }

  // assets/site/binders.js
  function bindHeader() {
    const header = document.querySelector(".top");
    if (!header) return;
    header.dataset.dmBound = "1";
    initTopbarButtons();
    initHovercard();
  }
  function bindSidebar() {
    const leftRoot = document.querySelector(".left, .sidebar, #leftDrawer");
    if (!leftRoot) return;
    leftRoot.dataset.dmBound = "1";
    initSidebar(leftRoot);
  }
  function bindRightPanel() {
    const rightRoot = document.querySelector("aside.right, .right");
    if (!rightRoot) return;
    rightRoot.dataset.dmBound = "1";
    initRightDrawer();
    if (typeof initPanelResizers === "function") initPanelResizers();
  }

  // assets/site/entry.js
  window.DM = window.DM || {};
  function boot() {
    const g = globalThis;
    if (g.__dm_booted) return;
    g.__dm_booted = true;
    g.__dm_boot = boot;
    g.__dm_entry_version = "boot-01d";
    console.log("[dm] boot ran", g.__dm_entry_version);
    initPinToggle();
    window.addEventListener("dm-header-injected", bindHeader);
    window.addEventListener("dm-nav-inited", bindSidebar);
    window.addEventListener("dm-right-panel-injected", bindRightPanel);
    const fallbackBind = () => {
      bindHeader();
      bindSidebar();
      bindRightPanel();
    };
    if (document.readyState !== "loading") {
      fallbackBind();
    } else {
      document.addEventListener("DOMContentLoaded", fallbackBind, { once: true });
    }
  }
  boot();
})();
//# sourceMappingURL=site.js.map
