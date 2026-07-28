# React Flow 스타일 도식 개편 작업 보고서

- 날짜: 2026-07-28
- 브랜치: `react-flow-diagrams` (커밋 2개: `8fffd2b`, `204107d`)
- 기준: `main`
- 연관 문서: `2026-07-28-react-flow-style-diagrams-requirements.md` · `-unknowns.md` · `-explainer.md` · `react-flow-style-diagrams-implementation-notes.md`

## Human 섹션

### 요약

이 사이트에는 발표 자료가 두 벌 있습니다.

하나는 쓸 수 있는 기능을 보여 주는 견본 자료입니다.

다른 하나는 실제 발표에 쓰는 자료입니다.

두 자료를 통틀어 그림으로 설명하던 자리 세 곳을 모두 새로 만들었습니다.

이제 도식을 마우스로 끌어 옮길 수 있습니다.

확대와 축소도 할 수 있습니다.

확대하는 방법은 셋입니다.

Ctrl 키를 누른 채 마우스 휠을 굴리면 됩니다.

도식 구석의 단추를 눌러도 됩니다.

만지는 화면에서는 두 손가락을 벌려도 됩니다.

다만 휴대폰처럼 좁은 화면에서는 세 방법이 모두 꺼집니다.

견본 자료의 흐름도는 글로 그리던 방식에서 상자와 선을 직접 배치하는 방식으로 바뀌었습니다.

발표용 자료의 덮임 그림은 글자로 흉내 내던 막대에서 진짜 막대 그래프가 되었습니다.

파일 구조를 설명하던 표는 상자와 화살표가 있는 도식으로 바뀌었습니다.

표가 있던 자리에 남는 세로 공간이 137픽셀뿐이라 표와 도식을 함께 둘 수 없었습니다.

"실행 화면 ①②③"이라는 세 장의 제목에서 앞말만 "실행 결과"로 바꿨습니다.

가운데 장이 실제 화면이 아니라 다듬어진 그림이 되었기 때문입니다.

발표 중 사고를 막는 장치도 넣었습니다.

슬라이드를 넘기면 확대와 위치가 처음으로 돌아갑니다.

네 가지 상황에서는 조작이 꺼지고 단추도 사라집니다.

슬라이드를 한눈에 늘어놓는 전체 보기가 첫째입니다.

휴대폰처럼 좁은 화면이 둘째입니다.

발표자만 보는 별도 창인 발표자 화면이 셋째입니다.

인쇄가 넷째입니다.

좁은 화면에서는 조작을 끄기 때문에 손가락 스크롤이 평소대로 살아 있습니다.

그 화면에서는 두 손가락 확대도 함께 꺼집니다.

화면을 못 보는 사람도 상자 안 글자를 그대로 들을 수 있습니다.

상자 사이 관계는 눈에 안 보이는 문장으로 따로 적었습니다.

### 육안 확인 목록

아래 화면을 브라우저로 직접 보고 확인했습니다. 이미지는 저장소에 넣지 않았습니다.

| 화면 | 여는 주소 |
|---|---|
| 견본 자료 흐름도 (어두운·밝은 모드) | `slides/demo/index.html#/5` |
| 발표용 자료 덮임 그림 (어두운·밝은 모드) | `slides/primer-inventory/index.html#/4` |
| 발표용 자료 구조 도식 (어두운·밝은 모드) | `slides/primer-inventory/index.html#/11` |
| 1920x1080 창에서 3단계 확대 | 위 첫 주소 + 확대 단추 3회 |
| 인쇄의 덮임 그림 | `slides/primer-inventory/index.html?print-pdf` 5쪽 |

주소의 번호는 reveal 의 0부터 세는 가로 인덱스입니다. 자료 안 주석 번호(`<!-- 12 -->`)와 다릅니다.

재현: 저장소 뿌리에서 정적 서버를 띄우고 위 주소를 연다.

밝은 모드는 `slides/demo/index.html?light#/5`처럼 물음표 자리에 붙인다. 우물정자 뒤에 붙이면 안 먹는다.

### 리뷰 포인트

