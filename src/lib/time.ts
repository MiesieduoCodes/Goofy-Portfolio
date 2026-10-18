// Time-zone helpers for the world clock, built on Intl so they need no date library.

// Hours/minutes/seconds of `date` as seen in `timeZone`
export function timeParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { h: get("hour"), m: get("minute"), s: get("second") };
}

// Minutes `timeZone` is ahead of UTC at `date`
export function utcOffsetMinutes(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  // Compare against the same instant truncated to the minute, since the parts above drop seconds
  const wholeMinute = date.getTime() - (date.getTime() % 60000);
  return Math.round((asUtc - wholeMinute) / 60000);
}

export function describeDiff(minutes: number) {
  if (minutes === 0) return "Same time as you";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const amount = m ? `${h}h ${m}m` : `${h}h`;
  return `${amount} ${minutes > 0 ? "ahead of" : "behind"} you`;
}

export const pad = (n: number) => String(n).padStart(2, "0");
