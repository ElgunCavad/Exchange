# Məzənnə

Valyuta məzənnələri saytı. Məlumat açıq API-dən canlı alınır.

## Necə açmaq olar

`index.html` faylına iki dəfə klikləyin. Server və ya quraşdırma lazım deyil, internet bağlantısı kifayətdir.

## API

https://api.exchangerate-api.com/v4/latest/USD

## Saytda nə var

- Manat qarşısında USD, EUR, TRY, RUB və GBP kartları
- Valyuta konvertoru (⇄ düyməsi ilə yerdəyişmə)
- Bütün valyutaların cədvəli: kod və ya ad üzrə axtarış, sətrə klik edəndə valyuta konvertora keçir
- Açıq və tünd rejim

## Qovluq strukturu

```
mezenne/
├── index.html              Səhifənin quruluşu (HTML)
├── README.md               Bu fayl
├── css/
│   ├── variables.css       Rənglər, şriftlər, açıq və tünd rejim
│   ├── base.css            Ümumi üslublar: üst zolaq, giriş, düymə, forma, alt hissə
│   └── rates.css           Məzənnə kartları, konvertor, cədvəl
├── js/
│   ├── config.js           API ünvanı və ayarlar
│   ├── utils.js            Köməkçi funksiyalar (el, fmt, getJSON, currencyName)
│   ├── theme.js            Açıq və tünd rejim düyməsi
│   ├── rates.js            Məzənnələrin yüklənməsi, kartlar, konvertor, cədvəl
│   └── main.js             Başlanğıc nöqtəsi
└── data/
    └── rates-snapshot.js   API işləməyəndə göstərilən ehtiyat məzənnələr
```

## Skriptlərin ardıcıllığı

`index.html` skriptləri bu ardıcıllıqla yükləyir. Hər biri əvvəlkilərə əsaslanır, ona görə ardıcıllığı dəyişməyin:

1. `config.js`
2. `data/rates-snapshot.js`
3. `utils.js`
4. `theme.js`
5. `rates.js`
6. `main.js`

## Tez dəyişikliklər

- Kartlarda başqa valyutalar göstərmək üçün `js/config.js` faylında `FEATURED` siyahısını dəyişin.
- Əsas valyutanı (manat) dəyişmək üçün `HOME` dəyərini dəyişin.
- Rəngləri dəyişmək üçün `css/variables.css` faylına baxmaq kifayətdir.
