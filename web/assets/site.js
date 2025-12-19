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
  if (typeof window !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
      const leftRoot = document.querySelector(".left, .sidebar, #leftDrawer");
      if (leftRoot) initSidebar(leftRoot);
    });
  }
})();
//# sourceMappingURL=site.js.map
