/* 배포에서만 조용히 깨지는 것들을 잡는다.  실행: node .github/check-links.js
 *
 * 이 저장소의 대표적 실패 방식은 "내 컴퓨터에서는 되고 웹에 올리면 404"다.
 * GitHub Pages가 Jekyll을 거치면서 밑줄·점으로 시작하는 경로와 node_modules를
 * 에러 없이 지워 버리기 때문이다. 눈으로는 알 수 없어서 검사로 못 박는다.
 * 근거: docs/blindspot/2026-07-27-revealjs-galaxy-slides-unknowns.md 해소 7·8·10번
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
// 발표자료를 새로 만들면 여기에 한 줄 더한다. 안 더하면 그 덱의 경로는 아무도 검사하지 않는다.
const PAGES = ['index.html', 'slides/demo/index.html', 'slides/primer-inventory/index.html'];
const fails = [];
const fail = (m) => fails.push(m);

// ── 1. HTML이 가리키는 파일이 실제로 있는가 ────────────────────
for (const page of PAGES) {
  const dir = path.dirname(path.join(ROOT, page));
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');

  const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
  // <script src>가 아니라 자바스크립트가 나중에 불러오는 경로도 놓치면 안 된다
  refs.push(...[...html.matchAll(/loadScript\('([^']+)'\)/g)].map((m) => m[1]));

  for (const ref of refs) {
    if (/^(https?:|data:|#|mailto:)/.test(ref)) continue;
    const target = path.join(dir, ref.split('#')[0].split('?')[0]);
    const resolved = ref.endsWith('/') ? path.join(target, 'index.html') : target;
    if (!fs.existsSync(resolved)) fail(`${page} → ${ref} (파일 없음: ${path.relative(ROOT, resolved)})`);
  }

  // KaTeX는 설정값으로 경로를 조립하므로 위 검사에 안 잡힌다
  const katex = html.match(/katex:\s*\{\s*local:\s*'([^']+)'/);
  if (katex) {
    for (const f of ['dist/katex.min.css', 'dist/katex.min.js', 'dist/contrib/auto-render.min.js']) {
      const p = path.join(dir, katex[1], f);
      if (!fs.existsSync(p)) fail(`${page} → 수식 도구 파일 없음: ${path.relative(ROOT, p)}`);
    }
  }
}

// ── 2. Jekyll이 조용히 지울 경로를 참조하지 않는가 ──────────────
for (const page of PAGES) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  if (/["'(](?:\.\.\/)*(?:_|node_modules)/.test(html)) {
    fail(`${page}: 밑줄로 시작하는 폴더나 node_modules를 참조한다 (배포에서 사라짐)`);
  }
}

// 발행되는 폴더 이름이 밑줄로 시작하지 않는가 (_config.yml은 Jekyll 설정이라 예외)
for (const dir of ['assets', 'slides']) {
  const walk = (d) => {
    for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) {
      if (e.name.startsWith('_')) fail(`${d}/${e.name}: 밑줄로 시작해 배포에서 사라진다`);
      if (e.isDirectory()) walk(path.join(d, e.name));
    }
  };
  walk(dir);
}

// ── 3. 페이지 안에 직접 쓴 스크립트의 문법이 맞는가 ────────────
// 워크플로의 node --check 는 .js 파일만 본다. 발표자료 안에 직접 쓴 스크립트는
// 문법이 틀려도 CI가 통과하고, 브라우저에서만 조용히 죽는다.
for (const page of PAGES) {
  const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  // <script type="text/template"> 처럼 속성이 붙은 것은 코드가 아니므로 건너뛴다
  for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    try {
      new vm.Script(m[1]);
    } catch (e) {
      fail(`${page}: 페이지 안 스크립트 문법 오류 — ${e.message}`);
    }
  }
}

// ── 4. 내부 문서가 공개되지 않도록 막혀 있는가 ─────────────────
const cfg = fs.readFileSync(path.join(ROOT, '_config.yml'), 'utf8');
for (const must of ['docs', 'CLAUDE.md', 'slides/README.md', 'node_modules']) {
  if (!new RegExp(`^\\s*-\\s*${must.replace(/[.\/]/g, '\\$&')}\\s*$`, 'm').test(cfg)) {
    fail(`_config.yml: 제외 목록에 "${must}" 가 없다 (웹에 공개된다)`);
  }
}

// ── 결과 ──────────────────────────────────────────────────────
if (fails.length) {
  console.error('링크·배포 검사 실패:');
  fails.forEach((f) => console.error('  - ' + f));
  process.exit(1);
}
console.log(`링크·배포 검사: PASS (${PAGES.length}개 페이지)`);
