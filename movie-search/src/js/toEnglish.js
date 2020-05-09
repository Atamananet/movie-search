import { yandexKey } from './variables';
import alertWithMessage from './alertWithMessage';

const TRANSLATED = 0;

async function toEnglish() {
  const urlTranslate = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandexKey}&text=${this.value}&lang=en`;
  const responseTranslate = await fetch(urlTranslate);
  const translation = await responseTranslate.json();
  
  if (!translation) {
    throw Error(`Can't translate ${this.value}`);
  }

  const message = `Showing results for ${translation.text[TRANSLATED]}`;
  alertWithMessage(message, 'primary');

  return translation.text[TRANSLATED];
}

export default toEnglish;

