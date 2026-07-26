/* 별 배경의 순수 계산부 자체 검사.  실행: node assets/starfield.selftest.js
 * unknowns 해소 19·20번의 수치 약속(별 200개, 최대 밝기 0.5, 이동폭 30px)이
 * 깨지면 여기서 바로 실패한다. */
const assert = require('assert');
const S = require('./starfield.js');

// 결정된 수치가 그대로 살아 있는지
assert.strictEqual(S.CONFIG.starCount, 200, '별 개수는 200개로 고정 (해소 19번)');
assert.strictEqual(S.CONFIG.maxAlpha, 0.5, '최대 밝기는 0.5 (해소 20번)');
assert.strictEqual(S.CONFIG.maxShift, 30, '마우스 반응 이동폭은 30px (해소 20번)');

// 별 생성: 개수, 화면 안 배치, 층 분포
const stars = S.makeStars(S.CONFIG.starCount, 1920, 1080, S.CONFIG.layers);
assert.strictEqual(stars.length, 200);
for (const s of stars) {
  assert.ok(s.x >= 0 && s.x <= 1920, '별이 가로 화면 밖에 생기면 안 됨');
  assert.ok(s.y >= 0 && s.y <= 1080, '별이 세로 화면 밖에 생기면 안 됨');
  assert.ok(s.depth >= 0 && s.depth < S.CONFIG.layers, '층 번호가 범위 밖');
  assert.ok(s.alpha <= S.CONFIG.maxAlpha, '기본 밝기가 상한을 넘음');
}
assert.strictEqual(new Set(stars.map((s) => s.depth)).size, S.CONFIG.layers, '모든 층에 별이 있어야 함');

// 시차: 가까운 층이 먼 층보다 더 많이 밀린다
const far = S.parallaxOffset(0, 3, 1, 1, 30);
const near = S.parallaxOffset(2, 3, 1, 1, 30);
assert.ok(near.dx > far.dx, '가까운 층이 더 많이 밀려야 함');
assert.strictEqual(near.dx, 30, '가장 가까운 층은 상한만큼 밀린다');
assert.strictEqual(S.parallaxOffset(2, 3, 0, 0, 30).dx, 0, '마우스가 가운데면 안 밀린다');

// 이동폭은 어떤 마우스 위치·층에서도 상한을 못 넘는다
for (let d = 0; d < 3; d++) {
  for (const n of [-1, -0.5, 0, 0.5, 1]) {
    const o = S.parallaxOffset(d, 3, n, n, 30);
    assert.ok(Math.abs(o.dx) <= 30 && Math.abs(o.dy) <= 30, '이동폭 상한 초과');
  }
}

// 반짝임은 어떤 시각에도 밝기 상한을 못 넘고, 음수가 되지 않는다
for (let t = 0; t < 50; t += 0.1) {
  const a = S.twinkle(S.CONFIG.maxAlpha, 1.234, 1.2, t);
  assert.ok(a >= 0 && a <= S.CONFIG.maxAlpha, `밝기 상한 초과: t=${t} a=${a}`);
}

// ── 애니메이션 루프 수명 ─────────────────────────────────────
// 실제로 났던 버그: 루프가 running을 확인하지 않아 "동작 줄이기"를 도중에 켜도
// 별이 멈추지 않았고, 껐다 켤 때마다 루프가 하나씩 늘어났다.
// 브라우저 없이 재현하려고 최소한의 가짜 환경만 세운다.
{
  let rafQueue = [], nextId = 1, live = new Set();
  const listeners = {};
  let reduceMatches = false;
  const mql = {
    get matches() { return reduceMatches; },
    addEventListener: (_, cb) => { mql._cb = cb; }
  };
  global.window = {
    innerWidth: 1280, innerHeight: 720, devicePixelRatio: 1,
    matchMedia: () => mql,
    addEventListener: (t, cb) => { (listeners[t] = listeners[t] || []).push(cb); },
    removeEventListener: (t, cb) => {
      if (listeners[t]) listeners[t] = listeners[t].filter((f) => f !== cb);
    }
  };
  global.requestAnimationFrame = (cb) => {
    const id = nextId++; live.add(id); rafQueue.push([id, cb]); return id;
  };
  global.cancelAnimationFrame = (id) => { live.delete(id); rafQueue = rafQueue.filter(([i]) => i !== id); };
  global.location = { search: '' };
  const ctx2d = new Proxy({}, { get: () => () => {} });
  const canvas = { style: {}, width: 0, height: 0, getContext: () => ctx2d };

  const inst = S.start(canvas);
  const pump = (n) => {                       // n 프레임 진행
    for (let k = 0; k < n; k++) {
      const q = rafQueue; rafQueue = [];
      q.forEach(([id, cb]) => { if (live.has(id)) { live.delete(id); cb(k * 16); } });
    }
  };

  pump(3);
  assert.ok(inst.isRunning(), '기본 상태에서는 루프가 돌아야 함');
  assert.strictEqual(rafQueue.length, 1, '살아 있는 루프는 정확히 하나여야 함');

  // (1) 도중에 "동작 줄이기"를 켜면 루프가 멈춰야 한다
  reduceMatches = true; mql._cb();
  assert.strictEqual(inst.isRunning(), false, '동작 줄이기를 켜면 멈춤 상태여야 함');
  pump(5);
  assert.strictEqual(rafQueue.length, 0, '멈춘 뒤에는 예약된 프레임이 없어야 함');

  // (2) 이미 켜져 있는데 알림이 또 와도 루프가 늘면 안 된다
  reduceMatches = false; mql._cb(); pump(2);
  mql._cb(); mql._cb();
  pump(2);
  assert.strictEqual(rafQueue.length, 1, '중복 알림에 루프가 늘어나면 안 됨');

  // (3) 껐다 켜기를 반복해도 매번 루프는 하나 이하
  for (let i = 0; i < 3; i++) {
    reduceMatches = true; mql._cb(); pump(2);
    assert.strictEqual(rafQueue.length, 0, `${i + 1}번째 끄기 뒤에도 프레임이 남음`);
    reduceMatches = false; mql._cb(); pump(2);
    assert.strictEqual(rafQueue.length, 1, `${i + 1}번째 켜기 뒤 루프가 하나가 아님`);
  }

  // (4) 멈추기 직전에 브라우저가 이미 큐에 넣어 둔 프레임이 뒤늦게 실행되는 경우.
  //     그 프레임은 아무것도 다시 예약하지 않고 조용히 끝나야 한다.
  reduceMatches = false; mql._cb(); pump(1);
  const stale = rafQueue[0][1];
  reduceMatches = true; mql._cb();
  rafQueue = [];
  stale(999);
  assert.strictEqual(rafQueue.length, 0, '멈춘 뒤 뒤늦게 실행된 프레임이 재예약하면 안 됨');

  delete global.window; delete global.location;
  delete global.requestAnimationFrame; delete global.cancelAnimationFrame;
}

console.log('starfield selftest: PASS');
