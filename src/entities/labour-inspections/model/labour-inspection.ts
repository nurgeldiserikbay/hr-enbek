import type { Locale } from '@/shared/config';

export interface InspectionDepartment {
  organization: string | undefined;
  address: string | undefined;
  phone: string | undefined;
  email: string | undefined;
  inspectors: readonly string[];
  director: string | undefined;
  lang: Locale;
}

export interface LabourInspection {
  regionId: string;
  regionName: string;
  regionLang: Locale;
  department: InspectionDepartment | undefined;
}
