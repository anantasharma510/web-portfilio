import { NextResponse, type NextRequest } from "next/server"
import nodemailer from "nodemailer"
import { z } from "zod"
import dns from "dns"
import { promisify } from "util"
import clientPromise from "@/lib/mongodb"
import { createContactMessage } from "@/lib/models/contactus"

// Convert DNS lookup to promise-based function
const resolveMx = promisify(dns.resolveMx)

// Schema for contact form validation
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

// Function to check if email domain has valid MX records
async function isEmailValid(email: string): Promise<boolean> {
  try {
    const domain = email.split("@")[1]
    if (!domain) return false

    // Check if domain has MX records
    const mxRecords = await resolveMx(domain)
    return mxRecords.length > 0
  } catch (error) {
    console.error("Error validating email domain:", error)
    return false
  }
}

// Function to send auto-reply email
async function sendAutoReply(to: string, name: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: process.env.EMAIL_SERVER_PORT === "465",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: `"Ananta Sharma" <${process.env.EMAIL_FROM}>`,
      to,
      subject: "Thank you for contacting me",
      text: `Hello ${name},\n\nThank you for reaching out to me. I have received your message and will get back to you as soon as possible.\n\nBest regards,\nAnanta Sharma`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #DC2626;">Thank you for contacting me</h2>
          <p>Hello ${name},</p>
          <p>Thank you for reaching out to me. I have received your message and will get back to you as soon as I'm available.</p>
          <p>I typically respond within 24-48 hours during weekdays.</p>
          <p>Best regards,<br>Ananta Sharma</p>
        </div>
      `,
    })

    return true
  } catch (error) {
    console.error("Error sending auto-reply:", error)
    return false
  }
}

// Function to send notification email to yourself
async function sendNotificationToSelf(name: string, email: string, message: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: process.env.EMAIL_SERVER_PORT === "465",
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: `"Contact Form" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #DC2626;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, "<br>")}
          </div>
        </div>
      `,
    })

    return true
  } catch (error) {
    console.error("Error sending notification email:", error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate form data
    const result = contactFormSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid form data", details: result.error.format() },
        { status: 400 },
      )
    }

    const { name, email, message } = result.data

    // Check if email domain is valid
    const isValidEmail = await isEmailValid(email)

    if (!isValidEmail) {
      return NextResponse.json(
        { success: false, error: "Invalid email domain. Please provide a valid email address." },
        { status: 400 },
      )
    }

    // Store message in database
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_DB)

    await createContactMessage(db, {
      name,
      email,
      message,
    })

    // Send auto-reply to the user
    const autoReplySuccess = await sendAutoReply(email, name)

    // Send notification to yourself
    const notificationSuccess = await sendNotificationToSelf(name, email, message)

    if (!autoReplySuccess && !notificationSuccess) {
      return NextResponse.json(
        { success: false, error: "Failed to send emails. Please try again later." },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Message received successfully. Thank you for reaching out!",
      autoReply: autoReplySuccess ? "sent" : "failed",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred. Please try again later." },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
