/**
 * Jan portfolio scroll & GSAP animations.
 */
(function () {
  "use strict";

  var pluginsRegistered = false;

  function initJanSiteAnimations() {
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    var ScrollToPlugin = window.ScrollToPlugin;
    var SplitText = window.createSplitTextAdapter(window.SplitType);

    if (!pluginsRegistered) {
      gsap.registerPlugin(ScrollTrigger, SplitText, ScrollToPlugin);
      pluginsRegistered = true;
    }

    var cleanups = [];
    var scrollTriggerInstances = [];
    var splitTextInstances = [];

    // --- Split text reveals (.split-text) ---
    document.querySelectorAll(".split-text").forEach(function (element) {
      var target = element.querySelector("p, a") || element;
      var split = new SplitText(target, {
        type: "words,chars",
        linesClass: "split-line",
      });
      splitTextInstances.push(split);

      var animatedTargets = split.chars;
      gsap.set(target, { opacity: 1, perspective: 400 });

      var tweenVars = {
        scrollTrigger: {
          trigger: target,
          start: "top 86%",
          toggleActions: "play none none none",
        },
        duration: 0.9,
        stagger: 0.02,
        ease: "power3.out",
      };

      if (element.classList.contains("effect-fade")) {
        tweenVars.opacity = 0;
      }

      if (
        element.classList.contains("split-lines-transform") ||
        element.classList.contains("split-lines-rotation-x")
      ) {
        split.revert();
        var lineSplit = new SplitText(target, {
          type: "lines",
          linesClass: "split-line",
        });
        splitTextInstances.push(lineSplit);
        animatedTargets = lineSplit.lines;
        tweenVars.opacity = 0;
        tweenVars.stagger = 0.5;

        if (element.classList.contains("split-lines-rotation-x")) {
          tweenVars.rotationX = -120;
          tweenVars.transformOrigin = "top center -50";
        } else {
          tweenVars.yPercent = 100;
          tweenVars.autoAlpha = 0;
        }
      }

      if (element.classList.contains("effect-blur-fade")) {
        split.revert();
        var blurSplit = new SplitText(target, {
          type: "lines",
          linesClass: "split-line",
        });
        splitTextInstances.push(blurSplit);
        gsap.fromTo(
          blurSplit.lines,
          { opacity: 0, filter: "blur(10px)", y: 20 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: target,
              start: "top 86%",
              toggleActions: "play none none none",
            },
          }
        );
      } else {
        gsap.from(animatedTargets, tweenVars);
      }
    });

    // --- Scrolling parallax-style effects (.scrolling-effect) ---
    document.querySelectorAll(".scrolling-effect").forEach(function (element) {
      var delay = parseFloat(element.dataset.delay || "0");
      var vars = {
        scrollTrigger: {
          trigger: element,
          scrub: 3,
          toggleActions: "play none none none",
          start: "30px bottom",
          end: "bottom bottom",
          once: true,
        },
        duration: 0.8,
        ease: "power3.out",
        delay: delay,
      };

      if (element.classList.contains("effectRight")) {
        vars.opacity = 0;
        vars.x = 80;
      }
      if (element.classList.contains("effectLeft")) {
        vars.opacity = 0;
        vars.x = -80;
      }
      if (element.classList.contains("effectBottom")) {
        vars.opacity = 0;
        vars.y = 100;
      }
      if (element.classList.contains("effectTop")) {
        vars.opacity = 0;
        vars.y = -80;
      }
      if (element.classList.contains("effectZoomIn")) {
        vars.opacity = 0;
        vars.scale = 0.4;
      }

      gsap.from(element, vars);
    });

    // --- Fade-in on scroll (.effectFade) ---
    document.querySelectorAll(".effectFade").forEach(function (element) {
      var fromVars = { autoAlpha: 0 };
      var toVars = { autoAlpha: 1, duration: 1, ease: "power3.out" };
      var overflowWrapper = null;
      var triggerStart = "top 96%";

      toVars.delay = element.dataset.delay
        ? parseFloat(element.dataset.delay)
        : 0;

      if (
        element.classList.contains("fadeUp") &&
        !element.classList.contains("no-div")
      ) {
        overflowWrapper = document.createElement("div");
        overflowWrapper.classList.add("overflow-hidden");
        element.parentNode && element.parentNode.insertBefore(overflowWrapper, element);
        overflowWrapper.appendChild(element);
      }

      if (element.classList.contains("no-div")) {
        overflowWrapper = null;
      }

      if (element.classList.contains("fadeUp")) {
        fromVars.y = 50;
        toVars.y = 0;
      } else if (element.classList.contains("fadeDown")) {
        fromVars.y = -50;
        toVars.y = 0;
      } else if (element.classList.contains("fadeLeft")) {
        fromVars.x = -50;
        toVars.x = 0;
      } else if (element.classList.contains("fadeRight")) {
        fromVars.x = 50;
        toVars.x = 0;
      } else if (element.classList.contains("fadeRotateX")) {
        fromVars.rotationX = 45;
        fromVars.yPercent = 100;
        fromVars.transformOrigin = "top center -50";
        toVars.rotationX = 0;
        toVars.yPercent = 0;
        toVars.transformOrigin = "top center -50";
        if (overflowWrapper) {
          overflowWrapper.style.perspective = "400px";
        }
      } else if (element.classList.contains("fadeZoom")) {
        fromVars.scale = 0.8;
        toVars.scale = 1;
      }

      if (element.classList.contains("view-visible")) {
        triggerStart = "top 101%";
      }

      gsap.set(element, fromVars);
      gsap.to(element, {
        ...toVars,
        scrollTrigger: {
          trigger: element,
          start: triggerStart,
          toggleActions: "play none none none",
        },
      });
    });

    // --- Timeline progress line (.scroll-down) ---
    if (document.querySelector(".scroll-down")) {
      gsap.set(".prg-line", { height: "0%" });
      gsap.to(".prg-line", {
        height: "100%",
        duration: 2,
        ease: "none",
        scrollTrigger: {
          trigger: ".scroll-down",
          start: "top 40%",
          end: "bottom 30%",
          scrub: true,
        },
      });

      document.querySelectorAll(".timeline-item").forEach(function (item) {
        var st = ScrollTrigger.create({
          trigger: item,
          start: "top 30%",
          onEnter: function () {
            item.classList.add("active");
          },
          onLeaveBack: function () {
            item.classList.remove("active");
          },
        });
        scrollTriggerInstances.push(st);
      });
    }

    // --- Skill / stat progress bars (.progress-line) ---
    gsap.utils.toArray(".progress-line").forEach(function (bar) {
      var targetWidth = bar.dataset.progress;
      gsap.fromTo(
        bar,
        { width: "15%" },
        {
          width: targetWidth + "%",
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bar,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // --- Sticky sidebar + section highlights ---
    var anchorClickLock = false;
    var anchorClickTimer = null;
    var sidebarUser = document.querySelector(".sidebar-user");
    var stickyItems = document.querySelectorAll(".sticky-item");

    if (sidebarUser && stickyItems.length) {
      var firstSticky = stickyItems[0];
      var lastSticky = stickyItems[stickyItems.length - 1];

      var sidebarSt = ScrollTrigger.create({
        trigger: firstSticky,
        start: "top 132px",
        endTrigger: lastSticky,
        end: "bottom 68px",
        onEnter: function () {
          if (!anchorClickLock) sidebarUser.classList.add("active");
        },
        onLeave: function () {
          if (!anchorClickLock) sidebarUser.classList.remove("active");
        },
        onEnterBack: function () {
          if (!anchorClickLock) sidebarUser.classList.add("active");
        },
        onLeaveBack: function () {
          if (!anchorClickLock) sidebarUser.classList.remove("active");
        },
        invalidateOnRefresh: true,
      });
      scrollTriggerInstances.push(sidebarSt);

      stickyItems.forEach(function (item) {
        var wrap = item.querySelector(".wrap");
        if (!wrap) return;

        var itemSt = ScrollTrigger.create({
          trigger: item,
          start: "top 132px",
          end: "bottom 68px",
          onEnter: function () {
            if (anchorClickLock) return;
            document.querySelectorAll(".sticky-item .wrap").forEach(function (el) {
              el.classList.remove("active");
            });
            wrap.classList.add("active");
          },
          onEnterBack: function () {
            if (anchorClickLock) return;
            document.querySelectorAll(".sticky-item .wrap").forEach(function (el) {
              el.classList.remove("active");
            });
            wrap.classList.add("active");
          },
          onLeave: function () {
            if (!anchorClickLock) wrap.classList.remove("active");
          },
          onLeaveBack: function () {
            if (!anchorClickLock) wrap.classList.remove("active");
          },
          invalidateOnRefresh: true,
        });
        scrollTriggerInstances.push(itemSt);
      });

      var lockStickyDuringAnchorScroll = function () {
        anchorClickLock = true;
        if (anchorClickTimer) clearTimeout(anchorClickTimer);
        anchorClickTimer = setTimeout(function () {
          anchorClickLock = false;
        }, 800);
      };

      var anchorLinks = document.querySelectorAll('a[href^="#"]');
      anchorLinks.forEach(function (link) {
        link.addEventListener("click", lockStickyDuringAnchorScroll);
      });
      cleanups.push(function () {
        anchorLinks.forEach(function (link) {
          link.removeEventListener("click", lockStickyDuringAnchorScroll);
        });
      });
    }

    // --- Hero flip-card stack (.gsap-anime-2 / .flip-image) ---
    if (document.querySelector(".gsap-anime-2")) {
      var flipImages = document.querySelectorAll(".flip-image");
      var glowPulseTweens = [];

      var stopGlowPulse = function () {
        glowPulseTweens.forEach(function (tween) {
          tween.kill();
        });
        glowPulseTweens = [];
        gsap.killTweensOf(".flip-glow");
      };

      var startGlowPulse = function () {
        stopGlowPulse();
        document.querySelectorAll(".flip-image:nth-child(-n+5) .flip-glow").forEach(function (glow, index) {
          gsap.set(glow, { transform: "translateZ(1px)" });
          glowPulseTweens.push(
            gsap.to(glow, {
              opacity: 0.55,
              duration: 1.4 + index * 0.12,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            })
          );
        });
      };

      var boostCardGlow = function (card) {
        var glow = card.querySelector(".flip-glow");
        if (!glow) return;
        gsap.killTweensOf(glow);
        gsap.set(glow, { transform: "translateZ(1px) scale(1.1)" });
        gsap.to(glow, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      var settleCardGlow = function (card) {
        var glow = card.querySelector(".flip-glow");
        if (!glow || card.classList.contains("is-picked")) return;
        if (!card.matches(".flip-image:nth-child(-n+5)")) return;

        gsap.killTweensOf(glow);
        gsap.set(glow, { transform: "translateZ(1px)" });
        gsap.to(glow, {
          opacity: 0.65,
          duration: 0.35,
          ease: "power2.out",
          onComplete: function () {
            glowPulseTweens.push(
              gsap.to(glow, {
                opacity: 0.45,
                duration: 1.4,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
              })
            );
          },
        });
      };

      window.flipCardGlow = {
        pause: stopGlowPulse,
        resume: startGlowPulse,
        boost: boostCardGlow,
        settle: settleCardGlow,
      };

      var layoutFlipCards = function () {
        if (!flipImages.length) return;

        stopGlowPulse();
        gsap.killTweensOf(".flip-image");
        gsap.killTweensOf(".flip-glow");

        var isMobile = window.innerWidth < 575;
        var container = flipImages[0].parentElement;
        if (!container) return;

        var centerX = container.clientWidth / 2 - 75;
        var centerY = container.clientHeight / 2 - 75;
        var glowEls = document.querySelectorAll(".flip-image:nth-child(-n+5) .flip-glow");

        flipImages.forEach(function (card, index) {
          card.style.position = "absolute";
          card.style.zIndex = String(index + 1);
          card.style.transformStyle = "preserve-3d";
        });

        gsap.set(glowEls, { opacity: 0.35, transform: "translateZ(1px)" });

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: ".gsap-anime-2",
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
            onComplete: startGlowPulse,
            onReverseComplete: stopGlowPulse,
          })
          .to(flipImages, {
            x: centerX,
            y: centerY,
            opacity: 1,
            duration: 1,
            stagger: 0.1,
          })
          .to(
            glowEls,
            {
              opacity: 0.65,
              duration: 0.9,
              stagger: 0.08,
              ease: "power2.out",
            },
            "-=0.55"
          )
          .to(flipImages, {
            x: function (index) {
              if (index === 0) return centerX - (isMobile ? 150 : 225);
              if (index === 1) return centerX - (isMobile ? 90 : 135);
              if (index === 2) return centerX - (isMobile ? 30 : 45);
              if (index === 3) return centerX + (isMobile ? 30 : 45);
              if (index === 4) return centerX + (isMobile ? 90 : 135);
              if (index === 5) return centerX + (isMobile ? 150 : 225);
              return centerX;
            },
            y: function (index) {
              if (index === 0) return centerY - 150;
              if (index === 1) return centerY - 90;
              if (index === 2) return centerY - 30;
              if (index === 3) return centerY + 30;
              if (index === 4) return centerY + 90;
              if (index === 5) return centerY + 150;
              return centerY;
            },
            rotation: -10,
            rotateX: 4,
            rotateY: 10,
            duration: 1,
            ease: "power2.out",
          }, "-=0.35");
      };

      layoutFlipCards();

      var onFlipResize = function () {
        layoutFlipCards();
      };
      window.addEventListener("resize", onFlipResize);
      cleanups.push(function () {
        stopGlowPulse();
        window.removeEventListener("resize", onFlipResize);
      });
    }

    // --- Scribble path draw-on (.scribble-wrap) ---
    if (document.querySelector(".scribble-wrap")) {
      var scribblePath = document.getElementById("scribblePath");
      var scribbleEl = document.querySelector(".scribble");

      if (scribblePath && scribbleEl) {
        var pathLength = scribblePath.getTotalLength();
        scribbleEl.style.setProperty("--len", String(pathLength));

        var scribbleObserver = new IntersectionObserver(
          function (entries) {
            if (entries[0].isIntersecting) {
              scribbleEl.classList.add("is-drawn");
              scribbleObserver.disconnect();
            }
          },
          { threshold: 0.2 }
        );
        scribbleObserver.observe(scribbleEl);
        cleanups.push(function () {
          scribbleObserver.disconnect();
        });
      }
    }

    // --- Animated counters (.counter, requires body.counter-scroll) ---
    var counters = document.querySelectorAll(".counter");
    if (document.body.classList.contains("counter-scroll") && counters.length) {
      var countedElements = new WeakSet();

      counters.forEach(function (counterEl) {
        var counterSt = ScrollTrigger.create({
          trigger: counterEl,
          start: "top 95%",
          once: true,
          onEnter: function () {
            if (countedElements.has(counterEl)) return;
            countedElements.add(counterEl);

            counterEl.querySelectorAll(".number").forEach(function (numberEl) {
              var targetValue = parseFloat(numberEl.dataset.to || "0");
              var speedMs = parseFloat(numberEl.dataset.speed || "1000");
              var state = { v: 0 };

              gsap.to(state, {
                v: targetValue,
                duration: speedMs / 1000,
                ease: "power1.out",
                onUpdate: function () {
                  numberEl.textContent = String(Math.round(state.v));
                },
              });
            });
          },
        });
        scrollTriggerInstances.push(counterSt);
      });
    }

    // --- Circular rotating label (.text-rotate) ---
    document.querySelectorAll(".text-rotate .text").forEach(function (textEl) {
      var chars = "award winning agency - since 2022 -".split("");
      var step = 360 / chars.length;
      textEl.innerHTML = "";
      chars.forEach(function (char, index) {
        var span = document.createElement("span");
        span.textContent = char;
        span.style.transform = "rotate(" + index * step + "deg)";
        textEl.appendChild(span);
      });
    });

    // --- Intro title word reveal (.intro-title span) ---
    var introSpans = document.querySelectorAll(".intro-title span");
    var revealIntroSpans = function () {
      introSpans.forEach(function (span) {
        if (span.classList.contains("active")) return;
        var rect = span.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
          setTimeout(function () {
            span.classList.add("active");
          }, 300);
        }
      });
    };

    if (introSpans.length) {
      window.addEventListener("scroll", revealIntroSpans);
      revealIntroSpans();
      cleanups.push(function () {
        window.removeEventListener("scroll", revealIntroSpans);
      });
    }

    // --- Award hover section visibility (.wrap-hover-award) ---
    var awardWraps = document.querySelectorAll(".wrap-hover-award");
    var updateAwardWrapVisibility = function () {
      awardWraps.forEach(function (wrap) {
        var rect = wrap.getBoundingClientRect();
        var inView = rect.bottom > 0 && rect.top < window.innerHeight;
        wrap.classList.toggle("active", inView);
      });
    };

    if (awardWraps.length) {
      window.addEventListener("scroll", updateAwardWrapVisibility);
      updateAwardWrapVisibility();
      cleanups.push(function () {
        window.removeEventListener("scroll", updateAwardWrapVisibility);
      });
    }

    // --- Active scroll nav links (.scroll-link) ---
    var scrollLinks = document.querySelectorAll("a.scroll-link");
    var updateScrollLinkActiveState = function () {
      scrollLinks.forEach(function (link) {
        var href = link.getAttribute("href");
        if (!href || href === "#") return;

        var section = document.querySelector(href);
        if (!section) return;

        var rect = section.getBoundingClientRect();
        var scrollTop = window.scrollY;
        var sectionTop = scrollTop + rect.top;

        if (
          scrollTop < sectionTop + section.offsetHeight - 20 &&
          scrollTop >= sectionTop - 20
        ) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    };

    if (scrollLinks.length) {
      document.addEventListener("scroll", updateScrollLinkActiveState);
      updateScrollLinkActiveState();
      cleanups.push(function () {
        document.removeEventListener("scroll", updateScrollLinkActiveState);
      });
    }

    // --- Cursor-following preview images (.hover-cursor-img) ---
    var hoverCursorBindings = [];
    document.querySelectorAll(".hover-cursor-img").forEach(function (trigger) {
      var preview = trigger.querySelector(".hover-image");
      if (!preview) return;

      var onMove = function (event) {
        preview.style.top = event.clientY + 20 + "px";
        preview.style.left = event.clientX + 20 + "px";
      };
      var onEnter = function () {
        preview.style.transform = "scale(1)";
        preview.style.opacity = "1";
      };
      var onLeave = function () {
        preview.style.transform = "scale(0)";
        preview.style.opacity = "0";
      };

      trigger.addEventListener("mousemove", onMove);
      trigger.addEventListener("mouseenter", onEnter);
      trigger.addEventListener("mouseleave", onLeave);
      hoverCursorBindings.push([trigger, onMove, "mousemove"]);
      hoverCursorBindings.push([trigger, onEnter, "mouseenter"]);
      hoverCursorBindings.push([trigger, onLeave, "mouseleave"]);
    });

    cleanups.push(function () {
      hoverCursorBindings.forEach(function (binding) {
        binding[0].removeEventListener(binding[2], binding[1]);
      });
    });

    var refreshTimer = setTimeout(function () {
      ScrollTrigger.refresh();
    }, 100);
    cleanups.push(function () {
      clearTimeout(refreshTimer);
    });

    return function destroySiteAnimations() {
      cleanups.forEach(function (fn) {
        fn();
      });
      scrollTriggerInstances.forEach(function (st) {
        st.kill();
      });
      splitTextInstances.forEach(function (split) {
        split.revert();
      });
      ScrollTrigger.getAll().forEach(function (st) {
        st.kill();
      });
    };
  }

  window.initJanSiteAnimations = initJanSiteAnimations;
})();
