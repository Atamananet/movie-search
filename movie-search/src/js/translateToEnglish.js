import { yandexKey } from './variables';
import alertWithMessage from './alertWithMessage';

const TRANSLATED = 0;

async function translateToEnglish() {
    const urlTranslate = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandexKey}&text=${this.value}&lang=en`;
    const responseTranslate = await fetch(urlTranslate);
    const translation = await responseTranslate.json();

    const message = `Showing results for ${translation.text[TRANSLATED]}`;
    alertWithMessage(message, 'primary');
    
    return translation.text[TRANSLATED];
}

const input = document.querySelector('.form-search__input') || {};
input.toEnglish = translateToEnglish;

