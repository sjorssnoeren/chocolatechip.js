import simplecsv from 'simplecsv';
import './chocolatechip.scss';
import './polyfills';
import defaultTranslations from './defaultTranslations'

// HTML

const bannerTemplate = (translations) =>
`<div class="choc-banner choc-padding--tiny">
    <p>
      ${translations["bannerTemplate.text"]}
      <a href="#" data-choc-action="showBannerInfo" class="choc-display--none choc-display--sm-inline-block">Meer info</a>
      <span class="choc-banner__description">
        ${translations["bannerTemplate.description"]}
        <a href="#" data-choc-action="presentModal">${translations["bannerTemplate.actionOpen"]}</a>
        <a href="#" data-choc-action="acceptAllCookies">${translations["bannerTemplate.actionSluiten"]}</a>
      </span>
    </p>
  </div>`;

const modalTemplate = (translations) =>
  `<div class="choc-modal__overlay">
      <div class="choc-modal">
        <div class="choc-padding--v-medium choc-padding--h-small">
          <a href="#" class="choc-close-btn" data-choc-action="dismissModal">Sluiten</a>
          <h3>${translations["modalTemplate.settings"]}</h3>
        </div>

        <hr class="choc-hr" />

        <div class="choc-float--clearfix">
          <div class="choc-tabs__navigation">
            <ul>
              <li class="choc-tabs__link choc-tabs__link--state-active choc-display--block"><a data-choc-action="show-tab" href="#">${translations["modalTemplate.functionalHeader"]}</a></li>
              <li class="choc-tabs__link choc-display--none" data-choc-preference-tab="userPreferences"><a data-choc-action="show-tab" href="#">${translations["modalTemplate.preferenceHeader"]}</a></li>
              <li class="choc-tabs__link choc-display--none" data-choc-preference-tab="analytics"><a data-choc-action="show-tab" href="#">${translations["modalTemplate.analyticalHeader"]}</a></li>
              <li class="choc-tabs__link choc-display--none" data-choc-preference-tab="advertisements"><a data-choc-action="show-tab" href="#">${translations["modalTemplate.advertHeader"]}</a></li>
            </ul>
          </div>

          <div class="choc-tabs__dynamic-content choc-float--left choc-padding--small">
            <div class="choc-tabs__item" data-choc-tab="0">
              <div class="choc-tabs__header">
                <h3>${translations["modalTemplate.functionalHeader"]}</h3>

                <label class="choc-form__toggle">
                  <input type="checkbox" data-choc-preference="functional" disabled>
                  ${translations["modalTemplate.mandatory"]}
                </label>
              </div>

              <p>${translations["modalTemplate.functionalText"]}</p>

              <div data-choc-cookies-table="functional"></div>
            </div>

            <div class="choc-tabs__item" data-choc-tab="1">
              <div class="choc-tabs__header">
                <h3>${translations["modalTemplate.preferenceHeader"]}</h3>

                <label class="choc-form__toggle">
                  <input type="checkbox" data-choc-preference="userPreferences">
                  <span>${translations["modalTemplate.enable"]}</span>
                </label>
              </div>

              <p>${translations["modalTemplate.preferenceText"]}</p>

              <div data-choc-cookies-table="userPreferences"></div>
            </div>

            <div class="choc-tabs__item" data-choc-tab="2">
              <div class="choc-tabs__header">
                <h3>${translations["modalTemplate.analyticalHeader"]}</h3>

                <label class="choc-form__toggle">
                  <input type="checkbox" data-choc-preference="analytics">
                  <span>${translations["modalTemplate.enable"]}</span>
                </label>
              </div>

              <p>${translations["modalTemplate.analyticalText"]}</p>

              <div data-choc-cookies-table="analytics"></div>
            </div>

            <div class="choc-tabs__item" data-choc-tab="3">
              <div class="choc-tabs__header">
                <h3>${translations["modalTemplate.advertHeader"]}</h3>

                <label class="choc-form__toggle">
                  <input type="checkbox" data-choc-preference="advertisements">
                  <span>${translations["modalTemplate.enable"]}</span>
                </label>
              </div>

              <p>${translations["modalTemplate.advertText"]}</p>

              <div data-choc-cookies-table="advertisements"></div>
            </div>
          </div>
        </div>

        <hr class="choc-hr" />

        <div class="choc-padding--v-medium choc-padding--h-small choc-float--clearfix">
          <div class="choc-float--left choc-float--sm-none">
            <a href="#" target="_blank" data-choc-link="privacyPolicy">${translations["modalTemplate.privacy"]}</a>
          </div>

          <div class="choc-float--right choc-float--sm-none choc-modal__actions">
            <a href="#" data-choc-action="dismissBanner" class="choc-btn choc-btn--type-secondary choc-margin--right-nano">${translations["modalTemplate.actionWebsite"]}</a>
            <a href="#" class="choc-btn" data-choc-action="acceptAllCookies">${translations["modalTemplate.actionCookies"]}</a>
          </div>
        </div>
      </div>
    </div>`;

const cookieTableTemplate = (props) => {
  return `
    <table class="choc-table">
      <thead>
        <tr>
          <th>${props.translations['cookieTableTemplate.name']}</th>
          <th>${props.translations['cookieTableTemplate.supplier']}</th>
          <th>${props.translations['cookieTableTemplate.description']}</th>
          <th>${props.translations['cookieTableTemplate.expiryDate']}</th>
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
    const language = defaultTranslations[options.language] != null ? options.language : 'en_GB';
    const translations = Object.assign({}, defaultTranslations[options.language], options.translations[options.language]);

    this._options = Object.assign({}, this._options, options, { translations });

    const body = document.getElementsByTagName('body')[0];
    body.insertBefore(renderHTML(bannerTemplate(translations)), body.firstChild);
    body.insertBefore(renderHTML(modalTemplate(translations)), body.firstChild);

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

      const { translations } = this._options;
      if (span != null) {
        span.innerHTML = checked ? translations['modalTemplate.enabled'] : translations['modalTemplate.enable'];
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
      Object.keys(this._state.cookiesByCategory).forEach((category) => {
        const html = cookieTableTemplate({ cookies: this._state.cookiesByCategory[category], translations: this._options.translations });
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
