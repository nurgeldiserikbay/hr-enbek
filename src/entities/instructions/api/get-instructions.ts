import { z } from 'zod';

import { requestCms, toCmsAudience } from '@/shared/api';
import type { Audience, Locale } from '@/shared/config';

import type { Instruction } from '../model/instruction.ts';
import { instructionSchema } from './instruction-schema.ts';

interface InstructionFilter {
  locale: Locale;
  query?: string | undefined;
  audience?: Audience | undefined;
}

export async function getInstructions({ locale, query, audience }: InstructionFilter): Promise<Instruction[]> {
  return z.array(instructionSchema).parse(
    await requestCms({
      path: '/api/v1/public/instructions',
      locale,
      sections: ['instructions'],
      query: { audience: toCmsAudience(audience), q: query },
    }),
  );
}
