import { mergeWithFallback } from './messages.ts';

describe('mergeWithFallback', () => {
  it('FR-SYS-03: missing English values fall back to Kazakh per element', () => {
    const kk = { HomePage: { title: 'Басты бет', subtitle: 'Порталы' }, Footer: { phone: '1414' } };
    const en = { HomePage: { title: 'Home' } };

    expect(mergeWithFallback(kk, en)).toEqual({
      HomePage: { title: 'Home', subtitle: 'Порталы' },
      Footer: { phone: '1414' },
    });
  });

  it('does not mutate the fallback dictionary', () => {
    const kk = { HomePage: { title: 'Басты бет' } };
    mergeWithFallback(kk, { HomePage: { title: 'Home' } });

    expect(kk.HomePage.title).toBe('Басты бет');
  });
});