| 자리 | 봐야 할 것 |
|---|---|
| `assets/flow.js:96-97`, `:215-216` | 좌표 환산의 두 축. `translate` 먼저 `scale` 나중, 그리고 끈 거리를 발표 도구 배율로 나누기. 둘 중 하나만 빠져도 그림이 손가락과 어긋난다. 1920x1080에서 실측 결과 화면 -100px에 슬라이드 -77.16px(= -100/1.296) |
| `assets/flow.js:114-129` | 상태를 배열이 아니라 요소(`el.__flow`)에 붙인다. 발표 폭 435px 이하에서 reveal이 `.slides`를 innerHTML 왕복으로 재생성하므로 배열 참조는 죽는다 |
| `assets/flow.js:222-230` | 손가락이 셋에서 둘로 줄 때 기준 간격 재측정. 없으면 배율이 상한까지 도약 |
| `assets/flow.js:273-277` | 손 떼기를 창 전체에서 듣는다. `.reveal` 바깥에서 떼면 유령 끌기가 남는다 |
| `assets/flow.js:159-165` | `toLocal` — `getBoundingClientRect()`는 테두리 상자를, `state.x`는 안쪽 칸을 기준으로 한다. `clientLeft/Top` 보정 |
| `assets/flow.js:71-73`, `:247` | 조작 가능 판정 네 가지와 단추 클릭 가드. CSS `galaxy-reveal.css:308`의 감추기와 이중으로 건다 |
| `assets/galaxy-reveal.css:167-182` | `box-sizing: content-box` 명시 이유. `border-box`면 안쪽 칸이 도식보다 2px 낮아져 기본 배율에서도 밀린다 |
| `assets/galaxy-reveal.css:254-260` | `.flow-bar`의 `box-sizing: border-box`. `.is-gap`만 테두리를 가져 50x30으로 커지던 것 |
| `slides/demo/index.html:102-106` | 세로 산술 주석. 상자 78 = 글자 36 + 여백 40 + 테두리 2 |
| `slides/primer-inventory/index.html:437-444` | 상자 높이가 설명 줄 수에 따라 108/138로 갈린다. 화살표 y좌표가 그에 맞는지 |
| `slides/primer-inventory/index.html:167-190` | 막대 좌표. 1.2px/bp 기준으로 M13-F 1261~1531, CLONE-F 1531~1936, INS-F2 1700~2120, 합계 860bp, 틈 40bp |
| `assets/flow.selftest.js:56-75` | 치수 상수가 HTML과 갈라질 수 있다는 한계. 주석에 명시했으나 자동으로는 못 잡는다 |
| `.github/workflows/check.yml:33-46` | 문법 검사 2줄 + 자체 검사 단계 2줄 추가 |

### 검증 결과

`.github/workflows/check.yml` 순서 그대로 5단계 전부 통과했습니다.

| 검사 | 결과 | 무엇을 보는가 |
|---|---|---|
| 문법 검사 (`node --check` x6) | 통과 | 파일 6개가 파싱 가능한지 |
| `assets/starfield.selftest.js` | PASS | 별 배경 수치 약속과 루프 수명 |
| `assets/flow.selftest.js` | 통과 | 배율 상하한, 밀기 경계, 확대 고정점, 세 도식 치수 |
| `.github/check-links.js` | PASS (3개 페이지) | 로컬 경로 실존, Jekyll이 지우는 경로 사용 여부 |
| `.github/check-render.js` | PASS (발표자료 2 · 일반 1 · 공용 CSS 2) | 버려진 CSS, 등장 시차, 세로 넘침, 전체 보기, 두 모드 대비, 인쇄, 움직임 줄이기 |

자동 검사가 못 보는 것은 사람이 브라우저로 실측했습니다.

