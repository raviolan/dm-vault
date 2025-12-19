// Delegated modals: survives DOM replacement/injection
(function () {
    function initDelegatedModals() {
        if (window.__dmDelegatedModalsInit) return;
        window.__dmDelegatedModalsInit = true;
        document.addEventListener("submit", async function (e) {
            const form = e.target;
            if (!(form instanceof HTMLFormElement)) return;
            // Create Page
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
                        setTimeout(() => { window.location.href = result.url; }, 1000);
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
            // Delete Page
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
                        setTimeout(() => { window.location.href = "/index.html"; }, 1000);
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

    // Export for site.js
    window.initDelegatedModals = initDelegatedModals;

    // Auto-initialize for legacy compatibility
    initDelegatedModals();
})();
