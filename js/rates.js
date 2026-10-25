/* Məzənnə bölməsi: API-dən məlumat almaq, kartlar, konvertor, cədvəl. */
(() => {
  "use strict";
  const App = window.App;
  const { $, el, fmt, currencyName, getJSON } = App;
  const { RATES_URL, HOME, FEATURED } = App.config;

  const state = { rates: {}, date: "", updated: 0, selected: HOME };

  const statusBox = $("#rates-status");
  const fromSel = $("#from");
  const toSel = $("#to");
  const amountInput = $("#amount");
  const body = $("#rate-body");

  /* ---------- status zolağı ---------- */
  function setStatus(stateName, text, showRetry) {
    statusBox.dataset.state = stateName;
    $("#rates-status-text").textContent = text;
    $("#rates-retry").hidden = !showRetry;
  }

  function formatUpdated() {
    try {
      return new Date(state.updated * 1000).toLocaleString("az-AZ", {
        dateStyle: "long", timeStyle: "short", timeZone: "Asia/Baku"
      });
    } catch (e) {
      return state.date;
    }
  }

  // 1 vahid valyuta neçə manatdır
  const toHome = (code) => state.rates[HOME] / state.rates[code];

  /* ---------- məlumatı tətbiq etmək ---------- */
  function applyRates(data, offline) {
    state.rates = data.rates;
    state.date = data.date;
    state.updated = data.time_last_updated;

    if (offline) {
      setStatus("offline", "API-yə qoşulmaq olmadı. Ehtiyat məlumat göstərilir (" + formatUpdated() + ").", true);
    } else {
      setStatus("live", "Canlı məlumat. Son yenilənmə: " + formatUpdated() + " (Bakı vaxtı).", false);
    }

    buildSelects();
    renderFeatured();
    renderTable();
    convert();
  }

  async function load() {
    setStatus("loading", "Məzənnələr yüklənir…", false);
    try {
      const data = await getJSON(RATES_URL);
      if (!data || typeof data.rates !== "object" || !data.rates[HOME]) throw new Error("gözlənilməz cavab");
      applyRates(data, false);
    } catch (e) {
      applyRates(App.snapshot, true);
    }
  }

  /* ---------- seçilmiş valyuta kartları ---------- */
  function renderFeatured() {
    const box = $("#featured");
    box.replaceChildren();
    FEATURED.filter((code) => state.rates[code]).forEach((code) => {
      const value = el("div", { class: "v" }, [
        document.createTextNode(fmt(toHome(code))),
        el("small", { text: HOME })
      ]);
      box.append(el("div", { class: "fcard" }, [
        el("div", { class: "k", text: "1 " + code }),
        value,
        el("div", { class: "r", text: "1 " + HOME + " = " + fmt(state.rates[code] / state.rates[HOME]) + " " + code })
      ]));
    });
  }

  /* ---------- konvertor ---------- */
  function buildSelects() {
    const keep = { from: fromSel.value || "USD", to: toSel.value || HOME };
    const codes = Object.keys(state.rates).sort();
    [fromSel, toSel].forEach((select) => {
      select.replaceChildren();
      codes.forEach((code) => {
        select.append(el("option", { value: code, text: code + " · " + currencyName(code) }));
      });
    });
    fromSel.value = state.rates[keep.from] ? keep.from : "USD";
    toSel.value = state.rates[keep.to] ? keep.to : HOME;
  }

  function convert() {
    const from = fromSel.value;
    const to = toSel.value;
    if (!state.rates[from] || !state.rates[to]) return;

    const amount = parseFloat(amountInput.value);
    const rate = state.rates[to] / state.rates[from];
    $("#result").textContent = isFinite(amount) ? fmt(amount * rate) + " " + to : "—";
    $("#result-sub").textContent = "1 " + from + " = " + fmt(rate) + " " + to;

    state.selected = to;
    markSelected();
  }

  /* ---------- cədvəl ---------- */
  function renderTable() {
    const query = $("#rate-search").value.trim().toLocaleLowerCase("az");
    const codes = Object.keys(state.rates).sort().filter((code) =>
      !query ||
      code.toLowerCase().includes(query) ||
      currencyName(code).toLocaleLowerCase("az").includes(query)
    );

    body.replaceChildren();
    const fragment = document.createDocumentFragment();
    codes.forEach((code) => {
      const button = el("button", { type: "button", text: code, "aria-label": code + " valyutasını konvertora seç" });
      const row = el("tr", { "data-code": code }, [
        el("td", null, [button]),
        el("td", { class: "name", text: currencyName(code) }),
        el("td", { class: "num", text: fmt(state.rates[code]) }),
        el("td", { class: "num", text: fmt(toHome(code)) })
      ]);
      if (code === HOME) row.dataset.home = "1";
      fragment.append(row);
    });
    body.append(fragment);

    $("#rate-empty").hidden = codes.length > 0;
    $("#rate-count").textContent = codes.length + " / " + Object.keys(state.rates).length + " valyuta";
    markSelected();
  }

  function markSelected() {
    body.querySelectorAll("tr").forEach((row) => {
      row.setAttribute("aria-selected", String(row.dataset.code === state.selected));
    });
  }

  /* ---------- hadisələr ---------- */
  function bindEvents() {
    [fromSel, toSel, amountInput].forEach((node) => node.addEventListener("input", convert));
    $("#conv").addEventListener("submit", (event) => event.preventDefault());

    $("#swap").addEventListener("click", () => {
      const previousFrom = fromSel.value;
      fromSel.value = toSel.value;
      toSel.value = previousFrom;
      convert();
    });

    $("#rate-search").addEventListener("input", renderTable);
    $("#rates-retry").addEventListener("click", load);

    // Cədvəl sətrinə klik: həmin valyuta konvertorda "Hansına" olur
    body.addEventListener("click", (event) => {
      const row = event.target.closest("tr");
      if (!row) return;
      toSel.value = row.dataset.code;
      if (fromSel.value === toSel.value) fromSel.value = row.dataset.code === "USD" ? HOME : "USD";
      convert();
    });
  }

  App.rates = {
    init() {
      bindEvents();
      load();
    }
  };
})();
