import { describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen } from "@testing-library/react"
import { ProjectList, ProjectPanel, toProject } from "./projects"

const projects = [
  toProject("a", { title: "Atlas", tags: "Next.js, Three.js", link: "https://atlas.example.com" }, "web"),
  toProject("b", { title: "Bramble", tags: ["Unity"] }, "games"),
]

describe("ProjectList", () => {
  it("renders a numbered row per project with its tags", () => {
    render(<ProjectList projects={projects} onSelect={() => {}} />)
    expect(screen.getByText("Atlas")).toBeInTheDocument()
    expect(screen.getByText("Next.js · Three.js")).toBeInTheDocument()
    expect(screen.getByText("01")).toBeInTheDocument()
    expect(screen.getByText("02")).toBeInTheDocument()
  })

  it("selects a project when its row is clicked", () => {
    const onSelect = vi.fn()
    render(<ProjectList projects={projects} onSelect={onSelect} />)
    fireEvent.click(screen.getByText("Bramble"))
    expect(onSelect).toHaveBeenCalledWith(projects[1])
  })
})

describe("ProjectPanel", () => {
  it("shows the project and a live link, and closes on Escape", () => {
    const onClose = vi.fn()
    render(<ProjectPanel project={projects[0]} onClose={onClose} />)
    expect(screen.getByRole("dialog", { name: "Atlas" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /visit live site/i })).toHaveAttribute("href", "https://atlas.example.com")

    fireEvent.keyDown(window, { key: "Escape" })
    expect(onClose).toHaveBeenCalled()
  })

  it("locks page scrolling while open", () => {
    const { unmount } = render(<ProjectPanel project={projects[1]} onClose={() => {}} />)
    expect(document.documentElement).toHaveClass("menu-open")
    unmount()
    expect(document.documentElement).not.toHaveClass("menu-open")
  })

  it("omits the live link when a project has none", () => {
    render(<ProjectPanel project={projects[1]} onClose={() => {}} />)
    expect(screen.queryByRole("link", { name: /visit live site|play/i })).not.toBeInTheDocument()
  })
})
