"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// Where I am right now, and home. Change `current` when travelling.
export const LOCATIONS = {
  current: { label: "Kazakhstan", city: "Almaty", timeZone: "Asia/Almaty", tag: "I'm here" },
  home: { label: "Nigeria", city: "Lagos", timeZone: "Africa/Lagos", tag: "Home" },
};

interface ClockPlace {
  label: string;
  city: string;
  timeZone: string;
  tag: string;
}

// Hours/minutes/seconds of `date` as seen in `timeZone`
function timeParts(date: Date, timeZone: string) {
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
function utcOffsetMinutes(date: Date, timeZone: string) {
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

function describeDiff(minutes: number) {
  if (minutes === 0) return "Same time as you";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const amount = m ? `${h}h ${m}m` : `${h}h`;
  return `${amount} ${minutes > 0 ? "ahead of" : "behind"} you`;
}

const pad = (n: number) => String(n).padStart(2, "0");

function Dial({ h, m, s }: { h: number; m: number; s: number }) {
  const hourDeg = (h % 12) * 30 + m * 0.5;
  const minuteDeg = m * 6 + s * 0.1;
  const secondDeg = s * 6;
  return (
    <svg viewBox="0 0 100 100" className="h-14 w-14 shrink-0" aria-hidden>
      <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1="50"
          y1="7"
          x2="50"
          y2={i % 3 === 0 ? "15" : "11"}
          stroke={i % 3 === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)"}
          strokeWidth={i % 3 === 0 ? 2.5 : 1.5}
          transform={`rotate(${i * 30} 50 50)`}
        />
      ))}
      <line x1="50" y1="50" x2="50" y2="28" stroke="white" strokeWidth="4" strokeLinecap="round" transform={`rotate(${hourDeg} 50 50)`} />
      <line x1="50" y1="50" x2="50" y2="17" stroke="white" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${minuteDeg} 50 50)`} />
      <line x1="50" y1="58" x2="50" y2="14" stroke="rgba(255,255,255,0.55)" strokeWidth="1" transform={`rotate(${secondDeg} 50 50)`} />
      <circle cx="50" cy="50" r="3" fill="white" />
    </svg>
  );
}

function ClockCard({ place, now, visitorOffset, highlight }: { place: ClockPlace; now: Date; visitorOffset: number; highlight?: boolean }) {
  const { h, m, s } = timeParts(now, place.timeZone);
  const diff = utcOffsetMinutes(now, place.timeZone) - visitorOffset;
  const awake = h >= 8 && h < 23;

  return (
    <div
      className={`flex items-center gap-4 rounded-2xl border px-5 py-4 backdrop-blur-xl transition-colors ${
        highlight ? "border-white/30 bg-white/[0.06]" : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <Dial h={h} m={m} s={s} />
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/40">
          {highlight && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
            </span>
          )}
          {place.tag}
        </div>
        <div className="truncate text-sm font-semibold text-white">
          {place.city}, {place.label}
        </div>
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span className="font-mono tabular-nums text-white/80">
            {pad(h)}:{pad(m)}:{pad(s)}
          </span>
          {awake ? <Sun className="h-3 w-3" aria-label="Daytime" /> : <Moon className="h-3 w-3" aria-label="Night-time" />}
        </div>
        {place.tag !== "You" && <div className="text-[11px] text-white/35">{describeDiff(diff)}</div>}
      </div>
    </div>
  );
}

export function WorldClock() {
  const [now, setNow] = useState<Date | null>(null);
  const [visitorZone, setVisitorZone] = useState<string>("UTC");

  useEffect(() => {
    setVisitorZone(Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Render an empty frame on the server so the layout doesn't jump
  if (!now) return <div className="min-h-[96px]" aria-hidden />;

  const visitorOffset = utcOffsetMinutes(now, visitorZone);
  // Skip the "You" card when the visitor already shares a time with one of the places
  const sameAs = (tz: string) => utcOffsetMinutes(now, tz) === visitorOffset;
  const visitorCity = visitorZone.split("/").pop()?.replace(/_/g, " ") || "Your city";

  const places: { place: ClockPlace; highlight?: boolean }[] = [
    { place: LOCATIONS.current, highlight: true },
    { place: LOCATIONS.home },
  ];
  if (!sameAs(LOCATIONS.current.timeZone) && !sameAs(LOCATIONS.home.timeZone)) {
    places.push({ place: { label: "Local time", city: visitorCity, timeZone: visitorZone, tag: "You" } });
  }

  return (
    <div>
      <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-white/40">World clock</p>
      <div className={`grid gap-3 sm:grid-cols-2 ${places.length === 3 ? "lg:grid-cols-3" : ""}`}>
        {places.map(({ place, highlight }) => (
          <ClockCard key={place.timeZone + place.tag} place={place} now={now} visitorOffset={visitorOffset} highlight={highlight} />
        ))}
      </div>
    </div>
  );
}

// Compact "HH:MM" for one place, used in the footer's bottom bar
export function PlaceTime({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return <span className="tabular-nums">--:--</span>;
  const { h, m } = timeParts(now, timeZone);
  return (
    <span className="tabular-nums">
      {pad(h)}:{pad(m)}
    </span>
  );
}
