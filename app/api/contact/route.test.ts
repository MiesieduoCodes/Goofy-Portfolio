// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"
import { POST } from "./route"

// Capture what would be sent instead of calling Resend (vi.mock is hoisted above the imports)
const { send } = vi.hoisted(() => ({ send: vi.fn() }))
vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(() => ({ emails: { send } })),
}))

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "New website",
  message: "I'd like to build a portfolio site.",
}

const post = (body: unknown) =>
  POST(
    new NextRequest("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    })
  )

let consoleError: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  vi.stubEnv("RESEND_API_KEY", "re_test_key")
  send.mockReset().mockResolvedValue({ data: { id: "email_1" }, error: null })
  // The route logs failures; keep test output quiet
  consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllEnvs()
  consoleError.mockRestore()
})

describe("POST /api/contact", () => {
  it("sends the email and reports success", async () => {
    const res = await post(valid)
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ success: true })
    expect(send).toHaveBeenCalledTimes(1)
    expect(send.mock.calls[0][0]).toMatchObject({
      to: ["miesieduoveria@gmail.com"],
      replyTo: "ada@example.com",
      subject: "New Contact: New website",
    })
  })

  it("escapes HTML in the email body", async () => {
    await post({ ...valid, message: `<img src=x onerror="alert(1)"> hello there` })
    const html: string = send.mock.calls[0][0].html
    expect(html).not.toContain("<img src=x")
    expect(html).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;")
  })

  it("strips newlines from the subject", async () => {
    await post({ ...valid, subject: "Hello\r\nBcc: someone@example.com" })
    expect(send.mock.calls[0][0].subject).toBe("New Contact: Hello Bcc: someone@example.com")
  })

  it("returns field errors for invalid input without sending", async () => {
    const res = await post({ name: "A", email: "nope", subject: "Hi", message: "short" })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(body.errors.map((e: { field: string }) => e.field).sort()).toEqual(["email", "message", "name", "subject"])
    expect(send).not.toHaveBeenCalled()
  })

  it("rejects a body that isn't JSON", async () => {
    const res = await post("not json")
    expect(res.status).toBe(400)
    expect(send).not.toHaveBeenCalled()
  })

  it("fails safely when the API key is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "")
    const res = await post(valid)
    expect(res.status).toBe(500)
    expect(send).not.toHaveBeenCalled()
  })

  it("reports a failure when Resend returns an error", async () => {
    send.mockResolvedValue({ data: null, error: { name: "validation_error", message: "bad", statusCode: 422 } })
    const res = await post(valid)
    expect(res.status).toBe(500)
    expect(await res.json()).toMatchObject({ success: false })
  })
})
