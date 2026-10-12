import { matchesQuery } from './matches-query.ts';

describe('matchesQuery', () => {
  it('matches everything when the query is empty', () => {
    expect(matchesQuery(undefined, 'Трудовой договор')).toBe(true);
    expect(matchesQuery('  ', 'Трудовой договор')).toBe(true);
  });

  it('matches any field ignoring case', () => {
    expect(matchesQuery('эцп', 'Подписание', 'Подписание ЭЦП или QR')).toBe(true);
    expect(matchesQuery('стаж', 'Подписание', 'Подписание ЭЦП или QR')).toBe(false);
  });
});
