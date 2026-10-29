// Template previews: fills the open-now chips using the real site's hours logic and data.
import { hoursStatus } from '/assets/js/hours.js';

const chips = document.querySelectorAll('[data-hours-status]');
if (chips.length) {
  fetch('/assets/data/site.json')
    .then(r => r.json())
    .then(site => {
      const { open, text } = hoursStatus(site);
      chips.forEach(c => { c.dataset.open = String(open); c.textContent = text; });
    })
    .catch(() => {});
}
