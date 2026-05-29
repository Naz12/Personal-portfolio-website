export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface ContactFormResponse {
  success: boolean
  message?: string
  error?: string
}

export async function submitContactForm(
  data: ContactFormData
): Promise<ContactFormResponse> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  const result: ContactFormResponse = await response.json()

  if (!response.ok) {
    throw new Error(result.error ?? "Failed to send message. Please try again.")
  }

  return result
}
