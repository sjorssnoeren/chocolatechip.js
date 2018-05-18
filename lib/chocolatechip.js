import './chocolatechip.scss';

const bannerTemplate =
`<div class="choc-banner choc-padding--small">
    <div class="choc-banner__message">
      <a href="#" class="choc-close-btn" data-choc-action="hideChocolateChip">Close</a>

      <h3 class="choc-margin--top-nano">Cookiemelding</h3>
      <p class="choc-margin--top-nano">We gebruiken cookies om jouw gebruikerservaring te verbeteren, het website verkeer te analyseren en gerichte advertenties te kunnen tonen. Klik op “Cookie instellingen” om te kiezen welke cookies je wil accepteren. Klik op “Alle cookies toestaan om alle cookies te accepteren.</p>
    </div>

    <div class="choc-banner__actions choc-margin--top-nano">
      <a href="#" class="choc-btn choc-btn--type-secondary choc-margin--right-nano" data-choc-action="presentModal">Cookie instellingen</a>
      <a href="#" class="choc-btn choc-margin--right-nano" data-choc-action="acceptAllCookies">Alle cookies toestaan</a>
    </div>
  </div>`;

const modalTemplate =
  `<div class="choc-modal__overlay">
      <div class="choc-modal">
        <div class="choc-padding--v-medium choc-padding--h-small">
          <a href="#" class="choc-close-btn" data-choc-action="dismissModal">Close</a>
          <h3>Cookie instellingen</h3>
        </div>

        <hr class="choc-hr" />

        <div class="choc-float--clearfix">
          <div class="choc-tabs__navigation">
            <ul>
              <li class="choc-tabs__link choc-tabs__link--state-active choc-display--block"><a data-choc-action="show-tab" href="#">Essentiële cookies</a></li>
              <li class="choc-tabs__link choc-display--none" data-choc-preference-tab="userPreferences"><a data-choc-action="show-tab" href="#">Voorkeurs cookies</a></li>
              <li class="choc-tabs__link choc-display--none" data-choc-preference-tab="analytics"><a data-choc-action="show-tab" href="#">Analytische cookies</a></li>
              <li class="choc-tabs__link choc-display--none" data-choc-preference-tab="advertisements"><a data-choc-action="show-tab" href="#">Advertentie cookies</a></li>
            </ul>
          </div>

          <div class="choc-tabs__dynamic-content choc-float--left choc-padding--small">
            <div class="choc-tabs__item" data-choc-tab="0">
              <div class="choc-tabs__header">
                <h3>Essentiële cookies</h3>

                <label class="choc-form__toggle">
                  <input type="checkbox" data-choc-preference="essentials" disabled>
                  Verplicht
                </label>
              </div>
            </div>

            <div class="choc-tabs__item" data-choc-tab="1">
              <div class="choc-tabs__header">
                <h3>Voorkeurs cookies</h3>

                <label class="choc-form__toggle">
                  <input type="checkbox" data-choc-preference="userPreferences">
                  <span>Inschakelen</span>
                </label>
              </div>

              <p>Deze cookies worden gebruikt om de prestaties en functionaliteit van deze website te verbeteren. Deze cookies zijn niet essentieel om deze website te kunnen gebruiken. Echter kunnen bepaalde onderdelen op deze website zonder deze cookies niet meer optimaal functioneren.</p>
            </div>

            <div class="choc-tabs__item" data-choc-tab="2">
              <div class="choc-tabs__header">
                <h3>Analytische cookies</h3>

                <label class="choc-form__toggle">
                  <input type="checkbox" data-choc-preference="analytics">
                  <span>Inschakelen</span>
                </label>
              </div>
            </div>

            <div class="choc-tabs__item" data-choc-tab="3">
              <div class="choc-tabs__header">
                <h3>Advertentie cookies</h3>

                <label class="choc-form__toggle">
                  <input type="checkbox" data-choc-preference="advertisements">
                  <span>Inschakelen</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <hr class="choc-hr" />

        <div class="choc-padding--v-medium choc-padding--h-small choc-float--clearfix">
          <div class="choc-float--left choc-float--sm-none">
            <a href="#" data-choc-link="privacyPolicy">Privacy Policy</a>
          </div>

          <div class="choc-float--right choc-float--sm-none">
            <a href="#" data-choc-action="dismissModal" class="choc-btn choc-btn--type-secondary choc-margin--right-nano">Annuleren</a>
            <a href="#" class="choc-btn" data-choc-action="acceptAllCookies">Alle cookies toestaan</a>
          </div>
        </div>
      </div>
    </div>`;

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

