import { yandexKey } from './variables';

async function isRussian() {
  const urlDetect = `https://translate.yandex.net/api/v1.5/tr.json/detect?key=${yandexKey}&text=${this.value}&hint=ru,en`;
  const responseLanguage = await fetch(urlDetect);
  const json = await responseLanguage.json();
  if (json.code !== 200) {
    const e = new Error('Failed to translate');
    e.name = 'YandexError'; 
    throw e; 
  }

  return json.lang === 'ru';
}

export default isRussian;
