import { yandexKey } from './variables';

async function isRussian() {
  const urlDetect = `https://translate.yandex.net/api/v1.5/tr.json/detect?key=${yandexKey}&text=${this.value}&hint=ru,en`;
  const responseLanguage = await fetch(urlDetect);
  const json = await responseLanguage.json();

  return !!(json.code === 200 && json.lang === 'ru');
}

export default isRussian;
