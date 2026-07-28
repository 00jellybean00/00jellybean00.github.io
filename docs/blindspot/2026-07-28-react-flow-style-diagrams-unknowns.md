# React Flow 스타일 도식 개편 Unknown Unknowns

- 날짜: 2026-07-28
- 입력: `docs/blindspot/2026-07-28-react-flow-style-diagrams-requirements.md`
- 스캔 렌즈: conventions / similar-features / integration-points / edge-cases / domain

## 해소된 항목

| # | 발견 (근거 파일:라인 또는 출처 URL) | 구체화된 질문 | 결정 | 결정 주체 |
|---|---|---|---|---|
| 1 | React Flow 실제 배포본 수치: `.react-flow__node-default { padding:10px; width:150px; font-size:12px }`, `--xy-node-border-radius-default: 3px`, 배경 점 `gap:20, radius:0.5px`, Controls 버튼 `26px`. https://cdn.jsdelivr.net/npm/@xyflow/react@12/dist/style.css | 도식의 크기를 React Flow 원본 수치에 맞출지 정해야 한다. | 발표용으로 키운다. 원본의 비율만 빌린다. 상자 글자를 24픽셀로 못박는다. 슬라이드 본문 글자 48픽셀의 절반이다. 상자 폭과 여백과 모서리 값은 이 글자 크기에 맞춰 설계 문서에서 정한다. 강의실 뒷자리에서 읽히는 것이 우선이다. | 사용자 |
| 2 | 브라우저 실측: primer 13번 화면은 섹션 663픽셀, 남는 세로 공간 137픽셀. 표 자체가 385픽셀. `slides/primer-inventory/index.html:401-410` | 구조 설명 장의 표를 남길지 지울지 정해야 한다. | 표를 지우고 도식이 대체한다. 파일 이름과 하는 일과 계층 셋을 도식이 모두 담는다. 발표 장 수는 늘리지 않는다. | 사용자 |
| 3 | React Flow 기본은 맨휠 확대(`zoomOnScroll:true`, `preventScrolling:true`). reveal은 `mouseWheel:!1`이라 휠을 안 듣는다. Ctrl+휠은 브라우저가 페이지 확대로 처리하는 기본 동작이며 reveal과 무관하다. 가로채려면 `{passive:false}` `wheel` 리스너에서 `preventDefault()`를 불러야 한다. 손가락 핀치는 별개로 `.reveal{touch-action:pinch-zoom}`이 지배하므로 도식에 `touch-action:none`을 따로 걸어야 한다. `slides/vendor/reveal/reveal.js:40` · `slides/vendor/reveal/reveal.css:1` | 마우스 휠로 확대하게 할지 정해야 한다. | Ctrl 키를 누른 채 굴릴 때만 확대한다. 그냥 굴리면 아무 일도 일어나지 않는다. 도식 위에서만 브라우저의 화면 확대를 대신 가로챈다. 도식 바깥에서는 브라우저 확대가 그대로 동작한다. 만지는 화면에서 두 손가락으로 벌리는 동작도 확대로 받는다. 그러려면 도식에 손가락 기본 동작을 끄는 표시가 필요하다. 그 표시의 이름은 `touch-action: none`이다. 붙일 자리는 바깥 껍데기다. 손가락 넘기기를 막는 표시와 같은 자리다. 이 표시는 조작이 켜져 있을 때만 건다. 좁은 화면에서는 18번에 따라 조작 자체를 끄므로 이 표시도 걸지 않는다. 그래야 좁은 화면에서 손가락 스크롤이 살아 있다. | 사용자 |
| 4 | 유전체 도구의 확립된 관행: 겹치는 구간은 줄을 나눠 그린다. UCSC는 pack 모드를 권장 기본으로 명시한다. https://genome.ucsc.edu/goldenPath/help/hgTracksHelp.html · https://igv.org/doc/webapp/UserGuide/ | 덮임 그림에서 겹치는 구간을 어떻게 보여줄지 정해야 한다. | primer 하나가 한 줄을 차지한다. 겹치는 구간이 세로로 정렬돼 한눈에 보인다. 지금 글자 그림과 구조가 같아 이해가 끊기지 않는다. | 사용자 |
| 5 | 세 장이 한 묶음이다. `slides/primer-inventory/index.html:125` 실행 화면 ①, `:157` 실행 화면 ②, `:189` 실행 화면 ③. 셋 다 프로그램이 찍는 글자 화면이다. | 가운데 장만 그림으로 바뀔 때 세 장의 제목을 어떻게 할지 정해야 한다. | 세 장의 제목을 함께 손본다. ①②③ 순서는 그대로 둔다. 앞말만 바꾼다. 앞뒤 두 장은 글자 몇 개만 고친다. | 사용자 |
| 6 | reveal에 `isSwipePrevented`가 구현돼 있다. 조상 사슬을 타고 `data-prevent-swipe` 속성을 찾는다. reveal 자신이 발표자 노트 패널에 이 속성을 쓴다. 포인터 경로는 `pointerType==='touch'`일 때만 처리한다. `slides/vendor/reveal/reveal.js:39` (바이트 84108) | 손가락으로 미는 동작이 슬라이드 넘기기와 부딪히는 것을 어떻게 막을지 정해야 한다. | 발표 도구가 이미 제공하는 표시 하나를 도식 바깥 상자에 붙인다. 그 표시의 이름은 `data-prevent-swipe`이다. 새로 만들 코드가 없다. 마우스로 끄는 것은 원래 부딪히지 않는다. 발표 도구가 손가락 조작만 넘기기로 세기 때문이다. | 자체 해소 |
| 7 | 브라우저 실측: 발표 도구가 슬라이드 전체에 배율을 건다. 창 1280x800이면 0.96배, 1920x1080이면 1.296배, 1024x640이면 0.768배. 저장소 검사기는 `Reveal.getScale()`로 나눈다. 다만 그 값은 발표 도구 배율만 주므로 도식 자체 배율을 따로 곱해야 한다. `.github/check-render.js:151-152` · `slides/vendor/reveal/reveal.js:40` (바이트 99616) | 밀기 이동량을 화면 픽셀 그대로 쓸지 배율로 나눌지 정해야 한다. | 배율로 나눈다. 두 배율을 각각 구해 곱하지 않는다. 밀기를 적용하는 층에서 잰다. 그 층의 화면 폭을 원래 폭으로 나누면 총 배율이 한 번에 나온다. 안 나누면 1920x1080 창에서 그림이 손가락 이동량의 77퍼센트만 움직인다. 자동 검사는 창 하나만 보므로 이 어긋남을 절대 못 잡는다. | 자체 해소 |
| 8 | 브라우저 실측 재현: 상자에 `transform: translate(300px,120px)`와 등장 효과(`rise`)를 함께 걸면 약 0.8초까지 좌표가 무시된다. 등장 효과는 0.6초 동안 돌고 지연이 0.2초다. 마지막 단계가 `transform: none`이라 배치값을 지운다. `assets/galaxy.css:126-129` · `assets/galaxy-reveal.css:197-200` | 상자 하나하나의 좌표를 어떤 방법으로 지정할지 정해야 한다. | 상자를 어디에 놓을지 정하는 자리 지정 방법을 쓴다. 그 방법의 이름은 `left`와 `top`이다. 겹쳐 그리는 방법으로 좌표를 주면 안 된다. 그 방법의 이름은 `transform`이다. 그러면 모든 상자가 첫 0.8초 동안 좌상단에 겹쳤다가 튄다. 10번 결정으로 이 충돌은 사라지지만 규칙은 안전장치로 남긴다. 도식 전체를 밀고 확대하는 층은 이 금지의 대상이 아니다. 그 층은 `transform`을 쓴다. | 자체 해소 |
| 9 | 검사 2의 선택자가 `[style*="--i"]`이며 부분 문자열로 맞춘다. `--idx`나 `--in` 같은 이름도 함께 걸린다. `.github/check-render.js:110-129` (선택자는 `:120`) | 도식에서 쓸 사용자 정의 값의 이름을 어떻게 정할지 정해야 한다. | 등장 순서를 뜻하는 기존 이름은 그대로 쓴다. 그 이름은 `--i`이다. 다만 그 이름으로 시작하는 다른 이름을 도식에서 금지한다. 예를 들어 `--idx`나 `--inner` 같은 이름을 쓰지 않는다. 걸리면 등장 지연이 0이라는 거짓 실패가 난다. | 자체 해소 |
| 10 | 검사 4는 ESC를 눌러 0.8초 기다린 뒤 흐릿한 항목을 센다. 견본 자료 마지막 장의 여유가 150밀리초뿐이다. `.github/check-render.js:163-170` | 도식 상자에 등장 효과를 걸지 정해야 한다. | 등장 효과는 도식 바깥 껍데기 한 겹에만 건다. 상자 하나하나에는 걸지 않는다. 껍데기는 저장소의 기존 표기를 그대로 쓴다. 그 표기는 `class="rise" style="--i:0"`이다. 이렇게 하면 8번 항목의 충돌도 함께 사라진다. | 자체 해소 |
| 11 | reveal이 발생시키는 이벤트 24종을 확인했다. `beforeslidechange`는 슬라이드 전환 함수 첫 줄에서 발생하고 취소도 가능하다. `slides/vendor/reveal/reveal.js:40` (바이트 103404) | 슬라이드를 벗어날 때 확대를 되돌릴 시점을 무엇으로 잡을지 정해야 한다. | 슬라이드가 바뀌기 직전에 나오는 신호를 쓴다. 그 신호의 이름은 `beforeslidechange`이다. 전환이 시작되기 전이라 확대된 그림이 한 순간도 안 보인다. 전체 보기로 들어갈 때는 이 신호가 안 나온다. 그때는 전체 보기가 켜졌다는 신호를 따로 듣는다. 그 신호의 이름은 `overviewshown`이다. 전체 보기에서는 되돌리는 것에 더해 조작 자체를 끈다. 전체 보기는 슬라이드를 눌러 고르는 화면이기 때문이다. 발표 도구가 그 누름을 먼저 가로채므로 단추를 눌러도 안 먹는다. 눌리지도 않는 단추를 남기면 오해를 준다. 그래서 전체 보기에서는 단추 묶음을 감춘다. | 자체 해소 |
| 12 | 발표자 창은 페이지를 세 번 연다. 발표자가 누른 키가 `triggerKey`라는 통로로 안쪽 화면에 그대로 전달된다. 이 통로는 차단 목록에 없다. `slides/vendor/reveal/plugin/notes.js` (바이트 13216) | 확대와 축소를 키보드 단축키로도 제공할지 정해야 한다. | 단축키를 넣지 않는다. 키보드만 쓰는 사람은 단추로 초점을 옮겨 확대와 축소를 할 수 있다. 밀기까지 포함한 규격 충족 여부는 13번에 적었다. 단축키를 넣으면 도식이 없는 장에서도 눌린다. 발표자 화면에서도 예상 못 한 동작이 생긴다. | 자체 해소 |
| 13 | 규격 문서: 끌기로 되는 기능은 끌기 없이도 할 수 있어야 한다. 다만 끌기가 본질적인 경우는 예외다. 규격 해설의 대표 예시는 지도에 방향 단추를 함께 두는 것이다. https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html | 단추를 몇 개 어떤 것으로 둘지 정해야 한다. 방향 단추도 둘지 함께 정해야 한다. | 확대와 축소와 원위치 세 개를 둔다. 방향 단추는 두지 않는다. 잠금 단추도 두지 않는다. 규격을 완전히 충족하지는 못하며 남은 위험을 감수한다. 자세한 근거는 표 아래 "13번 상세"에 적었다. | 자체 해소 |
| 14 | 규격 문서: 사용자가 스스로 조작하는 화면 이동은 허용된다. 꺼야 할 것은 부드럽게 변하는 전환이다. https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html · https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion | 움직임 줄이기 설정에서 확대 기능을 어떻게 다룰지 정해야 한다. | 확대와 이동 기능은 그대로 남긴다. 부드럽게 변하는 전환만 0으로 만든다. 기존 공용 규칙은 이 전환을 못 잡는다. 15번에 적은 이유 때문이다. 따라서 도식 전용 차단 규칙을 `assets/galaxy-reveal.css`의 움직임 줄이기 구역에 직접 적는다. 그 구역은 `:209-214`이다. | 자체 해소 |
| 15 | 브라우저 실측: 움직임 줄이기 공용 규칙은 슬라이드의 직계 자식까지만 닿는다. 바로 뒤의 `.reveal .rise { animation: none !important }`는 깊이와 무관하지만 `animation`만 끄고 `transition`은 안 끈다. 즉 사각지대가 둘이다. `rise` 이름을 안 쓰는 새 움직임이 하나다. 직계 자식보다 깊은 곳의 부드러운 전환이 둘이다. `assets/galaxy-reveal.css:209-214` | 선이 흐르는 연출을 넣을지 정해야 한다. | 넣지 않는다. 그 연출은 사용자가 조작하는 것이 아니라 저절로 움직이는 것이다. 움직임 줄이기에서 완전히 꺼야 한다. 그런데 기존 공용 규칙이 이 연출을 못 잡는다. 검사 7도 못 잡는다. 차단 규칙을 새로 늘리기보다 연출 자체를 안 넣는 쪽이 안전하다. | 자체 해소 |
| 16 | 과거 사고 기록: 단계 노출과 등장 효과를 함께 걸었더니 항목이 안 나타나고 거짓 실패 7건이 났다. `docs/blindspot/2026-07-27-theme-rollout-all-pages-unknowns.md:121` | 도식 상자를 한 개씩 차례로 보여 줄지 정해야 한다. | 차례로 보여 주지 않는다. 도식은 통째로 나타난다. 과거에 같은 조합으로 사고가 났다. | 자체 해소 |
| 17 | 인쇄에는 두 경로가 있다. 주소로 여는 경로는 새로 여는 것이라 확대 상태가 없다. 살아 있는 화면에서 인쇄를 누르는 경로는 reveal이 아무 신호도 주지 않는다. `beforeprint` 처리가 저장소에 0건이다. `slides/vendor/reveal/reveal.js:14` (바이트 48138) | 확대한 채로 인쇄를 누르는 경우를 어떻게 막을지 정해야 한다. | 인쇄용 규칙에서 도식의 이동과 확대를 강제로 되돌린다. 그냥 적으면 안 되고 우선 표시(`!important`)를 붙여야 한다. 코드가 요소에 직접 넣은 값이 파일 규칙보다 세기 때문이다. 저장소에서도 코드가 만든 값을 덮어야 하는 인쇄 차단은 이 표시를 쓴다. 근거는 `assets/galaxy.css:136-145`이다. 자동 검사는 이 경로를 못 보므로 사람이 한 번 확인한다. | 자체 해소 |
| 18 | 폭 435픽셀 이하에서 reveal이 슬라이드 영역을 통째로 다시 만든다. 이때 붙여 둔 조작이 모두 사라진다. `slides/vendor/reveal/reveal.js:14` (바이트 34762, 36665) | 좁은 화면에서 도식이 조용히 죽는 것을 어떻게 막을지 정해야 한다. | 조작을 슬라이드 영역 바깥의 상위 요소에 붙인다. 그래야 안쪽이 다시 만들어져도 살아남는다. 붙일 곳은 발표 도구의 최상위 상자인 `.reveal`이다. 좁은 화면에서는 밀기와 확대를 아예 끈다. 좁은 화면의 기준은 발표 폭 435픽셀 이하다. 이 값은 발표 도구가 스크롤 보기로 바꾸는 기준과 같다. 그 화면에서는 그냥 굴린 휠이 세로 스크롤로 동작한다. Ctrl을 누른 채 굴리면 브라우저의 화면 확대로 돌아간다. 단추 묶음도 함께 감춘다. 청중 화면에서 조작이 꺼지면 단추를 남기지 않는다. 11번의 전체 보기도 같은 규칙을 따른다. 발표자 화면은 청중 화면이 아니므로 이 규칙 밖이며 미해소 5번에서 따로 정한다. 세로로 죽 읽는 것이 우선이기 때문이다. | 자체 해소 |
| 19 | 저장소에 `user-select`와 `cursor` 규칙이 0건이다. reveal은 5초 동안 움직임이 없으면 마우스 화살표를 숨긴다. `slides/vendor/reveal/reveal.js:40` (`hideInactiveCursor:!0`, `hideCursorTime:5e3`) | 끌 수 있다는 것을 무엇으로 알릴지 정해야 한다. | 도식 위에서 글자가 선택되지 않게 막는다. 손 모양 화살표는 밀 수 있을 때만 보여 준다. 밀 수 있는 범위가 0이면 보통 화살표를 쓴다. 34번에서 정한 대로 기본 배율에서는 갈 곳이 없기 때문이다. 화살표가 사라지는 5초 뒤를 대비해 단추 묶음을 상시 노출한다. 마우스를 올려야 나타나는 방식을 쓰지 않는다. 다만 조작이 꺼진 상태에서는 감춘다. 전체 보기가 그 하나이며 11번에 있다. 좁은 화면이 다른 하나이며 18번에 있다. 발표자 화면에서 어떻게 할지는 미해소 5번에서 정한다. | 자체 해소 |
| 20 | 저장소에 그림자 규칙이 하나도 없다. 두 번 나오는 그림자는 둘 다 지우는 코드다. React Flow 원본도 평상시 상자에는 그림자가 없다. `assets/galaxy-reveal.css:106`, `:155` · https://cdn.jsdelivr.net/npm/@xyflow/react@12/dist/style.css | 상자에 그림자를 넣을지 정해야 한다. | 넣지 않는다. 테두리와 배경 두 단계로 입체감을 낸다. 원본도 그렇게 하고 저장소 관행과도 맞는다. 인쇄에서 회색으로 번지는 위험도 없앤다. | 자체 해소 |
| 21 | 검사 1은 중괄호 개수를 세어 버려진 규칙을 찾는다. 실측 확인: `.a{content:"{"}`처럼 글자열 안에 중괄호가 있으면 거짓 실패가 난다. `.github/check-render.js:55-63` | 점 격자 배경을 어떤 방법으로 그릴지 정해야 한다. | 그림 파일을 글자로 심는 방법을 쓰지 않는다. 색을 둥글게 퍼뜨리는 배경 기능으로 그린다. 그 기능의 이름은 `radial-gradient`이다. 그림 파일 글자열은 검사 1의 계산 방식과 어떻게 맞물릴지 확실하지 않다. 확실한 쪽을 고른다. | 자체 해소 |
| 22 | 배경 점은 확대할 때 함께 커지는 것이 원본 동작이다. https://github.com/xyflow/xyflow/blob/main/packages/react/src/additional-components/Background/Background.tsx | 점 격자를 확대에 맞춰 함께 키울지 정해야 한다. | 함께 키우지 않는다. 배경을 밀고 확대하는 층 바깥에 두고 무늬 위치만 옮긴다. 만들 코드가 훨씬 줄어든다. 눈에 띄는 차이도 거의 없다. | 자체 해소 |
| 23 | 저장소에 점 격자 선례가 없다. `.sky-grid`는 1픽셀 선을 56픽셀 간격으로 그린 선 격자이며 점이 아니다. 밝은 모드에서는 발광과 함께 아예 꺼진다. 한편 대비 검사는 배경 그림을 읽지 않으므로 점 격자가 대비를 깎아도 통과한다. `assets/galaxy.css:106-115` · `.github/check-render.js:73-82` | 밝은 모드에서 점 격자를 어떻게 할지 정해야 한다. | 끄지 않고 색 이름표를 써서 옅게 남긴다. 도식의 배경은 장식이 아니라 React Flow 느낌의 핵심이기 때문이다. 점 색의 투명도 상한을 0.08로 못박는다. 어두운 모드와 밝은 모드 모두에 같은 상한을 쓴다. 참고로 기존 선 격자는 어두운 모드에서 0.05를 쓰고 밝은 모드에서는 아예 꺼진다. 자동 검사가 이 대비를 못 재므로 사람이 두 모드에서 한 번 확인한다. | 자체 해소 |
| 24 | 공용 코드 파일의 규격이 하나 있다. 순수 계산을 따로 떼고, 검사 파일을 짝으로 두고, 자동 검사 목록에 등록한다. 선례에서 문법 검사는 `:33-36`의 네 줄 목록이고, 자체 검사 실행은 `:38-39`의 별도 단계다. `assets/starfield.js:169-187` · `assets/starfield.selftest.js` · `.github/workflows/check.yml:33-39` | 밀기와 확대 코드를 어느 파일에 둘지 정해야 한다. | 공용 파일 `assets/flow.js`로 뺀다. 도식이 두 자료에 걸쳐 있어 복제하면 두 벌이 된다. 저장소 규격대로 검사 파일 `assets/flow.selftest.js`를 짝으로 만든다. 자동 검사 설정에 내용 네 줄을 더한다. 문법 검사 목록에 두 줄을 더한다. 그리고 자체 검사를 돌리는 새 단계를 두 줄로 만든다. 단계 사이를 띄우는 빈 줄은 세지 않은 값이다. 기존 별 검사 단계에 얹지 않는다. 얹으면 단계 이름이 사실과 어긋난다. | 자체 해소 |
| 25 | 연결선 종류는 네 가지다. 직각으로 꺾되 모서리만 살짝 둥근 것이 정돈된 흐름도 느낌을 준다. 화살촉 크기는 선 두께에 비례하는 것이 기본이다. https://reactflow.dev/api-reference/utils/get-smooth-step-path · https://github.com/xyflow/xyflow/blob/main/packages/react/src/container/EdgeRenderer/MarkerDefinitions.tsx | 연결선을 어떤 모양으로 그릴지 정해야 한다. | 직각으로 꺾고 모서리만 둥글린다. 화살촉 크기는 선 두께와 무관하게 고정한다. 고정하지 않으면 선을 굵힐 때 화살촉이 같이 커진다. | 자체 해소 |
| 26 | 저장소의 유일한 선례는 글자가 없는 그래프에 `role="img"`와 한국어 `aria-label`을 단 것이다. 그 그래프는 안에 읽을 글자가 없다. 새 도식은 안이 전부 글자다. React Flow는 개별 상자에 `role="group"`을 쓴다. `slides/demo/index.html:126-127` · https://reactflow.dev/learn/advanced-use/accessibility | 화면을 못 보는 사람에게 도식을 어떻게 설명할지 정해야 한다. | 도식을 그림으로 선언하지 않는다. 그림으로 선언하면 안의 글자가 전부 안 읽히고 이름표 한 줄로 대체된다. 표를 대체하는 도식은 정보 열다섯 칸을 한 줄에 담을 수 없다. 대신 상자 글자를 그대로 읽히게 둔다. 바깥 껍데기에는 묶음 역할과 한국어 이름만 단다. 연결선 그림은 장식으로 표시해 읽지 않게 한다. 상자 사이 관계는 눈에 안 보이는 문장으로 따로 적는다. 단추 묶음은 이 껍데기 바깥에 두고 한국어 이름을 단다. | 자체 해소 |
| 27 | 검사 5는 슬라이드 안 모든 요소의 글자 대비를 잰다. 단추 글자도 대상이다. 저장소의 유일한 초점 표시는 `.deck-card:focus-visible`의 `outline: 2px solid var(--g-link); outline-offset: 3px`이다. `.github/check-render.js:185-195` · `assets/galaxy.css:205`, `:211` | 단추의 모양과 초점 표시를 어떻게 할지 정해야 한다. | 랜딩 화면 카드의 초점 표시와 똑같이 맞춘다. 두께 2픽셀에 바깥 여백 3픽셀이다. 단추 색은 색 이름표만 써서 대비를 보장한다. | 자체 해소 |
| 28 | 저장소에 한국어 줄바꿈 제어 규칙이 0건이다. 폭이 고정된 상자 안에서는 어절 중간이 끊긴다. `assets/galaxy.css`, `assets/galaxy-reveal.css` 전역 | 좁은 상자 안 한국어가 어절 중간에 끊기는 것을 막을지 정해야 한다. | 막는다. 어절 단위로 끊는 규칙을 도식 상자에만 적용한다. 저장소에서 처음 쓰는 규칙이므로 근거를 주석으로 남긴다. | 자체 해소 |
| 29 | 브라우저 실측 세로 예산: 덮임 그림 장은 여유 272픽셀에 교체 대상이 346픽셀이라 도식에 618픽셀을 쓸 수 있다. 구조 설명 장은 여유 137픽셀에 표가 385픽셀이라 표를 지우면 522픽셀이다. 견본 자료 도식 장은 여유가 343픽셀이다. 반면 primer 11번 화면은 여유가 10.3픽셀, 14번 화면은 10.6픽셀뿐이다. | 세 도식 각각의 최대 높이를 얼마로 못박을지 정해야 한다. 공용 파일 수정이 다른 장을 깨뜨리지 않게 막는 방법도 함께 정해야 한다. | 세 도식의 높이 상한을 이름별로 못박는다. 덮임 그림은 610픽셀이다. 구조 설명 도식은 515픽셀이다. 견본 자료 흐름도는 340픽셀이다. 실측 예산에서 조금씩 뺀 값이다. 이 상한은 도식만이 아니라 그 아래 딸린 글까지 합친 값이다. 덮임 그림은 요구사항 6번에 따라 안내 문구 세 덩어리를 도식 아래로 내보낸다. 그 글의 높이도 610픽셀 안에 들어가야 한다. 견본 자료 값만 산정법이 다르다. 그 장은 교체 대상 높이를 재지 않고 남는 여유만 썼다. mermaid가 그린 그림의 높이는 창 크기에 따라 달라져 실측이 불안정하기 때문이다. 공용 파일에 넣는 규칙은 도식 안쪽만 골라 적용한다. 여백이나 글자 크기에 닿는 규칙을 전역에 추가하지 않는다. | 자체 해소 |
| 30 | 검사기가 그림 글자의 색을 엉뚱하게 잰다. 그러나 저장소가 직접 쓴 파일에 그림 글자가 0건이고, 이번 도식도 그림에 글자를 넣지 않는다. `.github/check-render.js:185-195` | 검사기의 이 결함을 이번에 고칠지 정해야 한다. | 고치지 않는다. 이번 작업으로 그림 글자를 쓰는 곳이 저장소에서 완전히 사라진다. 고칠 대상이 없어진 결함이다. | 자체 해소 |
| 31 | 배율 상한과 하한의 통용 기본값은 0.5배에서 2배다. https://github.com/xyflow/xyflow/blob/main/packages/react/src/container/ReactFlow/index.tsx | 확대와 축소를 어디까지 허용할지 정해야 한다. | 0.5배에서 2배로 둔다. 원본 기본값이며 발표 화면에서 충분하다. 더 넓히면 도식을 잃어버리기 쉽다. | 자체 해소 |
| 32 | 발표 도식의 통념: 확대해야 읽히는 도식은 이미 실패한 도식이다. 확대는 질의응답 대응용 보조 장치다. https://jothamgunn.com/presentation-tips-architecture-diagrams/ | 기본 상태에서 글자가 읽히는지를 어떻게 보장할지 정해야 한다. | 확대하지 않은 상태에서 뒷자리에서 읽히는 것을 기준으로 글자 크기를 먼저 정한다. 1번 항목의 결정이 이 기준을 따른 것이다. 13번의 접근성 논리도 이 전제 위에 선다. | 자체 해소 |
| 33 | React Flow에는 도식 전체를 축소해 보여 주는 작은 지도(MiniMap)가 있다. 언제 쓰라는 공식 권고는 찾지 못했다. https://reactflow.dev/api-reference/components/minimap | 작은 지도를 넣을지 정해야 한다. | 넣지 않는다. 상자가 다섯에서 여섯 개뿐이라 길을 잃을 일이 없다. 슬라이드 자리도 부족하다. 공식 권고를 못 찾았으므로 근거 없이 늘리지 않는다. | 자체 해소 |
| 34 | React Flow의 기본값 목록에 이동 범위 제한 항목이 없다. 즉 원본은 무한 캔버스를 전제한다. 반면 이번 도식은 상자 수가 적고 슬라이드 안에 갇혀 있다. https://github.com/xyflow/xyflow/blob/main/packages/react/src/container/ReactFlow/index.tsx | 밀 수 있는 범위를 제한할지 정해야 한다. | 제한한다. 도식의 가장자리가 보이는 칸 안으로 들어오면 더 못 밀게 막는다. 도식이 화면에 다 들어가는 배율에서는 밀 수 있는 범위가 0이 된다. 원본과 다른 선택이며 이유는 두 가지다. 첫째로 도식을 화면 밖으로 밀어내 잃어버리는 사고를 막는다. 둘째로 13번의 접근성 논리가 이 제한 위에 선다. | 자체 해소 |

