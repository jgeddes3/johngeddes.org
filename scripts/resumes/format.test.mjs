import { test } from 'node:test';
import assert from 'node:assert/strict';
import { monthYear, dateRange, shortYears } from '../../src/resumes/format.js';

test('monthYear formats a year-month and treats null as Present', () => {
  assert.equal(monthYear('2025-09'), 'Sep 2025');
  assert.equal(monthYear('2021-01'), 'Jan 2021');
  assert.equal(monthYear(null), 'Present');
});

test('dateRange joins with "to", never a dash', () => {
  assert.equal(dateRange('2025-09', null), 'Sep 2025 to Present');
  assert.equal(dateRange('2024-10', '2025-02'), 'Oct 2024 to Feb 2025');
});

test('shortYears gives the About timeline style', () => {
  assert.equal(shortYears('2024-03', '2024-06'), '24');
  assert.equal(shortYears('2021-01', '2023-05'), '21-23');
  assert.equal(shortYears('2025-09', null), '25~');
});
