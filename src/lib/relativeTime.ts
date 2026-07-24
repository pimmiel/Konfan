/** Thai relative time — used by HistoryView and ResurfacingCard. */
export function relativeTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffDays === 0) return "วันนี้";
  if (diffDays === 1) return "เมื่อวาน";
  if (diffDays < 7) return `${diffDays} วันก่อน`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks} สัปดาห์ก่อน`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} เดือนก่อน`;
}

/** Simpler variant used by HistoryView (คืน-based labels). */
export function relativeNight(timestamp: number): string {
  const today = new Date();
  const entry = new Date(timestamp);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (entry.toDateString() === today.toDateString()) return "คืนนี้";
  if (entry.toDateString() === yesterday.toDateString()) return "เมื่อคืน";

  const diffDays = Math.floor((today.getTime() - entry.getTime()) / 86_400_000);
  return `${diffDays} คืนก่อน`;
}
