import { describe, expect, it } from "vitest"
import { canOptimizeImage, cn } from "./utils"

describe("canOptimizeImage", () => {
  it("optimizes local images", () => {
    expect(canOptimizeImage("/images/photo.jpg")).toBe(true)
  })

  it("skips local images with query strings (e.g. placeholder sizes)", () => {
    expect(canOptimizeImage("/placeholder.svg?height=400&width=600")).toBe(false)
  })

  it("optimizes Firebase Storage URLs", () => {
    expect(canOptimizeImage("https://firebasestorage.googleapis.com/v0/b/x/o/a.jpg")).toBe(true)
    expect(canOptimizeImage("https://miesieduocodes.firebasestorage.app/a.jpg")).toBe(true)
  })

  it("passes other hosts through unoptimized", () => {
    expect(canOptimizeImage("https://example.com/a.jpg")).toBe(false)
    expect(canOptimizeImage("https://lh3.googleusercontent.com/avatar")).toBe(false)
  })

  it("handles empty and malformed values", () => {
    expect(canOptimizeImage(undefined)).toBe(false)
    expect(canOptimizeImage("")).toBe(false)
    expect(canOptimizeImage("not a url")).toBe(false)
  })
})

describe("cn", () => {
  it("merges conflicting Tailwind classes, last one wins", () => {
    expect(cn("px-2 text-white", false && "hidden", "px-4")).toBe("text-white px-4")
  })
})
