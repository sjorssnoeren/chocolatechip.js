## Installatie

#### Stap 1: Voeg chocolatechip.js toe

Voeg het volgende script toe voor het sluiten van met van `<body>` tag. Dit kan in de pagina zelf of met behulp van Google TagManager.

```html
<script src="https://gitcdn.link/repo/sjorssnoeren/chocolatechip.js/master/dist/js/chocolatechip.js"></script>
<script>
  ChocolateChip.eat({
    includes: ['userPreferences', 'analytics', 'advertisements'],
    privacyPolicyURL: 'http://example.com/privacy-policy',
  });
</script>
```

#### Stap 2: Voeg de triggers toe in Google Tag Manager

Maak een nieuwe aangepaste trigger aan in Google Tag Manager. In onderstaande tabel vind je de verschillende waarden die je kunt gebruiken. Bij het laden van het script en bij het aanpassen van een voorkeur worden de juiste events in het Tag Manager dataLayer geschoten.

| Waarde | Titel | Beschrijving |
|--------|-------|--------------|
| ChocolateChip_functional | Functionele Cookies | Vereist voor juiste werking van de website.  |
| ChocolateChip_userPreferences | Voorkeurs Cookies | Wordt gebruikt voor het aanpassen van voorkeur van de gebruiker. |
| ChocolateChip_analytics | Analytische Cookies | Voor analyse doeleinden om de website te verbeteren. |
| ChocolateChip_advertisements | Advertentie Cookies | Om bij te houden welke advertenties een gebruik heeft gezien, en hoe vaak. |

#### Stap 3: Koppel jouw CSV met cookies

Vanaf heden is het ook mogelijk een CSV te gebruiken om de verschillende cookies uit te lichten. Een voorbeeld van deze CSV vind je [hier](https://docs.google.com/spreadsheets/d/1U5ZqnbEnjFA1wj1d_ScN6NHMcUgy4QooAjDLQl2cIRA/edit?usp=sharing). Je koppelt eenvoudig de cookie lijst door de URL van een CSV in te voegen met de optie `cookiesSheetURL`. Dit kun je bij een google docs document doen door de URL te kopieëren, het woord `/edit` aan het einde van de URL te vervangen met `/export?format=csv`.

Bekijk onderstaand voorbeeld hoe dit er in zijn totaliteit uit ziet:

```html
<script src="https://gitcdn.link/repo/sjorssnoeren/chocolatechip.js/master/dist/js/chocolatechip.js"></script>
<script>
  ChocolateChip.eat({
    includes: ['userPreferences', 'analytics', 'advertisements'],
    privacyPolicyURL: 'http://example.com/privacy-policy',
    cookiesSheetURL: 'https://docs.google.com/spreadsheets/d/1U5ZqnbEnjFA1wj1d_ScN6NHMcUgy4QooAjDLQl2cIRA/export?format=csv'
  });
</script>
```

De CSV wordt ingeladen en deze wordt netjes in een opgemaakte tabel getoond. In de kolom *category* gebruik je de een van de volgende waarden: `functional`, `userPreferences`, `analytics` of `advertisements`. Om de tabel te kunnen zien, moet de categorie natuurlijk zijn benoemd in het script onder de key: `includes`.

Meer uitleg volgt binnenkort..
