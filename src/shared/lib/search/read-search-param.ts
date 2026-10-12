export const readSearchParam = (value: string | string[] | undefined): string | undefined =>
  typeof value === 'string' && value !== '' ? value : undefined;