## 도식의 층 구조

여러 항목이 "껍데기"와 "층"을 언급합니다.

혼동을 막기 위해 부모와 자식 관계를 한 번만 정의합니다.

들여쓰기가 한 칸 깊어지면 자식입니다. 같은 깊이는 형제입니다.

아래 목록에서 층은 이름으로 부릅니다. "N번"은 언제나 해소 항목 번호입니다.

```
슬라이드
├─ 바깥 껍데기            (1)
│  ├─ 배경 층             (2)
│  └─ 밀기·확대 층        (3)
│     ├─ 상자들           (4)
│     └─ 연결선 그림 층   (5)
└─ 단추 묶음              (6)
```

1. **바깥 껍데기** — 도식 한 벌을 감싸는 상자입니다. 등장 효과와 높이 상한이 여기 붙습니다. 손가락 넘기기를 막는 표시와 묶음 역할 이름도 여기 붙습니다. 넘치는 부분을 잘라 내는 것도 여기서 합니다. 잘라 내지 않으면 확대한 도식이 슬라이드 밖으로 번집니다. 이 결정은 29번의 높이 상한을 지키기 위한 것입니다. 6번과 10번과 26번과 29번이 이것을 가리킵니다.
2. **배경 층** — 점 격자를 그립니다. 밀기·확대 층의 형제이므로 밀기와 확대의 영향을 받지 않습니다. 무늬 위치만 따라 움직입니다. 22번과 23번이 이것을 가리킵니다.
3. **밀기·확대 층** — 실제로 옮겨지고 커지는 층입니다. 총 배율을 재는 대상도 이 층입니다. 7번과 8번과 34번이 이것을 가리킵니다.
4. **상자들** — 밀기·확대 층의 자식입니다. 자리는 `left`와 `top`으로 정합니다. 8번과 28번이 이것을 가리킵니다.
5. **연결선 그림 층** — 상자들의 형제입니다. 선만 그리고 글자는 넣지 않습니다. 보조 기술에는 장식으로 표시합니다. 25번과 26번이 이것을 가리킵니다.
6. **단추 묶음** — 바깥 껍데기의 형제입니다. 껍데기 안에 넣지 않습니다. 자리는 겹쳐 띄우는 방식으로 잡습니다. 흐름을 따라 놓으면 29번의 높이 상한을 잡아먹습니다. 세 도식의 여유가 각각 8픽셀과 7픽셀과 3픽셀뿐이라 그만큼도 없습니다. 13번과 19번이 이것을 가리킵니다.

