import { z } from 'zod';

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === '' ? undefined : value))
  .optional();

export const feedbackRequestSchema = z.object({
  name: optionalText,
  region: optionalText,
  iin: optionalText.pipe(
    z
      .string()
      .regex(/^\d{12}$/u)
      .optional(),
  ),
  email: optionalText.pipe(z.email().optional()),
  phone: z.string().trim().min(1),
  subject: optionalText,
  message: optionalText,
});

export type FeedbackRequest = z.infer<typeof feedbackRequestSchema>;
