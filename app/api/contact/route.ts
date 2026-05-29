import { NextResponse } from "next/server"
import { Resend } from "resend"

import type { ContactFormData } from "@/lib/contact"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_MESSAGE_LENGTH = 10

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

    const apiKey = process.env.RESEND_API_KEY
    const toEmail = process.env.CONTACT_TO_EMAIL
    const fromEmail = process.env.CONTACT_FROM_EMAIL

    if (!apiKey || !toEmail || !fromEmail) {
      return NextResponse.json(
        { success: false, error: "Contact form is not configured. Please try again later." },
        { status: 503 }
      )
    }

    const resend = new Resend(apiKey)

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: body.email,
      subject: `[Portfolio] ${body.subject}`,
      text: [
        `Name: ${body.name}`,
        `Email: ${body.email}`,
        `Subject: ${body.subject}`,
        "",
        body.message,
      ].join("\n"),
    })

    if (error) {
      console.error("Resend error:", error)
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
