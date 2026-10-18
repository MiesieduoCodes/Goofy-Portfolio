import { z } from "zod"

// Contact form rules, shared by the form (instant feedback) and /api/contact (enforcement)
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  subject: z.string().trim().min(5, "Subject must be at least 5 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
})

export type ContactInput = z.infer<typeof contactSchema>
export type ContactField = keyof ContactInput

// Field -> first error message, for showing under each input
export function fieldErrors(error: z.ZodError): Partial<Record<ContactField, string>> {
  const out: Partial<Record<ContactField, string>> = {}
  for (const issue of error.issues) {
    const field = issue.path[0] as ContactField
    if (field && !out[field]) out[field] = issue.message
  }
  return out
}

// Escape user input before it goes into the email HTML
export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

// Email subject line; newlines are stripped so they can't inject extra headers
export const emailSubject = (subject: string) => `New Contact: ${subject.replace(/[\r\n]+/g, " ")}`
