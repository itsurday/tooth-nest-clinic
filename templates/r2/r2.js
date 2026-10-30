// Design Round 2 — shared behaviour: staggered entrances, open-now text, and the visit planner.
import { hoursStatus, formatTime } from '/assets/js/hours.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('r2-js');

// Entrances: each [data-r] rises in when it enters, staggered within its section by 70ms.
const io = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
document.querySelectorAll('section, header, footer, [data-group]').forEach(group => {
  [...group.querySelectorAll(':scope [data-r]')].forEach((el, i) => {
    if (el.style.getPropertyValue('--d')) return;
    el.style.setProperty('--d', `${Math.min(i, 6) * 70}ms`);
  });
});
document.querySelectorAll('[data-r]').forEach(el => io.observe(el));
// Never leave content hidden: reveal everything after 3s whatever happens.
setTimeout(() => document.querySelectorAll('[data-r]').forEach(el => el.classList.add('in')), reduce ? 0 : 3000);

const WA = '919704737577';
const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_NAMES = { sun: 'Sunday', mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday' };
const SESSION = from => (Number(from.split(':')[0]) < 12 ? 'Morning' : 'Evening');

// Clinic-time "today" as YYYY-MM-DD plus the next 6 days.
function clinicDays(tz) {
  const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
  const today = fmt.format(new Date());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + i);
    return { iso: d.toISOString().slice(0, 10), key: DAY_KEYS[d.getUTCDay()], date: d };
  });
}

fetch('/assets/data/site.json').then(r => r.json()).then(site => {
  document.querySelectorAll('[data-hours-status]').forEach(el => {
    const { open, text } = hoursStatus(site);
    el.textContent = text; el.dataset.open = String(open);
  });

  document.querySelectorAll('[data-planner]').forEach(root => {
    const daysRow = root.querySelector('.planner-days');
    const sessRow = root.querySelector('.planner-sessions');
    const out = root.querySelector('.planner-out');
    const go = root.querySelector('.planner-go');
    const holidays = new Set(site.holidays || []);
    let day, session;

    const render = () => {
      const sessions = holidays.has(day.iso) ? [] : site.hours[day.key] || [];
      const when = day.label === 'Today' || day.label === 'Tomorrow' ? day.label.toLowerCase() : `on ${DAY_NAMES[day.key]}`;
      sessRow.replaceChildren(...sessions.map(([from, to]) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'press';
        b.textContent = `${SESSION(from)} · ${formatTime(from)}–${formatTime(to)}`;
        b.setAttribute('aria-pressed', String(session === from));
        b.addEventListener('click', () => { session = from; render(); });
        return b;
      }));
      if (!sessions.length) {
        out.textContent = `Closed ${when}. Choose another day.`;
        go.setAttribute('aria-disabled', 'true'); go.href = `https://wa.me/${WA}`;
        return;
      }
      if (!sessions.some(([f]) => f === session)) session = sessions[0][0];
      const chosen = sessions.find(([f]) => f === session);
      const dateText = day.date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', timeZone: 'UTC' });
      const status = day.label === 'Today' ? ` ${hoursStatus(site).text}.` : '';
      out.textContent = `${dateText}: ${sessions.map(([f, t]) => `${formatTime(f)}–${formatTime(t)}`).join(' and ')}.${status}`;
      const msg = `Hello Tooth Nest, I would like an appointment ${when} (${dateText}), ${SESSION(chosen[0]).toLowerCase()} session.`;
      go.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
      go.removeAttribute('aria-disabled');
    };

    const days = clinicDays(site.timeZone).map((d, i) => ({ ...d, label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAY_NAMES[d.key].slice(0, 3) }));
    daysRow.replaceChildren(...days.map(d => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'press'; b.textContent = d.label;
      b.addEventListener('click', () => { day = d; session = null; daysRow.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); render(); });
      b.setAttribute('aria-pressed', 'false');
      return b;
    }));
    // Start on the first day that still has an open or upcoming session.
    const first = days.findIndex(d => !holidays.has(d.iso) && (site.hours[d.key] || []).length);
    daysRow.children[Math.max(first, 0)].click();
  });
}).catch(() => {});
