// show alert message below search
function alertWithMessage(message, type = 'danger') {
  const alert = document.querySelector(`.container__alert .alert-${type}`);
  alert.hidden = false;
  alert.innerText = message;
  setTimeout(() => { alert.hidden = true; }, 3000);
}

export default alertWithMessage;
