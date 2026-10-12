export const matchesQuery = (query: string | undefined, ...fields: readonly string[]): boolean => {
  const normalized = query?.trim().toLocaleLowerCase();
  if (normalized === undefined || normalized === '') return true;
  return fields.some((field) => field.toLocaleLowerCase().includes(normalized));
};