조작을 듣는 자리는 이 여섯 층이 아닙니다.

18번에 따라 발표 도구의 최상위 상자에 붙입니다.

## 13번 상세: 접근성 규격과 남은 위험

규격은 끌기로 되는 기능을 끌기 없이도 할 수 있게 하라고 요구합니다.

이번 설계에서 밀 수 있는 범위는 경계 안으로 제한됩니다. 그 결정과 근거는 해소 34번에 있습니다.

도식이 화면에 다 들어가면 밀 수 있는 범위가 0이 됩니다.

즉 기본 배율에서는 밀어도 아무 데도 안 갑니다.

밀기 기능을 따로 잠그는 것이 아니라 갈 곳이 없는 것입니다.

확대해야 화면 밖으로 나간 내용이 생깁니다.

그 내용을 끌지 않고 보려면 원위치 단추로 되돌아가면 됩니다.

즉 같은 내용을 다른 방법으로 볼 수는 있습니다.

다만 확대한 채로 옮기는 동작 자체는 끌기에만 있습니다.

이 점은 규격을 완전히 충족하지 못하는 부분입니다.

감수한 위험으로 기록합니다.

방향 단추 네 개를 더하면 규격은 충족됩니다.

그러나 발표 화면이 복잡해지고 얻는 것이 적다고 판단했습니다.

