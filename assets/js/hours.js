// Opening-hours status, always computed in the clinic's time zone.
const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_NAMES = { sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat' };

const toMin = hhmm => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

export function formatTime(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const h12 = h % 12 || 12;
  return `${h12}${m ? ':' + String(m).padStart(2, '0') : ''} ${h < 12 ? 'AM' : 'PM'}`;
}

// Wall-clock date and time at `now` in `timeZone`.
function clinicClock(now, timeZone) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short',
  }).formatToParts(now).map(p => [p.type, p.value]));
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    day: parts.weekday.toLowerCase().slice(0, 3),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

const addDays = (isoDate, n) => {
  const d = new Date(isoDate + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

// Returns { open, text } e.g. { open: true, text: 'Open now · until 2 PM' }.
export function hoursStatus(site, now = new Date()) {
  const { date, day, minutes } = clinicClock(now, site.timeZone);
  const holidays = new Set(site.holidays || []);
  const today = holidays.has(date) ? [] : site.hours[day] || [];

  const current = today.find(([from, to]) => minutes >= toMin(from) && minutes < toMin(to));
  if (current) return { open: true, text: `Open now · until ${formatTime(current[1])}` };

  const later = today.find(([from]) => toMin(from) > minutes);
  if (later) return { open: false, text: `Closed · opens ${formatTime(later[0])}` };

  for (let i = 1; i <= 14; i++) {
    const d = addDays(date, i);
    const name = DAYS[new Date(d + 'T00:00:00Z').getUTCDay()];
    const first = holidays.has(d) ? null : (site.hours[name] || [])[0];
    if (first) return { open: false, text: `Closed · opens ${i === 1 ? 'tomorrow' : DAY_NAMES[name]} ${formatTime(first[0])}` };
  }
  return { open: false, text: 'Closed' };
}