global.ChocolateChip = {

  // MARK: Public

  eat(options) {
    this._options = Object.assign({}, this._options, options);

    const body = document.getElementsByTagName('body')[0];
    body.appendChild(renderHTML(bannerTemplate));
    body.appendChild(renderHTML(modalTemplate));

    this._componentDidMount();
  },

  acceptAllCookies() {

  },

  // MARK: Private

  _options: {
    includes: ['userPreferences', 'analytics', 'advertisements'],
    privacyPolicyURL: null,
  },

  _componentDidMount() {
    this._bindEvents();

    // Apply options to DOM structure
    this._options.includes.forEach((key) => {
      document.querySelector(`[data-choc-preference-tab=${key}]`).style.display = 'block';
    });

    if (this._options.privacyPolicyURL != null) {
      document.querySelector('[data-choc-link=privacyPolicy]').setAttribute('href', this._options.privacyPolicyURL);
    } else {
      document.querySelector('[data-choc-link=privacyPolicy]').style.display = 'none';
    }

    // Sets initial state
    const cookieConsentString = getCookie('cookieConsent');
    if (cookieConsentString != null) {
      this._setState(JSON.parse(cookieConsentString));
      return;
    }

    this._setState({
      isChocolateChipHidden: false,

      cookiePreferences: {
        essentials: true,
        userPreferences: false,
        analytics: false,
        advertisements: false,
      },
    });
  },

  _firedEvents: [],

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
    this._state = Object.assign({}, this._state, state);
    this._didUpdateState();
  },

  _didUpdateState() {
    // Update Cookie consent
    const cookieConsentString = JSON.stringify(this._state);
    setCookie('cookieConsent', cookieConsentString, 60);

    // Notify Google Tag Manager
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
      document.querySelector('.choc-modal__overlay').style.display = 'none';
    }
  },

  _bindEvents() {
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

    // `NodeList.forEach()` does not exist in most versions of internet explorer, therefore let's
    // use a regular for loop
    const tabLinks = document.querySelectorAll('[data-choc-action=show-tab]');
    for (let i = 0; i < tabLinks.length; i++) {
      tabLinks[i].addEventListener('click', (event) => {
        event.preventDefault();
        setTabActiveAt(i);
      });
    }

    const presentModalButton = document.querySelector('[data-choc-action=presentModal]');
    presentModalButton.addEventListener('click', (event) => {
      event.preventDefault();
      document.querySelector('.choc-modal__overlay').style.display = 'block';
      document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    });

    const dismissModalButtons = document.querySelectorAll('[data-choc-action=dismissModal]');
    for (let i = 0; i < dismissModalButtons.length; i++) {
      dismissModalButtons[i].addEventListener('click', (event) => {
        event.preventDefault();
        document.querySelector('.choc-modal__overlay').style.display = 'none';
        document.getElementsByTagName('body')[0].style.overflow = 'auto';
      });
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

    const hideChocolateChipButton = document.querySelector('[data-choc-action=hideChocolateChip]');
    hideChocolateChipButton.addEventListener('click', (event) => {
      event.preventDefault();
      this._setState({ isChocolateChipHidden: true });
    });

    const acceptAllButtons = document.querySelectorAll('[data-choc-action=acceptAllCookies]');
    for (let i = 0; i < acceptAllButtons.length; i++) {
      acceptAllButtons[i].addEventListener('click', (event) => {
        event.preventDefault();

        document.getElementsByTagName('body')[0].style.overflow = 'auto';

        this._setState({
          isChocolateChipHidden: true,
          cookiePreferences: Object.keys(this._state.cookiePreferences).reduce((result, key) => {
            return Object.assign(result, { [key]: true });
          }, {}),
        });
      });
    }
  },
};
