/**
 * Color variant picker offcanvas + body class presets.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "Jan-color-variant";
  var DEFAULT_BODY_CLASS = "body-default";

  var COLOR_VARIANTS = [
    { label: "Default", mode: "light", className: "type-body-default", bodyClass: "body-default" },
    { label: "Silver Dawn", mode: "light", className: "type-body-v1", bodyClass: "body-v1" },
    { label: "Lavender Stone", mode: "light", className: "type-body-v2", bodyClass: "body-v2" },
    { label: "Ocean Breeze", mode: "light", className: "type-body-v3", bodyClass: "body-v3" },
    { label: "Midnight Fade", mode: "dark", className: "type-dark-v1", bodyClass: "dark-v1" },
    { label: "Charcoal Mist", mode: "dark", className: "type-dark-v2", bodyClass: "dark-v2" },
    { label: "Forest Shadow", mode: "dark", className: "type-dark-v3", bodyClass: "dark-v3" },
  ];

  function applyBodyVariant(bodyClass) {
    var body = document.body;
    body.classList.forEach(function (className) {
      if (
        className === DEFAULT_BODY_CLASS ||
        className.startsWith("body-v") ||
        className.startsWith("dark-v")
      ) {
        body.classList.remove(className);
      }
    });
    if (bodyClass) {
      body.classList.add(bodyClass);
    } else {
      body.classList.add(DEFAULT_BODY_CLASS);
    }
  }

  function setActiveButton(bodyClass) {
    document.querySelectorAll(".settings-color .choose-item").forEach(function (button) {
      var match = COLOR_VARIANTS.find(function (variant) {
        return button.querySelector("." + variant.className);
      });
      button.classList.toggle("active", match && match.bodyClass === bodyClass);
    });
  }

  function openOffcanvas(panel, backdrop) {
    if (backdrop) {
      document.body.appendChild(backdrop);
    }
    if (panel) {
      document.body.appendChild(panel);
    }
    panel.classList.add("show");
    panel.style.visibility = "visible";
    panel.style.transform = "none";
    if (backdrop) backdrop.classList.add("show");
  }

  function closeOffcanvas(panel, backdrop) {
    panel.classList.remove("show");
    panel.style.visibility = "hidden";
    panel.style.transform = "";
    if (backdrop) backdrop.classList.remove("show");
  }

  function initSiteSettings() {
    var panel = document.getElementById("settingColorMenu");
    var openButton = document.querySelector(".btn-setting-color");
    var closeButton = panel && panel.querySelector(".icon-close-popup");
    var backdrop = document.querySelector(".offcanvas-backdrop");

    var savedVariant = null;
    try {
      savedVariant = localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      savedVariant = null;
    }

    if (savedVariant) {
      var saved = COLOR_VARIANTS.find(function (item) {
        return item.bodyClass === savedVariant;
      });
      if (saved) {
        if (window.setJanTheme) window.setJanTheme(saved.mode);
        applyBodyVariant(saved.bodyClass);
        setActiveButton(saved.bodyClass);
      }
    } else {
      applyBodyVariant(null);
    }

    if (openButton && panel) {
      openButton.addEventListener("click", function () {
        if (!backdrop) {
          backdrop = document.createElement("div");
          backdrop.className = "offcanvas-backdrop site-settings-backdrop fade";
          document.body.appendChild(backdrop);
          backdrop.addEventListener("click", function () {
            closeOffcanvas(panel, backdrop);
          });
        }
        openOffcanvas(panel, backdrop);
      });
    }

    if (closeButton && panel) {
      closeButton.addEventListener("click", function () {
        closeOffcanvas(panel, backdrop);
      });
    }

    document.querySelectorAll(".settings-color .choose-item").forEach(function (button) {
      button.addEventListener("click", function () {
        var variant = COLOR_VARIANTS.find(function (item) {
          return button.querySelector("." + item.className);
        });
        if (!variant) return;

        if (window.setJanTheme) window.setJanTheme(variant.mode);
        applyBodyVariant(variant.bodyClass);
        setActiveButton(variant.bodyClass);

        try {
          localStorage.setItem(STORAGE_KEY, variant.bodyClass);
        } catch (error) {
          /* ignore */
        }
      });
    });
  }

  window.initSiteSettings = initSiteSettings;
})();
