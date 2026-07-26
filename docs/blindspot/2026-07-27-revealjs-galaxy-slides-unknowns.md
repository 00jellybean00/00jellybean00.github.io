# reveal.js 갤럭시 발표자료 페이지 Unknown Unknowns

- 날짜: 2026-07-27
- 입력: 없음 (requirements 문서 미작성, 사용자 구두 요청에서 시작)
- 스캔 렌즈: conventions / integration-points / edge-cases / domain

> 이 저장소에는 웹사이트 코드가 한 줄도 없습니다. 따라서 `similar-features` 렌즈는 생략했습니다.

## 화면을 이루는 네 겹 (아래 결정들을 읽기 전에)

화면은 네 겹으로 쌓입니다. 맨 뒤부터 순서대로입니다.

1. 가장 뒤: 짙은 남색 바탕 (#0a0e1a)
2. 그 위: 마우스를 따라 움직이는 별
3. 그 위: 슬라이드 판 — 배경색 없이 투명
4. 맨 앞: 글자, 그리고 글자 바로 뒤에 깔리는 옅은 어둠 막

12번, 15번, 20번 결정은 서로 다른 겹을 가리킵니다. 충돌하지 않습니다.

## 해소된 항목

| # | 발견 (근거 파일:라인 또는 출처 URL) | 구체화된 질문 | 결정 | 결정 주체 |
|---|---|---|---|---|
| 1 | Pages API 조회 결과 `{"status":"built","build_type":"legacy","source":{"branch":"main","path":"/"}}`. `curl -sI https://00jellybean00.github.io/` → HTTP 404. 저장소에 `index.html` 부재. 과거 빌드 기록 `7daf8b9`(2025-06-05)의 파일 목록은 `_config.yml`, `_layouts/default.html`, `modern-resume-theme.gemspec` 등 51개이며 소유자는 "Ji-Yeong Park / Researcher". 해당 커밋은 `git cat-file -t 7daf8b9` 실패로 로컬에 없음(force-push로 히스토리 소실) | 발표자료를 사이트의 어느 주소에 놓을지. 이 주소는 원래 다른 사람의 이력서 홈페이지였다. 지금은 그 기록이 지워져 첫 화면이 비어 있다 | 발표자료는 하위 주소 `/slides/` 에 놓는다. 첫 화면은 발표자료를 골라 들어가는 목록 페이지로 만든다. 이전 이력서 사이트는 되살리지 않는다. (2026-07-27 02:05 사용자 지시로 갱신됨) | 사용자 |
| 2 | 사용자 요청에 발표 주제와 목차가 없음. `git ls-files` 결과 14개 파일 전부 `.claude/` 도구와 `CLAUDE.md` | 이번에 만들 것이 빈 껍데기인지, 예시가 채워진 견본인지, 실제 발표 원고인지 | 예시 내용이 들어간 견본 발표자료를 만든다. 슬라이드는 8~12장으로 한다. 6번에서 정한 네 기능이 모두 한 번씩 나오게 한다 | 사용자 |
| 3 | Jekyll 3.10.0 기본 exclude에 `node_modules` 포함(`configuration.rb:255-260`). 라이브 실측으로 `/CLAUDE.md` → 200, `/.claude/settings.json` → 404 확인. CDN 도달성 확인 `cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.js` → HTTP 200 | 발표자료를 움직이는 프로그램 파일을 우리 저장소에 복사해 둘지, 남의 서버에서 그때그때 빌려 올지 | 우리 저장소에 직접 복사해 둔다. 6번과 22번에서 정한 수식·코드 색칠·다이어그램·차트 파일도 함께 복사한다. 남의 서버가 막히거나 느려도 슬라이드가 정상으로 뜬다 | 사용자 |
| 4 | https://revealjs.com/markdown/ — 외부 마크다운 파일 로드는 웹서버가 있어야 동작. `.claude/shared/CLAUDE.md:17` — "Playwright MCP blocks `file://` — serve via `python3 -m http.server`" | 슬라이드 본문을 웹페이지 언어(HTML)로 직접 쓸지, 간이 글쓰기 문법(마크다운)으로 쓸지 | 웹페이지 언어로 직접 쓴다. 수식과 그림 배치를 원하는 대로 조절할 수 있다 | 사용자 |
| 5 | https://lumitree.art/blog/parallax-effect, https://particles.js.org/docs/, https://github.com/matteobruni/tsparticles/issues/995 — 시차 이동은 연산이 가볍고 시선을 덜 뺏음. 선 연결은 별 사이 거리를 전부 재므로 비용이 개수의 제곱으로 증가 | 마우스를 따라 별이 어떤 방식으로 움직일지 | 깊이별 시차 이동으로 만든다. 가까운 별이 먼 별보다 더 많이 밀린다 | 사용자 |
| 6 | https://revealjs.com/math/ — 공식 math 플러그인은 KaTeX 권장. 코드 색칠은 내장 highlight 플러그인. Mermaid와 Chart는 서드파티(`reveal.js-mermaid-plugin`, `reveal.js-chart` / Chart.js 기반)이며 공식 wiki의 Plugins 목록에 등재 | 이공계 발표에 필요한 기능 중 무엇을 넣을지 | 수식, 코드 색칠, 다이어그램, 차트를 모두 넣는다. 다이어그램과 차트는 외부 제작물이라 최신 버전에서 못 쓸 수 있다. 그런 경우에는 미리 만든 그림 파일로 대체한다 | 사용자 |
| 7 | `.claude/shared/MANDATE.md:21` — 산출물 경로는 `docs/blindspot/`로 고정. Jekyll 기본 exclude 목록에 `docs`는 없음(`configuration.rb:255-260`). 실측으로 `/CLAUDE.md` → 200 확인. jekyllrb.com/docs/configuration/options/ — Jekyll 3의 `exclude:` 키는 기본 목록을 대체(replace)함 | 작업 문서 폴더가 웹 주소로 공개되어도 괜찮은지 | 공개하지 않는다. 저장소 맨 위에 설정 파일 `_config.yml`을 만든다. 그 안의 제외 목록에 `docs`를 적는다. 이 목록은 원래 값을 통째로 대체하므로 `Gemfile`, `Gemfile.lock`, `node_modules`, `vendor/`도 함께 적는다 | 사용자 |
| 8 | Jekyll `entry_filter.rb:7` — `SPECIAL_LEADING_CHAR_REGEX = %r!\A#{Regexp.union([".", "_", "#", "~"])}!`. `configuration.rb:258` — 기본 exclude에 `node_modules` | 발표자료용으로 새로 만드는 파일과 폴더의 이름을 어떻게 지을지. 이름을 잘못 지으면 내 컴퓨터에서는 정상으로 보인다. 그런데 웹에 올린 사이트에서만 그 파일이 사라진다 | 새로 만드는 폴더의 이름을 밑줄(`_`)이나 점(`.`)으로 시작하지 않는다. 개발 도구가 만드는 `node_modules` 폴더 안의 파일을 가리키지 않는다. 7번의 설정 파일 `_config.yml`은 예외이며 원래 그 이름이어야 한다 | 자체 해소 |
| 9 | 저장소에 `.nojekyll` 부재. `.claude/`가 웹에 안 나오는 이유는 오직 점으로 시작하는 이름 때문(`entry_filter.rb:7`). reveal.js 6.x 배포본 최상위는 `css, dist, js, plugin`으로 밑줄 폴더 없음 | GitHub이 올린 파일을 사이트로 바꿔 주는 자동 변환 기능이 있다. 이것을 끌지 말지 정해야 한다. 끄면 `.claude` 폴더가 웹에 드러날 수 있다 | 자동 변환 기능을 켜 둔 채로 간다. 그것을 끄는 파일(`.nojekyll`)은 만들지 않는다 | 자체 해소 |
| 10 | `gh api repos/00jellybean00/00jellybean00.github.io --jq .permissions` → `{"admin":false,"maintain":false,"push":true}`. Pages `build_type: "legacy"` | 올리기 전에 파일을 미리 가공해 주는 도구를 도입할지 말지. 지금 계정에는 저장소 설정을 바꿀 관리자 권한이 없다 | 미리 가공하는 도구는 쓰지 않는다. 브라우저가 바로 읽을 수 있는 파일만 만들어 그대로 올린다 | 자체 해소 |
| 11 | Jekyll safe 모드의 심볼릭 링크 거부: `entry_filter.rb:84-91`. `git ls-files -s` → `.claude/skills/*` 12개가 mode `120000`(심볼릭 링크) | 발표자료 파일을 바로가기로 걸어둘지, 실제 파일로 둘지 | 모든 파일을 실제 파일로 복사해 넣는다. 바로가기로 걸면 웹에 올라간 사이트에서 사라진다 | 자체 해소 |
| 12 | https://uxmovement.com/content/why-you-should-never-use-pure-black-for-text-or-backgrounds/, https://m2.material.io/design/color/dark-theme.html, https://webaim.org/resources/contrastchecker/, https://github.com/rtmalone/slides/blob/main/shared/theme/starfield.css — 천문 발표용 Starfield 테마는 배경 `#0a0e1a` / 본문 `#e8eaf0`, 대비비 약 16:1. WCAG AAA 기준은 7:1 | 배경과 글자를 정확히 어떤 색으로 할지. "눈부시지 않게"를 색으로 어떻게 지킬지 | 배경은 `#0a0e1a`, 글자는 `#e8eaf0`으로 한다. 이 배경은 순수 검은색이 아니라 거의 검게 보이는 짙은 남색이다. 순수 검은색 위의 순수 흰 글자는 가장자리가 번져 보이기 때문이다 | 자체 해소 |
| 13 | https://npm-compare.com/particles.js,tsparticles, https://dev.to/tsparticles/why-everyone-should-stop-using-particlesjs-right-now-5eb6 — particles.js는 유지보수 중단. tsParticles는 20~100KB. `.claude/shared/skills/work-report/templates/quiz.html` 전체에 외부 참조 0건 | 별 애니메이션을 남이 만든 도구로 만들지, 직접 만들지 | 직접 만든다. 이 프로젝트의 기존 웹페이지 파일은 남의 서버를 그때그때 부르지 않는다 | 자체 해소 |
| 14 | https://revealjs.com/themes/ — 모든 테마 값이 `--r-background-color` 같은 CSS 변수로 노출됨. 공식 Sass 빌드는 Node 20.19.0 이상 요구 | 테마를 처음부터 만들지, 기본 테마를 덮어쓸지 | 기본 어두운 테마를 불러온 뒤 색만 덮어쓴다. 파일을 미리 가공하는 과정이 필요 없다 | 자체 해소 |
| 15 | https://revealjs.com/themes/ — 배경색은 `.reveal-viewport`에 칠해지므로 그 뒤의 별 배경이 통째로 가려짐 | 별 배경이 화면에 실제로 보이게 하려면 무엇을 해야 하는지 | 슬라이드 판 자체의 배경색을 투명으로 둔다. 그러면 뒤에 있는 별이 비쳐 보인다 | 자체 해소 |
| 16 | https://github.com/reveal/notes-server/blob/master/index.html — 발표자 뷰는 현재와 다음 슬라이드를 각각 다시 불러옴. 주소에 `receiver` 파라미터가 붙음 | 발표자만 보는 창을 열면 슬라이드가 두 번 더 불려온다. 별 애니메이션이 세 번 겹쳐 도는 문제를 어떻게 막을지 | 그 창은 주소 끝에 `receiver`라는 표시가 붙는다. 그 표시가 보이면 별 애니메이션을 아예 켜지 않는다 | 자체 해소 |
| 17 | https://revealjs.com/pdf-export/ — `?print-pdf`는 전용 인쇄 스타일로 레이아웃을 재배치. 고정 위치 요소는 첫 페이지에만 찍히거나 누락됨 | PDF로 내보낼 때 배경이 깨지는 문제를 어떻게 막을지 | 인쇄 모드에서는 움직이는 별을 끈다. 배경은 단색 `#0a0e1a`만 남긴다 | 자체 해소 |
| 18 | https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion — 전정기관 장애가 있으면 큰 배경 움직임이 어지럼증을 유발 | 화면이 움직이면 어지러운 사람을 어떻게 배려할지 | 운영체제에 "동작 줄이기"가 켜져 있으면 별을 움직이지 않는다. 정지 화면만 한 번 그린다 | 자체 해소 |
| 19 | https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas — 창 크기를 바꿀 때 별 목록을 비우지 않으면 별이 누적 증식. 화면 배율을 반영하지 않으면 고해상도에서 흐릿함 | 별을 몇 개 그릴지. 창 크기가 바뀔 때 무엇을 조심할지 | 별은 200개로 고정한다. 창 크기가 바뀌면 별 목록을 비우고 처음부터 다시 만든다 | 자체 해소 |
| 20 | https://www.tandfonline.com/doi/full/10.1080/08164622.2022.2139593 — 과학 발표 가이드는 화려한 전환을 비권장. https://lifetips.alibaba.com/tech-efficiency/animated-wallpaper-gpu-drain-truth-fixes — 상시 배경 애니메이션은 소비전력 약 20% 증가 | 발표 중 배경이 시선을 뺏는 문제를 어떻게 줄일지 | 별의 최대 밝기는 절반(0.5)을 넘지 않는다. 마우스에 반응해 별이 밀리는 폭은 최대 30픽셀로 제한한다. 슬라이드가 바뀔 때는 서서히 사라지고 나타나는 효과 하나만 쓴다. 글자 뒤에는 55% 짙기의 어둠 막을 깐다 | 자체 해소 |
| 21 | https://revealjs.com/upgrading/ — 5.x부터 플러그인 경로가 `plugin/notes/notes.js` → `dist/plugin/notes.js`로 변경. 웹의 예제 대부분은 4.x 경로 | 발표 도구의 어느 버전을 쓸지 | 6번대 최신 버전을 쓴다. 인터넷 예제에 적힌 파일 위치는 이 버전과 다르다. 예제를 그대로 베끼지 않고 위치를 확인해 고쳐 쓴다 | 자체 해소 |
| 22 | https://revealjs.com/math/ — 공식 문서가 "선호가 없으면 KaTeX 권장"이라 명시. 코드 색칠 테마는 reveal.js 테마와 별개 CSS. reveal.js 배포본에 `plugin/highlight/monokai.css`, `zenburn.css` 동봉 | 수식 표시 도구와 코드 색상표를 무엇으로 고를지 | 수식은 공식 문서가 권장하는 KaTeX라는 도구로 그린다. 코드 색상표는 발표 도구에 같이 들어 있는 어두운 배색(monokai)을 쓴다 | 자체 해소 |
| 23 | `.claude/shared/CLAUDE.md:17` — `file://`은 자동 검증 도구가 거부. 로컬 도구 실측: `python3` 3.10.12 존재, `node` v22.16.0 존재. `check-runner.md:20` — "No checks found is itself a finding" | 만든 결과를 어떻게 확인할지. 이 저장소에는 자동 검사가 하나도 없다 | 내 컴퓨터에서 슬라이드를 볼 수 있게 임시 서버를 실행한다. 그다음 브라우저로 열어 확인한다. 자동 검사가 없으므로 눈으로 보는 것이 유일한 관문이다 | 자체 해소 |
| 24 | `CLAUDE.md:1` — 현재 내용은 `@.claude/shared/MANDATE.md` 한 줄. `.claude/shared/install.sh:52` — 이 줄이 없으면 다시 덧붙임. 이 저장소에는 파일 배치 규칙과 미리보기 방법을 적어 둔 곳이 없음(`git ls-files` 14개 전부 도구 파일) | 파일 위치와 미리보기 방법을 어디에 적어 둘지. 프로젝트 설명 파일 `CLAUDE.md`를 건드려도 되는지 | `CLAUDE.md`는 이번에 건드리지 않는다. 요청 범위 밖이기 때문이다. 대신 `/slides/README.md`에 적는다 | 자체 해소 |
| 25 | `.claude/shared/MANDATE.md:20` — 모든 사용자 대면 산출물은 한국어. 슬라이드 본문 언어는 어디에도 규정 없음 | 견본 슬라이드의 본문을 어떤 언어로 쓸지 | 본문은 한국어로 쓴다. 기술 용어는 한국어 뒤에 영어를 괄호로 병기한다 | 자체 해소 |

## 미해소 항목

| # | 질문 | 보류 이유 | 재방문 시점 |
|---|---|---|---|
| 1 | ~~사이트 첫 화면을 나중에 무엇으로 채울지~~ **해소됨** | 2026-07-27 02:05 사용자가 발표자료 목록 페이지로 지정했다. 해소된 항목 1번을 참고 | — |
| 2 | 조명이 밝은 강의실용 밝은 테마를 따로 만들지 | 실제 발표장의 조명 밝기를 아직 모른다. 프로젝터의 밝기도 모른다 | 실제 발표 일정과 장소가 정해졌을 때 |
| 3 | ~~다이어그램과 차트 기능이 최신 버전에서 정상 동작하는지~~ **해소됨** | 외부 제작 연결 도구를 쓰지 않고 본체를 직접 불러 쓰기로 바꿨다. 브라우저에서 둘 다 정상 표시를 확인했다 | — |
| 4 | ~~발표자만 보는 창에서 별 애니메이션이 실제로 꺼지는지~~ **해소됨** | 실제로 발표자 화면을 열어 확인했다. 화면 두 칸 모두에서 별이 꺼져 있었다 | — |
| 5 | ~~PDF로 내보냈을 때 글자와 그림이 빠짐없이 찍히는지~~ **부분 해소** | 인쇄 상태를 흉내 내 확인했다. 배경은 짙은 남색, 글자는 밝게 나왔다. 사람이 실제로 인쇄해 본 것은 아니다 | 사용자가 실제로 PDF를 만들어 볼 때 |
| 6 | "눈부시지 않다"의 합격선을 무엇으로 삼을지 | 밝기 느낌은 사람마다 다르다. 화면 기기마다 그려지는 결과도 다르다 | 첫 시안 완성 후, 사용자가 본인 브라우저에서 직접 확인할 때 |
| 7 | 실제 발표 주제와 목차 | 이번에는 견본을 만들기로 했다. 실제 원고는 다음 작업이다 | 실제 발표자료를 만들 때 |

## 스캔 원본 요약

### conventions

- 웹 코딩 관례는 **존재하지 않음**. 추적 파일 14개 전부 `.claude/` 심링크·설정 + `.gitmodules` + `CLAUDE.md`. 이번 작업이 디렉터리 배치·자산 도입·검증 절차의 첫 선례를 만듦.
- 언어 정책 이원화: 모델 지시 파일은 영어, 생성 산출물은 한국어 (`.claude/shared/MANDATE.md:20`, `.claude/shared/CLAUDE.md:23`). 비개발자 가독성 표준(한 문장 한 사실, ≤25 어절)이 4개 skill에 중복 명시.
- 산출물 경로 계약: `docs/blindspot/YYYY-MM-DD-<slug>-{requirements,unknowns,explainer,report}.md`, 퀴즈는 `docs/blindspot/quiz/*.html` (`.claude/shared/README.md:71`). `docs/` 디렉터리는 이번 작업 전까지 부재.
- 정적 사이트 스캐폴딩 전무: `_config.yml`, `.nojekyll`, `CNAME`, `index.html`, `.github/workflows`, `package.json`, lockfile, 루트 `.gitignore` 전부 MISSING.
- 유일한 HTML 선례는 `.claude/shared/skills/work-report/templates/quiz.html` — `<!doctype html>` + `<html lang="ko">`, 인라인 `<style>`(`:7`)·인라인 `<script>`(`:32`), 파일 전체에 `http`/`src=`/CDN 참조 **0건**. 외부 의존 없는 단일 파일 자립형 스타일.
- 커밋 규약: Conventional Commits 접두사(`feat:`/`fix:`/`docs:`/`chore:`/`refactor:`) + 불릿 본문 + `Co-Authored-By` 트레일러. 서브모듈 30개 커밋 전부 일관.
- 서브모듈 경계: `.gitmodules:1` path `.claude/shared`, mode `160000`(gitlink, pin `5e46d913`). `.claude/skills/*`·`.claude/agents/*`는 mode `120000` 심링크. `.claude/shared/` 내부는 다른 저장소이므로 프로젝트 파일을 넣으면 안 됨.
- 표준 검사 부재: check-runner 탐색 순서(`check-runner.md:7`)의 다섯 후보(CLAUDE.md/README, package.json scripts, Makefile, test/, 언어 기본값)가 전부 없음. `:20` — "No checks found is itself a finding".

### integration-points

- `git remote -v` → `https://github.com/00jellybean00/00jellybean00.github.io.git`. `gh api .../pages` → `{"status":"built","build_type":"legacy","source":{"branch":"main","path":"/"},"https_enforced":true,"cname":null}`. 최신 빌드 `{"commit":"cdcdc7b...","status":"built","duration":33364}`. 브랜치 보호 규칙 없음(`gh api .../rules/branches/main` → `[]`).
- `curl -sI https://00jellybean00.github.io/` → HTTP/2 404, content-length 9379 (GitHub 기본 404). 경쟁 진입점 없음.
- user site이므로 base path 접두사 문제 없음: 저장소명 == owner login, `source.path: "/"`. `/dist/reveal.css` 같은 루트 절대 경로가 그대로 동작.
- Jekyll 3.10.0 / github-pages 232 (`curl https://pages.github.com/versions.json`). 기본 exclude(`configuration.rb:21-24`): `Gemfile Gemfile.lock node_modules vendor/...`. `entry_filter.rb:6-8,48-51`: `SPECIAL_LEADING_CHARACTERS = [".", "_", "#", "~"]`.
- **실증**: `/CLAUDE.md` → 200, `/.gitmodules` → 404, `/.claude/settings.json` → 404, `/.claude/shared/MANDATE.md` → 404. Jekyll 필터가 실제 가동 중임을 확인.
- Jekyll 3의 `exclude:` 키는 기본 목록을 **교체**함(jekyllrb.com/docs/configuration/options/). `_config.yml`에 `exclude`를 쓸 때 `node_modules` 등 기본 항목을 함께 나열하지 않으면 제외가 풀림.
- `gh api repos/... --jq .permissions` → `{"admin":false,"maintain":false,"pull":true,"push":true,"triage":true}`. Pages source를 GitHub Actions로 전환 불가. 빌드 결과물을 `main` 루트에 직접 커밋하는 경로만 확실히 동작.
- 히스토리 소실 정황: `git rev-list --max-parents=0 HEAD` → `cc69dbe`(root commit), 로컬 커밋 2개뿐. 그러나 Pages 빌드 기록에는 2025-06-05 커밋 `7daf8b9`(pusher `00jellybean00`) 존재. `gh api .../commits/7daf8b9` → `_config.yml`, `_includes/*`, `_layouts/default.html`, `_sass/*`, `Gemfile`, `index.md`, `assets/`, `modern-resume-theme.gemspec` 등 51개 파일. `_config.yml` 내용상 소유자는 "Ji-Yeong Park / Researcher".
- `.claude/settings.json` — `hooks.SessionStart` 하나뿐, `permissions` 키 없음. `.claude/shared/hooks/mandate.sh:1-5` — `MANDATE.md`를 `cat`할 뿐, PreToolUse/PostToolUse 훅 없음. 파일 생성·로컬 서버 기동을 막는 설정 없음.
- 툴체인 실측: node v22.16.0, npm 11.18.0, python3 3.10.12, ruby+bundle, jekyll 4.4.1 gem 존재. CDN 도달성: jsdelivr 200, unpkg 302.

### edge-cases

- `docs/`는 Jekyll 기본 exclude에 **없음**(`configuration.rb:255-260`). MANDATE가 강제하는 `docs/blindspot/` 산출물이 생기는 순간 `https://00jellybean00.github.io/docs/blindspot/...`로 전부 공개됨. `quiz/*.html`은 front matter 없는 정적 HTML이라 그대로 서빙.
- `/CLAUDE.md` → `HTTP/2 200`, `content-type: text/markdown`, `access-control-allow-origin: *`. front matter 없는 마크다운은 정적 파일로 복사됨. 루트의 non-dot 파일은 전부 공개.
- `.nojekyll` 트레이드오프: 현재 `.claude/`가 404인 것은 오직 Jekyll의 dot 제외(`entry_filter.rb:7`) 덕분. Jekyll을 끄면 그 보호가 무엇으로 대체되는지 미확인. 반대로 Jekyll 유지 시 `_`로 시작하는 에셋 폴더가 **에러 없이 조용히 사라짐**. reveal.js 6.x 배포본 최상위(`css, dist, js, plugin`)는 밑줄 없어 안전.
- 서브모듈은 Pages 빌드를 깨지 않음(실측): `.gitmodules:1-3` url이 공개 HTTPS이고 `dev-env-blindspot`은 `{"private":false}`. 설치 커밋 `cdcdc7b`에 대해 빌드 성공(33초). 남는 위험은 (1) `--recurse-submodules` 없는 clone 시 심링크 파손 → SessionStart 훅 exit 1, (2) Jekyll safe 모드가 사이트 소스 밖 심링크를 버림(`entry_filter.rb:84-91`) → 에셋은 실파일 커밋 필수.
- 로컬 미리보기 수단 전무(빈 결과): `package.json`, `Gemfile`, `Makefile`, `_config.yml`, `.github/workflows` 전부 없음. 기존 기록: `.claude/shared/CLAUDE.md:17` — Playwright MCP가 `file://` 차단, `python3 -m http.server` 경유 필요. `.claude/shared/README.md:87` — WSL은 `explorer.exe <path>`.
- `file://`에서 reveal.js가 깨지는 지점 3가지: `<script type="module">`은 origin `null`로 CORS 차단, Markdown 플러그인의 외부 `.md` 로딩은 fetch 기반이라 차단, 워커/`import()`도 동일. UMD 빌드 + 인라인 HTML 슬라이드는 `file://`에서도 대체로 동작.
- 브라우저 검증 능력은 사용자 전역에만 존재: `.claude/settings.json`에 `mcpServers` 없음, `.mcp.json` 없음, `~/.claude.json`의 이 프로젝트 항목 `mcpServers: []`. `~/.claude/settings.json`의 `enabledPlugins`에 `playwright@claude-plugins-official: true`. `~/.cache/ms-playwright/`에 chromium-1223/1228 설치, `/usr/bin/google-chrome` 존재.
- 환경: WSL2 `6.18.33.2-microsoft-standard-WSL2`, 저장소는 ext4 네이티브(`/dev/sdd`). `explorer.exe` 있음, `wslview` 없음, `xdg-open` 있음. WSL의 Linux headless Chromium과 Windows 실제 브라우저는 GPU 가속 캔버스·폰트 렌더링에서 결과가 갈릴 수 있음.
- 에셋 제약 미설정: `.gitattributes`/`.gitignore`/LFS 전부 없음, `git-lfs` 바이너리 자체 미설치. `core.autocrlf` 미설정, `core.filemode=true`. 원격 저장소 크기 796KB, 로컬 `.git` 660K.

### domain

- **reveal.js 6.0.1이 최신**(https://revealjs.com/upgrading/). 5.x부터 플러그인 경로 `plugin/notes/notes.js` → `dist/plugin/notes.js`, ES 모듈 `.esm.js` → `.mjs`. 웹 튜토리얼 대부분이 4.x 경로라 그대로 복사하면 404. 공식 설치 문서에 CDN 항목 없음(zip / npm 두 가지만 안내), 풀 셋업은 Node 20.19.0+ 요구.
- **테마**: 모든 값이 `:root` CSS 커스텀 프로퍼티(`--r-background-color`, `--r-main-color`, `--r-heading-color`, `--r-link-color`, `--r-main-font-size`)로 노출. 함정 — 배경색이 `.reveal-viewport`에 칠해져 뒤의 canvas를 가림. `--r-background-color: transparent` 필요 (https://revealjs.com/themes/, https://deepwiki.com/hakimel/reveal.js/4-styling-and-themes).
- **색상 기준**: 순수 `#000`은 동공을 확장시켜 `#fff` 글자에 할레이션 유발(난시 인구 약 30%에서 심함). Material Design 다크 배경 `#121212`, 최상위 표면 대비비 약 15.8:1. WCAG AA 4.5:1 / AAA 7:1, 큰 텍스트 3:1 / 4.5:1. reveal.js 기본 `black` 테마도 실은 `#191919` + `#fff`(약 17.6:1) (https://uxmovement.com/..., https://m2.material.io/design/color/dark-theme.html, https://webaim.org/resources/contrastchecker/).
- **실참고 구현**: 천문 발표용 Starfield reveal.js 테마 — 배경 `#0a0e1a`, 보조면 `#111827`, 본문 `#e8eaf0`(약 16:1), 보조 텍스트 `#9ca3b4`, 강조 금색 `#d4a843` / 파랑 `#60a5fa`. 별은 canvas가 아니라 `::before`/`::after` + `radial-gradient` + opacity 키프레임, 그 아래 opacity 0.03~0.07 성운 그라디언트 (https://github.com/rtmalone/slides/blob/main/shared/theme/starfield.css).
- **마우스 인터랙션 4패턴**: (1) 패럴랙스 — 3~4 깊이 레이어, `current += (target - current) * 0.08` lerp, 난이도 최저·시선 분산 최소. (2) 컨스텔레이션 — 임팩트 크나 "네트워크"로 읽히고 O(n²). (3) repulse/attract — 학술 발표 부적합, tsParticles에서 parallax와 동시 사용 시 무력화 버그(issue #995). (4) 커서 트레일 — reveal.js 기본값 `hideInactiveCursor: true`로 5초 후 커서가 숨겨져 발표 중 사실상 무용.
- **라이브러리**: particles.js는 사실상 유지보수 중단. tsParticles는 slim 약 20KB / full 약 100KB, `fpsLimit`·`pauseOnOutsideViewport`·parallax 내장이나 설정 JSON 방대. three.js는 별 수백 개에 과도. 자체 구현 약 200줄.
- **rAF 함정 3종**: (1) 리사이즈 시 배열 미초기화 → 별 누적 증식, (2) `devicePixelRatio` 미반영 → 고해상도에서 흐릿, (3) 콜백 내 DOM 조회·`Math.sqrt` 남발 → 프레임 드랍 (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas).
- **완화책**: 과학 발표 가이드는 페이드 수준 전환만 권고(`transition: 'fade'`, `backgroundTransition: 'fade'`). `prefers-reduced-motion: reduce`는 전정기관 장애 대응 — `window.matchMedia('(prefers-reduced-motion: reduce)')`로 읽어 루프를 시작하지 않고 정적 별만 1회 렌더. 상시 배경 애니메이션은 GPU 사용률 1~3% → 7~18%, 소비전력 약 20% 증가.
- **STEM 플러그인**: 공식 math 플러그인은 KaTeX / MathJax 2·3·4 지원(MathJax 4는 6.0부터), 공식 문서가 "선호 없으면 KaTeX 권장" 명시. 코드 하이라이팅은 내장 `highlight`(highlight.js)이며 **색 테마는 reveal.js 테마와 별개 CSS** — monokai/zenburn 계열을 따로 지정하지 않으면 대비 붕괴. Mermaid는 서드파티 `reveal.js-mermaid-plugin`이며 Mermaid 자체 `theme: 'dark'` 별도 설정 필요.
- **발표자 뷰 / PDF**: `s` 키의 발표자 뷰는 현재·다음 슬라이드를 각각 iframe으로 **프레젠테이션 재로드**(쿼리 `receiver`, `postMessageEvents=true`, `transition=none`). 가드 없으면 애니메이션 3중 실행. `location.search.includes('receiver')`로 감지. `?print-pdf`는 전용 프린트 스타일시트로 페이지 재배치하며 **Chrome/Chromium에서만 동작 확인**, `position: fixed` canvas는 첫 페이지만 찍히거나 누락 (https://github.com/reveal/notes-server/blob/master/index.html, https://revealjs.com/pdf-export/).
- **총평(도메인)**: 최대 리스크는 "예쁜 배경"과 "발표 도구"의 충돌 — 개발 중 단일 창에서는 완벽하나 발표자 뷰·PDF에서 깨짐. 두 번째는 눈부심을 색으로만 해결하려는 접근 — 피로의 상당 부분이 "움직이는 밝은 점"에서 오므로 밝기·속도 상한을 함께 잡아야 함. STEM 문헌은 일관되게 장식적 애니메이션을 비권장하므로, 강렬한 은하 연출은 타이틀·섹션 슬라이드에 국한하고 본문에서는 억제하는 절충이 현실적.
