const REGIONS = [
  ['astana', 'г. Астана'],
  ['almaty', 'г. Алматы'],
  ['shymkent', 'г. Шымкент'],
  ['abai', 'Абайская область'],
  ['akmola', 'Акмолинская область'],
  ['aktobe', 'Актюбинская область'],
  ['almaty-region', 'Алматинская область'],
  ['atyrau', 'Атырауская область'],
  ['east-kazakhstan', 'Восточно-Казахстанская область'],
  ['zhambyl', 'Жамбылская область'],
  ['zhetysu', 'Жетысуская область'],
  ['west-kazakhstan', 'Западно-Казахстанская область'],
  ['karaganda', 'Карагандинская область'],
  ['kostanay', 'Костанайская область'],
  ['kyzylorda', 'Кызылординская область'],
  ['mangystau', 'Мангистауская область'],
  ['pavlodar', 'Павлодарская область'],
  ['north-kazakhstan', 'Северо-Казахстанская область'],
  ['turkistan', 'Туркестанская область'],
  ['ulytau', 'Улытауская область'],
] as const;

const files = (id: string) => ({
  kk: `/mock/agreements/${id}-kk.pdf`,
  ru: `/mock/agreements/${id}-ru.pdf`,
});

export const AGREEMENTS_MOCK: unknown = {
  general: {
    title: 'Генеральное соглашение',
    description: 'Между Правительством РК, республиканскими объединениями работодателей и работников',
    files: files('general'),
  },
  regional: REGIONS.map(([id, title]) => ({ id, title, files: files(id) })),
};
