# reveal.js 갤럭시 발표자료 페이지 작업 보고서

- 날짜: 2026-07-27
- 기준: `cdcdc7b` (HEAD) → 작업 트리 (아직 커밋 전, 신규 파일 84개)
- 퀴즈: `docs/blindspot/quiz/2026-07-27-revealjs-galaxy-slides.html` — 통과 전 머지 금지
- 읽는 법: 코드를 모르는 분은 '요약'과 '스크린샷/데모'까지만 읽으면 됩니다. 그 아래는 개발자와 AI를 위한 상세입니다.
- 연관 문서: [unknowns](./2026-07-27-revealjs-galaxy-slides-unknowns.md) · [구현 노트](./revealjs-galaxy-slides-implementation-notes.md)

## Human 섹션

### 요약

발표자료를 웹페이지로 보는 사이트를 만들었습니다. 첫 화면에서 발표자료를 골라 들어갑니다. 슬라이드는 방향키로 넘깁니다. 배경은 거의 검게 보이는 짙은 남색입니다. 그 위에 별이 떠 있습니다. 마우스를 움직이면 가까운 별이 먼 별보다 더 많이 밀립니다. 견본 발표자료 12장에 수식·프로그램 코드·순서도·꺾은선 그래프를 한 번씩 넣었습니다.

필요한 파일을 전부 저장소에 복사해 두었습니다. 그래서 발표장 인터넷이 끊겨도 슬라이드가 정상으로 뜹니다. 대신 새로 들어가는 파일이 6.7메가바이트입니다. 그중 3.4메가바이트가 순서도를 그리는 도구 한 개입니다.

눈부심을 줄이려고 세 가지를 했습니다. 순수 검은색 대신 짙은 남색을 썼습니다. 별 밝기를 절반 이하로 묶었습니다. 글자 뒤에 옅은 어둠 막을 깔았습니다. 화면이 움직이면 어지러운 분을 위한 장치도 넣었습니다. 운영체제에 "동작 줄이기"가 켜져 있으면 별이 아예 멈춥니다.

이 주소는 원래 다른 분의 이력서 홈페이지였습니다. 그 기록은 이번 작업 전에 이미 지워져 있었습니다. 지금은 첫 화면을 발표자료 목록이 차지합니다.

### 스크린샷 / 데모

로컬에서 확인하는 방법입니다. 저장소 맨 위에서 아래를 실행하고 브라우저로 여세요.

```
python3 -m http.server 8000
```

- `http://localhost:8000/` — 발표자료 목록
- `http://localhost:8000/slides/demo/` — 견본 발표자료
- 슬라이드에서 `S` 발표자 화면 · `F` 전체 화면 · `ESC` 전체 보기 · `?` 단축키
- 주소 끝에 `?print-pdf` 를 붙이면 PDF로 인쇄할 수 있습니다

브라우저로 확인한 화면: 목록, 표지, 수식, 코드, 순서도, 그래프, 두 칸 배치, 표, 부록, 발표자 화면, 인쇄 미리보기. 전부 정상 표시되었고 오류 메시지는 없었습니다.

### 리뷰 포인트 (개발자용)

