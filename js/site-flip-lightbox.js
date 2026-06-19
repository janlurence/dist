/**
 * Flip-card pick-up lightbox — keeps fan layout intact on open/close.
 */
(function () {
  "use strict";

  var activeLightbox = null;
  var glowApi = function () {
    return window.flipCardGlow || null;
  };

  function getTargetSize() {
    var max = Math.min(window.innerWidth * 0.88, window.innerHeight * 0.78, 560);
    return { width: max, height: max };
  }

  function cardCenter(rect) {
    return {
      top: rect.top + rect.height / 2,
      left: rect.left + rect.width / 2,
    };
  }

  function placeFixedCenter(el, rect) {
    var center = cardCenter(rect);
    gsap.set(el, {
      position: "fixed",
      top: center.top,
      left: center.left,
      xPercent: -50,
      yPercent: -50,
      width: rect.width,
      height: rect.height,
      margin: 0,
    });
  }

  function dimOtherCards(selected) {
    document.querySelectorAll(".flip-image-list .flip-image").forEach(function (card) {
      if (card === selected) return;
      card.classList.add("is-dimmed");
      gsap.to(card, { opacity: 0.3, duration: 0.35, ease: "power2.out", overwrite: "auto" });
    });
  }

  function restoreOtherCards() {
    document.querySelectorAll(".flip-image-list .flip-image.is-dimmed").forEach(function (card) {
      card.classList.remove("is-dimmed");
      gsap.to(card, { opacity: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
    });
  }

  function closeLightbox() {
    if (!activeLightbox || activeLightbox.isClosing) return;
    activeLightbox.isClosing = true;

    var lb = activeLightbox;
    var returnRect = lb.sourceCard.getBoundingClientRect();
    var returnCenter = cardCenter(returnRect);

    document.removeEventListener("keydown", lb.onKeyDown);
    if (glowApi()) glowApi().pause();

    gsap.timeline({
      onComplete: function () {
        lb.overlay.remove();
        lb.stage.remove();
        lb.closeBtn.remove();
        document.body.classList.remove("flip-lightbox-open");
        lb.sourceCard.classList.remove("is-picked");

        gsap.to(lb.sourceCard, {
          opacity: 1,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });

        restoreOtherCards();

        if (glowApi()) {
          var api = glowApi();
          api.settle(lb.sourceCard);
          api.resume();
        }

        activeLightbox = null;
      },
    })
      .to(lb.closeBtn, { opacity: 0, scale: 0.5, rotation: 90, duration: 0.2, ease: "power2.in" }, 0)
      .to(lb.halo, { opacity: 0, scale: 0.4, duration: 0.25, ease: "power2.in" }, 0)
      .to(lb.overlay, { opacity: 0, backdropFilter: "blur(0px)", duration: 0.35, ease: "power2.in" }, 0.04)
      .to(
        lb.card,
        {
          top: returnCenter.top,
          left: returnCenter.left,
          width: returnRect.width,
          height: returnRect.height,
          rotation: lb.originRotation,
          rotateX: lb.originRotateX,
          rotateY: lb.originRotateY,
          scale: 1,
          duration: 0.6,
          ease: "power3.inOut",
        },
        0.06
      )
      .to(lb.sourceCard, { opacity: 0.15, duration: 0.15, ease: "power1.in" }, 0.06)
      .to(lb.sourceCard, { opacity: 1, duration: 0.35, ease: "power2.out" }, 0.45);
  }

  function openLightbox(flipCard) {
    if (activeLightbox || typeof gsap === "undefined") return;

    var img = flipCard.querySelector("img");
    if (!img) return;

    var rect = flipCard.getBoundingClientRect();
    var size = getTargetSize();
    var glow = flipCard.querySelector(".flip-glow");

    flipCard.classList.add("is-picked");
    dimOtherCards(flipCard);
    if (glowApi()) glowApi().pause();

    if (glow) {
      gsap.killTweensOf(glow);
      gsap.set(glow, { transform: "translateZ(1px) scale(1.15)" });
      gsap.to(glow, { opacity: 1, duration: 0.3, ease: "power2.out" });
    }

    gsap.to(flipCard, {
      opacity: 0.12,
      duration: 0.28,
      ease: "power2.out",
      overwrite: "auto",
    });

    var overlay = document.createElement("div");
    overlay.className = "flip-lightbox-overlay";

    var stage = document.createElement("div");
    stage.className = "flip-lightbox-stage";

    var halo = document.createElement("div");
    halo.className = "flip-lightbox-halo";

    var card = document.createElement("div");
    card.className = "flip-lightbox-card";
    card.appendChild(img.cloneNode(true));

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "flip-lightbox-close";
    closeBtn.setAttribute("aria-label", "Close image");
    closeBtn.innerHTML = "&times;";

    stage.appendChild(halo);
    stage.appendChild(card);
    document.body.appendChild(overlay);
    document.body.appendChild(stage);
    document.body.appendChild(closeBtn);
    document.body.classList.add("flip-lightbox-open");

    placeFixedCenter(card, rect);
    gsap.set(card, {
      rotation: gsap.getProperty(flipCard, "rotation") || 0,
      rotateX: gsap.getProperty(flipCard, "rotateX") || 0,
      rotateY: gsap.getProperty(flipCard, "rotateY") || 0,
      scale: 0.92,
    });
    gsap.set(overlay, { opacity: 0, backdropFilter: "blur(0px)" });
    gsap.set(halo, { opacity: 0, scale: 0.3 });
    gsap.set(closeBtn, { opacity: 0, scale: 0.5, rotation: -90 });

    activeLightbox = {
      overlay: overlay,
      stage: stage,
      halo: halo,
      card: card,
      closeBtn: closeBtn,
      sourceCard: flipCard,
      originRotation: gsap.getProperty(flipCard, "rotation") || 0,
      originRotateX: gsap.getProperty(flipCard, "rotateX") || 0,
      originRotateY: gsap.getProperty(flipCard, "rotateY") || 0,
      isClosing: false,
      onKeyDown: onKeyDown,
    };

    gsap.timeline({ delay: 0.05 })
      .to(overlay, { opacity: 1, backdropFilter: "blur(12px)", duration: 0.4, ease: "power2.out" }, 0)
      .to(halo, { opacity: 1, scale: 2.6, duration: 0.55, ease: "power2.out" }, 0.08)
      .to(
        card,
        {
          top: window.innerHeight / 2,
          left: window.innerWidth / 2,
          width: size.width,
          height: size.height,
          rotation: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.65,
          ease: "power3.out",
        },
        0.04
      )
      .to(closeBtn, { opacity: 1, scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2)" }, 0.3);

    closeBtn.addEventListener("click", closeLightbox);
    overlay.addEventListener("click", closeLightbox);
    card.addEventListener("click", function (event) {
      event.stopPropagation();
    });
    document.addEventListener("keydown", onKeyDown);
  }

  function onKeyDown(event) {
    if (event.key === "Escape") closeLightbox();
  }

  function initFlipLightbox() {
    var flipCards = document.querySelectorAll(".flip-image-list .flip-image");
    if (!flipCards.length) return;

    flipCards.forEach(function (card) {
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");

      card.addEventListener("mouseenter", function () {
        if (activeLightbox || card.classList.contains("is-dimmed")) return;
        if (glowApi()) glowApi().boost(card);
      });

      card.addEventListener("mouseleave", function () {
        if (activeLightbox || card.classList.contains("is-picked")) return;
        if (glowApi()) glowApi().settle(card);
      });

      card.addEventListener("click", function () {
        openLightbox(card);
      });

      card.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(card);
        }
      });
    });
  }

  window.initFlipLightbox = initFlipLightbox;
})();
