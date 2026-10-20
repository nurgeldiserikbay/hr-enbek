import { readFileSync } from 'node:fs';
import { createServer, type ServerResponse } from 'node:http';

interface Searchable {
  title?: string;
  question?: string;
  description?: string | null;
  summary?: string | null;
}

interface NewsItem extends Searchable {
  slug: string;
  category: { code: string };
  publishedAt: string;
  readingMinutes: number;
  isPinned: boolean;
  cover: unknown;
  coverAlt: string | null;
  languages: string[];
  langUsed: string;
}

interface Group<T> {
  code: string;
  name: string;
  langUsed: string;
  icon?: string | null;
  items: T[];
}

interface WithAudience extends Searchable {
  audience: 'ALL' | 'EMPLOYER' | 'WORKER';
}

interface Agreement extends Searchable {
  kind: string;
  region: { code: string } | null;
}

interface Fixtures {
  previewFileId: string;
  newsCategories: unknown[];
  news: NewsItem[];
  faq: Group<Searchable>[];
  legalActs: Group<Searchable>[];
  instructions: WithAudience[];
  videoInstructions: WithAudience[];
  agreements: Agreement[];
  regions: unknown[];
  services: unknown[];
  laborInspections: { regionCode: string }[];
  indicators: unknown[];
}

const PORT = Number(process.env['MOCK_CMS_PORT'] ?? 8099);
const ORIGIN = `http://localhost:${String(PORT)}`;
const PREFIX = '/cms/api/v1/public';
const RELATED_COUNT = 3;
const FILE_PATH = /^\/files\/([^/]+)(\/thumbnail)?$/u;
const ARTICLE_PATH = /^\/news\/([^/]+)$/u;
const FILE_URL = /"\/cms\/api\/v1\/public\/files\//gu;

const FIXTURES_FILE = new URL('fixtures.json', import.meta.url);
const PREVIEW_FILE = new URL('preview.jpg', import.meta.url);

// eslint-disable-next-line security/detect-non-literal-fs-filename -- fixed file next to this script
const fixtures = JSON.parse(readFileSync(FIXTURES_FILE, 'utf8')) as Fixtures;
// eslint-disable-next-line security/detect-non-literal-fs-filename -- fixed file next to this script
const preview = readFileSync(PREVIEW_FILE);
const pdf = Buffer.from(
  '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj ' +
    '3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]>>endobj\ntrailer<</Root 1 0 R>>\n%%EOF\n',
);

const sendJson = (response: ServerResponse, status: number, body: unknown) => {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  response.end(JSON.stringify(body).replaceAll(FILE_URL, `"${ORIGIN}/cms/api/v1/public/files/`));
};

const notFound = (response: ServerResponse) => {
  sendJson(response, 404, { status: 404, error: 'Not Found', message: 'Не найдено', code: 'news.not.found' });
};

const matches = (query: string | null, { title, question, description, summary }: Searchable) => {
  const needle = query?.trim().toLocaleLowerCase();
  return (
    needle === undefined ||
    needle === '' ||
    [title, question, description, summary].some((field) => field?.toLocaleLowerCase().includes(needle) === true)
  );
};

const search = <T extends Searchable>(items: T[], params: URLSearchParams) =>
  items.filter((item) => matches(params.get('q'), item));

const searchGroups = <T extends Searchable>(groups: Group<T>[], params: URLSearchParams) =>
  groups.map((group) => ({ ...group, items: search(group.items, params) })).filter((group) => group.items.length > 0);

const forAudience = <T extends WithAudience>(items: T[], params: URLSearchParams) => {
  const audience = params.get('audience');
  const chosen =
    audience === null || audience === 'ALL'
      ? items
      : items.filter((item) => item.audience === audience || item.audience === 'ALL');
  return search(chosen, params);
};

const toNewsItem = ({
  slug,
  category,
  title,
  summary,
  publishedAt,
  readingMinutes,
  isPinned,
  cover,
  coverAlt,
  langUsed,
}: NewsItem) => ({
  slug,
  category,
  title,
  summary,
  publishedAt,
  readingMinutes,
  isPinned,
  cover,
  coverAlt,
  langUsed,
});

