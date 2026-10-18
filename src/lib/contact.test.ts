import { describe, expect, it } from "vitest"
import { contactSchema, emailSubject, escapeHtml, fieldErrors } from "./contact"

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "New website",
  message: "I'd like to build a portfolio site.",
}

describe("contactSchema", () => {
  it("accepts a complete message and trims whitespace", () => {
    const result = contactSchema.safeParse({ ...valid, name: "  Ada  " })
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.name).toBe("Ada")
  })

  it("rejects whitespace-only values", () => {
    const result = contactSchema.safeParse({ ...valid, name: "   " })
    expect(result.success).toBe(false)
  })

  it("reports one message per invalid field", () => {
    const result = contactSchema.safeParse({ name: "A", email: "nope", subject: "Hi", message: "short" })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(fieldErrors(result.error)).toEqual({
        name: "Name must be at least 2 characters",
        email: "Please enter a valid email address",
        subject: "Subject must be at least 5 characters",
        message: "Message must be at least 10 characters",
      })
    }
  })
})

describe("escapeHtml", () => {
  it("neutralizes markup in user input", () => {
    expect(escapeHtml(`<script>alert("x")</script>`)).toBe("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;")
  })

  it("escapes ampersands first so entities aren't double-decoded", () => {
    expect(escapeHtml("Tom & Jerry's <b>")).toBe("Tom &amp; Jerry&#39;s &lt;b&gt;")
  })
})

describe("emailSubject", () => {
  it("strips newlines so the subject can't inject headers", () => {
    expect(emailSubject("Hello\r\nBcc: victim@example.com")).toBe("New Contact: Hello Bcc: victim@example.com")
  })
})
