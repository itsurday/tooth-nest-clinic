import { hoursStatus } from './hours.js';

// Mobile menu: the nav is visible without JS; with JS it collapses behind the toggle.
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
if (toggle && nav) {
  const setOpen = open => {
    nav.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('use').setAttribute('href', `/assets/icons.svg#i-${open ? 'x' : 'menu'}`);
  };
  setOpen(false);
  toggle.addEventListener('click', () => setOpen(nav.dataset.open !== 'true'));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.dataset.open === 'true') { setOpen(false); toggle.focus(); }
  });
}

// "Open now" chips. Purely informational, so a failed fetch just leaves them empty (hidden by CSS).
const chips = document.querySelectorAll('[data-hours-status]');
if (chips.length) {
  fetch('/assets/data/site.json')
    .then(r => r.json())
    .then(site => {
      const render = () => {
        const { open, text } = hoursStatus(site);
        chips.forEach(chip => { chip.dataset.open = String(open); chip.textContent = text; });
      };
      render();
      setInterval(render, 60_000);
    })
    .catch(() => {});
}

// Click-to-load Google map: nothing is requested from Google until the visitor asks for it.
document.querySelectorAll('[data-map-src]').forEach(box => {
  box.querySelector('button')?.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = box.dataset.mapSrc;
    frame.title = box.dataset.mapTitle || 'Map';
    frame.loading = 'lazy';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    box.replaceChildren(frame);
  });
});
