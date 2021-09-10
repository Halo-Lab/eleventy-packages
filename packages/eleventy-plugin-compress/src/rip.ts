/**
 * Extract information from text based on pattern.
 * Pattern must have only one capturing group, that
 * describes needed information.
 */
export const rip = (text: string, pattern: RegExp) => {
  const links = [];

  let match = null;
  while ((match = pattern.exec(text)) !== null) {
    links.push(match[1]);
  }

  return links;
};
