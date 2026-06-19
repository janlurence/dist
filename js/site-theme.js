/**
 * Theme boot (runs immediately) + dark/light toggle wiring.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "darkMode";
  var DEFAULT_THEME = "dark";
  var HTML_ATTR = "data-theme";

  function applyTheme(theme) {
    var root = document.documentElement;
    root.setAttribute(HTML_ATTR, theme);
    root.style.colorScheme = theme;

    var body = document.body;
    if (!body) return;
    body.classList.remove("dark-mode", "light-mode");
    body.classList.add(theme === "dark" ? "dark-mode" : "light-mode");
  }

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    } catch (error) {
      return DEFAULT_THEME;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* ignore */
    }
  }

  // Apply html theme before paint (body may not exist yet).
  (function bootTheme() {
    var root = document.documentElement;
    var theme = getStoredTheme();
    root.setAttribute(HTML_ATTR, theme);
    root.style.colorScheme = theme;
  })();

  function initThemeToggle() {
    applyTheme(getStoredTheme());
    document.querySelectorAll(".toggle-switch-mode").forEach(function (button) {
      button.addEventListener("click", function () {
        var nextTheme = getStoredTheme() === "dark" ? "light" : "dark";
        setStoredTheme(nextTheme);
        applyTheme(nextTheme);
        button.classList.toggle("active", nextTheme === "dark");
        document.dispatchEvent(
          new CustomEvent("Jan:themechange", { detail: { theme: nextTheme } })
        );
      });
      button.classList.toggle("active", getStoredTheme() === "dark");
    });
  }

  window.getJanTheme = getStoredTheme;
  window.setJanTheme = function (theme) {
    setStoredTheme(theme);
    applyTheme(theme);
    document.dispatchEvent(
      new CustomEvent("Jan:themechange", { detail: { theme: theme } })
    );
  };
  window.initThemeToggle = initThemeToggle;
})();
