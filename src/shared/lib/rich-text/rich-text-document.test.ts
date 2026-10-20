import { isSafeHref, richTextDocumentSchema } from './rich-text-document.ts';

describe('richTextDocumentSchema', () => {
  it('accepts an editor document', () => {
    const document = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Текст', marks: [{ type: 'bold' }] }] }],
    };

    expect(richTextDocumentSchema.parse(document)).toEqual(document);
  });

  it('rejects a value that is not a document', () => {
    expect(richTextDocumentSchema.safeParse({ type: 'paragraph' }).success).toBe(false);
    expect(richTextDocumentSchema.safeParse('<p>html</p>').success).toBe(false);
  });
});

describe('isSafeHref', () => {
  it('FR-MAIN-05: allows only web, mail, phone links and site paths', () => {
    expect(isSafeHref('https://egov.kz')).toBe(true);
    expect(isSafeHref('mailto:help@enbek.kz')).toBe(true);
    expect(isSafeHref('tel:1414')).toBe(true);
    expect(isSafeHref('/self-check')).toBe(true);
    expect(isSafeHref('javascript:alert(1)')).toBe(false);
    expect(isSafeHref('//evil.example')).toBe(false);
    expect(isSafeHref(42)).toBe(false);
  });
});
