import { faqCategorySchema } from './faq-schema.ts';

vi.mock('@/shared/config/i18n/navigation.ts', () => ({ Link: vi.fn(), usePathname: vi.fn() }));

const answer = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Да.' }] }] };
const PDF = 'https://cms.example/cms/api/v1/public/files/0b6c3f4e-2a1d-4c5e-9f00-1a2b3c4d5e6f';
const instruction = {
  title: 'Регистрация договора',
  file: { id: '0b6c3f4e-2a1d-4c5e-9f00-1a2b3c4d5e6f', url: PDF, width: null, height: null, thumbnailUrl: null },
};

const parseQuestion = (overrides: Record<string, unknown>) =>
  faqCategorySchema.parse({
    code: 'contracts',
    name: 'Договоры',
    langUsed: 'ru',
    items: [
      {
        id: '4b6c3f4e-2a1d-4c5e-9f00-1a2b3c4d5e6f',
        question: 'Нужно ли регистрировать договор?',
        answer,
        langUsed: 'ru',
        ...overrides,
      },
    ],
  }).questions[0];

describe('faqCategorySchema', () => {
  it('links the answer to the instruction page, or to its PDF when the page is not set', () => {
    expect(parseQuestion({ instruction: { ...instruction, url: '/help/instructions', langUsed: 'ru' } })?.link).toEqual(
      { label: 'Регистрация договора', href: '/help/instructions', lang: 'ru' },
    );
    expect(parseQuestion({ instruction: { ...instruction, url: null, langUsed: 'kk' } })?.link).toEqual({
      label: 'Регистрация договора',
      href: PDF,
      lang: 'kk',
    });
  });

  it('signs the link with the label set by the editor', () => {
    expect(
      parseQuestion({
        videoInstruction: { title: 'Видео', videoUrl: 'https://www.youtube.com/watch?v=1', langUsed: 'ru' },
        linkLabel: 'Видеоинструкция: заключение ЭТД',
      })?.link,
    ).toEqual({ label: 'Видеоинструкция: заключение ЭТД', href: 'https://www.youtube.com/watch?v=1', lang: 'ru' });
  });

  it('IR-UI-03: marks the answer taken from the Kazakh text', () => {
    const question = parseQuestion({ langUsed: 'en', fallbackFields: ['answer'] });

    expect(question?.lang).toBe('en');
    expect(question?.answerLang).toBe('kk');
  });

  it('shows no link when the related record is not published', () => {
    expect(parseQuestion({ instruction: null, videoInstruction: null, linkLabel: 'Подпись' })?.link).toBeUndefined();
  });
});