이 판단은 미해소 6번에서 사용자에게 확인받습니다.

## 미해소 항목

| # | 질문 | 보류 이유 | 재방문 시점 |
|---|---|---|---|
| 1 | 세 장 묶음의 새 제목을 어떤 말로 할지 정해야 한다. 앞말을 "실행 결과"로 할지 다른 말로 할지가 열려 있다. | 문구 선택은 설계 문서에서 실제 도식을 그려 놓고 보는 편이 낫다. 지금 정하면 도식 모양과 안 맞을 수 있다. | 설계 문서(explainer) 작성 시 |
| 2 | 구조 설명 도식이 파일 다섯 개의 "하는 일" 설명을 어느 정도 길이로 담을지 정해야 한다. | 1번이 글자 크기를 24픽셀로 정했다. 그 위에서 상자 폭을 함께 정한 뒤라야 몇 글자가 들어가는지 계산할 수 있다. | 설계 문서(explainer) 작성 시 |
| 3 | 도식 상자에 붙일 연결점 표시를 넣을지 정해야 한다. React Flow는 상자 가장자리에 작은 점을 찍는다. | 상자를 끌 수 없는 이 구현에서 연결점 표시가 뜻을 갖는지가 도식 모양을 봐야 판단된다. | 설계 문서(explainer) 작성 시 |
| 4 | 견본 자료의 mermaid 소개 장을 무슨 주제로 바꿔 쓸지 정해야 한다. | 요구사항 문서가 제목과 출처와 노트를 고치기로 정했으나 새 문구는 정하지 않았다. 도식 내용이 정해진 뒤라야 쓸 수 있다. | 설계 문서(explainer) 작성 시 |
| 5 | 발표자 화면에서 조작 단추를 감출지 남길지 정해야 한다. 요구사항은 밀기와 확대만 끄기로 했으나 단추 표시는 정하지 않았다. | 단추를 남기면 눌러도 아무 일이 없어 혼란스럽다. 감추면 발표자 화면과 청중 화면의 모습이 달라진다. 어느 쪽이 나은지는 실제 화면을 봐야 안다. | 설계 문서(explainer) 작성 시 |
| 6 | 기본 배율에서 밀어도 도식이 안 움직이는 동작을 사용자에게 확인받아야 한다. 방향 단추를 넣지 않기로 한 판단도 함께 확인받아야 한다. | 요구사항 2번과 4번의 "밀면 밀려야 한다"를 그대로 읽으면 어긋나 보인다. 실제로는 갈 곳이 없어서 안 움직이는 것이며 기능을 끄는 것이 아니다. 글로 설명하기보다 실제 동작을 보여 주고 확인받는 편이 낫다. 접근성 규격의 남은 위험도 같은 자리에서 함께 설명한다. | 구현 직후 실제 화면 시연으로 확인 |

