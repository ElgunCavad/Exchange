/* Açıq / tünd rejim düyməsi. Seçim brauzerdə yadda saxlanılır. */
(() => {
  "use strict";
  const App = window.App;

  App.theme = {
    init() {
      const root = document.documentElement;

      try {
        const saved = localStorage.getItem("theme");
        if (saved) root.dataset.theme = saved;
      } catch (e) { /* saxlanmış seçim yoxdur */ }

      App.$("#theme").addEventListener("click", () => {
        const isDark = root.dataset.theme
          ? root.dataset.theme === "dark"
          : matchMedia("(prefers-color-scheme: dark)").matches;
        const next = isDark ? "light" : "dark";
        root.dataset.theme = next;
        try { localStorage.setItem("theme", next); } catch (e) { /* mühüm deyil */ }
      });
    }
  };
})();
