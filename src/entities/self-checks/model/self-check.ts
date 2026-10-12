import { z } from 'zod';

const selfCheckQuestionSchema = z.object({
  id: z.string(),
  label: z.string(),
  question: z.string(),
  hint: z.string(),
  why: z.string(),
  passTitle: z.string(),
  failTitle: z.string(),
  checkTitle: z.string(),
  advice: z.string(),
  link: z.object({ label: z.string(), href: z.string() }).optional(),
});

export const selfCheckTopicSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  questions: z.array(selfCheckQuestionSchema).min(1),
});

export type SelfCheckQuestion = z.infer<typeof selfCheckQuestionSchema>;
export type SelfCheckTopic = z.infer<typeof selfCheckTopicSchema>;
export type SelfCheckTopicSummary = Omit<SelfCheckTopic, 'questions'> & { questionCount: number };
