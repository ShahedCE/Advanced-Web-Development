// lib/validation/login.schema.ts
import { z } from 'zod';

// Zod validation schema for login form
export const loginSchema = z.object({
  phone: z
    .string()
    .min(10, 'Mobile number must be at least 10 digits')
    .max(14, 'Mobile number must be at most 15 digits')
    .regex(
      /^\+?\d+$/,
      'Invalid mobile number format, must contain only digits and optional +'
    ),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(50, 'Password must be at most 50 characters'),
});

// TypeScript type for form data
export type LoginFormData = z.infer<typeof loginSchema>;
