/* 마우스를 따라 움직이는 별 배경.
 * 랜딩 페이지와 발표자료가 같은 파일을 공유한다.
 *
 * 설계 근거: docs/blindspot/2026-07-27-revealjs-galaxy-slides-unknowns.md
 *   해소 5번  깊이별 시차 이동 (가까운 별이 더 많이 밀림)
 *   해소 16번 발표자 뷰(receiver)에서는 아예 켜지 않음 — 3중 실행 방지
 *   해소 17번 인쇄 모드에서는 켜지 않음 — PDF 배경 깨짐 방지
 *   해소 18번 "동작 줄이기"가 켜져 있으면 정지 화면 1회만
 *   해소 19번 별 200개 고정, 창 크기가 바뀌면 목록을 비우고 재생성
 *   해소 20번 최대 밝기 0.5, 마우스 반응 이동폭 최대 30px
 */
(function (root) {
  'use strict';

  var CONFIG = {
    starCount: 200,
    layers: 3,
    maxAlpha: 0.5,   // 별 하나가 낼 수 있는 최대 밝기
    minAlpha: 0.18,
    maxShift: 30,    // 마우스를 화면 끝까지 옮겼을 때 가장 가까운 층이 밀리는 픽셀
    ease: 0.08       // 마우스를 따라가는 부드러움 (1이면 즉시, 0이면 멈춤)
  };

  /* ── 순수 함수 (브라우저 없이도 검증 가능) ───────────────── */

  // 별 목록을 새로 만든다. rand는 테스트에서 갈아끼울 수 있게 주입받는다.
  function makeStars(count, width, height, layers, rand) {
    rand = rand || Math.random;
    var stars = [];
    for (var i = 0; i < count; i++) {
      var depth = i % layers;                       // 0 = 가장 먼 층
      var near = (depth + 1) / layers;              // 0 초과 1 이하
      stars.push({
        x: rand() * width,
        y: rand() * height,
        depth: depth,
        r: 0.5 + near * 1.1,                        // 가까울수록 크게
        alpha: CONFIG.minAlpha + near * (CONFIG.maxAlpha - CONFIG.minAlpha),
        phase: rand() * Math.PI * 2,                // 반짝임 시작 위상
        speed: 0.4 + rand() * 0.8
      });
    }
    return stars;
  }

  // 마우스 위치(-1..1 정규화)를 그 층의 픽셀 이동량으로 바꾼다.
  function parallaxOffset(depth, layers, nx, ny, maxShift) {
    var near = (depth + 1) / layers;
    return { dx: nx * maxShift * near, dy: ny * maxShift * near };
  }

  // 반짝임을 더한 밝기. 어떤 입력에도 maxAlpha를 넘지 않는다.
  function twinkle(baseAlpha, phase, speed, timeSec) {
    var v = baseAlpha * (0.78 + 0.22 * Math.sin(timeSec * speed + phase));
    return Math.max(0, Math.min(CONFIG.maxAlpha, v));
  }

  /* ── 브라우저 구동부 ──────────────────────────────────────── */

  function start(canvas) {
    var params = new URLSearchParams(location.search);

    // 발표자 뷰는 슬라이드를 iframe으로 다시 불러온다. 거기서도 돌면 3중 실행이 된다.
    if (params.has('receiver') || params.has('print-pdf')) {
      canvas.style.display = 'none';
      return null;
    }

    var ctx = canvas.getContext('2d');
    var stars = [];
    var mouse = { tx: 0, ty: 0, x: 0, y: 0 };  // t* = 목표, 나머지는 현재 위치
    var dpr = 1;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var running = false;
    var rafId = null;
    var resizeTimer = null;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);   // 3배 이상은 비용만 늘고 차이가 안 보인다
      var w = window.innerWidth;
      var h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = makeStars(CONFIG.starCount, w, h, CONFIG.layers);  // 비우고 재생성 — 안 하면 누적 증식
      if (!running) draw(0);
    }

    function draw(timeMs) {
      var t = timeMs / 1000;
      var w = window.innerWidth;
      var h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var off = parallaxOffset(s.depth, CONFIG.layers, mouse.x, mouse.y, CONFIG.maxShift);
        ctx.globalAlpha = twinkle(s.alpha, s.phase, s.speed, t);
        ctx.beginPath();
        ctx.arc(s.x + off.dx, s.y + off.dy, s.r, 0, Math.PI * 2);
        ctx.fillStyle = '#e8eaf0';
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function frame(timeMs) {
      // running을 여기서 확인하지 않으면, 멈춘 뒤에도 루프가 스스로를 계속 예약한다.
      // 그러면 "동작 줄이기"를 도중에 켜도 별이 멈추지 않는다.
      if (!running) { rafId = null; return; }
      mouse.x += (mouse.tx - mouse.x) * CONFIG.ease;
      mouse.y += (mouse.ty - mouse.y) * CONFIG.ease;
      draw(timeMs);
      rafId = requestAnimationFrame(frame);
    }

    function onPointer(e) {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
    }

    function stop() {
      running = false;
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
      window.removeEventListener('pointermove', onPointer);
    }

    function applyMotionPreference() {
      if (reduce.matches) {
        stop();
        mouse.x = mouse.y = mouse.tx = mouse.ty = 0;
        draw(0);                       // 정지 화면 한 장만
      } else if (!running) {
        // !running 조건이 없으면 껐다 켤 때마다 루프가 하나씩 늘어난다.
        running = true;
        window.addEventListener('pointermove', onPointer, { passive: true });
        rafId = requestAnimationFrame(frame);
      }
    }

    // 창 크기 조절 중에는 초당 수십 번 불린다. 그때마다 별을 새로 뽑으면 배경이 튄다.
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    }

    resize();
    window.addEventListener('resize', onResize);
    // 사용자가 설정을 도중에 바꿔도 따라간다. addEventListener가 없는 구형은 조용히 건너뛴다.
    if (reduce.addEventListener) reduce.addEventListener('change', applyMotionPreference);
    applyMotionPreference();

    return { resize: resize, stop: stop, config: CONFIG, isRunning: function () { return running; } };
  }

  // 캔버스가 없으면 만들어 붙인다. 페이지마다 <canvas>를 적을 필요가 없다.
  function autoStart() {
    var canvas = document.getElementById('starfield');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'starfield';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(canvas, document.body.firstChild);
    }
    return start(canvas);
  }

  var Starfield = {
    CONFIG: CONFIG,
    makeStars: makeStars,
    parallaxOffset: parallaxOffset,
    twinkle: twinkle,
    start: start,
    autoStart: autoStart
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Starfield;            // node 자체 검사용
  } else {
    root.Starfield = Starfield;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', autoStart);
    } else {
      autoStart();
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