## 요구사항 문서와의 관계

요구사항 문서는 인터뷰 시점의 기록입니다.

따라서 두 종류만 그 문서에 반영했습니다.

첫째는 사실 오류입니다.

둘째는 이후 단계에서 정해졌다고 표시한 보충입니다.

이번에 반영한 내용은 다음과 같습니다.

- 자동 검사 등록 줄 수를 "한 줄"에서 "네 줄"로 고쳤습니다. 이 문서 24번의 결정을 따른 값입니다.
- 손댈 공용 파일 목록에 항목 세 개를 더했습니다. 그중 새로 만드는 파일은 `assets/flow.js`와 `assets/flow.selftest.js` 둘입니다. 나머지 하나인 `.github/workflows/check.yml`은 기존 파일입니다. 이 문서 24번에서 정해진 것이라고 표시했습니다.
- 머리말의 상태와 관련 문서 줄을 지금 상황에 맞게 고쳤습니다. 인터뷰 시점의 기록이라는 성격을 밝히는 줄도 머리말에 더했습니다.
- 확정 요구사항 2번의 "아직 정하지 않았습니다"를 이후 결정과 연결했습니다.

아래 한 가지는 요구사항 문서에 반영하지 않았습니다.

- 이 문서 34번의 밀기 경계 제한입니다. 요구사항 2번과 4번의 "밀면 밀려야 한다"와 어긋나 보일 수 있습니다. 사용자 확인이 필요하므로 미해소 6번으로 올렸습니다. 확인을 받은 뒤에 요구사항 문서에 반영합니다.

## 스캔 원본 요약

### conventions

