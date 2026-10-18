import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import Contact from "./page"

const fill = (label: RegExp, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } })

const fillValid = () => {
  fill(/your name/i, "Ada Lovelace")
  fill(/^email$/i, "ada@example.com")
  fill(/subject/i, "New website")
  fill(/tell me about your project/i, "I'd like to build a portfolio site.")
}

const submit = () => fireEvent.click(screen.getByRole("button", { name: /send message/i }))

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  fetchMock = vi.fn()
  vi.stubGlobal("fetch", fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("Contact form", () => {
  it("shows field errors and doesn't send when the form is incomplete", async () => {
    render(<Contact />)
    submit()
    expect(await screen.findByText("Name must be at least 2 characters")).toBeInTheDocument()
    expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument()
    expect(screen.getByLabelText(/your name/i)).toHaveAttribute("aria-invalid", "true")
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("posts to /api/contact with the topic in the subject, then confirms", async () => {
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ success: true }) })
    render(<Contact />)
    fireEvent.click(screen.getByRole("button", { name: "Website" }))
    fillValid()
    submit()

    expect(await screen.findByRole("heading", { name: /message sent/i })).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith("/api/contact", expect.objectContaining({ method: "POST" }))
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(sent).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      subject: "[Website] New website",
      message: "I'd like to build a portfolio site.",
    })
  })

  it("shows the server's message and field errors when sending fails", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        success: false,
        message: "Please check your form inputs",
        errors: [{ field: "email", message: "Please enter a valid email address" }],
      }),
    })
    render(<Contact />)
    fillValid()
    submit()

    expect(await screen.findByRole("alert")).toHaveTextContent("Please check your form inputs")
    expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument()
  })

  it("falls back to the email address if the request can't be made", async () => {
    fetchMock.mockRejectedValue(new Error("offline"))
    render(<Contact />)
    fillValid()
    submit()
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("miesieduoveria@gmail.com"))
  })
})
