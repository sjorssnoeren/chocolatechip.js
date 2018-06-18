import simplecsv from 'simplecsv';

import './chocolatechip.scss';
import './polyfills';

// HTML

const bannerTemplate = () =>
`<div class="choc-banner choc-padding--tiny">
    <p>
      Door verder te klikken op onze website, accepteer je cookies en vergelijkbare technieken.
      <a href="#" data-choc-action="showBannerInfo" class="choc-display--none choc-display--sm-inline-block">Meer info</a>
      <span class="choc-banner__description">
        Hiermee verzamelen we persoonsgegevens en volgen wij en derden je internetgedrag. Op onze website en die van derden. Waarom? Zodat wij en derden je advertenties kunnen laten zien die bij jouw interesses passen.

        <a href="#" data-choc-action="presentModal">Meer weten?</a>
        <a href="#" data-choc-action="acceptAllCookies">Sluiten</a>
      </span>
    </p>
  </div>`;

const modalTemplate = () =>
  `<div class="choc-modal__overlay">
      <div class="choc-modal">
        <div class="choc-padding--v-medium choc-padding--h-small">
          <a href="#" class="choc-close-btn" data-choc-action="dismissModal">Sluiten</a>
          <h3>Cookie instellingen</h3>
        </div>

        <hr class="choc-hr" />

        <div class="choc-float--clearfix">
          <div class="choc-tabs__navigation">
            <ul>
              <li class="choc-tabs__link choc-tabs__link--state-active choc-display--block"><a data-choc-action="show-tab" href="#">Functionele cookies</a></li>
              <li class="choc-tabs__link choc-display--none" data-choc-preference-tab="userPreferences"><a data-choc-action="show-tab" href="#">Voorkeurs cookies</a></li>
              <li class="choc-tabs__link choc-display--none" data-choc-preference-tab="analytics"><a data-choc-action="show-tab" href="#">Analytische cookies</a></li>
              <li class="choc-tabs__link choc-display--none" data-choc-preference-tab="advertisements"><a data-choc-action="show-tab" href="#">Advertentie cookies</a></li>
            </ul>
          </div>

          <div class="choc-tabs__dynamic-content choc-float--left choc-padding--small">
            <div class="choc-tabs__item" data-choc-tab="0">
              <div class="choc-tabs__header">
                <h3>Functionele cookies</h3>

                <label class="choc-form__toggle">
                  <input type="checkbox" data-choc-preference="functional" disabled>
                  Verplicht
                </label>
              </div>

              <p>Functionele cookies houden anoniem statistieken bij en zijn vereist voor de werking van de website. Omdat de werking van de website niet kan worden gegarandeerd zonder deze cookies, kun je deze cookies niet weigeren. Je kunt deze cookies eventueel wel verwijderen in je browserinstellingen.</p>

              <div data-choc-cookies-table="functional"></div>
            </div>

            <div class="choc-tabs__item" data-choc-tab="1">
              <div class="choc-tabs__header">
                <h3>Voorkeurs cookies</h3>

                <label class="choc-form__toggle">
                  <input type="checkbox" data-choc-preference="userPreferences">
                  <span>Inschakelen</span>
                </label>
              </div>

              <p>Voorkeurscookies zijn niet essentieel voor de werking van de website, maar bevorderen wel de gebruikerservaring. Deze cookies zorgen ervoor dat je gebruikerservaring optimaal is.</p>

              <div data-choc-cookies-table="userPreferences"></div>
            </div>

            <div class="choc-tabs__item" data-choc-tab="2">
              <div class="choc-tabs__header">
                <h3>Analytische cookies</h3>

                <label class="choc-form__toggle">
                  <input type="checkbox" data-choc-preference="analytics">
                  <span>Inschakelen</span>
                </label>
              </div>

              <p>Analytische cookies verzamelen informatie over het gedrag van gebruikers van de website.
              Dit leert ons om deze gebruikers beter te begrijpen en helpt ons om deze website te optimaliseren. Ook wordt hieruit opgemaakt hoe effectief de marketingcampagnes via deze website zijn.</p>

              <div data-choc-cookies-table="analytics"></div>
            </div>

            <div class="choc-tabs__item" data-choc-tab="3">
              <div class="choc-tabs__header">
                <h3>Advertentie cookies</h3>

                <label class="choc-form__toggle">
                  <input type="checkbox" data-choc-preference="advertisements">
                  <span>Inschakelen</span>
                </label>
              </div>

              <p>Advertentiecookies brengen je surfgedrag in kaart voor advertentienetwerken.
              Door middel van deze cookies kunnen deze netwerken je advertenties aanbieden die aansluiten bij jouw interesses. Ook voorkomen deze cookies dat dezelfde advertentie niet meerdere malen aan dezelfde gebruiker wordt getoond.</p>

              <div data-choc-cookies-table="advertisements"></div>
            </div>
          </div>
        </div>

        <hr class="choc-hr" />

        <div class="choc-padding--v-medium choc-padding--h-small choc-float--clearfix">
          <div class="choc-float--left choc-float--sm-none">
            <a href="#" target="_blank" data-choc-link="privacyPolicy">Privacy Policy</a>
          </div>

          <div class="choc-float--right choc-float--sm-none choc-modal__actions">
            <a href="#" data-choc-action="dismissBanner" class="choc-btn choc-btn--type-secondary choc-margin--right-nano">Verder naar website</a>
            <a href="#" class="choc-btn" data-choc-action="acceptAllCookies">Alle cookies toestaan</a>
          </div>
        </div>
      </div>
    </div>`;

