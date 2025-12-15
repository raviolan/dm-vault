# Phase 4C Injection Plan (Pilot Batch 1)

## Ranked List of 5 “Best First” Inline-to-Injected Candidates

### 1. Footer (Pilot Batch 1)
- **Files:**
  - assets/partials/footer.html (already exists as a partial)
  - index.html
  - Locations.html
  - Arcs.html
  - 01_Arcs/Arcs.html
- **What will be extracted:**
  - The site-wide `<footer class="footer">...</footer>` block, currently duplicated at the end of each main HTML page.
- **Why it’s safe:**
  - The footer is a simple, non-interactive, non-protected component.
  - It is already implemented as a partial in assets/partials/footer.html.
  - Affects only the bottom of each page, with no impact on protected features or app logic.
  - Blast radius: 1 partial + 4 main HTML files (well under the 5-file limit).
  - No mass HTML rewrite required; only a small, well-bounded change.

### 2. Header
- **Files:**
  - assets/partials/header.html
  - index.html
  - Locations.html
  - Arcs.html
  - 01_Arcs/Arcs.html
- **What will be extracted:**
  - The top toolbar/navigation bar, currently duplicated at the top of each main HTML page.
- **Why it’s safe:**
  - Header is already a partial and is referenced in a consistent way.
  - Slightly higher blast radius than the footer due to possible script dependencies.

### 3. Sidebar
- **Files:**
  - assets/partials/sidebar.html
  - index.html
  - Locations.html
  - Arcs.html
  - 01_Arcs/Arcs.html
- **What will be extracted:**
  - The left navigation drawer/sidebar block.
- **Why it’s safe:**
  - Sidebar is already a partial, but may have more interactive dependencies.
  - Slightly more risk than header/footer, but still well-bounded.

### 4. Right Panel
- **Files:**
  - assets/partials/right-panel.html
  - index.html
  - Locations.html
  - Arcs.html
  - 01_Arcs/Arcs.html
- **What will be extracted:**
  - The right drawer panel (notepad, to-do, tools).
- **Why it’s safe:**
  - Already a partial, but interacts with more scripts and dynamic content.
  - Slightly higher risk, but still isolated from protected features.

### 5. Breadcrumb
- **Files:**
  - assets/partials/breadcrumb.html
  - index.html
  - Locations.html
  - Arcs.html
  - 01_Arcs/Arcs.html
- **What will be extracted:**
  - The breadcrumb navigation bar.
- **Why it’s safe:**
  - Already a partial, but may have dynamic content dependencies.
  - Lowest priority due to possible data binding.

---

## Pilot Batch 1 — #1 Candidate: Footer
- **Component:** Footer
- **Files affected:** assets/partials/footer.html, index.html, Locations.html, Arcs.html, 01_Arcs/Arcs.html
- **Why:**
  - Smallest blast radius, no protected features, no mass HTML rewrite, and already implemented as a partial.
  - Simple, static content with no script dependencies.
  - Safest first step for injection refactor.
