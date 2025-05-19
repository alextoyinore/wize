import { z } from 'zod'

const smtpConfigSchema = z.object({
  host: z.string().min(1, 'SMTP host is required'),
  port: z.string().min(1, 'SMTP port is required'),
  user: z.string().min(1, 'SMTP user is required'),
  password: z.string().min(1, 'SMTP password is required')
})

const cloudinarySchema = z.object({
  cloudName: z.string().min(1, 'Cloudinary cloud name is required'),
  apiKey: z.string().min(1, 'Cloudinary API key is required'),
  apiSecret: z.string().min(1, 'Cloudinary API secret is required')
})

export const settingsSchema = z.object({
  siteTitle: z.string().min(1, 'Site title is required'),
  siteDescription: z.string().min(1, 'Site description is required'),
  theme: z.enum(['light', 'dark', 'system'], {
    errorMap: () => ({ message: 'Invalid theme value' })
  }),
  maintenanceMode: z.boolean(),
  emailNotifications: z.boolean(),
  smtpConfig: smtpConfigSchema,
  storageProvider: z.enum(['cloudinary', 's3', 'local'], {
    errorMap: () => ({ message: 'Invalid storage provider' })
  }),
  cloudinary: cloudinarySchema
})

export function validateSettings(settings) {
  try {
    settingsSchema.parse(settings)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.errors[0]?.message || 'Invalid settings' }
  }
}