- 사이트 코드(vendor·quiz 제외)에서 `addEventListener`는 `assets/starfield.js`에만 있다. `pointermove`(`{passive:true}`), `resize`(150ms 디바운스), MediaQueryList `change`, `DOMContentLoaded` 넷이 전부. `capture`, 이벤트 위임, `{once:true}`, `AbortController`, `keydown`/`wheel`/`touch*`/`pointerdown`은 0건. 두 덱 인라인 스크립트는 리스너를 하나도 달지 않는다 — 밀기·확대는 저장소 최초의 상호작용 코드다.
- cleanup은 선택적이다. `stop()`은 `pointermove`만 떼고 `resize`/mql `change`는 남긴다(`starfield.js:123-127`). 불변식("루프는 정확히 하나")을 `running` 플래그로 지키고 `starfield.selftest.js:81-111`이 가짜 DOM으로 검증한다.
- `prefers-reduced-motion` 처리가 이원화돼 있다. 공용 JS는 mql `change` 구독으로 실시간 추종(`starfield.js:73,151`), 덱 인라인은 초기화 시 `.matches` 스냅샷 1회(`demo:226`, `primer:831`). 코드 위치가 곧 동작을 결정해 왔다.
- CSS는 BEM이 아니라 평평한 하이픈 클래스 + 접두어 네임스페이스. `.sky-*`, `.deck-*`, `.center-slide`, `.slow-steps`. 접두어 선택 근거가 주석에 있다(`galaxy.css:87`). 변수 접두어는 팔레트 `--g-*`, reveal 덮어쓰기 `--r-*`, 등장 손잡이 `--i`/`--step`/`--lead`. 덱용 규칙은 예외 없이 `.reveal `로 시작(black.css 우선순위 대응, `galaxy-reveal.css:2`).
- `!important` 20곳은 전부 차단 스위치 맥락 — vendor 덮어쓰기 1건, `@media print`, `prefers-reduced-motion`, `html.no-anim`. 평상시 시각 규칙에는 0건. `@media` 블록은 두 파일 모두 파일 맨 끝에 몰려 있고 브레이크포인트는 0건. `:root.light` 규칙은 덮는 대상 바로 뒤에 붙인다.
- `will-change`·`contain`·`touch-action`·`user-select`·`overflow`·`cursor` 전부 0건. `overflow` 0건은 클리핑 컨테이너가 아직 없다는 뜻. 쌓임 순서 규약이 주석에 명문화돼 있다 — 별 캔버스 0 < 어둠 막 1 < 슬라이드 본문 10(`galaxy-reveal.css:40-44`).
- 접근성은 두 패턴뿐: 장식은 `aria-hidden="true"`, 내용 그림은 `role="img"` + 한국어 `aria-label`(`demo:126-127`). `:focus-visible`은 `.deck-card` 1곳(`galaxy.css:205,211`), `galaxy-reveal.css`에는 포커스 규칙 0건. `tabindex` 0건. `<button>` 0개 — 조작 단추가 저장소 최초의 버튼이 된다.
- `word-break`/`keep-all`/`overflow-wrap`/`white-space:nowrap` 0건. 글꼴 스택은 랜딩과 덱에서 첫 항목이 서로 반대. JS는 `inherit` 대신 스택 문자열을 복제하는 것이 관행이고 이유가 주석에 있다(mermaid는 한글 폭 오측, Chart.js는 조용히 10px sans-serif로 강등). 글자 크기는 48px 루트 기준 `em` 배수, `rem`은 padding/border-radius에만.
- 주석은 전부 한국어. 파일 머리에 "무엇이고 왜 이렇게 됐는가"를 적는다. 수치에는 예외 없이 근거가 붙는다. 지배적 형식은 "이 값을 바꾸면 무엇이 깨지는가". 실측과 가정의 델타는 구현 노트에 남긴다.

### similar-features

- `starfield.js`의 rAF 루프 3종 가드가 유일한 선례: `frame()` 첫 줄 `if(!running){rafId=null;return}`, `stop()`의 `cancelAnimationFrame`+리스너 해제, 중복 기동 방지. 좌표는 `mouse.x += (mouse.tx-mouse.x)*0.08` 한 줄 lerp, resize는 150ms 디바운스 후 배열 교체, dpr은 `Math.min(dpr,2)` 상한. `receiver`/`print-pdf`면 `start()`가 `null` 반환.
- 공용 JS 규격: IIFE로 전역 하나만 노출, 순수 함수와 DOM 구동부를 주석 구분선으로 분리, 수치는 상단 `CONFIG` 한 곳, `module.exports`/`root.X` 분기, selftest가 CONFIG 값을 상수로 못 박음, CI에는 `:33-36`의 `node --check` 목록에 파일당 1줄, 그리고 `:38-39`의 자체 검사 실행 단계(이름 1줄 + 실행 1줄).
- reveal 6.0.1 번들에 zoom 플러그인이 없다(`plugin/`에 highlight·math·notes뿐, `*zoom*` 0건, core에 `altKey` 0건). 직접 만드는 것 외 선택지 없음. `mouseWheel:!1`이라 휠 충돌 없음. 다만 `hideInactiveCursor:true`+`hideCursorTime:5000`으로 5초 뒤 커서가 사라지고, `scrollActivationWidth:435`가 걸려 있다.
- `.slides`에 `translate(-50%,-50%) scale(S)`가 상시. reveal 자신이 auto-animate에서, 저장소 검사기가 `check-render.js:151-152`에서 똑같이 `getScale()`로 나눈다. 밀기 델타도 같은 나눗셈이 필요하다.
- `data-prevent-swipe`가 reveal core에 구현돼 있고 저장소 사용처는 0건.
- overview(ESC)는 `.slides`에 배율 변환을 하나 더 얹고 각 섹션을 `cursor:pointer` 클릭 대상으로 만든다. 검사 4가 실제로 ESC를 누른다.
- 렌더 5단 뼈대: ① `Reveal.initialize().then()` 안에서만 그린다 ② 서로 다른 그리기를 try/catch와 `.catch()`로 격리 ③ 무거운 것만 `loadScript()` 지연 로드 + `isReceiver`면 건너뜀 ④ 실패는 예외가 아니라 `<p class="muted">` 대체 문구 + `console.warn` ⑤ 마지막에 `Reveal.layout()`. 재시도 로직 0건.
- `.figure` 수치: `padding:1rem; border:1px solid var(--g-border); border-radius:0.5rem; background:var(--g-bg-2); text-align:center`. 저장소 전체에서 `box-shadow`는 2번 등장하고 값이 둘 다 `none`.
- `.deck-card` 어휘: `padding:1.5rem; border:1px solid var(--g-border); border-radius:0.75rem; background:var(--g-card)`, hover에서 `border-color:var(--g-accent)`+`translateY(-2px)`, transition 0.25s, 움직임 줄이기에서 `transition:none`+`transform:none`. 모서리 값은 저장소 전체에서 0.25/0.5/0.75rem과 999px 네 가지뿐.
- 배치 장치는 `.cols`(1fr 1fr) 하나뿐. 좌표 기반 배치는 저장소 최초. `.stack`은 reveal이 세로 슬라이드 껍데기에 붙이는 이름이라 재사용 금지(`check-render.js:149`의 제외 선택자에 걸림).
- 과거 교훈 4건: ① 숨은 슬라이드에서는 어떤 치수도 못 잰다(mermaid가 `translate(undefined,NaN)`으로 죽었음) ② 글꼴에 `inherit`을 넘기면 측정 칸과 슬라이드가 달라져 글자가 잘린다 ③ 900x700에서 1280x800으로 키울 때 절대값 박힌 것만 12.5% 작아져 전부 손으로 1.143배 보정 ④ 한글 등폭 글꼴 부재로 실측 기반 자간 보정 도입, 정규식 추측 방식은 폐기.

