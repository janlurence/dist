/**
 * Static site entry point — initializes all readable modules after DOM is ready.
 */
(function () {
  "use strict";

  function boot() {
    document.body.classList.add("counter-scroll");

    if (window.initThemeToggle) window.initThemeToggle();
    if (window.initSiteSettings) window.initSiteSettings();
    if (window.initPreloader) window.initPreloader();
    if (window.initJanSiteUI) window.initJanSiteUI();
    if (window.initJanSiteAnimations) window.initJanSiteAnimations();
    if (window.initFlipLightbox) window.initFlipLightbox();
    if (window.initSwipers) window.initSwipers();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
