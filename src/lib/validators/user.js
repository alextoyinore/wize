import { z } from 'zod'

const roleSchema = z.enum(['user', 'admin', 'super_admin'], {
  errorMap: () => ({ message: 'Invalid role value' })
})

const userSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format'),
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  role: roleSchema,
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .optional(),
  address: z.string()
    .max(200, 'Address must be less than 200 characters'),
  status: z.enum(['active', 'inactive', 'suspended'], {
    errorMap: () => ({ message: 'Invalid status value' })
  }).default('active'),
  avatar: z.string()
    .url('Invalid avatar URL')
    .optional(),
  metadata: z.record(z.any())
    .optional()
})

// For updates, make all fields optional except email and role
const updateUserSchema = userSchema.partial().omit({ password: true })

export function validateUser(userData, isUpdate = false) {
  try {
    const schema = isUpdate ? updateUserSchema : userSchema
    schema.parse(userData)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.errors[0]?.message || 'Invalid user data' }
  }
}
