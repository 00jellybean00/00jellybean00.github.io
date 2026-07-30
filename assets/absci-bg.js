(function() {
  'use strict';
  // 공통 최적화: URL 파라미터 확인 후 상태 클래스 추가 및 변수 노출
  var params = new URLSearchParams(location.search);
  var isReceiver = params.has('receiver');
  var isPrint = params.has('print-pdf');
  
  if (isReceiver) {
    document.documentElement.classList.add('no-anim');
  }
  
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.absciTheme = {
    isReceiver: isReceiver,
    isPrint: isPrint,
    reduceMotion: reduceMotion,
    getCssVar: function(name, fallback) {
      var val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return val || fallback;
    }
  };
})();
