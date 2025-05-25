import nodemailer from 'nodemailer'
import { config } from 'dotenv'

// Load environment variables
config()

// Create a transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

// Templates
const templates = {
  'role-change': ({ oldRole, newRole, changedBy, timestamp }) => `
    <h2>Role Change Notification</h2>
    <p>Your role has been changed from <strong>${oldRole}</strong> to <strong>${newRole}</strong></p>
    <p>Changed by: ${changedBy}</p>
    <p>Timestamp: ${new Date(timestamp).toLocaleString()}</p>
  `,
  'system-alert': ({ message, severity }) => `
    <h2>System Alert - ${severity.toUpperCase()}</h2>
    <p>${message}</p>
    <p>Timestamp: ${new Date().toLocaleString()}</p>
  `,
  'security-alert': ({ message, severity }) => `
    <h2>Security Alert - ${severity.toUpperCase()}</h2>
    <p>${message}</p>
    <p>Timestamp: ${new Date().toLocaleString()}</p>
  `
}

export async function sendEmail({ to, subject, template, data }) {
  try {
    // Validate required fields
    if (!to || !subject || !template || !templates[template]) {
      throw new Error('Invalid email parameters')
    }

    // Render template
    const html = templates[template](data)

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    })

    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

// Test email configuration
export async function testEmail() {
  try {
    // Verify connection
    await transporter.verify()
    return true
  } catch (error) {
    console.error('Email configuration error:', error)
    return false
  }
}