const cookieTableTemplate = (props) => {
  return `
    <table class="choc-table">
      <thead>
        <tr>
          <th>Cookie naam</th>
          <th>Leverancier</th>
          <th>Beschrijving</th>
          <th>Vervaldatum</th>
        </tr>
      </thead>

      <tbody>
        ${props.cookies == null || props.cookies.length < 1 ? `
          <td style="word-break: normal">Geen cookies gespecificeerd.</td>
          <td></td>
          <td></td>
          <td></td>
        ` : ''}
        ${props.cookies.map((cookie) => {
          return cookieTableCellTemplate(cookie);
        }).join('')}
      </tbody>
    </table>
  `;
};

const cookieTableCellTemplate = (props) => {
  return `
    <tr>
      <td>${props.name}</td>
      <td>${props.vendor}</td>
      <td>${props.description}</td>
      <td>${props.expiryDate}</td>
    </tr>
  `;
};

const renderHTML = (htmlString) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};

// ! taken from: https://plainjs.com/javascript/utilities/set-cookie-get-cookie-and-delete-cookie-5/
const getCookie = (name) => {
  var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
};

// ! taken from: https://plainjs.com/javascript/utilities/set-cookie-get-cookie-and-delete-cookie-5/
const setCookie = (name, value, days) => {
  var d = new Date;
  d.setTime(d.getTime() + 24*60*60*1000*days);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
};

// ! taken from: https://gist.github.com/rmruano/4638071
const createXHRRequest = (type, url) => {
  let xhr = false;
  try {
     xhr = new XMLHttpRequest();
  } catch(e) {}
  if (xhr && "withCredentials" in xhr) {
      xhr.open(type, url, true); // Standard Cors request
  } else if (typeof XDomainRequest != "undefined") {
      xhr = new XDomainRequest(); // IE Cors request
      xhr.open(type, url);
      xhr.onload = function() {
      	this.readyState = 4;
      	if (this.onreadystatechange instanceof Function) this.onreadystatechange();
      };
  } else if (xhr) {
  	xhr.open(type, url, true);
  };
  return xhr;
};

