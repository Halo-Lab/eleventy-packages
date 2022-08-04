/**
 * Extract information from text based on pattern.
 * Pattern must have only one capturing group, that
 * describes needed information. Also, pattern should
 * have global flag.
 * It can accept optional predicate that can decide
 * if found information should be captured.
 */
export const rip = (
  text: string,
  pattern: RegExp,
  predicate: (value: string) => boolean = () => true,
): ReadonlyArray<string> => {
  const links = [];

  let match = null;
  while ((match = pattern.exec(text)) !== null) {
    if (predicate(match[1])) {
      links.push(match[1]);
    }
  }

  return links;
};
