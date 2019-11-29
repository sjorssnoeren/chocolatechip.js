import simplecsv from 'simplecsv';
import './styles/chocolatechip.scss';
import './polyfills';

import defaultTranslations from './defaultTranslations';

import Banner from './templates/Banner';
import Modal from './templates/Modal';
import CookieTable from './templates/CookieTable';

import { getCookie, setCookie } from './services/CookieService';

// HTML

const renderHTML = (htmlString) => {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
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
    const providedTranslations = options.translations != null ? options.translations : {};
    const language = defaultTranslations[options.language] != null || providedTranslations[options.language] != null ? options.language : 'nl_NL';
    const translations = Object.assign({}, defaultTranslations[language], providedTranslations[language]);
    this._options = Object.assign({}, this._options, options, { translations });

    const body = document.getElementsByTagName('body')[0];
    const useAlternativeText = options.disableAcceptThroughInteraction === true;
    const bannerComponent = Banner({ translations, layout: this._options.bannerLayout, useAlternativeText });
    body.insertBefore(renderHTML(bannerComponent), body.firstChild);
    body.insertBefore(renderHTML(Modal(translations)), body.firstChild);

    this._componentDidMount();
  },

  // MARK: Private

  // Initial State
  _state: {
    isChocolateChipHidden: false,
    isPreferenceModalVisible: false,
    isMoreInfoVisible: false,
    isCookieTableVisible: false,

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
    bannerLayout: 'bottom',
    disableAcceptThroughInteraction: false,
    preferencesDefaultChecked: false,
  },

  _firedEvents: [],

  _componentDidMount() {
    // Apply options to DOM structure
    this._options.includes.forEach((key) => {
      document.querySelector(`[data-choc-preference-tab=${key}]`).style.display = 'block';
    });

    if (this._options.privacyPolicyURL != null) {
      this._options.privacyPolicyURL = typeof this._options.privacyPolicyURL === 'string' ? this._options.privacyPolicyURL : this._options.privacyPolicyURL[this._options.language];
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

    if (this._options.preferencesDefaultChecked === true) {
      this._setState({
        cookiePreferences: {
          functional: true,
          userPreferences: true,
          analytics: true,
          advertisements: true,
        },
      });
    }
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
        const html = CookieTable({ cookies: this._state.cookiesByCategory[category], translations: this._options.translations });
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

    if (this._state.cookiesByCategory != null) {
      const cookieTableHeaderAccessories = document.querySelectorAll('.choc-table__header--accessory');
      for (let i = 0; i < cookieTableHeaderAccessories.length; i++) {
        cookieTableHeaderAccessories[i].innerHTML = this._state.isCookieTableVisible === true ? '-' : '+';
      }

      const cookieTables = document.querySelectorAll('[data-choc-ref=cookieTable]');
      for (let i = 0; i < cookieTables.length; i++) {
        cookieTables[i].style.display = this._state.isCookieTableVisible === true ? 'block' : 'none';
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
    } else {
      this._options.cookiesSheetURL = typeof this._options.cookiesSheetURL === 'string' ? this._options.cookiesSheetURL : this._options.cookiesSheetURL[this._options.language];
    }

    const xhr = createXHRRequest('GET', this._options.cookiesSheetURL);

    xhr.onreadystatechange = () => {
    	if (xhr.readyState === 4) {
        const csv = new simplecsv.csv();
        const jsonString = csv.CSVToJSON(xhr.responseText, { hasHeaders: true });
        const cookies = JSON.parse(jsonString);

        this._setState({ cookiesByCategory: this._mapCookiesToCategories(cookies) });
        this._onCookiesByCategoryLoad();
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

  _onCookiesByCategoryLoad() {
    const presentCookieTableHandler = (event) => {
      event.preventDefault();
      this._setState({ 
        isCookieTableVisible: ! this._state.isCookieTableVisible,
      });
    };

    const presentCookieTableButtons = document.querySelectorAll('[data-choc-action=presentCookieTable]');
    for (let i = 0; i < presentCookieTableButtons.length; i++) {
      presentCookieTableButtons[i].addEventListener('click', presentCookieTableHandler);
    }
  },

  _acceptAllCookies() {
    this._setState({
      isChocolateChipHidden: true,
      isPreferenceModalVisible: false,

      cookiePreferences: Object.keys(this._state.cookiePreferences).reduce((result, key) => {
        return Object.assign(result, { [key]: true });
      }, {}),
    });
  },

  _bindEvents() {
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
      this._setState({ isCookieTableVisible: false });

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

    const presentModalButtons = document.querySelectorAll('[data-choc-action=presentModal]');
    for (let i = 0; i < presentModalButtons.length; i++) {
      presentModalButtons[i].addEventListener('click', presentModalEventHandler);
    }

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
        this._acceptAllCookies();
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

    if (this._options.disableAcceptThroughInteraction !== true) {
      this._listenForInteraction();
    }
  },

  _listenForInteraction() {
    // Interpret clicks as approval of cookie consent. Areas that should not count as approval
    // should not propogate their event. Use `event.stopPropagation()` for any click event that
    // should not be used as approval of consent.
    const body = document.getElementsByTagName('body')[0];
    body.addEventListener('click', () => {
      // DO NOT use `preventDefault()` otherwise other links on page will be ignored

      // If cookie banner is still active, accept all cookies
      if (this._state.isChocolateChipHidden !== true) {
        this._acceptAllCookies();
      }
    });
  }
};
