// Collapsible sections: make sections and headings collapsible and persist state
window.initializeCollapsibleSections = window.initializeCollapsibleSections || function () {
	(function init() {
		try {
			const entityBody = document.querySelector('.entity-body');
			const article = document.querySelector('article');
			const main = document.querySelector('main.main');
			const target = entityBody || article || main || document.body;
			if (!target) return;

			// For simple articles/main, wrap top-level H1/H2 in sections if not already
			if (!entityBody && (article || main)) {
				const topLevelHeadings = Array.from((article || main).querySelectorAll('h1, h2'));
				topLevelHeadings.forEach((heading, index) => {
					if (heading.closest('section[id]')) return;
					const section = document.createElement('section');
					// Create stable id from heading text
					let base = 'section-' + slugify(heading.textContent || ('section-' + (index + 1)));
					if (!base || base === 'section-') base = 'section-' + (index + 1);
					let id = base; let i = 1;
					while (document.getElementById(id)) { id = base + '-' + (i++); }
					section.id = id;
					heading.parentNode.insertBefore(section, heading);
					const toMove = [heading];
					let el = heading.nextSibling;
					while (el && !(el.tagName === 'H1' || el.tagName === 'H2')) {
						const next = el.nextSibling;
						toMove.push(el);
						el = next;
					}
					toMove.forEach(node => section.appendChild(node));
				});
			}

			// Make top-level sections (with IDs) collapsible and persist by page path
			const sections = target.querySelectorAll('section[id]');
			sections.forEach(section => {
				const heading = section.querySelector('h1, h2');
				if (!heading) return;

				// Wrap all following nodes in a content container
				const contentWrapper = document.createElement('div');
				contentWrapper.className = 'section-content';
				const toMove = [];
				let el = heading.nextSibling;
				while (el) {
					const next = el.nextSibling;
					toMove.push(el);
					el = next;
				}
				toMove.forEach(node => contentWrapper.appendChild(node));
				section.appendChild(contentWrapper);

				heading.style.cursor = 'pointer';
				heading.setAttribute('tabindex', '0');
				heading.setAttribute('role', 'button');
				heading.setAttribute('aria-expanded', 'true');

				function toggleSection() {
					const wasCollapsed = section.classList.contains('collapsed');
					section.classList.toggle('collapsed');
					heading.setAttribute('aria-expanded', String(!wasCollapsed));

					// Save state
					try {
						const sectionId = section.id;
						const collapsedSections = JSON.parse(localStorage.getItem('collapsedSections') || '{}');
						const pageKey = location.pathname;
						if (!collapsedSections[pageKey]) collapsedSections[pageKey] = [];
						if (wasCollapsed) {
							collapsedSections[pageKey] = collapsedSections[pageKey].filter(id => id !== sectionId);
						} else {
							if (!collapsedSections[pageKey].includes(sectionId)) collapsedSections[pageKey].push(sectionId);
						}
						localStorage.setItem('collapsedSections', JSON.stringify(collapsedSections));
					} catch (e) { }
				}

				heading.addEventListener('click', toggleSection);
				heading.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleSection(); } });

				// Restore
				try {
					const collapsedSections = JSON.parse(localStorage.getItem('collapsedSections') || '{}');
					const pageKey = location.pathname;
					if (collapsedSections[pageKey]?.includes(section.id)) {
						section.classList.add('collapsed');
						heading.setAttribute('aria-expanded', 'false');
					}
				} catch (e) { }
			});

			// Make h1-h4 headings within sections collapsible (nested collapsibles)
			const levels = ['H1','H2','H3','H4'];
			const headings = [...target.querySelectorAll(levels.join(','))].filter(h => {
				return !h.parentElement.classList.contains('entity') && !h.parentElement.matches('section[id]');
			});
			headings.forEach(h => {
				const container = document.createElement('div');
				container.className = 'collapsible-section';
				const content = document.createElement('div');
				content.className = 'collapsible-content';

				let el = h.nextSibling;
				const stopAt = (tag) => levels.indexOf(tag) <= levels.indexOf(h.tagName);
				const toMove = [];
				while (el) {
					if (el.nodeType === 1 && levels.includes(el.tagName) && stopAt(el.tagName)) break;
					const next = el.nextSibling;
					toMove.push(el);
					el = next;
				}
				if (!toMove.length) return;

				h.classList.add('collapsible-toggle');
				h.setAttribute('tabindex', '0');
				h.setAttribute('role', 'button');
				h.setAttribute('aria-expanded', 'true');
				h.parentNode.insertBefore(container, h);
				container.appendChild(h);
				toMove.forEach(n => content.appendChild(n));
				container.appendChild(content);

				// assign a stable id based on heading text so state can persist across reloads
				if (!container.dataset.cid) {
					const slugify = (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
					const base = 'cs-' + h.tagName.toLowerCase() + '-' + slugify(h.textContent || 'section');
					// ensure uniqueness on page
					let cid = base; let i = 1;
					while (document.querySelector(`[data-cid="${cid}"]`)) { cid = base + '-' + (i++); }
					container.dataset.cid = cid;
				}

				function toggle() {
					const open = h.getAttribute('aria-expanded') === 'true';
					h.setAttribute('aria-expanded', String(!open));
					content.style.display = open ? 'none' : 'block';

					// Save state
					try {
						const pageKey = location.pathname;
						const states = JSON.parse(localStorage.getItem('collapsibleStates') || '{}');
						if (!states[pageKey]) states[pageKey] = {};
						states[pageKey][container.dataset.cid] = !open;
						localStorage.setItem('collapsibleStates', JSON.stringify(states));
					} catch (e) { }
				}

				h.addEventListener('click', toggle);
				h.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });

				// Restore
				try {
					const states = JSON.parse(localStorage.getItem('collapsibleStates') || '{}');
					const pageKey = location.pathname;
					if (states[pageKey] && states[pageKey][container.dataset.cid] === true) {
						h.setAttribute('aria-expanded', 'false');
						content.style.display = 'none';
					}
				} catch (e) { }
			});
		} catch (e) { }
	})();
};