- `assets/starfield.js:106-141` — rAF 루프 수명. `frame()`의 `if (!running) return` 가드 + `stop()`의 `cancelAnimationFrame` + `applyMotionPreference()`의 `!running` 중복 방지, 세 가지가 함께 있어야 루프가 새지 않는다. 초기 구현에는 셋 다 없어 reduced-motion 중간 토글 시 프레임이 계속 돌았다(측정: 1.2초에 144프레임 → 수정 후 2프레임).
- `assets/galaxy-reveal.css:25-47` — 지켜야 할 불변식은 `#starfield`(0) < `.reveal-viewport::before` 스크림(1) < `.reveal .slides>section`(10). 초기 구현은 스크림을 `z-index: -1`로 두었고, 동시에 `.reveal-viewport`에 `position: relative; z-index: 1`을 줬다. reveal 6에서 `.reveal-viewport`는 `<body>` 자신이라 body가 스태킹 컨텍스트가 되고, 그 안에서 `-1`은 형제인 캔버스(0)보다 아래로 내려가 스크림이 별을 전혀 가리지 못했다. 실제 수정은 `-1` → `1`이며, `.reveal-viewport`의 배치 제거는 불필요한 컨텍스트를 없애는 부수적 정리다. 이 값을 0 이하로 내리면 같은 결함이 재발한다.
- `slides/demo/index.html:250-259` — mermaid를 `<script src>`가 아니라 `loadScript()`로 지연 로드(`:254`). `isReceiver`면 아예 안 부른다(`:252`). 정적 참조 검사에 안 잡히는 경로이므로 경로 변경 시 주의.
- `slides/demo/index.html:228-236` — `Reveal.initialize().then()`에서 `renderChart()`를 `try/catch`로 감싸고 `renderMermaid()`를 반환한 뒤 `.catch()`. 하나가 죽어도 다른 하나는 그려져야 한다.
- `slides/demo/index.html:324-327` — `Chart.defaults.font.family`에 `'inherit'`을 넣으면 캔버스가 거부하고 조용히 `10px sans-serif`로 떨어진다. 반드시 실제 글꼴 이름.
- `slides/demo/index.html:271-274` — mermaid `themeVariables.fontFamily`도 같은 이유로 실제 글꼴 이름이어야 한다. `'inherit'`이면 화면 밖 측정 칸과 슬라이드의 글꼴이 달라져 한글 라벨이 잘린다.
- `_config.yml:10-22` — Jekyll 3의 `exclude`는 기본 목록을 **대체**한다. 기본값을 함께 적어 둔 이유. `slides/vendor/`는 `vendor/bundle/` 규칙에 안 걸린다(소스 루트 기준 `start_with?` 매칭).
- `assets/starfield.selftest.js:46-116` — 가짜 rAF/matchMedia 환경으로 루프 수명을 검사. 돌연변이 검사로 검출력을 확인했다(4종 중 3종 검출, 미검출 1종은 동작 동일).

## Agent 섹션 (AI 인수인계용)

### 의도 (Intent)

GitHub Pages user site(`00jellybean00.github.io`)에 reveal.js 기반 발표 시스템의 첫 선례를 만든다. 산출물은 (a) 루트 랜딩 = 덱 선택 페이지, (b) `slides/<slug>/` = 덱 하나, (c) `assets/` = 랜딩·덱 공용 테마와 별 배경. 미학 요구는 "검은 배경 galaxy + 마우스 추종 별 + 눈부시지 않게 + STEM 청중". 이번 덱은 실제 원고가 아니라 각 기능을 한 번씩 보여 주는 견본이다.

### 제약 (Constraints)

