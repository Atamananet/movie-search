/**
 * Show short message for 3 second to user
 *
 * @param {string} message   Message should be showed.
 * @param {string} type      danger - for error messages, primary - for others
 */
function alertWithMessage(message, type = 'danger') {
  const alert = document.querySelector(`.container__alert .alert-${type}`);
  alert.hidden = false;
  alert.innerText = message;
  setTimeout(() => { alert.hidden = true; }, 3000);
}

export default alertWithMessage;
