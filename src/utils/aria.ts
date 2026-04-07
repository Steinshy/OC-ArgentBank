export const joinDescribedBy = (...ids: (string | undefined | null | false)[]): string | undefined => {
  const joined = ids.filter(Boolean).join(' ');
  return joined || undefined;
};
