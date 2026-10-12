import { z } from 'zod';

import { type LabourInspection, labourInspectionSchema } from '../model/labour-inspection.ts';
import { LABOUR_INSPECTIONS_MOCK } from './labour-inspections.mock.ts';

export function getLabourInspections(): Promise<LabourInspection[]> {
  return Promise.resolve(z.array(labourInspectionSchema).parse(LABOUR_INSPECTIONS_MOCK));
}
