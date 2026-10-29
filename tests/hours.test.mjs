import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { hoursStatus, formatTime } from '../assets/js/hours.js';

const site = JSON.parse(readFileSync(new URL('../assets/data/site.json', import.meta.url)));
// IST is UTC+5:30, so build instants from IST wall-clock times.
const ist = s => new Date(s + '+05:30');

test('open during the morning session', () => {
  assert.deepEqual(hoursStatus(site, ist('2026-10-29T11:15:00')), { open: true, text: 'Open now · until 2 PM' });
});

test('closed at lunch, reopens in the evening', () => {
  assert.equal(hoursStatus(site, ist('2026-10-29T14:00:00')).text, 'Closed · opens 5 PM');
});

test('closed late at night, opens tomorrow', () => {
  assert.equal(hoursStatus(site, ist('2026-10-29T22:00:00')).text, 'Closed · opens tomorrow 10 AM');
});

test('Sunday afternoon: closed, opens Monday morning', () => {
  assert.equal(hoursStatus(site, ist('2026-11-01T13:00:00')).text, 'Closed · opens tomorrow 10 AM');
});

test('uses clinic time, not the visitor time zone', () => {
  // 05:00 UTC = 10:30 IST.
  assert.equal(hoursStatus(site, new Date('2026-10-29T05:00:00Z')).open, true);
});

test('holiday closes the whole day and is skipped when looking ahead', () => {
  const s = { ...site, holidays: ['2026-10-29', '2026-10-30'] };
  assert.equal(hoursStatus(s, ist('2026-10-29T11:00:00')).text, 'Closed · opens Sat 10 AM');
});

test('formatTime', () => {
  assert.equal(formatTime('20:30'), '8:30 PM');
  assert.equal(formatTime('00:05'), '12:05 AM');
  assert.equal(formatTime('12:00'), '12 PM');
});
