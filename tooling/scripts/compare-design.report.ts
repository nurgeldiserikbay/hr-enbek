import type { Rect } from './compare-design.config.ts';

export interface ReportBlock {
  name: string;
  design: Rect | null;
  page: Rect;
}

export interface ReportViewport {
  title: string;
  designImage: string;
  pageImage: string;
  blocks: ReportBlock[];
}

export interface ReportResult {
  title: string;
  name: string;
  dy: number;
  dh: number;
  percent: number;
}

const STYLE = `
body { margin: 0; font: 14px/1.4 system-ui, sans-serif; background: #f1f5f9; color: #0f172a; }
header { position: sticky; top: 0; z-index: 2; display: flex; flex-wrap: wrap; gap: 16px; align-items: center; padding: 12px 24px; background: #0f172a; color: #fff; }
section { padding: 24px; border-bottom: 1px solid #cbd5e1; }
h2 { margin: 0 0 12px; font-size: 18px; }
table { border-collapse: collapse; background: #fff; margin-bottom: 16px; }
th, td { padding: 6px 12px; border: 1px solid #e2e8f0; text-align: right; }
th:first-child, td:first-child { text-align: left; }
td.zero { color: #0e8f60; } td.off { color: #b91c1c; font-weight: 600; }
details { margin: 8px 0; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; }
summary { cursor: pointer; font-weight: 600; }
.toolbar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 12px 0; }
button { padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; }
button[aria-pressed=true] { background: #17b67c; border-color: #17b67c; color: #fff; }
.views > div { display: none; gap: 16px; align-items: flex-start; }
[data-view=side] .side, [data-view=diff] .diff, [data-view=overlay] .overlay { display: flex; }
figure { margin: 0; } figcaption { margin-bottom: 4px; font-weight: 600; }
canvas { display: block; max-width: 100%; height: auto; box-shadow: 0 0 0 1px #cbd5e1; }
.overlay { position: relative; } .overlay canvas + canvas { position: absolute; inset: 0 auto auto 0; opacity: var(--mix, 0.5); }
`;

