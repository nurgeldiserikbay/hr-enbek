import { z } from 'zod';

export const legalDocumentGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string(),
  documents: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      url: z.url(),
      pdfUrl: z.string(),
    }),
  ),
});

export type LegalDocumentGroup = z.infer<typeof legalDocumentGroupSchema>;
