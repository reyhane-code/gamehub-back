export const toSlug = (str: string) => {
  return str.toLowerCase().replace(/\s+/g, '-');
};