const SCRIPT = `
const DATA = JSON.parse(document.getElementById('data').textContent);
const load = (src) => new Promise((resolve) => { const image = new Image(); image.onload = () => resolve(image); image.src = src; });
const crop = (image, rect, width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  const context = canvas.getContext('2d');
  context.fillStyle = '#fff'; context.fillRect(0, 0, width, height);
  context.drawImage(image, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
  return canvas;
};
const STEP = 2;
const grayRows = (image) => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(image.width / STEP); canvas.height = Math.ceil(image.height / STEP);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const gray = new Float32Array(canvas.width * canvas.height);
  for (let i = 0; i < gray.length; i += 1) gray[i] = (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3;
  return { gray, width: canvas.width, height: canvas.height };
};
const locate = (design, page, rect) => {
  const x0 = Math.floor(rect.x / STEP); const w = Math.max(1, Math.floor(rect.width / STEP));
  const py = Math.floor(rect.y / STEP); const h = Math.max(1, Math.floor(Math.min(rect.height, 400) / STEP));
  const range = Math.floor(900 / STEP);
  let best = { error: Infinity, y: py };
  for (let dy = -range; dy <= range; dy += 1) {
    const dyStart = py + dy;
    if (dyStart < 0 || dyStart + h > design.height) continue;
    let error = 0;
    for (let row = 0; row < h; row += 2) {
      const a = (dyStart + row) * design.width + x0; const b = (py + row) * page.width + x0;
      for (let col = 0; col < w; col += 3) error += Math.abs(design.gray[a + col] - page.gray[b + col]);
      if (error > best.error) break;
    }
    if (error < best.error) best = { error, y: dyStart };
  }
  return { x: rect.x, y: best.y * STEP, width: rect.width, height: Math.min(rect.height, design.height * STEP - best.y * STEP) };
};
const delta = (value) => (value === 0 ? 'zero' : 'off');
const signed = (value) => (value > 0 ? '+' : '') + value;
const comparisons = [];

for (const viewport of DATA) {
  const [designImage, pageImage] = await Promise.all([load(viewport.designImage), load(viewport.pageImage)]);
  const section = document.createElement('section');
  section.innerHTML = '<h2>' + viewport.title + '</h2><table><thead><tr><th>Блок</th><th>Δ y</th><th>Δ x</th><th>Δ ширина</th><th>Δ высота</th><th>Отличие</th></tr></thead><tbody></tbody></table>';
  document.body.append(section);
  const fullPage = { name: 'Вся страница (без выравнивания)', design: { x: 0, y: 0, width: designImage.width, height: designImage.height }, page: { x: 0, y: 0, width: pageImage.width, height: pageImage.height } };
  const designGray = grayRows(designImage);
  const pageGray = grayRows(pageImage);
  for (const raw of [...viewport.blocks, fullPage]) {
    const block = raw.design === null ? { ...raw, name: raw.name + ' (авто)', design: locate(designGray, pageGray, raw.page) } : raw;
    const width = Math.max(block.design.width, block.page.width);
    const height = Math.max(block.design.height, block.page.height);
    const design = crop(designImage, block.design, width, height);
    const page = crop(pageImage, block.page, width, height);
    const row = document.createElement('tr');
    const d = { y: block.page.y - block.design.y, x: block.page.x - block.design.x, w: block.page.width - block.design.width, h: block.page.height - block.design.height };
    row.innerHTML = '<td>' + block.name + '</td>' + [d.y, d.x, d.w, d.h].map((v) => '<td class="' + delta(v) + '">' + signed(v) + ' px</td>').join('') + '<td data-percent></td>';
    section.querySelector('tbody').append(row);
    const details = document.createElement('details');
    details.dataset.view = 'side';
    details.innerHTML = '<summary>' + block.name + '</summary><div class="toolbar"><button data-mode="side" aria-pressed="true">Рядом</button><button data-mode="diff" aria-pressed="false">Разница</button><button data-mode="overlay" aria-pressed="false">Наложение</button><label>макет <input type="range" min="0" max="100" value="50"> страница</label></div><div class="views"><div class="side"><figure><figcaption>Макет</figcaption></figure><figure><figcaption>Страница</figcaption></figure></div><div class="diff"><figure><figcaption>Красным — отличающиеся пиксели</figcaption></figure></div><div class="overlay"></div></div>';
    const [designFigure, pageFigure] = details.querySelectorAll('.side figure');
    designFigure.append(design); pageFigure.append(page);
    const diffCanvas = document.createElement('canvas');
    diffCanvas.width = width; diffCanvas.height = height;
    details.querySelector('.diff figure').append(diffCanvas);
    details.querySelector('.overlay').append(crop(designImage, block.design, width, height), crop(pageImage, block.page, width, height));
    for (const button of details.querySelectorAll('[data-mode]')) {
      button.addEventListener('click', () => {
        details.dataset.view = button.dataset.mode;
        for (const other of details.querySelectorAll('[data-mode]')) other.setAttribute('aria-pressed', String(other === button));
      });
    }
    details.querySelector('input').addEventListener('input', (event) => details.style.setProperty('--mix', event.target.value / 100));
    section.append(details);
    const a = design.getContext('2d').getImageData(0, 0, width, height).data;
    const b = page.getContext('2d').getImageData(0, 0, width, height).data;
    comparisons.push({ title: viewport.title, block, d, a, b, width, height, diffCanvas, cell: row.querySelector('[data-percent]') });
  }
}

const matchesNearby = (item, index, threshold, radius) => {
  const x = (index / 4) % item.width;
  const y = Math.floor(index / 4 / item.width);
  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= item.width || ny >= item.height) continue;
      const j = (ny * item.width + nx) * 4;
      if (Math.max(Math.abs(item.a[index] - item.b[j]), Math.abs(item.a[index + 1] - item.b[j + 1]), Math.abs(item.a[index + 2] - item.b[j + 2])) <= threshold) return true;
    }
  }
  return false;
};

const compare = (threshold, radius) => {
  for (const item of comparisons) {
    const diff = new ImageData(item.width, item.height);
    let changed = 0;
    for (let i = 0; i < item.a.length; i += 4) {
      const max = Math.max(Math.abs(item.a[i] - item.b[i]), Math.abs(item.a[i + 1] - item.b[i + 1]), Math.abs(item.a[i + 2] - item.b[i + 2]));
      const gray = (item.a[i] + item.a[i + 1] + item.a[i + 2]) / 3;
      if (max > threshold && !matchesNearby(item, i, threshold, radius)) { changed += 1; diff.data.set([230, 30, 60, 255], i); } else { diff.data.set([gray, gray, gray, 60], i); }
    }
    item.diffCanvas.getContext('2d').putImageData(diff, 0, 0);
    item.percent = (changed / (item.width * item.height)) * 100;
    item.cell.textContent = item.percent.toFixed(2) + ' %';
  }
};

const thresholdInput = document.getElementById('threshold');
const radiusInput = document.getElementById('radius');
const update = () => {
  document.getElementById('threshold-value').textContent = thresholdInput.value;
  document.getElementById('radius-value').textContent = radiusInput.value;
  compare(Number(thresholdInput.value), Number(radiusInput.value));
};
thresholdInput.addEventListener('change', update);
radiusInput.addEventListener('change', update);
update();
window.comparisonResults = comparisons.map(({ title, block, d, percent }) => ({ title, name: block.name, dy: d.y, dh: d.h, percent }));
`;

interface ReportOptions {
  subtitle: string;
  threshold: number;
  radius: number;
}

export const renderReport = (
  viewports: ReportViewport[],
  { subtitle, threshold, radius }: ReportOptions,
) => `<!doctype html>
<html lang="ru">
<head><meta charset="utf-8"><title>Сравнение с макетом</title><style>${STYLE}</style></head>
<body>
<header>
  <strong>Сравнение с макетом</strong><span>${subtitle}</span>
  <label>Чувствительность: разница канала больше <output id="threshold-value"></output>
    <input id="threshold" type="range" min="0" max="64" value="${String(threshold)}"></label>
  <label>Допуск сглаживания, px: <output id="radius-value"></output>
    <input id="radius" type="range" min="0" max="3" value="${String(radius)}"></label>
</header>
<script id="data" type="application/json">${JSON.stringify(viewports)}</script>
<script type="module">${SCRIPT}</script>
</body>
</html>`;
