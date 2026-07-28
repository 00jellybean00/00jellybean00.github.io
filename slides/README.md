# 발표자료

## 구조

```
/index.html              발표자료 목록 (랜딩)
/assets/galaxy.css       공통 색 팔레트 + 배경 두 겹 + 등장 움직임 + 랜딩 스타일
/assets/galaxy-reveal.css  reveal.js 위에 얹는 갤럭시 테마
/assets/starfield.js     마우스를 따라 움직이는 별 배경 (랜딩·발표자료 공용)
/slides/<슬러그>/index.html  발표자료 하나
/slides/vendor/          reveal.js·KaTeX·Chart.js·Mermaid 사본 (인터넷 없이 동작)
```

## 로컬에서 보기

`file://`로 직접 열면 일부 기능이 막힌다. 저장소 최상위에서 서버를 띄운다.

```bash
python3 -m http.server 8000
# http://localhost:8000/            랜딩
# http://localhost:8000/slides/demo/  견본 발표자료
```

## 주소 뒤에 붙이는 표시

| 표시 | 효과 |
|---|---|
| `?light` | 조명이 밝은 강의실용 밝은 화면. 별과 성운을 끈다 |
| `?print-pdf` | PDF 인쇄용 배치. 별을 끄고 단색 배경만 남긴다 |
| `?receiver` | reveal이 발표자 화면에서 자동으로 붙인다. 무거운 그리기를 건너뛴다 |

## 자체 검사

```bash
node assets/starfield.selftest.js   # 별 개수·밝기·이동폭 상한, 애니메이션 루프 수명
node .github/check-links.js         # 배포에서만 깨지는 경로, 문서 공개 차단
node .github/check-render.js        # 브라우저로 실제 그려 확인 (playwright 필요)
```

`check-render.js` 는 파일이 멀쩡한데 화면만 틀린 것을 잡는다 — 버려진 CSS 규칙,
죽은 등장 움직임, 세로 넘침, 대비비 미달, 인쇄 깨짐. 실행 전에 한 번만:

```bash
npm install --no-save playwright@1.62.0 && npx playwright install chromium
```

푸시하면 GitHub Actions가 같은 검사를 자동으로 돌린다(`.github/workflows/check.yml`).

## 발표자료 추가하기

1. `slides/<슬러그>/index.html`을 만든다. `slides/demo/index.html`을 복사해 쓰면 된다.
2. `Reveal.initialize`에 `width: 1280, height: 800`이 있는지 확인한다.
   기준 글자 크기 48은 `galaxy-reveal.css`에 있고 이 크기와 짝이다.
   빠뜨리면 reveal 기본값 700에 48이 얹혀 글자가 14% 커지고 내용이 넘친다.
3. `<body>` 첫머리에 `<div class="sky-glow">`와 `<div class="sky-grid">`를 넣는다.
   배경 두 겹은 CSS만으로는 안 그려진다.
4. `/index.html`의 `.deck-list`에 `<li>`를 하나 추가한다.
   등장 순서 번호(`--i`)를 이어서 매기고, 맨 아래 글의 번호를 한 칸 민다.
5. `.github/check-links.js`의 `PAGES`와 `.github/check-render.js`의 `DECKS`에 한 줄씩 더한다.
   안 더하면 그 발표자료는 아무 검사도 안 받는다.

## 지켜야 할 것

- 폴더 이름을 `_`나 `.`으로 시작하지 않는다. Jekyll이 조용히 지운다.
- 파일을 심볼릭 링크로 두지 않는다. 배포본에서 사라진다.
- 라이브러리는 `slides/vendor/`에 실파일로 복사한다. `node_modules`를 참조하면 배포에서 404가 난다.
- 색과 등장 움직임은 `assets/galaxy*.css`에만 둔다. 발표자료 안에 복사하지 않는다.
  복사하면 색을 바꿀 때마다 여러 곳을 똑같이 고쳐야 하고, 한 곳을 빼먹으면 조용히 어긋난다.
  발표자료 안에 남길 것은 그 발표자료의 내용에만 맞춘 값뿐이다(예: 코드 상자 글자 크기).

배경·애니메이션 수치의 근거는 `docs/blindspot/2026-07-27-revealjs-galaxy-slides-unknowns.md`에 있다.
색과 등장 움직임을 공용으로 옮긴 근거는 `docs/blindspot/2026-07-27-theme-rollout-all-pages-explainer.md`에 있다.
