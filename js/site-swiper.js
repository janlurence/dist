/**
 * Swiper carousels: awards (mobile), testimonial image + quote sync.
 */
(function () {
  "use strict";

  function initSwipers() {
    if (typeof Swiper === "undefined") return;

    var mainImageEl = document.querySelector(".sw-main-image");
    var testimonialEl = document.querySelector(".swiper-testimonial");
    var mainSwiper = null;
    var testimonialSwiper = null;

    if (mainImageEl) {
      mainSwiper = new Swiper(".sw-main-image", {
        slidesPerView: 1,
        spaceBetween: 10,
        centeredSlides: true,
        watchSlidesProgress: true,
      });
    }

    if (testimonialEl) {
      testimonialSwiper = new Swiper(".swiper-testimonial", {
        slidesPerView: 1,
        navigation: {
          nextEl: ".sw-nav-next",
          prevEl: ".sw-nav-prev",
        },
        pagination: {
          el: ".number-pagination",
          type: "fraction",
        },
        controller: mainSwiper ? { control: mainSwiper } : undefined,
      });
    }

    if (mainSwiper && testimonialSwiper) {
      mainSwiper.controller.control = testimonialSwiper;
    }

    if (document.querySelector(".swiper-award")) {
      new Swiper(".swiper-award", {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 10,
        speed: 1000,
        pagination: {
          el: ".tf-sw-pagination",
          clickable: true,
        },
      });
    }
  }

  window.initSwipers = initSwipers;
})();