### integration-points

- `isSwipePrevented(e)`가 `data-prevent-swipe`를 조상 사슬까지 검사한다. `onTouchStart`/`onTouchMove` 양쪽 첫 줄에서 호출. reveal 자신이 발표자 노트에 이 속성을 쓴다. 리스너는 `.slides`가 아니라 `.reveal`에 붙고, 포인터 경로는 `pointerType==='touch'`일 때만 처리 — **마우스 드래그는 reveal이 아예 안 본다**. 임계값 40px.
- `mouseWheel:!1` 기본, 두 덱 모두 미설정. 원인이 다른 두 가지가 따로 있다. 터치스크린 손가락 핀치는 `.reveal{touch-action:pinch-zoom}`이 지배하므로 도식에 `touch-action:none`을 걸어야 가로챈다. 트랙패드 핀치는 브라우저가 Ctrl+wheel 로 전달하므로 아래 Ctrl+휠 경로에 속한다. Ctrl+휠은 브라우저 기본 페이지 확대이며 reveal과 무관하므로 `{passive:false}` `wheel` 리스너 + `preventDefault()`로만 가로챈다.
- 키 바인딩 전체 확인. 비어 있는 키: `=`, `-`, numpad `+`/`-`, `0`, `R`, `Z`, `X`, `[`, `]`. 공식 API `Reveal.addKeyBinding`/`removeKeyBinding`/`registerKeyboardShortcut`/`triggerKey` 모두 노출. 사용자 바인딩이 내장보다 먼저 검사된다. `keyboardCondition` 설정으로 조건부 차단 가능.
- 이벤트 24종 확인. `beforeslidechange`는 전환 함수 첫 줄에서 발사되고 `cancelable=true`. data에 목적지만 담으므로 떠나는 슬라이드는 `getCurrentSlide()`로 직접 얻어야 한다. `overviewshown`도 함께 들어야 한다 — overview에서 섹션마다 capture 단계 `click` 리스너가 붙어 도식 위 클릭이 슬라이드 이동으로 먹힌다.
- 인쇄 경로 A(`?print-pdf`): 초기화 시점에만 결정되며 런타임 전환 불가. 순서는 `@page` 주입 → `reveal-print`+`print-pdf` 클래스 동시 부착 → body 크기 → rAF 2회 → `.pdf-page` 래핑 → `pdf-ready` 발사. 감지 훅은 `pdf-ready` 이벤트와 `Reveal.isPrintView()`. 경로 B(Ctrl+P): reveal이 DOM을 안 바꾸고 클래스도 안 붙이며 `beforeprint`/`afterprint` 리스너가 파일 전체에 0개. reveal 인쇄 CSS는 `section`에만 `transform:none!important`를 걸어 도식 `div`는 살아남는다. CI 검사 6은 경로 A만 보므로 경로 B는 검사에 안 잡힌다.
- 발표자 화면은 `window.open('about:blank')` + iframe 2개(현재 1280x1024, 다음 640x512). 덱 HTML이 총 3번 실행된다. iframe 주소에 `?receiver&progress=false&...&scrollActivationWidth=false&postMessageEvents=true`. 발표자 키 입력이 `{method:'triggerKey',args:[keyCode]}` postMessage로 전달되고 `triggerKey`는 블랙리스트에 없다. 가짜 이벤트라 `preventDefault`도 `shiftKey`도 없다.
- `.slides` 배율 `S = clamp(min(presentationWidth/1280, presentationHeight/800), 0.2, 2)`. 1920x1080 창이면 약 1.30. `getBoundingClientRect()`와 `clientX`는 이미 S가 곱해진 화면 픽셀. 안전한 구현은 `rect.width / element.offsetWidth`로 총 배율을 한 번에 구하는 것. `Reveal.getScale()`은 reveal 배율만 주므로 자체 배율을 곱해야 한다. `resize` 이벤트가 `{oldScale, scale, size}`를 준다.
- `presentationWidth <= 435`이면 런타임에 스크롤 뷰로 전환. `.slides.innerHTML`을 문자열로 저장했다 되돌리는 왕복이라 JS로 붙인 리스너와 인라인 transform이 전부 소멸하고 DOM 노드 동일성도 깨진다. receiver iframe은 `scrollActivationWidth=false`라 이 문제가 없다.
- 잔가지 3건: `user-select` 규칙 0개라 드래그가 글자를 선택한다. `hideInactiveCursor` 때문에 5초 뒤 `.reveal`에 `cursor:none`이 걸린다. overview의 capture 단계 click이 단추 클릭을 가로챈다.

### edge-cases

