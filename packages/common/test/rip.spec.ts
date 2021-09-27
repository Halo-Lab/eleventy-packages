import { rip, isRemoteLink } from '../src';

describe('rip', () => {
  const text = `Lorem Ipsum of "httype" and is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of "type" and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s of "httype" and with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

  it('should extract word from the text', () => {
    const words = rip(text, /of\s+"([^"]+)"\s+and/g);

    expect(words.length).toBe(3);
  });

  it('should filter matched strings by predicate', () => {
    const words = rip(
      text,
      /of\s+"([^"]+)"\s+and/g,
      (value) => !/^htt/.test(value),
    );

    expect(words.length).toBe(1);
    expect(words).toEqual(['type']);
  });
});

describe('isRemoteLink', () => {
  it('should return true if link has http protocol', () => {
    const link = 'http://google.com';

    expect(isRemoteLink(link)).toBe(true);
  });

  it('should return true if link has https protocol', () => {
    const link = 'https://google.com';

    expect(isRemoteLink(link)).toBe(true);
  });

  it('should return false if link is not an external link', () => {
    const link = '/about';

    expect(isRemoteLink(link)).toBe(false);
  });
});