global.ChocolateChip = {

  // MARK: Public

  eat(options) {
    this._options = Object.assign({}, this._options, options);

    const body = document.getElementsByTagName('body')[0];
    body.insertBefore(renderHTML(bannerTemplate()), body.firstChild);
    body.insertBefore(renderHTML(modalTemplate()), body.firstChild);

    this._componentDidMount();
  },

  // MARK: Private


  // Initial State
  _state: {
    isChocolateChipHidden: false,
    isPreferenceModalVisible: false,
    isMoreInfoVisible: false,

    cookiesByCategory: null,

    cookiePreferences: {
      functional: true,
      userPreferences: false,
      analytics: false,
      advertisements: false,
    },
  },

  _options: {
    includes: ['userPreferences', 'analytics', 'advertisements'],
    privacyPolicyURL: null,
  },

  _firedEvents: [],

  _componentDidMount() {
    // Apply options to DOM structure
    this._options.includes.forEach((key) => {
      document.querySelector(`[data-choc-preference-tab=${key}]`).style.display = 'block';
    });

    if (this._options.privacyPolicyURL != null) {
      document.querySelector('[data-choc-link=privacyPolicy]').setAttribute('href', this._options.privacyPolicyURL);
    } else {
      document.querySelector('[data-choc-link=privacyPolicy]').style.display = 'none';
    }

    // Apply cookie consent to state, if non existing, saves intial state in cookie consent.
    const cookieConsentString = getCookie('cookieConsent');
    if (cookieConsentString != null) {
      this._setState(JSON.parse(cookieConsentString));
    } else {
      this._saveCookiePreferences();
    }

    // Component becomes inactive after mount
    this._bindEvents();
  },

  _fireGoogleTagManagerEvents() {
    window.dataLayer = window.dataLayer || [];

    const enabledCookies = Object.keys(this._state.cookiePreferences).filter((key) => {
      return this._state.cookiePreferences[key] === true && this._firedEvents.includes(key) !== true;
    }).forEach((key) => {
      this._firedEvents.push(key);
      window.dataLayer.push({ event: `ChocolateChip_${key}` });
    });
  },

  _setState(state) {
    const prevState = Object.assign({}, this._state);
    this._state = Object.assign({}, prevState, state);
    this._didUpdateState(prevState);
  },

  _didUpdateState(prevState) {
    // Save cookies & notify Google Tag Manager
    this._saveCookiePreferences();
    this._fireGoogleTagManagerEvents();

    // UI updates
    const { cookiePreferences } = this._state;

    Object.keys(cookiePreferences).forEach((key) => {
      const checked = cookiePreferences[key];
      const span = document.querySelector(`[data-choc-preference=${key}]`).parentElement.querySelector('span');
      if (span != null) {
        span.innerHTML = checked ? 'Ingeschakeld' : 'Inschakelen';
      }

      document.querySelector(`[data-choc-preference=${key}]`).checked = checked;
    });

    if (this._state.isChocolateChipHidden === true) {
      document.querySelector('.choc-banner').style.display = 'none';
    }

    if (this._state.isPreferenceModalVisible === true) {
      document.querySelector('.choc-modal__overlay').style.display = 'block';
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
      this._fetchCookiesFromCSV();
    } else {
      document.querySelector('.choc-modal__overlay').style.display = 'none';
      document.getElementsByTagName('body')[0].style.overflow = 'auto';
    }

    if (prevState.cookiesByCategory !== this._state.cookiesByCategory) {
      console.log(this._state.cookiesByCategory);
      Object.keys(this._state.cookiesByCategory).forEach((category) => {
        const html = cookieTableTemplate({ cookies: this._state.cookiesByCategory[category] });
        document.querySelector(`[data-choc-cookies-table="${category}"]`).appendChild(renderHTML(html));
      });
    }

    const bannerDescription = document.querySelector('.choc-banner__description');
    if (this._state.isMoreInfoVisible === true) {
      if (bannerDescription.classList.contains('choc-banner__description--visible') !== true) {
        bannerDescription.classList.add('choc-banner__description--visible');

        const showMoreInfoButton = document.querySelector('[data-choc-action="showBannerInfo"]');
        showMoreInfoButton.style.display = 'none';
      }
    }
  },

  _saveCookiePreferences() {
    // Update Cookie consent
    const { isChocolateChipHidden, cookiePreferences } = this._state;

    const cookieConsentString = JSON.stringify({ isChocolateChipHidden, cookiePreferences });
    setCookie('cookieConsent', cookieConsentString, 60);
  },

  _fetchCookiesFromCSV() {
    if (this._options.cookiesSheetURL == null || this._state.cookiesByCategory != null) {
      return;
    }

    const xhr = createXHRRequest('GET', this._options.cookiesSheetURL);

    xhr.onreadystatechange = () => {
    	if (xhr.readyState === 4) {
        const csv = new simplecsv.csv();
        const jsonString = csv.CSVToJSON(xhr.responseText, { hasHeaders: true });
        const cookies = JSON.parse(jsonString);

        this._setState({ cookiesByCategory: this._mapCookiesToCategories(cookies) });
    	}
    };

    xhr.send();
  },

  _mapCookiesToCategories(cookies) {
    const categories = this._options.includes.concat(['functional']);

    const dictionary = categories.reduce((result, category) => {
      return Object.assign(result, { [category]: [] });
    }, {});

    return cookies.reduce((result, cookie) => {
      if (result[cookie.category] != null) {
        return Object.assign(result, {
          [cookie.category]: result[cookie.category].concat([cookie]),
        });
      }

      return Object.assign(result, {
        functional: result.functional.concat([cookie]),
      });
    }, dictionary);
  },

  _bindEvents() {
    const acceptAll = () => {
      this._setState({
        isChocolateChipHidden: true,
        isPreferenceModalVisible: false,

        cookiePreferences: Object.keys(this._state.cookiePreferences).reduce((result, key) => {
          return Object.assign(result, { [key]: true });
        }, {}),
      });
    };

    const dismissModalEventHandler = (event) => {
      event.preventDefault();
      this._setState({ isPreferenceModalVisible: false });
    };

    const presentModalEventHandler = (event) => {
      event.preventDefault();
      this._setState({ isPreferenceModalVisible: true });
    };

    const dismissBannerEventHandler = (event) => {
      event.preventDefault();
      this._setState({
        isChocolateChipHidden: true,
        isPreferenceModalVisible: false,
      });
    };

    const setTabActiveAt = (index) => {
      const tabItems = document.getElementsByClassName('choc-tabs__item');

      for (let i = 0; i < tabItems.length; i++) {
        const item = tabItems[i];
        item.style.display = i === index ? 'block' : 'none';
      }

      const tabLinks = document.getElementsByClassName('choc-tabs__link');
      for (let i = 0; i < tabLinks.length; i++) {
        const link = tabLinks[i];

        if (i === index) {
          link.classList.add('choc-tabs__link--state-active');
        } else {
          link.classList.remove('choc-tabs__link--state-active');
        }
      }

    };

    // `NodeList.forEach()` does not exist in most versions of internet explorer, therefore we
    // use a regular for loop
    const tabLinks = document.querySelectorAll('[data-choc-action=show-tab]');
    for (let i = 0; i < tabLinks.length; i++) {
      tabLinks[i].addEventListener('click', (event) => {
        event.preventDefault();
        setTabActiveAt(i);
      });
    }

    const showMoreInfoButton = document.querySelector('[data-choc-action="showBannerInfo"]');
    showMoreInfoButton.addEventListener('click', (event) => {
      event.preventDefault();
      this._setState({ isMoreInfoVisible: true });
    });

    const presentModalButton = document.querySelector('[data-choc-action=presentModal]');
    presentModalButton.addEventListener('click', presentModalEventHandler);

    const dismissModalButtons = document.querySelectorAll('[data-choc-action=dismissModal]');
    for (let i = 0; i < dismissModalButtons.length; i++) {
      dismissModalButtons[i].addEventListener('click', dismissModalEventHandler);
    }

    const dismissBannerButtons = document.querySelectorAll('[data-choc-action=dismissBanner]');
    for (let i = 0; i < dismissBannerButtons.length; i++) {
      dismissBannerButtons[i].addEventListener('click', dismissBannerEventHandler);
    }

    const preferenceCheckboxes = document.querySelectorAll('[data-choc-preference]');
    for (let i = 0; i < preferenceCheckboxes.length; i++) {
      preferenceCheckboxes[i].addEventListener('change', (event) => {
        const { cookiePreferences } = this._state;
        const { checked } = event.target;
        const key = event.target.getAttribute('data-choc-preference');

        // Remove unchecked preferences from firedEvents
        if (checked === false) {
          this._firedEvents = this._firedEvents.filter((event) => event !== key);
        }

        this._setState({
          cookiePreferences: Object.assign({}, cookiePreferences, { [key]: checked }),
        });
      });
    }

    const acceptAllButtons = document.querySelectorAll('[data-choc-action=acceptAllCookies]');
    for (let i = 0; i < acceptAllButtons.length; i++) {
      acceptAllButtons[i].addEventListener('click', (event) => {
        event.preventDefault();

        document.getElementsByTagName('body')[0].style.overflow = 'auto';
        acceptAll();
      });
    }

    const banner = document.querySelector('.choc-banner');
    banner.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    // Firstly stop propagation on the modal, to use the overlay as control for dismissal
    const modal = document.querySelector('.choc-modal');
    modal.addEventListener('click', (event) => {
      event.stopPropagation();
    });

    // Dismiss overlay whlist clicking on the overlay background. Afterwards stop propagation
    // to not use this as body acceptAll action
    const modalOverlay = document.querySelector('.choc-modal__overlay');
    modalOverlay.addEventListener('click', (event) => {
      dismissModalEventHandler(event);
      event.stopPropagation();
    });

    // Interpret clicks as approval of cookie consent. Areas that should not count as approval
    // should not propogate their event. Use `event.stopPropagation()` for any click event that
    // should not be used as approval of consent.
    const body = document.getElementsByTagName('body')[0];
    body.addEventListener('click', () => {
      // DO NOT use `preventDefault()` otherwise other links on page will be ignored

      // If cookie banner is still active, accept all cookies
      if (this._state.isChocolateChipHidden !== true) {
        acceptAll();
      }
    });
  },
};
