export const parseStringToNumber = (input: string | number): number | boolean => {
  const parsed = Number(input);
  if (isNaN(parsed)) return false;
  return parsed;
};
