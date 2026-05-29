import { NextResponse } from "next/server"
import { Resend } from "resend"

import type { ContactFormData } from "@/lib/contact"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_MESSAGE_LENGTH = 10
const DEFAULT_FROM_NAME = "Nazrawi Portfolio"

function trimEnv(value: string | undefined): string | undefined {
  return value?.trim().replace(/^["']|["']$/g, "")
}

function normalizeFromEmail(from: string): string {
  const trimmed = from.trim().replace(/^["']|["']$/g, "")

  if (trimmed.includes("<") && trimmed.includes(">")) {
    return trimmed
  }

  if (EMAIL_REGEX.test(trimmed)) {
    return `${DEFAULT_FROM_NAME} <${trimmed}>`
  }

  return trimmed
}

function validateContactForm(data: ContactFormData): string | null {
  if (!data.name?.trim()) return "Name is required."
  if (!data.email?.trim() || !EMAIL_REGEX.test(data.email)) {
    return "A valid email address is required."
  }
  if (!data.subject?.trim()) return "Subject is required."
  if (!data.message?.trim() || data.message.trim().length < MIN_MESSAGE_LENGTH) {
    return `Message must be at least ${MIN_MESSAGE_LENGTH} characters.`
  }
  return null
}

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json()
    const validationError = validateContactForm(body)

    if (validationError) {
      return NextResponse.json({ success: false, error: validationError }, { status: 400 })
    }

    const apiKey = trimEnv(process.env.RESEND_API_KEY)
    const toEmail = trimEnv(process.env.CONTACT_TO_EMAIL)
    const fromEmail = trimEnv(process.env.CONTACT_FROM_EMAIL)

    if (!apiKey || !toEmail || !fromEmail) {
      return NextResponse.json(
        { success: false, error: "Contact form is not configured. Please try again later." },
        { status: 503 }
      )
    }

    if (!EMAIL_REGEX.test(toEmail)) {
      console.error("Invalid CONTACT_TO_EMAIL:", toEmail)
      return NextResponse.json(
        { success: false, error: "Contact form is not configured. Please try again later." },
        { status: 503 }
      )
    }

    const resend = new Resend(apiKey)

    const { error } = await resend.emails.send({
      from: normalizeFromEmail(fromEmail),
      to: [toEmail],
      replyTo: body.email.trim(),
      subject: `[Portfolio] ${body.subject.trim()}`,
      text: [
        `Name: ${body.name.trim()}`,
        `Email: ${body.email.trim()}`,
        `Subject: ${body.subject.trim()}`,
        "",
        body.message.trim(),
      ].join("\n"),
    })

    if (error) {
      console.error("Resend error:", JSON.stringify(error))
      return NextResponse.json(
        { success: false, error: "Failed to send message. Please try again later." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
    })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again later." },
      { status: 500 }
    )
  }
}
