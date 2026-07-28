/* 도식 밀기·확대의 순수 계산부 자체 검사.  실행: node assets/flow.selftest.js
 * 설계 문서(2026-07-28-react-flow-style-diagrams-explainer.md)의 수치 약속과
 * "기본 배율에서는 밀 수 없다"는 접근성 논거가 깨지면 여기서 바로 실패한다. */
const assert = require('assert');
const F = require('./flow.js');

// ── 결정된 수치가 그대로 살아 있는지 ─────────────────────────
assert.strictEqual(F.CONFIG.minScale, 0.5, '축소 하한은 0.5배 (설계 결정 13번)');
assert.strictEqual(F.CONFIG.maxScale, 2, '확대 상한은 2배 (설계 결정 13번)');

// ── 배율 가두기 ──────────────────────────────────────────────
assert.strictEqual(F.clampScale(1), 1);
assert.strictEqual(F.clampScale(10), 2, '상한을 넘으면 2배로 잘린다');
assert.strictEqual(F.clampScale(0.01), 0.5, '하한을 밑돌면 0.5배로 잘린다');
assert.strictEqual(F.clampScale(0), 1, '0이나 음수는 1배로 되돌린다');
assert.strictEqual(F.clampScale(NaN), 1, '숫자가 아니면 1배로 되돌린다');

// ── 밀기 가두기 ──────────────────────────────────────────────
// 내용이 칸보다 작거나 같으면: 가운데로 붙고, 어떤 값을 넣어도 결과가 같다.
// 이것이 "기본 배율에서는 끌어도 아무 데도 안 간다"의 근거다(설계 결정 10번).
assert.strictEqual(F.clampPan(0, 1000, 1200, 1), 100, '작으면 가운데로 붙는다');
assert.strictEqual(F.clampPan(-999, 1000, 1200, 1), 100, '왼쪽으로 끌어도 가운데 그대로');
assert.strictEqual(F.clampPan(999, 1000, 1200, 1), 100, '오른쪽으로 끌어도 가운데 그대로');
assert.strictEqual(F.clampPan(50, 1200, 1200, 1), 0, '딱 맞으면 0이고 움직일 여지가 없다');

// 내용이 칸보다 크면: [칸 - 내용, 0] 안에서만 움직인다.
assert.strictEqual(F.clampPan(0, 1000, 500, 2), 0, '오른쪽 끝을 넘어 못 간다');
assert.strictEqual(F.clampPan(100, 1000, 500, 2), 0, '양수로 밀어도 0에서 멈춘다');
assert.strictEqual(F.clampPan(-9999, 1000, 500, 2), -1500, '왼쪽 끝에서 멈춘다');
assert.strictEqual(F.clampPan(-700, 1000, 500, 2), -700, '범위 안이면 그대로 둔다');

// ── 밀 수 있는 상태인지 판정 ─────────────────────────────────
const box = { contentW: 1160, contentH: 212, viewW: 1160, viewH: 340 };
assert.strictEqual(F.isPannable(box, 1), false, '기본 배율에서는 밀 수 없다');
assert.strictEqual(F.isPannable(box, 2), true, '2배로 키우면 밀 수 있다');
assert.strictEqual(F.isPannable(box, 0.5), false, '축소하면 더더욱 밀 수 없다');

// ── 커서를 고정한 확대 ───────────────────────────────────────
// 확대해도 커서 아래 있던 내용은 제자리에 남아야 한다.
const before = F.fitState();
const after = F.zoomAt(before, 2, 300, 100);
assert.strictEqual(after.k, 2);
// 커서 아래 내용의 좌표: (px - x) / k. 확대 전후가 같아야 한다.
assert.strictEqual((300 - before.x) / before.k, (300 - after.x) / after.k, '가로 고정점이 어긋남');
assert.strictEqual((100 - before.y) / before.k, (100 - after.y) / after.k, '세로 고정점이 어긋남');

// 상한 너머로 확대해도 고정점은 유지된다.
const capped = F.zoomAt({ x: -50, y: -20, k: 1.8 }, 5, 400, 200);
assert.strictEqual(capped.k, 2, '상한을 넘으면 2배에서 멈춘다');
assert.ok(Math.abs((400 - (-50)) / 1.8 - (400 - capped.x) / capped.k) < 1e-9, '상한에서도 고정점 유지');

// ── 원위치 ───────────────────────────────────────────────────
const fit = F.fitState();
assert.deepStrictEqual(fit, { x: 0, y: 0, k: 1 }, '원위치는 배율 1에 이동 0');

// ── 실제 도식 세 벌의 치수가 기본 배율에서 넘치지 않는지 ─────
// 설계 문서가 못박은 값이다. 넘치면 슬라이드에서 잘린다.
const decks = [
  { name: '견본 흐름도', w: 1160, h: 212, cap: 340 },
  { name: '덮임 그림', w: 1240, h: 266, cap: 450 },
  { name: '파일 구조 도식', w: 980, h: 496, cap: 515 }
];
for (const d of decks) {
  assert.ok(d.w <= 1280, `${d.name}: 가로 ${d.w}가 슬라이드 1280을 넘음`);
  assert.ok(d.h <= d.cap, `${d.name}: 세로 ${d.h}가 상한 ${d.cap}을 넘음`);
  assert.strictEqual(F.isPannable({ contentW: d.w, contentH: d.h, viewW: d.w, viewH: d.cap }, 1),
    false, `${d.name}: 기본 배율에서 밀 수 있으면 안 됨`);
}

console.log('flow.selftest: 통과');
