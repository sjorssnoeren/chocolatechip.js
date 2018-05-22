# chocolatechip.js
🍪 Universeel, disclaimer vrij en volledig open-source | AVG Cookiemelding met een strak aanpasbaar ontwerp voor Google Tag Manager

**Deze module is voor jou ontwikkeld door [The Red Corner - In it to win it.](https://theredcorner.nl)**

## Voorbeeld

![The Red Corner](./images/theredcorner-chocolatechip-screenshot.png)

## Introductie

Vanaf 25 mei 2018 veranderd de europese wetgeving omtrent privacy. Dit heeft ingrijpende consequenties voor bijna alle bedrijven. Een onderdeel van deze nieuwe wetgeving is het vereisen van een heldere cookiewall. Om dit onderdeel wat te vergemakkelijken presenteren wij hierbij chocolatechip.js.

Een volledig open-source plug & play cookiewall die wordt geïntegreerd met Google Tag Manager. Geen disclaimer, geen onverwachte backlinks, gewoon een cookiewall die er goed uit ziet en jouw leven een stukje makkelijker maakt.

[Bekijk de demo](https://sjorssnoeren.github.io/chocolatechip.js/)

*Let op: Om volledig te voldoen aan de AVG of GDPR moeten meer acties ondernomen worden. Wij geven nooit garantie over het daadwerkelijk voldoen aan de gestelde eisen, gebruik is volledig op eigen risico. Snel hulp nodig met het implementeren van de nieuwe wetgeving binnen jouw organisatie? [Stuur ons een mail](mailto:mail@theredcorner.nl)*

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

Meer uitleg volgt binnenkort..

## Roadmap

* Responsive design improvements
* Customizable SASS variabelen
* Landingspage
* Volledige teksten voor alle items
* Uitgebreidere documentatie

## Licentie

Dit project is gelicenseerd onder MIT. Raadpleeg het LICENSE bestand voor meer informatie.
