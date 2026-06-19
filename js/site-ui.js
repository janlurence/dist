/**
 * Jan portfolio DOM UI: clock, marquees, rotating text, mobile nav, brand logos.
 */
(function () {
  "use strict";

  var BRAND_LOGOS = [
    { name: "Brand 1", light: "/assets/images/brand/brand-1.svg", dark: "/assets/images/brand/brand-1_dark.svg", width: 132 },
    { name: "Brand 2", light: "/assets/images/brand/brand-2.svg", dark: "/assets/images/brand/brand-2_dark.svg", width: 122 },
    { name: "Brand 3", light: "/assets/images/brand/brand-3.svg", dark: "/assets/images/brand/brand-3_dark.svg", width: 125 },
    { name: "Brand 4", light: "/assets/images/brand/brand-4.svg", dark: "/assets/images/brand/brand-4_dark.svg", width: 112 },
  ];

  function initLocalClock() {
    var tick = function () {
      var now = new Date();
      var time = now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
      var date = now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      document.querySelectorAll(".time-local").forEach(function (block) {
        var dateEl = block.querySelector(".date");
        var clockEl = block.querySelector(".clock");
        if (dateEl) dateEl.textContent = date;
        if (clockEl) clockEl.textContent = time;
      });
    };

    tick();
    var intervalId = window.setInterval(tick, 1000);
    return function () {
      window.clearInterval(intervalId);
    };
  }

  function initInfiniteSlideMarquees() {
    var cleanups = [];

    document.querySelectorAll(".infiniteSlide").forEach(function (track) {
      var direction = track.dataset.style || "left";
      var cloneCount = parseInt(track.dataset.clone || "2", 10);
      var speed = parseFloat(track.dataset.speed || "50");
      var originalChildren = Array.from(track.children);
      if (!originalChildren.length) return;

      track.style.display = "flex";
      track.style.flexWrap = "nowrap";
      track.style.willChange = "transform";

      var originalHtml = track.innerHTML;
      var duplicatedHtml = originalHtml;
      for (var i = 0; i < cloneCount; i++) {
        duplicatedHtml += originalHtml;
      }
      track.innerHTML = duplicatedHtml;

      var loopWidth = track.children[0].offsetWidth * originalChildren.length;
      var offset = 0;
      var paused = false;
      var frameId = 0;
      var lastTime = performance.now();

      var animate = function (timestamp) {
        var delta = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        if (!paused) {
          var step = speed * delta;
          offset += direction === "left" ? -step : step;
          if (offset <= -loopWidth) offset += loopWidth;
          if (offset >= loopWidth) offset -= loopWidth;
          track.style.transform = "translateX(" + offset + "px)";
        }

        frameId = requestAnimationFrame(animate);
      };

      frameId = requestAnimationFrame(animate);

      var pause = function () {
        paused = true;
      };
      var resume = function () {
        paused = false;
      };

      track.addEventListener("mouseenter", pause);
      track.addEventListener("mouseleave", resume);

      cleanups.push(function () {
        cancelAnimationFrame(frameId);
        track.removeEventListener("mouseenter", pause);
        track.removeEventListener("mouseleave", resume);
        track.innerHTML = originalHtml;
        track.style.transform = "";
      });
    });

    return function () {
      cleanups.forEach(function (fn) {
        fn();
      });
    };
  }

  function initRotatingText() {
    var elements = document.querySelectorAll(".animationtext");
    if (!elements.length) return function () {};

    var timeouts = [];
    var widthRestores = [];

    var animateWidth = function (el, targetWidth, durationMs, onComplete) {
      var startTime = performance.now();
      var startWidth = el.getBoundingClientRect().width;

      var step = function (timestamp) {
        var progress = Math.min(1, (timestamp - startTime) / durationMs);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.style.width = startWidth + (targetWidth - startWidth) * eased + "px";
        if (progress < 1) {
          requestAnimationFrame(step);
        } else if (onComplete) {
          onComplete();
        }
      };

      requestAnimationFrame(step);
    };

    var swapVisibleWord = function (current, next) {
      current.classList.remove("is-visible");
      current.classList.add("is-hidden");
      next.classList.remove("is-hidden");
      next.classList.add("is-visible");
    };

    var rotateToNext = function (currentWord) {
      var nextWord = currentWord.nextElementSibling
        ? currentWord.nextElementSibling
        : currentWord.parentElement.firstElementChild;
      var container = currentWord.closest(".animationtext");

      if (container) {
        if (container.classList.contains("clip")) {
          var wrapper = currentWord.closest(".cd-words-wrapper");
          if (!wrapper) return;
          animateWidth(wrapper, 2, 600, function () {
            swapVisibleWord(currentWord, nextWord);
            expandClipWrapper(nextWord);
          });
        } else {
          swapVisibleWord(currentWord, nextWord);
          timeouts.push(setTimeout(function () {
            rotateToNext(nextWord);
          }, 2500));
        }
      }
    };

    var expandClipWrapper = function (word) {
      var container = word.closest(".animationtext");
      if (container && container.classList.contains("clip")) {
        var wrapper = word.closest(".cd-words-wrapper");
        if (!wrapper) return;
        animateWidth(wrapper, word.getBoundingClientRect().width + 10, 600, function () {
          timeouts.push(setTimeout(function () {
            rotateToNext(word);
          }, 1500));
        });
      }
    };

    elements.forEach(function (container) {
      if (container.classList.contains("clip")) {
        var clipWrapper = container.querySelector(".cd-words-wrapper");
        if (clipWrapper) {
          var clipWidth = clipWrapper.getBoundingClientRect().width + 10;
          widthRestores.push({
            el: clipWrapper,
            initialWidth: clipWrapper.style.width,
          });
          clipWrapper.style.width = clipWidth + "px";
        }
      } else {
        var words = container.querySelectorAll(".cd-words-wrapper .item-text");
        var maxWidth = 0;
        words.forEach(function (word) {
          var rect = word.getBoundingClientRect();
          if (rect.width > maxWidth) maxWidth = rect.width;
        });
        var wrapper = container.querySelector(".cd-words-wrapper");
        if (wrapper) {
          widthRestores.push({
            el: wrapper,
            initialWidth: wrapper.style.width,
          });
          wrapper.style.width = maxWidth + "px";
        }
      }

      var visibleWord = container.querySelector(".is-visible");
      if (visibleWord) {
        timeouts.push(setTimeout(function () {
          rotateToNext(visibleWord);
        }, 2500));
      }
    });

    return function () {
      timeouts.forEach(clearTimeout);
      widthRestores.forEach(function (entry) {
        entry.el.style.width = entry.initialWidth;
      });
    };
  }

  function initBrandMarquee() {
    var track = document.querySelector(".infiniteSlide-brand");
    if (!track || track.children.length) return;

    var row = document.createElement("div");
    row.style.display = "flex";
    row.style.gap = "40px";
    row.style.alignItems = "center";

    BRAND_LOGOS.forEach(function (brand) {
      var wrap = document.createElement("div");
      wrap.className = "image-brand";
      var img = document.createElement("img");
      img.className = "image-switch";
      img.alt = brand.name;
      img.width = brand.width;
      img.height = 24;
      img.loading = "lazy";
      img.dataset.light = brand.light;
      img.dataset.dark = brand.dark;
      img.src = brand.light;
      wrap.appendChild(img);
      row.appendChild(wrap);
    });

    track.appendChild(row);
    track.dataset.style = "left";
    track.dataset.speed = "30";
    track.dataset.clone = "9";
    track.classList.add("infiniteSlide");
  }

  function initImageSwitch() {
    function refreshImages() {
      var theme = window.getJanTheme ? window.getJanTheme() : "dark";
      document.querySelectorAll("img.image-switch").forEach(function (img) {
        var light = img.dataset.light;
        var dark = img.dataset.dark;
        img.src = theme === "dark" && dark ? dark : light || img.src;
      });
    }

    refreshImages();
    document.addEventListener("Jan:themechange", refreshImages);
    return function () {
      document.removeEventListener("Jan:themechange", refreshImages);
    };
  }

  function initMobileMenu() {
    var toggle = document.querySelector(".btn-mobile-menu");
    var menu = document.querySelector(".nav-mobile-list");
    var overlay = document.querySelector(".overlay-pop");
    if (!toggle || !menu) return function () {};

    var open = false;
    var setOpen = function (next) {
      open = next;
      toggle.classList.toggle("close", open);
      menu.classList.toggle("open", open);
      if (overlay) overlay.classList.toggle("open", open);
      document.body.classList.toggle("overflow-hidden", open);
    };

    toggle.addEventListener("click", function () {
      setOpen(!open);
    });
    if (overlay) {
      overlay.addEventListener("click", function () {
        setOpen(false);
      });
    }
    menu.querySelectorAll(".scroll-link").forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false);
      });
    });

    return function () {
      setOpen(false);
    };
  }

  function initJanSiteUI() {
    initBrandMarquee();
    var destroyClock = initLocalClock();
    var destroyMarquees = initInfiniteSlideMarquees();
    var destroyRotatingText = initRotatingText();
    var destroyImages = initImageSwitch();
    var destroyMobile = initMobileMenu();

    return function destroySiteUI() {
      destroyClock();
      destroyMarquees();
      destroyRotatingText();
      destroyImages();
      destroyMobile();
    };
  }

  window.initJanSiteUI = initJanSiteUI;
})();
