export const removeSpecialCharacters = (str: string) => {
  return str.replace(/[^a-zA-Z ]/g, '');
};
