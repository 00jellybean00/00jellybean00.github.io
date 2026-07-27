/* 브라우저로 실제 그려 본 뒤에야 드러나는 것들을 잡는다.  실행: node .github/check-render.js
 *
 * check-links.js 는 파일이 있는지, 문법이 맞는지만 본다.
 * 그 검사를 전부 통과하고도 조용히 죽어 있던 결함이 2026-07-27 에 네 건 나왔다.
 *   1) 주석이 중간에 닫혀 뒤따르는 CSS 규칙 하나가 파서에 통째로 버려졌다.
 *      새로 정한 코드 색이 안 먹히고 원래 테마 색이 남았는데 화면에 오류는 없었다.
 *   2) animation 단축 속성이 animation-delay 를 0 으로 되돌려 시차 등장이 전멸했다.
 *      항목이 차례로 나와야 하는데 한꺼번에 나왔다. 역시 오류는 없었다.
 *   3) 인쇄 오버라이드가 빈 껍데기 슬라이드까지 잡아 PDF 끝에 빈 쪽이 붙었다.
 *   4) 슬라이드 내용이 세로로 넘쳐도 스크롤 막대 없이 잘린다.
 * 넷 다 "보이긴 하는데 의도한 모습이 아니다" 쪽이라, 존재 여부만 보는 검사로는 원리적으로 못 잡는다.
 * 근거: docs/blindspot/2026-07-27-primer-inventory-deck-script-redesign-report.md
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.join(__dirname, '..');
// 발표자료를 새로 만들면 여기에 한 줄 더한다. check-links.js 의 PAGES 와 같은 규칙이다.
const DECKS = ['slides/primer-inventory/'];
const PORT = 8731;

const fails = [];
const fail = (m) => fails.push(m);

// ── 정적 서버 (의존성 없이 node 기본 모듈만) ──────────────────
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
  '.woff': 'font/woff', '.ttf': 'font/ttf', '.png': 'image/png', '.jpg': 'image/jpeg' };

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
      if (p.endsWith('/')) p = path.join(p, 'index.html');
      fs.readFile(p, (err, data) => {
        if (err) { res.writeHead(404); res.end(); return; }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(PORT, () => resolve(server));
  });
}

// ── 1. 파서가 버린 CSS 규칙이 있는가 ───────────────────────────
// 브라우저는 선택자가 무효인 규칙을 조용히 버린다. 버린 자리에는 아무 흔적도 안 남는다.
// 그래서 "내가 쓴 규칙 수"와 "브라우저가 실제로 가진 규칙 수"를 맞대 본다.
// 주석을 올바르게(비탐욕) 걷어낸 뒤 최상위 중괄호 덩어리를 세면 내가 쓴 수가 된다.
// 주석이 잘못 닫혀 규칙이 무효가 되면 브라우저 쪽만 줄어들어 차이가 난다.
function countAuthoredRules(css) {
  const noComment = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let depth = 0, count = 0;
  for (const ch of noComment) {
    if (ch === '{') { if (depth === 0) count++; depth++; }
    else if (ch === '}') depth--;
  }
  return count;
}

// ── 2. 대비 계산 (반투명 배경은 조상 위에 합성해야 실제 값이 나온다) ──
const CONTRAST_FN = `
  (() => {
    const parse = (c) => { const m = c.match(/[\\d.]+/g).map(Number); return { r:m[0], g:m[1], b:m[2], a: m.length>3?m[3]:1 }; };
    const over = (f, b) => ({ r: f.r*f.a + b.r*(1-f.a), g: f.g*f.a + b.g*(1-f.a), b: f.b*f.a + b.b*(1-f.a), a: 1 });
    const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); };
      return 0.2126*f(c.r) + 0.7152*f(c.g) + 0.0722*f(c.b); };
    const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1,l2)+0.05) / (Math.min(l1,l2)+0.05); };
    const effBg = (el) => {
      let acc = null;
      for (let n = el; n; n = n.parentElement) {
        const c = parse(getComputedStyle(n).backgroundColor);
        if (c.a === 0) continue;
        acc = acc === null ? c : over(acc, c);
        if (acc.a >= 0.999) break;
      }
      return acc || { r:255, g:255, b:255, a:1 };
    };
    return { parse, over, ratio, effBg };
  })()`;

async function checkDeck(browser, deck) {
  const base = `http://localhost:${PORT}/${deck}`;
  const html = fs.readFileSync(path.join(ROOT, deck, 'index.html'), 'utf8');
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const say = (m) => fail(`${deck} ${m}`);

  // ── 검사 1: 내가 쓴 CSS 규칙이 전부 살아 있는가 ────────────────
  const authored = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => countAuthoredRules(m[1]));
  await page.goto(base + '?render-check');
  await page.waitForFunction('window.Reveal && Reveal.isReady()', null, { timeout: 15000 });
  await page.waitForTimeout(600);

  const parsed = await page.evaluate(() =>
    [...document.querySelectorAll('style')].map((el) => {
      try { return el.sheet ? el.sheet.cssRules.length : -1; } catch { return -1; }
    }));
  authored.forEach((n, i) => {
    if (parsed[i] === undefined) return;
    if (parsed[i] !== n) {
      say(`인라인 스타일 ${i + 1}번: 쓴 규칙 ${n}개 중 브라우저가 가진 것은 ${parsed[i]}개 — ` +
          `${n - parsed[i]}개가 버려졌다 (선택자 오류이거나 주석이 잘못 닫혔다)`);
    }
  });

  // ── 검사 2: 시차 등장이 실제로 걸리는가 ────────────────────────
  // 순서를 --i 로 적어 두고도 지연이 0 이면 전부 한꺼번에 나온다.
  const anim = await page.evaluate(async () => {
    const zero = [], perSlide = [];
    for (let n = 0; n < Reveal.getTotalSlides(); n++) {
      Reveal.slide(...Object.values(Reveal.getIndices(Reveal.getSlides()[n])));
      await new Promise((r) => setTimeout(r, 50));
      const s = document.querySelector('.reveal .slides section.present:not(.stack)');
      if (!s) continue;
      const items = [...s.querySelectorAll('[style*="--i"]')];
      if (!items.length) continue;
      const ds = items.map((el) => parseFloat(getComputedStyle(el).animationDelay) || 0);
      ds.forEach((d, k) => { if (d === 0) zero.push({ 화면: n + 1, 순서: items[k].style.getPropertyValue('--i') }); });
      perSlide.push(new Set(ds).size);
    }
    return { zero, 서로다른지연이있는장: perSlide.filter((v) => v > 1).length, 등장있는장: perSlide.length };
  });
  if (anim.등장있는장) {
    if (anim.zero.length) {
      say(`등장 지연이 0 인 항목 ${anim.zero.length}개 — 시차 등장이 죽었다 ` +
          `(animation 단축 속성이 animation-delay 를 되돌렸는지 확인). 예: ${JSON.stringify(anim.zero.slice(0, 3))}`);
    }
    if (anim.서로다른지연이있는장 === 0) {
      say('시차 등장이 걸린 슬라이드가 하나도 없다 — 모든 항목이 같은 시각에 나온다');
    }
  }

  // ── 검사 3: 슬라이드가 세로·가로로 넘치지 않는가 ───────────────
  // 코드 상자의 스크롤 상한을 없앤 덱은 넘쳐도 스크롤 막대 없이 잘린다.
  const overflow = await page.evaluate(async () => {
    const H = Reveal.getConfig().height;
    const tall = [], wide = [];
    for (let n = 0; n < Reveal.getTotalSlides(); n++) {
      Reveal.slide(...Object.values(Reveal.getIndices(Reveal.getSlides()[n])));
      await new Promise((r) => setTimeout(r, 50));
      const s = document.querySelector('.reveal .slides section.present:not(.stack)');
      if (!s) continue;
      const sc = Reveal.getScale();
      const h = s.getBoundingClientRect().height / sc;
      if (h > H + 0.5) tall.push({ 화면: n + 1, 높이: Math.round(h), 상한: H });
      s.querySelectorAll('pre code').forEach((c) => {
        if (c.scrollWidth > c.clientWidth + 1) wide.push({ 화면: n + 1, 초과: c.scrollWidth - c.clientWidth });
      });
    }
    return { tall, wide };
  });
  overflow.tall.forEach((t) => say(`화면 ${t.화면}: 세로 ${t.높이}px 로 상한 ${t.상한}px 을 넘는다 (잘린다)`));
  overflow.wide.forEach((w) => say(`화면 ${w.화면}: 원문 상자가 가로로 ${w.초과}px 넘쳐 오른쪽이 잘린다`));

  // ── 검사 4: 전체 보기(ESC)에서 내용이 사라지지 않는가 ──────────
  // 등장 애니메이션의 처음 모습을 기본 규칙에 두면 여기서 영원히 안 보인다.
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);
  const hiddenInOverview = await page.evaluate(() =>
    [...document.querySelectorAll('[style*="--i"]')].filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.99).length);
  if (hiddenInOverview) say(`전체 보기에서 안 보이는 항목 ${hiddenInOverview}개`);
  await page.keyboard.press('Escape');

  // ── 검사 5: 두 모드 모두 글자가 배경에 묻히지 않는가 (AA 4.5:1) ──
  for (const [mode, url] of [['어두운 모드', base + '?render-check'], ['밝은 모드', base + '?light&render-check']]) {
    await page.goto(url);
    await page.waitForFunction('window.Reveal && Reveal.isReady()', null, { timeout: 15000 });
    await page.waitForTimeout(500);
    const bad = await page.evaluate(async (fnSrc) => {
      const { parse, over, ratio, effBg } = eval(fnSrc);
      const out = [];
      for (let n = 0; n < Reveal.getTotalSlides(); n++) {
        Reveal.slide(...Object.values(Reveal.getIndices(Reveal.getSlides()[n])));
        await new Promise((r) => setTimeout(r, 40));
        const s = document.querySelector('.reveal .slides section.present:not(.stack)');
        if (!s) continue;
        s.querySelectorAll('*').forEach((el) => {
          if (![...el.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim())) return;
          const st = getComputedStyle(el);
          // 글자에 그러데이션을 입힌 제목은 color 가 투명이라 이 방식으로 못 잰다
          if ((st.webkitBackgroundClip || st.backgroundClip) === 'text') return;
          const bg = effBg(el);
          const r = ratio(over(parse(st.color), bg), bg);
          if (r < 4.5) out.push({ 화면: n + 1, 비: Math.round(r * 100) / 100, 글자: el.textContent.trim().slice(0, 16) });
        });
      }
      return out;
    }, CONTRAST_FN);
    bad.slice(0, 5).forEach((b) => say(`${mode} 화면 ${b.화면}: 선명도 ${b.비} (기준 4.5) — "${b.글자}"`));
    if (bad.length > 5) say(`${mode}: 선명도 미달 ${bad.length}건 중 5건만 표시`);
  }

  // ── 검사 6: 인쇄가 깨지지 않는가 ───────────────────────────────
  // 슬라이드가 종이 밖으로 나가거나, 빈 쪽이 붙거나, 원문이 잘리는 것을 본다.
  await page.goto(base + '?print-pdf&render-check');
  await page.waitForTimeout(2500);
  const print = await page.evaluate(() => {
    const pages = [...document.querySelectorAll('.pdf-page')];
    const out = { 쪽수: pages.length, 페이지밖: [], 잘린원문: 0, 남는높이: 0 };
    pages.forEach((p, i) => {
      const sec = p.querySelector('section');
      if (!sec) return;
      const pr = p.getBoundingClientRect(), r = sec.getBoundingClientRect();
      if (r.top - pr.top < -0.5 || r.bottom - pr.top > p.clientHeight + 0.5) out.페이지밖.push(i + 1);
    });
    out.잘린원문 = [...document.querySelectorAll('.reveal pre code')]
      .filter((c) => c.scrollWidth > c.clientWidth + 1 || c.scrollHeight > c.clientHeight + 1).length;
    const sum = pages.reduce((a, p) => a + p.getBoundingClientRect().height, 0);
    out.남는높이 = Math.round(document.documentElement.scrollHeight - sum);
    return out;
  });
  if (!print.쪽수) say('인쇄 화면에서 페이지가 하나도 안 만들어졌다');
  print.페이지밖.slice(0, 5).forEach((i) => say(`인쇄 ${i}쪽: 슬라이드가 종이 밖으로 나간다`));
  if (print.잘린원문) say(`인쇄에서 원문 상자 ${print.잘린원문}개가 잘린다`);
  // 페이지 높이의 합보다 문서가 크면 그만큼이 빈 쪽으로 나온다
  if (print.남는높이 > 1) say(`인쇄에 빈 쪽이 붙는다 (페이지 합보다 문서가 ${print.남는높이}px 크다)`);

  // ── 검사 7: 움직임 줄이기 설정에서 내용이 사라지지 않는가 ───────
  const reduced = await browser.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  await reduced.goto(base + '?render-check');
  await reduced.waitForFunction('window.Reveal && Reveal.isReady()', null, { timeout: 15000 });
  await reduced.waitForTimeout(600);
  const hiddenReduced = await reduced.evaluate(() =>
    [...document.querySelectorAll('[style*="--i"]')].filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.99).length);
  if (hiddenReduced) say(`움직임 줄이기 설정에서 안 보이는 항목 ${hiddenReduced}개`);
  await reduced.close();
  await page.close();
  return print.쪽수;
}

(async () => {
  let chromium;
  try {
    ({ chromium } = require('playwright'));
  } catch {
    console.error('화면 렌더링 검사: playwright 가 없다. `npm install --no-save playwright` 후 다시 실행하라.');
    process.exit(1);
  }

  const server = await serve();
  const browser = await chromium.launch();
  try {
    for (const deck of DECKS) await checkDeck(browser, deck);
  } finally {
    await browser.close();
    server.close();
  }

  if (fails.length) {
    console.error('화면 렌더링 검사 실패:');
    fails.forEach((f) => console.error('  - ' + f));
    process.exit(1);
  }
  console.log(`화면 렌더링 검사: PASS (${DECKS.length}개 발표자료)`);
})();