- **Jekyll legacy 빌드가 켜져 있다.** `build_type: "legacy"`, source `main` 루트. `_`/`.` 접두 경로와 `node_modules`는 배포에서 조용히 사라진다. 심링크도 safe 모드에서 제거된다. 에셋은 평범한 이름의 실파일이어야 한다.
- **인증 계정에 `admin: false`.** Pages source를 GitHub Actions로 못 바꾼다. 빌드 스텝 없는 순수 정적 파일만이 확실히 동작하는 경로.
- **user site이므로 base path 접두사가 없다.** 다만 모든 참조는 상대 경로로 작성했다(`../vendor/...`). 덱을 `slides/<a>/<b>/`처럼 더 깊이 두면 전부 깨진다.
- **오프라인 발표 요구.** 외부 CDN 참조 0건. reveal.js 6.0.1 / KaTeX 0.18.1 / Chart.js 4.5.1 / Mermaid 11.16.0을 `slides/vendor/`에 실파일 벤더링. 신규 커밋 대상 6.7MB, 그중 `slides/vendor/` 73파일이 6.6MB(mermaid 3.4MB, reveal 1.7MB, KaTeX 폰트 1.0MB). 커밋 전 추적 콘텐츠는 0.7KB, 원격 저장소 크기는 히스토리 포함 796KB였다.
- **UMD 빌드만 사용.** ESM은 `file://`에서 CORS로 막히고, mermaid ESM은 청크 분할이라 벤더링 대상이 불명확하다.
- **`docs/`는 배포 제외.** MANDATE가 산출물 경로를 `docs/blindspot/`로 고정하는데, Jekyll 기본 exclude에 `docs`가 없어 그대로 공개된다. `_config.yml`로 차단. 부작용: `docs/blindspot/quiz/*.html`도 배포 사이트에서 열리지 않는다(로컬 파일로 열어야 함).
- **자동 검사가 없는 저장소.** CI 없음, `package.json` 없음. `node assets/starfield.selftest.js`가 유일한 실행 가능 검사이며 사람이 직접 돌려야 한다.

### 검토한 엣지케이스

| 엣지케이스 | 처리 |
|---|---|
| 발표자 뷰(`S`)가 덱을 iframe 2개로 재로드 | `receiver` 파라미터 감지. 별 캔버스 미기동, mermaid 미로드, 차트 애니메이션 off. 실제 팝업으로 iframe 2개 모두 확인 |
| `?print-pdf` 로 PDF 내보내기 | 별 끄기, 스크림 끄기, 슬라이드마다 `#0a0e1a` 단색 + `print-color-adjust: exact`. print 미디어 에뮬레이션으로 확인 |
| 브라우저가 배경색을 인쇄하지 않음 | `print-color-adjust: exact`로 강제. 없으면 흰 종이에 밝은 회색 글자가 찍혀 판독 불가 |
| OS "동작 줄이기" — 최초 로드 | rAF 미기동, 정지 화면 1회, pointermove 리스너 미등록. 측정: rAF 0회 |
| OS "동작 줄이기" — 실행 중 토글 | `stop()`으로 취소 + `frame()` 가드. 측정: 144프레임 → 2프레임 |
| "동작 줄이기" 반복 토글 | `!running` 가드로 루프 중복 방지. 측정: 0/3/6회 토글 후 초당 120/120/122프레임(증식 없음) |
| reveal이 비활성 슬라이드를 `display:none` 처리 | mermaid가 글자 크기를 못 재 `translate(undefined, NaN)`. `mermaid.render()`로 화면 밖 렌더 후 SVG 이식 |
| mermaid 측정 칸과 슬라이드의 글꼴 불일치 | `themeVariables.fontFamily`에 실제 글꼴 스택 명시. `'inherit'`이면 한글 라벨이 잘림 |
| 캔버스가 `'inherit'`을 글꼴로 못 받음 | `Chart.defaults.font.family`에 실제 스택 명시. 검증: `ctx.font='normal 12px inherit'` → `10px sans-serif` 유지 |
| 창 크기 변경 시 별 누적 증식 | `resize()`에서 배열 교체 + 150ms 디바운스 |
| 고해상도 화면에서 흐릿함 | `devicePixelRatio` 반영, 상한 2 |
| mermaid 설정 예외가 차트까지 죽임 | `renderChart()`를 `try/catch`, 초기화 체인에 `.catch()` |
| mermaid 로드 실패 | 슬라이드에 대체 문구, 콘솔 경고. 덱은 계속 동작 |
| 다이어그램 개별 렌더 실패 | 노드별 `.catch()`로 나머지 다이어그램은 정상 렌더 |
| Jekyll 3 `exclude`가 기본 목록을 대체 | 기본값(`Gemfile`, `node_modules`, `vendor/*`, `gemfiles`)을 함께 명시 |
| `slides/README.md`가 웹에 공개됨 | `exclude`에 추가 |
| 로컬 확인 부산물이 커밋됨 | `.gitignore` 신설(`_site/`, `.jekyll-cache/`, `.playwright-mcp/`, `node_modules/`) |

