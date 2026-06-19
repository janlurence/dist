/**
 * SplitText-compatible adapter using SplitType (open-source alternative to GSAP SplitText).
 */
(function () {
  "use strict";

  function createSplitTextAdapter(SplitType) {
    function SplitText(element, options) {
      options = options || {};
      var typeMap = {
        words: "words",
        chars: "chars",
        lines: "lines",
      };
      var types = (options.type || "chars")
        .split(",")
        .map(function (part) {
          return typeMap[part.trim()] || part.trim();
        })
        .join(", ");

      this._instance = new SplitType(element, {
        types: types,
        lineClass: options.linesClass || "split-line",
      });
      this.chars = this._instance.chars || [];
      this.words = this._instance.words || [];
      this.lines = this._instance.lines || [];
    }

    SplitText.prototype.revert = function () {
      if (this._instance && this._instance.revert) {
        this._instance.revert();
      }
    };

    return SplitText;
  }

  window.createSplitTextAdapter = createSplitTextAdapter;
})();
