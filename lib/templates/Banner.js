export default ({ translations, layout, useAlternativeText }) =>
`<div class="choc-banner choc-padding--tiny choc-banner--layout-${layout}">
    <p>
      ${useAlternativeText === true ? translations["bannerTemplate.alternativeText"] : translations["bannerTemplate.text"]}
      <a href="#" data-choc-action="showBannerInfo" class="choc-display--none choc-display--sm-inline-block">${translations["bannerTemplate.actionOpen"]}</a>
      
      <span class="choc-banner__description">
        ${translations["bannerTemplate.description"]}
        <a href="#" data-choc-action="presentModal">${translations["bannerTemplate.actionOpen"]}</a>
      </span>

      <a href="#" data-choc-action="acceptAllCookies">${translations["bannerTemplate.actionSluiten"]}</a>
    </p>
  </div>`;