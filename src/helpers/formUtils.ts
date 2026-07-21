export const joinDescribedBy = (...ids: (string | undefined | null | false)[]): string | undefined => {
  const joined = ids.filter(Boolean).join(' ');
  return joined || undefined;
};

/** Builds an input change handler that updates a field and clears its validation/server error. */
export const makeFieldChangeHandler = (setValue: (v: string) => void, clearFieldError: () => void, clearServerError?: () => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
  clearFieldError();
  clearServerError?.();
};
