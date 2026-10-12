import { z } from 'zod';

import type { Audience } from '@/shared/config';
import { matchesQuery } from '@/shared/lib/search';

import { type Instruction, instructionSchema } from '../model/instruction.ts';
import { INSTRUCTIONS_MOCK } from './instructions.mock.ts';

interface InstructionFilter {
  query?: string | undefined;
  audience?: Audience | undefined;
}

export function getInstructions({ query, audience }: InstructionFilter = {}): Promise<Instruction[]> {
  return Promise.resolve(
    z
      .array(instructionSchema)
      .parse(INSTRUCTIONS_MOCK)
      .filter((item) => audience === undefined || item.audience === audience)
      .filter(({ title, description }) => matchesQuery(query, title, description)),
  );
}
