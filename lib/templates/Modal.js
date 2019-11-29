export default (translations) =>
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