- 검사 1(`countAuthoredRules`)은 주석만 걷고 최상위 `{` 개수를 센다. 실측: `.a{content:"{"}` → 저자 1 / 브라우저 2로 **거짓 실패**. 무효 선택자는 정상 검출, 알 수 없는 속성(`touch-actionx`)은 **미검출**. 도식 CSS가 `galaxy-reveal.css`로 가므로 판정자는 `checkSharedCss`.
- 검사 3 사각지대 4종을 실측 확인: (A) `position:relative` 컨테이너에 높이 없이 900px 절대배치 자식 → 섹션 높이 690 그대로. (B) `overflow:hidden` 300px 안에 900px 내용 → 잘린 600px 감지 0. (C) 폭 2400px 요소 → `pre code`만 보므로 감지 0. (D) `transform:scale(2)` → 레이아웃 높이만 반영. 요구사항의 좌표 배치가 (A)에 그대로 해당한다.
- 세로 예산 실측(상한 800px): primer 5번 화면 섹션 528 / 여유 272, 교체 대상 `<pre>` 346 → 새 그림 예산 약 618px. primer 13번 화면 섹션 663 / 여유 **137**, 표 385 → 표 제거 시 예산 522px. demo 6번 화면 여유 343. 부수 위험: primer 11번 여유 **10.3**, primer 14번 **10.6**, demo 4번 **35** — 공용 CSS에 여백·글자 크기 규칙을 전역 추가하면 이 세 장이 먼저 터진다.
- rise 충돌 실측: `class="rise" style="--i:1; transform:translate(300px,120px)"` → t=0/120ms `matrix(1,0,0,1,0,18)`, t=400ms `matrix(1,0,0,1,0,8.57)`, t=900ms에야 `matrix(1,0,0,1,300,120)`. 화면 x는 26→26→26→**314**로 튄다. CSS 애니메이션이 인라인 선언을 이기고 `to{transform:none}`이 배치값을 지운다. 검사 1~7 어느 것도 못 잡는다. 검사 2의 `[style*="--i"]`(`check-render.js:120`)는 부분 문자열 일치라 `--idx`/`--in`/`--i-color`도 걸린다.
- 검사 4·7은 `document.querySelectorAll('[style*="--i"]')`로 문서 전체를 훑지만 rise는 `section.present:not(.stack)` 아래에서만 걸리므로 실효 대상은 마지막 슬라이드뿐. demo 마지막 장 최대 지연 0.65s 대 대기 0.8s → 여유 150ms. `slow-one` 장이 present인 채 ESC를 누르면 즉시 "안 보이는 항목 1개" 재현됨. `galaxy.css:118-121` 경고대로 도식 기본 규칙에 `opacity:0`을 두면 검사 4·7이 동시 실패.
- 움직임 줄이기 공용 규칙 실측: 직계 자식은 `transitionDuration:0s`/`animationName:none`, **손자·증손자는 0.3s/riseIn 그대로 살아 있음**. 단 `galaxy-reveal.css:213`의 `.reveal .rise { animation:none !important }`가 깊이와 무관하게 등장 효과를 차단하므로, 사각지대는 `rise` 이름을 쓰지 않는 새 움직임에 한정된다. 저장소 다섯 대응의 일관된 원칙은 "장식은 끄고 내용·기능은 남긴다".
- 인쇄 실측: `?print-pdf`에서 `print-color-adjust: exact`가 깊이 1·2 모두에 **상속**되므로 새 컨테이너는 등록 없이도 배경이 찍힌다. 위험 방향이 반대 — 별과 성운은 인쇄에서 끄는데 도식의 점 격자·그라디언트는 상속된 `exact` 때문에 종이에 그대로 찍힌다. 덱 전용 오버라이드는 실제로 먹는다. 인쇄 쪽수 37 확인.
- 밝은 모드 실측: 글자 6종 × 배경 4종 전 조합 대비 최저 6.69, 최고 17.01 — 팔레트만 쓰면 검사 5 전부 통과. 위험은 `--g-bg-2` 하나뿐이고 `demo/index.html:105`가 지금 도식을 `.figure`에 담고 있다. `effBg`는 `backgroundColor`만 읽고 `background-image`는 안 읽으므로(`check-render.js:73-82`) 점 격자가 대비를 깎아도 검사는 통과한다.
- 배율 실측: `.slides`가 `matrix(scale,0,0,scale,-640,-400)`. 1280x800 → 0.96, 1920x1080 → **1.296**, 1024x640 → 0.768. clientX 델타를 그대로 쓰면 1080p 프로젝터에서 손가락 이동량의 77%만 움직인다. CI는 1280x800 하나만 보므로 절대 못 잡는다. 폭 430px에서 스크롤 뷰 전환과 `.slides` transform `none` 확인.
- 과거 실패 이력 5건: ① `.figure` 1.04:1 사고, 보고서가 "텍스트를 넣는 다음 덱에서 재발할 수 있다"고 명시적으로 예고(`2026-07-27-primer-inventory-deck-report.md:131`) — 이번이 그 덱이다. ② 공용 reduced-motion 규칙이 절반만 덮는다. ③ "CSS만 바꾸는 변경은 CI가 전혀 검증 못 한다 — 개요 백지·reduced-motion 절반 동결·인쇄 공백 세 실패 모드가 전부 CSS 문제이고 어느 것도 CI에 안 걸린다". ④ fragment 위에 `.rise`를 얹으면 `visibility:hidden` 때문에 안 나타나고 검사 7이 거짓 실패 7건. ⑤ 높이 넘침 실사고 2회 + "검사 자체가 틀렸던" 2건 — 검사 실패 메시지를 무조건 진실로 받지 말 것.

### domain

- React Flow 실제 배포본 수치: `.react-flow__node-default { padding:10px; width:150px; font-size:12px }`, `--xy-node-border-radius-default: 3px`, 테두리 `1px solid #1a192b`, 배경 `#fff`. 기본 상태 그림자 **없음**, hover `0 1px 4px 1px rgba(0,0,0,0.08)`, selected는 `box-shadow: 0 0 0 0.5px #1a192b`(크기 변화 없는 링). 핸들 `6px` 원.
- Background 기본: variant `Dots`, `gap=20`, `defaultSize.Dots=1` → 점 지름 1px(반지름 0.5px), 색 `#91919a`. gap과 size 모두 줌 배율에 비례 스케일.
- 엣지: 기본 `Bezier`. `getSmoothStepPath` 기본 `borderRadius=5`, `offset=20`. `borderRadius:0`이면 step과 동일. 화살촉 기본 `width/height=12.5`, `markerUnits="strokeWidth"`, `orient="auto-start-reverse"`, ArrowClosed polyline `-5,-4 0,0 -5,4 -5,-4`. 선 두께 기본 1, 색 `#b1b1b7`, 선택 시 `#555`.
- Controls: `26px` 정사각, `border-bottom:1px solid #eee`, 배경 `#fefefe`, hover `#f4f4f4`. 컨테이너 `flex-direction:column`, `box-shadow:0 0 2px 1px rgba(0,0,0,0.08)`. 기본 위치 `bottom-left`, 순서 확대 → 축소 → 맞춤 → 잠금 고정. 각 버튼에 `aria-label`+`title`.
- pan/zoom 기본값: `minZoom=0.5`, `maxZoom=2`, `zoomOnScroll=true`, `panOnScroll=false`, `zoomOnPinch=true`, `zoomOnDoubleClick=true`, `panOnDrag=true`, `preventScrolling=true`. d3-zoom은 wheel 시 커서 위치를 고정점으로 확대, `wheelDelta = -deltaY*0.002`로 `2^Δ` 배.
- 접근성: W3C WAI-ARIA Graphics Module 1.0이 `graphics-document`/`graphics-object`/`graphics-symbol` 세 롤을 정의하고 장식은 `role="none"`. React Flow 실제 구현은 더 보수적으로 노드 기본 `role="group"`, Tab 포커스 이동, Enter/Space 선택, Escape 해제, 방향키 이동, `autoPanOnNodeFocus`.
- WCAG 2.2 SC 2.5.7(레벨 AA): 드래그로 동작하는 모든 기능은 드래그 없이 단일 포인터로도 조작 가능해야 한다. 다만 드래그가 본질적인 경우는 예외다. W3C 대표 예시가 "지도는 드래그로 패닝하되 방향 버튼도 함께 제공한다".
- WCAG 2.3.3 Understanding 문서: "뷰포트로 새 콘텐츠를 옮기는 것은 스크롤의 본질이다. 사용자가 그 이동을 제어하므로 허용된다". MDN은 `prefers-reduced-motion: reduce`를 "**불필요한** 움직임 최소화"로 정의하고 제거가 아니라 대체를 예시로 든다. 다만 "큰 객체의 확대나 패닝은 전정기관 유발 요인이 될 수 있다"고 경고.
- 발표 도식 통념: 한 번에 다 보여주지 말고 점진적으로 드러내라, 슬라이드용 도식은 글자를 최소화하고 글자 많은 버전은 배포용 문서로 따로 만들라("도식이 혼자서 완전히 이해될 필요는 없다. 그러라고 발표자가 있는 것이다"), 상호작용 요소는 과하면 발표자의 집중을 흩뜨린다. 확대는 Q&A 대응용 보조 장치이지 기본 가독성의 해결책이 아니다.
- 유전체 구간 트랙: UCSC는 dense/squish/pack/full 4단계를 제공하고 **pack을 권장 기본**으로 명시. 시각 문법은 두꺼운 블록=코딩, 얇은 블록=UTR, 연결선=갭, 연결선 위 화살촉=방향. 좌표 눈금은 별도 트랙이 담당하며 UCSC와 IGV 모두 눈금을 막대와 분리한다. IGV는 collapsed/expanded/squished. ARTIC 타일링 앰플리콘은 인접 구간이 의도적으로 겹치고 두 풀을 번갈아 배치하므로 관행적으로 풀별 두 줄 교대 배치.
- MiniMap을 언제 쓰라는 공식 권고는 **확인 실패**. 해소 33번에서 MiniMap 미사용으로 결정했으므로 이 공백은 어떤 결정에도 영향을 주지 않는다.
