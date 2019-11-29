import CookieTableCell from './CookieTableCell';

export default (props) => {
  return `
    <div class="choc-collapsable">
      <a href="#" class="choc-table__header" data-choc-action="presentCookieTable">
        <span class="choc-table__header--accessory">+</span>

        ${props.translations['cookieTableTemplate.title']}
      </a>
      <table class="choc-table choc-display--none" data-choc-ref="cookieTable">
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
            return CookieTableCell(cookie);
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
};