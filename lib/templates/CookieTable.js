const CookieTableCellTemplate = (props) => {
  return `
    <tr>
      <td>${props.name}</td>
      <td>${props.vendor}</td>
      <td>${props.description}</td>
      <td>${props.expiryDate}</td>
    </tr>
  `;
};

export default (props) => {
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
          return CookieTableCellTemplate(cookie);
        }).join('')}
      </tbody>
    </table>
  `;
};