| 항목 | 실측 결과 |
|---|---|
| 밀기 정확도 (1920x1080) | 화면 -100px → 슬라이드 -77.16px. 손가락과 1:1 |
| 기본 배율 밀기 | 잠김. 확대하면 풀림 |
| 슬라이드 이동 후 | `scale(1)` 원위치 |
| 전체 보기 | 되돌림 + 조작 꺼짐 + 단추 0x0 |
| 좁은 화면 (창 폭 420px, 발표 폭 403px) | 조작 꺼짐, 손가락 기본 동작 살아 있음, 단추 감춤 |
| 좁은 화면 왕복 후 | 조작 되살아남 + 확대 작동 |
| 발표자 화면 | 도식 6상자 그려짐, 조작 꺼짐, 단추 감춤 |
| 인쇄 | 배율 리셋, 단추 감춤. 발표용 자료 37쪽 유지 |
| 움직임 줄이기 | 전환 0초, 확대 기능은 살아 있음 |
| 세 도식 치수 | 216/266/502 — 캔버스와 안쪽 칸과 마지막 요소 아래끝이 모두 일치 |
| 밝은 모드 | 과거 대비 1.04:1 사고 재현 안 됨 |

## Agent 섹션

### 의도

reveal.js 발표 자료 3곳의 도식을 React Flow 시각 규격으로 재구축하고 뷰포트 수준 pan/zoom을 추가한다. 노드 개별 드래그는 범위 밖(사용자 선택). 외부 라이브러리 도입 없이 바닐라로 구현한다.

### 제약

- **의존성**: React Flow 자체는 React 런타임을 요구하므로 사용 불가. `slides/vendor/`에 vendoring 자체는 허용되지만(`slides/README.md:68`) 비용 대비 이득이 없다고 판단.
- **좌표계**: reveal이 `.slides`에 `translate(-50%,-50%) scale(S)`를 상시 적용. S = `clamp(min(pW/1280, pH/800), 0.2, 2)`, pW는 창 폭에서 margin 0.04를 뺀 값. 1920x1080에서 S=1.296. 포인터 델타는 반드시 S로 나눠야 한다. S는 `.flow`(우리 transform 바깥)의 `rect.width / offsetWidth`로 측정.
- **transform 합성**: `translate(...) scale(...)` 순서 고정. 행렬이 T·S가 되어 이동량에 자체 배율 k가 곱해지지 않는다. 뒤집으면 S·T가 되어 k배 빨라진다.
- **DOM 재생성**: `presentationWidth <= 435`(reveal `scrollActivationWidth`)에서 reveal이 `.slides.innerHTML`을 문자열로 왕복시킨다. 리스너는 `.reveal`에, 상태는 요소 자신(`el.__flow`)에 둔다.
- **등장 효과 충돌**: `@keyframes riseIn`의 `to { transform: none }`이 인라인 `transform`을 0.8초간 무효화. 노드 배치는 `left/top`만 사용.
- **검사 2 선택자**: `[style*="--i"]`가 부분 문자열 일치. `--i`로 시작하는 다른 이름 금지.
- **밝은 모드**: `--g-bg-2`만 `:root.light` 짝이 없다. `.figure`와 `pre`가 이 값을 배경으로 쓰므로 두 틀 안에 HTML 텍스트를 넣으면 대비 1.04:1이 재현된다. `.flow`는 두 틀을 쓰지 않고 `--g-card`를 쓴다.
- **테두리 2px**: `.flow-node`는 `box-sizing: border-box`지만 height가 auto라 총 높이 = 콘텐츠 + padding 40 + border 2. 세로 산술에서 이 2px을 빼먹으면 캔버스 밖으로 나가 `overflow: hidden`에 잘린다.

### 검토한 엣지케이스

