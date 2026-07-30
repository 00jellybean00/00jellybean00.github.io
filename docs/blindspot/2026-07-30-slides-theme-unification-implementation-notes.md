# 슬라이드 테마 통일 구현 노트

- 시작일: 2026-07-30
- 연관 문서: [2026-07-30-slides-theme-unification-requirements.md](file:///c:/Workspace/00jellybean00.github.io/docs/blindspot/2026-07-30-slides-theme-unification-requirements.md), [2026-07-30-slides-theme-unification-unknowns.md](file:///c:/Workspace/00jellybean00.github.io/docs/blindspot/2026-07-30-slides-theme-unification-unknowns.md), [2026-07-30-slides-theme-unification-explainer.md](file:///c:/Workspace/00jellybean00.github.io/docs/blindspot/2026-07-30-slides-theme-unification-explainer.md)

<!-- 결정 시점마다 아래 형식으로 append. 사후 재구성 금지. -->

## 2026-07-30 13:17 — 배경 이미지 확보 방식 변경

- 결정: 엡사이 웹사이트에서 실제 이미지 파일을 긁어오는 대신 CSS 방사형 그래디언트(radial-gradient)를 활용해 엡사이 투자자 사이트 특유의 어두운 보라/파란색 테마 배경을 코드로 모사합니다.
- 이유: 엡사이 웹사이트가 봇 접근을 차단하거나 네트워크 연결 지연으로 인해 스크립트 기반의 이미지 다운로드가 지속적으로 실패함(사용자 확인 완료).
- 검토한 대안: 임의의 외부 플레이스홀더 이미지(unsplash 등) 사용
- 보수적 선택 여부: 예 (외부 이미지 의존성을 없애 파일 유실 가능성이나 외부 링크 차단 위험을 차단함)
- 계획과의 이탈: 없음 (투자자 사이트를 '참고'하여 디자인한다는 목적에 부합함)
- 사용자 확인 필요: 아니오
