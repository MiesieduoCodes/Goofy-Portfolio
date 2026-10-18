import { describe, expect, it } from "vitest"
import { byNewest, normalizeTags, toProject, websiteCategory, yearOf } from "./project-utils"

describe("normalizeTags", () => {
  it("keeps arrays, dropping empty entries", () => {
    expect(normalizeTags(["React", "", "Next.js"])).toEqual(["React", "Next.js"])
  })

  it("splits comma-separated strings saved by the admin", () => {
    expect(normalizeTags("React,  Next.js , ,TypeScript")).toEqual(["React", "Next.js", "TypeScript"])
  })

  it("returns an empty list for missing or unexpected values", () => {
    expect(normalizeTags(undefined)).toEqual([])
    expect(normalizeTags(null)).toEqual([])
    expect(normalizeTags(42)).toEqual([])
  })
})

describe("websiteCategory", () => {
  it("treats documents marked mobile as mobile apps", () => {
    expect(websiteCategory({ category: "mobile" })).toBe("mobile")
  })

  it("defaults everything else to web", () => {
    expect(websiteCategory({ category: "web" })).toBe("web")
    expect(websiteCategory({})).toBe("web")
    expect(websiteCategory(undefined)).toBe("web")
  })
})

describe("toProject", () => {
  it("fills in a title, normalizes tags and applies the category", () => {
    const project = toProject("abc", { tags: "Unity, C#", image: "/a.jpg" }, "games")
    expect(project).toMatchObject({ id: "abc", title: "Untitled", tags: ["Unity", "C#"], category: "games", image: "/a.jpg" })
  })

  it("does not let stored fields override id or category", () => {
    const project = toProject("real-id", { id: "stale", category: "web", title: "App" }, "mobile")
    expect(project.id).toBe("real-id")
    expect(project.category).toBe("mobile")
  })
})

describe("byNewest / yearOf", () => {
  it("sorts newest first and puts undated items last", () => {
    const items = [
      toProject("old", { createdAt: 1 }, "web"),
      toProject("none", {}, "web"),
      toProject("new", { createdAt: 3 }, "web"),
    ]
    expect(items.sort(byNewest).map((p) => p.id)).toEqual(["new", "old", "none"])
  })

  it("reads the year from createdAt", () => {
    expect(yearOf(toProject("a", { createdAt: Date.UTC(2024, 5, 1) }, "web"))).toBe(2024)
    expect(yearOf(toProject("b", {}, "web"))).toBeNull()
  })
})
