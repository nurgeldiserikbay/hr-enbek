import type { ContentLanguage } from '@/shared/api';

export interface ServiceFlowStep {
  icon: string | undefined;
  title: string;
  text: string | undefined;
}

export interface ServiceAction {
  label: string;
  href: string;
}

export interface Service {
  id: string;
  icon: string | undefined;
  title: string;
  subtitle: string | undefined;
  description: string | undefined;
  features: readonly string[];
  flow: readonly ServiceFlowStep[];
  action: ServiceAction | undefined;
  language: ContentLanguage;
}