### 검증 결과

- `node assets/starfield.selftest.js` — 통과
- `node --check assets/starfield.js` — 통과
- `jekyll build` — 통과. 포함 9개 전부 존재, 제외 4개(`docs/`, `CLAUDE.md`, `.claude/`, `slides/README.md`) 전부 부재
- HTML 로컬 참조 16건 — 전부 해석 성공. 외부(`http`) 참조 0건
- KaTeX 간접 경로(`math.js`가 `local`로 조립) 3개 + 폰트 60개 — 전부 존재
- 셀프테스트 검출력 — `if (!running) { rafId = null; return; }` 제거 시 의도대로 실패(`starfield.selftest.js:111`)
- 브라우저 실측 — 12슬라이드, KaTeX 10건, mermaid SVG 1건, 차트 생성 확인, 콘솔 오류 0건

미검증 영역: GitHub Pages safe 모드 하 실제 동작, 사람이 실제로 인쇄한 PDF, WSL Linux Chromium이 아닌 실기기에서의 밝기 체감.

### 의도적 범위 제외

- **실제 발표 원고** — 이번은 견본. 주제·목차가 정해지면 별도 작업.
- **밝은 강의실용 라이트 테마** — 발표장 조명·프로젝터 밝기를 모른다. unknowns 미해소 2번.
- **서드파티 reveal 플러그인(mermaid/chart 연결용)** — 6.x 호환 미확인이라 본체 직접 호출로 대체. 플러그인 자체를 도입하지 않음.
- **번들러·빌드 스텝** — `admin: false`로 Pages source 전환이 불가. 순수 정적으로 고정.
- **mermaid 용량 최적화** — 3.4MB UMD 통짜. ESM 청크 분할은 하지 않음. 지연 로드로 초기 비용만 제거.
- **KaTeX 폰트 포맷 정리** — `.ttf`/`.woff`/`.woff2` 3종 전부 커밋(1.0MB). 실사용은 `.woff2`뿐이나 404 소음을 피하려 유지. 전송량 영향 없음.
- **덱 목록의 데이터화** — 랜딩의 덱 목록은 HTML 직접 기재. 덱이 늘면 분리.
- **CI** — 저장소에 워크플로 없음. 검사는 사람이 수동 실행.
- **`CLAUDE.md` 수정** — 요청 범위 밖이라 건드리지 않음. 프로젝트 규칙은 `slides/README.md`에 기록.

### 구현 노트 요약

계획 이탈:
- unknowns 해소 1번의 "첫 화면 파일을 만들지 않는다"를 뒤집어 랜딩 페이지를 만들었다(사용자 지시).
- unknowns 미해소 1번(첫 화면을 뭘로 채울지)의 재방문 시점을 사용자 결정으로 앞당겼다.
- unknowns 미해소 3번(서드파티 플러그인 동작 확인)은 플러그인을 안 쓰기로 해 항목이 소멸했다.
- `.gitignore` 신설은 unknowns에 없던 항목. 확인 과정에서 필요성이 드러나 추가.

보수적 선택:
- 랜딩의 덱 목록을 HTML에 직접 기재(데이터 파일 분리는 나중).
- mermaid를 통짜 UMD로 벤더링(청크 최적화 안 함).
- 파일 분리를 `assets/` 3개까지만.
- 리사이즈에 150ms 디바운스만 추가.

**사용자 확인 필요 (머지 전 질문):**
1. 이번에 새로 커밋되는 파일이 6.7MB입니다. 그중 3.4MB가 다이어그램 라이브러리 한 개(mermaid)입니다. 그대로 둘까요, 아니면 다이어그램을 그림 파일로 대체해 용량을 줄일까요?
