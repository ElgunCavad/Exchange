/* Layihənin ümumi ayarları. Digər skriptlər bunları window.App.config vasitəsilə oxuyur. */
window.App = window.App || {};

window.App.config = {
  RATES_URL: "https://api.exchangerate-api.com/v4/latest/USD",
  HOME: "AZN",                                   // manat: cədvəldə vurğulanır, kartlarda əsas valyuta
  FEATURED: ["USD", "EUR", "TRY", "RUB", "GBP"], // yuxarıdakı kartlarda göstərilən valyutalar
  TIMEOUT_MS: 20000                              // API cavabını gözləmə müddəti
};
