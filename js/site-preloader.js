/**
 * Page preloader fade-out (#preload).
 */
(function () {
  "use strict";

  function initPreloader() {
    var preloader = document.getElementById("preload");
    if (!preloader) return;

    var fadeTimer = window.setTimeout(function () {
      preloader.style.opacity = "0";
      preloader.style.pointerEvents = "none";
    }, 400);

    var removeTimer = window.setTimeout(function () {
      preloader.remove();
    }, 1000);

    return function () {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }

  window.initPreloader = initPreloader;
})();
