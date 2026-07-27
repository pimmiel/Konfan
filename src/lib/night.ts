// A "night" runs until 05:00 the following morning so that
// someone who writes at 01:00 is still in the same night as 23:00.
export const NIGHT_CUTOFF_HOUR = 5;

/** Stable string key for the night that contains the given timestamp. */
export function nightKey(ts: number): string {
  const shifted = new Date(ts - NIGHT_CUTOFF_HOUR * 3_600_000);
  return `${shifted.getFullYear()}-${shifted.getMonth() + 1}-${shifted.getDate()}`;
}

export function tonightKey(): string {
  return nightKey(Date.now());
}
