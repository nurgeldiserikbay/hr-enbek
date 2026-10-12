export const AUDIENCES = ['employer', 'employee'] as const;

export type Audience = (typeof AUDIENCES)[number];

export const parseAudience = (value: unknown): Audience | undefined => AUDIENCES.find((audience) => audience === value);
