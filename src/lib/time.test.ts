import { describe, expect, it } from "vitest"
import { describeDiff, pad, timeParts, utcOffsetMinutes } from "./time"

// 15 Jan 2026, 12:34:56 UTC (winter in the northern hemisphere)
const WINTER = new Date(Date.UTC(2026, 0, 15, 12, 34, 56))
// 15 Jul 2026, 12:00:30 UTC (northern summer: daylight saving in New York)
const SUMMER = new Date(Date.UTC(2026, 6, 15, 12, 0, 30))

describe("utcOffsetMinutes", () => {
  it("returns whole-hour offsets for the clock's locations", () => {
    expect(utcOffsetMinutes(WINTER, "Asia/Almaty")).toBe(5 * 60)
    expect(utcOffsetMinutes(WINTER, "Africa/Lagos")).toBe(60)
    expect(utcOffsetMinutes(WINTER, "UTC")).toBe(0)
  })

  it("handles half-hour zones", () => {
    expect(utcOffsetMinutes(WINTER, "Asia/Kolkata")).toBe(5 * 60 + 30)
  })

  it("follows daylight saving time", () => {
    expect(utcOffsetMinutes(WINTER, "America/New_York")).toBe(-5 * 60)
    expect(utcOffsetMinutes(SUMMER, "America/New_York")).toBe(-4 * 60)
  })

  it("isn't thrown off by seconds", () => {
    // Regression: seconds used to make the offset come out a minute short
    expect(utcOffsetMinutes(SUMMER, "Africa/Lagos")).toBe(60)
  })
})

describe("timeParts", () => {
  it("gives the local wall-clock time in a zone", () => {
    expect(timeParts(WINTER, "Asia/Almaty")).toEqual({ h: 17, m: 34, s: 56 })
    expect(timeParts(WINTER, "Africa/Lagos")).toEqual({ h: 13, m: 34, s: 56 })
  })

  it("uses a 24-hour clock across midnight", () => {
    const lateUtc = new Date(Date.UTC(2026, 0, 15, 22, 5, 0))
    expect(timeParts(lateUtc, "Asia/Almaty")).toEqual({ h: 3, m: 5, s: 0 })
  })
})

describe("describeDiff", () => {
  it("describes places ahead of and behind the visitor", () => {
    expect(describeDiff(240)).toBe("4h ahead of you")
    expect(describeDiff(-60)).toBe("1h behind you")
    expect(describeDiff(330)).toBe("5h 30m ahead of you")
  })

  it("says when there's no difference", () => {
    expect(describeDiff(0)).toBe("Same time as you")
  })
})

describe("pad", () => {
  it("zero-pads to two digits", () => {
    expect(pad(7)).toBe("07")
    expect(pad(12)).toBe("12")
  })
})
