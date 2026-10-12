import { sanitizeRichText } from './sanitize-rich-text.ts';

describe('sanitizeRichText', () => {
  it('keeps the formatting an editor produces', () => {
    const html =
      '<h2>Что проверить</h2><ul><li><strong>Договоры</strong> в ЕСУТД</li></ul><blockquote><p>Штраф</p></blockquote>';

    expect(sanitizeRichText(html)).toBe(html);
  });

  it('removes executable code from the body', () => {
    const html =
      '<p onclick="alert(1)">Текст<script>alert(1)</script></p><img src="/files/1.png" onerror="alert(1)"><iframe src="https://evil.example"></iframe>';

    expect(sanitizeRichText(html)).toBe('<p>Текст</p><img src="/files/1.png" />');
  });

  it('drops javascript links and opens external links in a new tab', () => {
    expect(sanitizeRichText('<a href="javascript:alert(1)">Ссылка</a>')).toBe('<a>Ссылка</a>');
    expect(sanitizeRichText('<a href="https://egov.kz">eGov</a>')).toBe(
      '<a href="https://egov.kz" target="_blank" rel="noopener noreferrer">eGov</a>',
    );
    expect(sanitizeRichText('<a href="/ru/self-check">Самопроверка</a>')).toBe(
      '<a href="/ru/self-check">Самопроверка</a>',
    );
  });

  it('removes inline styles and classes', () => {
    expect(sanitizeRichText('<p style="color:red" class="x">Текст</p>')).toBe('<p>Текст</p>');
  });
});