| 케이스 | 처리 |
|---|---|
| 발표 도구 배율 ≠ 1 | `deckScale()`로 측정 후 나눗셈. 실측 검증 |
| 자체 배율 2배에서 밀기 | transform 합성 순서로 해결. 이동량에 k가 안 곱해짐 |
| 손가락 3개 → 2개 | `pointerup`에서 기준 간격 재측정 |
| 창 밖에서 pointerup | `window`에서 수신 + `lostpointercapture` |
| `setPointerCapture` 실패 | try/catch로 삼키되 window 리스너가 대비 |
| 확대 고정점 | `toLocal()`이 `clientLeft/Top`으로 테두리 보정 |
| 좁은 화면 진입/이탈 | 요소 기반 상태 + `resize` 훅. 왕복 후 작동 실측 확인 |
| 전체 보기 진입/이탈 | `overviewshown`/`overviewhidden` 양쪽 훅. 나올 때 나머지 세 상황 재판정 |
| 전체 보기에서 단추 클릭 | 단추가 0x0(`display:none`)이라 사람은 불가. 프로그램 클릭 시 reveal의 capture click이 먼저 overview를 종료시키므로 그 시점엔 조작이 정당하게 허용됨 — 결함 아님 |
| 인쇄 경로 A (`?print-pdf`) | 새 로드라 확대 상태 없음. `isPrintView` 판정 |
| 인쇄 경로 B (Ctrl+P) | reveal이 신호 없음 → `@media print`의 `!important` + `matchMedia('print')`/`beforeprint` 훅 |
| 움직임 줄이기 | 기능 유지, `transition`만 0. 공용 규칙이 깊이 1까지만 닿으므로 `.flow-canvas` 전용 규칙 추가 |
| 슬라이드 전환 중 잔상 | `beforeslidechange`(전환 직전) 사용 |
| 판독 구간 겹침 표현 | primer마다 1행(유전체 도구 pack 관행). M13-F/CLONE-F 겹침 0bp가 시각적으로 드러남 |

### 의도적 범위 제외

- **노드 개별 드래그** — 사용자가 "화면 전체만" 선택. 엣지 재계산 엔진 불필요.
- **MiniMap** — 노드 5~6개라 불필요. 공식 사용 권고도 확인 실패.
- **방향 버튼 4개** — WCAG 2.5.7을 완전 충족하려면 필요. 확대 상태에서의 이동이 드래그 전용으로 남는 잔여 위험을 감수. 기본 배율에서 전체가 보이므로 모든 콘텐츠는 드래그 없이 도달 가능.
- **키보드 단축키** — reveal이 대부분의 키를 점유. `triggerKey` postMessage가 receiver iframe으로 전달되는 함정. 버튼 포커스로 키보드 접근은 충족.
- **자동 재생 애니메이션** — 발표 중 주의 분산. 요청에 없음.
- **fragment 단계 노출** — 과거 `.rise` + fragment 조합에서 거짓 실패 7건 사고.
- **등장 효과(`rise`)** — 껍데기에 걸 수 있었으나 걸지 않음. 검사 2·4와의 상호작용을 애초에 만들지 않고, 구조 도식 장은 지연 1.2초라 도식이 늦게 뜨면 흐름이 끊긴다.
- **그림 글자 대비 검사기 수정** — 이번 작업으로 authored SVG text가 저장소에서 0건이 됨.
- **`slides/vendor/mermaid/` 삭제** — 약 3.4메비바이트(3,565,102바이트) 고아 파일로 남음. 요청 범위 밖.
- **`check-links.js`의 `loadScript` 스캔** — 대상 0건이 되었으나 죽은 검사 갈래를 정리하지 않음.
- **`Reveal.layout()` 호출** — mermaid 제거와 함께 사라짐. 도식 높이가 고정이라 무해.

### 알려진 한계

- `flow.selftest.js`는 HTML을 읽지 않는다. 치수 상수(`:61-65`)와 HTML이 갈라져도 자동으로 못 잡는다. 주석에 명시.
- 브라우저 구동부(포인터 상태 기계, pinch, `interactive()` 네 상황)는 자동 검사가 없다. 이번에 발견한 결함들이 모두 이 공백에 있었다.
- 점 격자는 `background-size` 고정이라 확대 시 함께 커지지 않는다(원본과 다름, 의도적).
- 점 투명도 0.08은 `background-image`라 `check-render.js`의 대비 검사가 원리적으로 못 본다.
- `beforeslidechange` 시점에는 들어올 슬라이드가 `display:none`이라 `measure()`가 0을 낸다. 현재는 기본 배율에서 밀 수 없어 무해하나, 화면보다 넓은 도식이 생기면 진입 시 `is-pannable`이 안 붙는다.
