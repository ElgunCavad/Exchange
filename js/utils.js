/* Köməkçi funksiyalar: element seçmək/yaratmaq, ədəd formatı, valyuta adı, API sorğusu. */
(() => {
  "use strict";
  const App = window.App;

  App.$ = (selector) => document.querySelector(selector);

  // el("div", {class: "x", text: "salam"}, [uşaq elementlər]); mətn həmişə textContent ilə yazılır.
  App.el = (tag, props, children) => {
    const node = document.createElement(tag);
    if (props) {
      for (const key in props) {
        if (key === "text") node.textContent = props[key];
        else if (key === "class") node.className = props[key];
        else node.setAttribute(key, props[key]);
      }
    }
    if (children) children.forEach((child) => node.append(child));
    return node;
  };

  const nfBig = new Intl.NumberFormat("az-AZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const nfSmall = new Intl.NumberFormat("az-AZ", { minimumFractionDigits: 2, maximumFractionDigits: 4 });

  // 1000 və yuxarı: 2 rəqəm; daha kiçik: 2 ilə 4 arası rəqəm
  App.fmt = (n) => {
    if (!isFinite(n)) return "—";
    return (Math.abs(n) >= 1000 ? nfBig : nfSmall).format(n);
  };

  let names = null;
  try { names = new Intl.DisplayNames(["az"], { type: "currency" }); } catch (e) { names = null; }

  // EUR -> "Avro". Ad tapılmasa kodun özü qaytarılır.
  App.currencyName = (code) => {
    try {
      const name = names && names.of(code);
      return name && name !== code ? name : code;
    } catch (e) {
      return code;
    }
  };

  // JSON qaytaran fetch: vaxt aşımı və HTTP xətası yoxlanır.
  App.getJSON = async (url) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), App.config.TIMEOUT_MS);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) throw new Error("HTTP " + response.status);
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  };
})();
