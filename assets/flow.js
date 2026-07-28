/* 도식(.flow) 밀기·확대.
   설계 근거: docs/blindspot/2026-07-28-react-flow-style-diagrams-explainer.md

   지켜야 할 세 가지.
   1) 끈 거리는 발표 도구 배율로 나눈다. reveal 이 .slides 에 scale(S) 를 걸어 두기 때문이다.
      안 나누면 1920x1080 창(S=1.296)에서 그림이 손가락보다 1.3배 앞질러 간다.
      S 는 껍데기(.flow) 의 화면 폭 / 원래 폭 으로 잰다. 껍데기는 우리 배율의 바깥이라 S 만 나온다.
   2) transform 은 translate 를 먼저, scale 을 나중에 적는다.
      순서를 뒤집으면 옮긴 거리에도 우리 배율이 곱해져 2배 확대에서 밀기가 두 배로 빨라진다.
   3) 리스너는 .reveal 에 붙인다. 발표 폭 435px 이하에서 reveal 이 .slides 를
      innerHTML 왕복으로 다시 만들기 때문에, 안쪽에 붙이면 조용히 사라진다. */
(function (root) {
  'use strict';

  var CONFIG = {
    minScale: 0.5,
    maxScale: 2,
    buttonStep: 1.25,   /* 단추 한 번에 곱하는 배율 */
    wheelStep: 0.0015   /* 휠 1틱(deltaY)당 지수 */
  };

  /* ── 순수 함수 (브라우저 없이도 검증 가능) ───────────────── */

  function clampScale(k) {
    if (!(k > 0)) return 1;
    return Math.min(CONFIG.maxScale, Math.max(CONFIG.minScale, k));
  }

  /* 한 축의 이동량을 경계 안으로 가둔다.
     내용이 칸보다 작거나 같으면 가운데로 붙이고 움직일 여지를 0으로 만든다.
     그래서 기본 배율에서는 끌어도 아무 데도 가지 않는다(설계 결정 10번). */
  function clampPan(x, contentLen, viewLen, k) {
    var scaled = contentLen * k;
    if (!(scaled > viewLen)) return (viewLen - scaled) / 2;
    return Math.min(0, Math.max(viewLen - scaled, x));
  }

  /* 화면의 한 점을 고정한 채 배율만 바꾼다. 그 점 아래 있던 내용이 제자리에 남는다. */
  function zoomAt(state, nextK, px, py) {
    var k1 = clampScale(nextK);
    var k0 = state.k;
    return { x: px - (px - state.x) * (k1 / k0), y: py - (py - state.y) * (k1 / k0), k: k1 };
  }

  function fitState() {
    return { x: 0, y: 0, k: 1 };
  }

  /* 이 상태에서 실제로 밀 수 있는가. 손 모양 화살표를 보일지 판단한다. */
  function isPannable(box, k) {
    return box.contentW * k > box.viewW + 0.5 || box.contentH * k > box.viewH + 0.5;
  }

  /* ── 브라우저 구동부 ─────────────────────────────────────── */

  var search = typeof location !== 'undefined' ? location.search : '';
  var isReceiver = /receiver/i.test(search);
  var isPrintView = /print-pdf/i.test(search);

  function scrollViewOn() {
    var vp = document.querySelector('.reveal-viewport');
    return !!(vp && vp.classList.contains('reveal-scroll'));
  }

  function overviewOn() {
    var r = document.querySelector('.reveal');
    return !!(r && r.classList.contains('overview'));
  }

  /* 조작을 켤 수 있는 상태인가. 설계 결정 19~22번의 네 상황을 여기서 한 번에 판정한다. */
  function interactive() {
    return !isReceiver && !isPrintView && !overviewOn() && !scrollViewOn();
  }

  function measure(flow, canvas) {
    return {
      viewW: flow.clientWidth,
      viewH: flow.clientHeight,
      contentW: canvas.offsetWidth,
      contentH: canvas.offsetHeight
    };
  }

  /* 발표 도구 배율. 껍데기는 우리 transform 바깥이므로 이 비율이 곧 reveal 의 scale 이다. */
  function deckScale(flow) {
    var w = flow.offsetWidth;
    if (!w) return 1;
    return flow.getBoundingClientRect().width / w;
  }

  function apply(view) {
    var box = measure(view.flow, view.canvas);
    view.state.x = clampPan(view.state.x, box.contentW, box.viewW, view.state.k);
    view.state.y = clampPan(view.state.y, box.contentH, box.viewH, view.state.k);
    /* translate 먼저, scale 나중 — 순서를 바꾸면 밀기 속도가 배율만큼 어긋난다 */
    view.canvas.style.transform =
      'translate(' + view.state.x + 'px, ' + view.state.y + 'px) scale(' + view.state.k + ')';
    view.flow.style.backgroundPosition = view.state.x + 'px ' + view.state.y + 'px';
    var on = interactive();
    /* is-live 가 붙은 동안에만 CSS 가 touch-action: none 을 건다.
       항상 걸면 좁은 화면에서 손가락 세로 스크롤이 막힌다. */
    view.flow.classList.toggle('is-live', on);
    view.flow.classList.toggle('is-pannable', on && isPannable(box, view.state.k));
  }

  function reset(view) {
    view.state = fitState();
    apply(view);
  }

  /* 상태를 배열이 아니라 요소 자신에 붙인다.
     발표 폭 435px 이하에서 reveal 이 .slides 를 innerHTML 왕복으로 다시 만드는데,
     그때 요소가 통째로 갈린다. 배열에 참조를 들고 있으면 그 뒤로 도식이 죽는다. */
  function viewOf(el) {
    var canvas = el.querySelector('.flow-canvas');
    if (!canvas) return null;
    if (!el.__flow || el.__flow.canvas !== canvas) {
      el.__flow = { flow: el, canvas: canvas, state: fitState() };
    }
    return el.__flow;
  }

  function eachView(fn) {
    var nodes = document.querySelectorAll('.flow');
    for (var i = 0; i < nodes.length; i++) {
      var v = viewOf(nodes[i]);
      if (v) fn(v);
    }
  }

  function viewAt(target) {
    var el = target && target.closest ? target.closest('.flow') : null;
    return el ? viewOf(el) : null;
  }

  function zoomBy(view, factor, px, py) {
    var box = measure(view.flow, view.canvas);
    if (px === undefined) { px = box.viewW / 2; py = box.viewH / 2; }
    view.state = zoomAt(view.state, view.state.k * factor, px, py);
    apply(view);
  }

  /* ── 이벤트 ──────────────────────────────────────────────── */

  /* 눌린 포인터를 전부 들고 있는다. 하나면 밀기, 둘이면 손가락 확대다. */
  var live = { view: null, points: [], scale: 1, pinch: 0 };

  function findPoint(id) {
    for (var i = 0; i < live.points.length; i++) if (live.points[i].id === id) return live.points[i];
    return null;
  }

  function pinchSpan() {
    var dx = live.points[0].x - live.points[1].x;
    var dy = live.points[0].y - live.points[1].y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function pinchMid() {
    var r = live.view.flow.getBoundingClientRect();
    return {
      x: ((live.points[0].x + live.points[1].x) / 2 - r.left) / live.scale,
      y: ((live.points[0].y + live.points[1].y) / 2 - r.top) / live.scale
    };
  }

  function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest && e.target.closest('.flow-controls')) return;
    var view = viewAt(e.target);
    if (!view || !interactive()) return;
    if (live.view && live.view !== view) return;

    live.view = view;
    live.scale = deckScale(view.flow) || 1;
    live.points.push({ id: e.pointerId, x: e.clientX, y: e.clientY });

    if (live.points.length === 2) {
      live.pinch = pinchSpan();
      view.flow.classList.remove('is-dragging');
    } else if (live.points.length === 1 && isPannable(measure(view.flow, view.canvas), view.state.k)) {
      view.flow.classList.add('is-dragging');
    }
    if (e.target.setPointerCapture && e.pointerId !== undefined) {
      try { e.target.setPointerCapture(e.pointerId); } catch (err) { /* 캡처 실패는 무시 */ }
    }
  }

  function onPointerMove(e) {
    var p = live.view ? findPoint(e.pointerId) : null;
    if (!p) return;
    var dx = e.clientX - p.x;
    var dy = e.clientY - p.y;
    p.x = e.clientX;
    p.y = e.clientY;

    if (live.points.length >= 2) {
      var span = pinchSpan();
      if (live.pinch > 0 && span > 0) {
        var mid = pinchMid();
        live.view.state = zoomAt(live.view.state, live.view.state.k * (span / live.pinch), mid.x, mid.y);
        live.pinch = span;
        apply(live.view);
      }
      return;
    }
    if (!live.view.flow.classList.contains('is-dragging')) return;
    /* 화면 픽셀을 슬라이드 좌표로 되돌린다. 이 나눗셈이 없으면 그림이 손가락을 앞지른다. */
    live.view.state.x += dx / live.scale;
    live.view.state.y += dy / live.scale;
    apply(live.view);
  }

  function onPointerUp(e) {
    if (!live.view) return;
    for (var i = live.points.length - 1; i >= 0; i--) {
      if (live.points[i].id === e.pointerId) live.points.splice(i, 1);
    }
    if (live.points.length < 2) live.pinch = 0;
    if (!live.points.length) {
      live.view.flow.classList.remove('is-dragging');
      live.view = null;
    }
  }

  function onWheel(e) {
    if (!e.ctrlKey) return;              /* 그냥 굴리면 아무 일도 하지 않는다 */
    var view = viewAt(e.target);
    if (!view || !interactive()) return;
    e.preventDefault();                  /* 브라우저 화면 확대를 도식 위에서만 대신 받는다 */
    var rect = view.flow.getBoundingClientRect();
    var s = deckScale(view.flow) || 1;
    zoomBy(view, Math.exp(-e.deltaY * CONFIG.wheelStep),
      (e.clientX - rect.left) / s, (e.clientY - rect.top) / s);
  }

  function onClick(e) {
    var btn = e.target.closest ? e.target.closest('.flow-controls button') : null;
    if (!btn) return;
    var view = viewAt(btn);
    if (!view) return;
    var act = btn.getAttribute('data-act');
    if (act === 'in') zoomBy(view, CONFIG.buttonStep);
    else if (act === 'out') zoomBy(view, 1 / CONFIG.buttonStep);
    else reset(view);
  }

  function resetAll() {
    live.view = null;
    live.points = [];
    live.pinch = 0;
    eachView(function (v) {
      v.flow.classList.remove('is-dragging');
      reset(v);
    });
  }

  /* ── 시작 ────────────────────────────────────────────────── */

  function init() {
    if (!document.querySelector('.flow')) return null;

    var reveal = document.querySelector('.reveal') || document;
    /* 리스너는 .slides 바깥에 붙인다. 좁은 화면에서 안쪽이 통째로 다시 만들어져도 살아남는다. */
    reveal.addEventListener('pointerdown', onPointerDown);
    reveal.addEventListener('pointermove', onPointerMove);
    reveal.addEventListener('pointerup', onPointerUp);
    reveal.addEventListener('pointercancel', onPointerUp);
    reveal.addEventListener('click', onClick);
    /* passive:false 라야 preventDefault 로 브라우저 확대를 막을 수 있다 */
    reveal.addEventListener('wheel', onWheel, { passive: false });

    if (root.Reveal && root.Reveal.on) {
      root.Reveal.on('beforeslidechange', resetAll);
      root.Reveal.on('overviewshown', resetAll);
      root.Reveal.on('overviewhidden', resetAll);
      root.Reveal.on('resize', resetAll);
    }
    /* 살아 있는 화면에서 Ctrl+P 를 누르는 길. reveal 은 이때 아무 신호도 주지 않는다.
       CSS 의 @media print 가 transform 을 지우지만, 상태 자체도 되돌려 두어야
       인쇄를 취소하고 돌아왔을 때 화면과 상태가 어긋나지 않는다. */
    if (root.matchMedia) {
      var mq = root.matchMedia('print');
      if (mq.addEventListener) mq.addEventListener('change', resetAll);
    }
    if (root.addEventListener) root.addEventListener('beforeprint', resetAll);

    resetAll();
    return true;
  }

  var Flow = {
    CONFIG: CONFIG,
    clampScale: clampScale,
    clampPan: clampPan,
    zoomAt: zoomAt,
    fitState: fitState,
    isPannable: isPannable,
    init: init
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Flow;                 // node 자체 검사용
  } else {
    root.Flow = Flow;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
