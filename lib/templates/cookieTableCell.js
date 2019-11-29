export default (props) => {
  return `
    <tr>
      <td>${props.name}</td>
      <td>${props.vendor}</td>
      <td>${props.description}</td>
      <td>${props.expiryDate}</td>
    </tr>
  `;
};