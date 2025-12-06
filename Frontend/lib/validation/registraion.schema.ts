import { z } from 'zod';

export const registrationSchema = z
  .object({
    // full_name: z
    //   .string()
    //   .optional()
    //   .max(100, 'Full name must be at most 100 characters'), // optional and limited length

    email: z.string().email('Invalid email address').optional(), // optional but must be valid if provided

    phone: z
      .string()
      .regex(
        /^01[3-9]\d{8}$/,
        'Phone number must be a valid Bangladeshi number'
      ), // bd mobile format

    password: z.string().min(6, 'Password must be at least 6 characters long'), // required, min 6

    confirmPassword: z.string(), // frontend only
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // error will show under confirmPassword
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;