const newsPage = (params: URLSearchParams) => {
  const page = Number(params.get('page') ?? 0);
  const size = Number(params.get('size') ?? 10);
  const category = params.get('category');
  const content = search(
    fixtures.news.filter((item) => category === null || item.category.code === category),
    params,
  )
    .toSorted((left, right) => Number(right.isPinned) - Number(left.isPinned))
    .map((item) => toNewsItem(item));
  return {
    content: content.slice(page * size, (page + 1) * size),
    page,
    size,
    totalElements: content.length,
    totalPages: Math.ceil(content.length / size),
  };
};

const article = (slug: string) => {
  const found = fixtures.news.find((item) => item.slug === slug);
  if (found === undefined) return;
  const related = fixtures.news
    .filter((item) => item.slug !== slug)
    .slice(0, RELATED_COUNT)
    .map((item) => toNewsItem(item));
  return { ...found, related };
};

const faq = (params: URLSearchParams) =>
  searchGroups(
    fixtures.faq.filter((group) => params.get('category') === null || group.code === params.get('category')),
    params,
  );

const agreements = (params: URLSearchParams) => {
  const kind = params.get('kind');
  const region = params.get('region');
  return search(
    fixtures.agreements.filter(
      (item) =>
        (kind === null || item.kind === kind) &&
        (region === null || (item.region !== null && item.region.code === region)),
    ),
    params,
  );
};

const laborInspections = (params: URLSearchParams) => {
  const region = params.get('region');
  return fixtures.laborInspections.filter((item) => region === null || item.regionCode.startsWith(region));
};

const sendFile = (response: ServerResponse, id: string, download: boolean) => {
  const isPreview = id === fixtures.previewFileId;
  response.writeHead(200, {
    'content-type': isPreview ? 'image/jpeg' : 'application/pdf',
    'cache-control': 'public, max-age=60',
    ...(download ? { 'content-disposition': `attachment; filename="${id}.${isPreview ? 'jpg' : 'pdf'}"` } : {}),
  });
  response.end(isPreview ? preview : pdf);
};

const ROUTES: Record<string, (params: URLSearchParams) => unknown> = {
  '/news': newsPage,
  '/news/categories': () => fixtures.newsCategories,
  '/news/sitemap': () =>
    fixtures.news.map(({ slug, publishedAt, languages }) => ({ slug, updatedAt: publishedAt, languages })),
  '/faq': faq,
  '/faq/categories': () =>
    fixtures.faq
      .filter((group) => group.items.length > 0)
      .map(({ code, name, langUsed, icon }) => ({ code, name, langUsed, icon: icon ?? null })),
  '/legal-acts': (params) => searchGroups(fixtures.legalActs, params),
  '/instructions': (params) => forAudience(fixtures.instructions, params),
  '/video-instructions': (params) => forAudience(fixtures.videoInstructions, params),
  '/services': () => fixtures.services,
  '/agreements': agreements,
  '/regions': () => fixtures.regions,
  '/labor-inspections': laborInspections,
  '/indicators': () => fixtures.indicators,
};

createServer((request, response) => {
  const url = new URL(request.url ?? '/', ORIGIN);
  if (request.method !== 'GET' || !url.pathname.startsWith(PREFIX)) {
    notFound(response);
    return;
  }
  const path = url.pathname.slice(PREFIX.length);
  const route = ROUTES[path];
  if (route !== undefined) {
    sendJson(response, 200, route(url.searchParams));
    return;
  }
  const fileId = FILE_PATH.exec(path)?.[1];
  if (fileId !== undefined) {
    sendFile(response, fileId, url.searchParams.get('download') === 'true');
    return;
  }
  const slug = ARTICLE_PATH.exec(path)?.[1];
  const found = slug === undefined ? undefined : article(decodeURIComponent(slug));
  if (found === undefined) notFound(response);
  else sendJson(response, 200, found);
}).listen(PORT, () => {
  process.stdout.write(`mock cms-service: ${ORIGIN}/cms\n`);
});
