import sanitizeHtml from 'sanitize-html';

const RICH_TEXT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p',
    'br',
    'h2',
    'h3',
    'h4',
    'strong',
    'b',
    'em',
    'i',
    'u',
    's',
    'ul',
    'ol',
    'li',
    'a',
    'blockquote',
    'hr',
    'figure',
    'figcaption',
    'img',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
    th: ['colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
  },
  allowedSchemes: ['https', 'http', 'mailto', 'tel'],
  allowedSchemesByTag: { img: ['https', 'http'] },
  allowProtocolRelative: false,
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: /^https?:/iu.test(attribs['href'] ?? '')
        ? { ...attribs, target: '_blank', rel: 'noopener noreferrer' }
        : attribs,
    }),
  },
};

export const sanitizeRichText = (html: string): string => sanitizeHtml(html, RICH_TEXT_OPTIONS).trim();
