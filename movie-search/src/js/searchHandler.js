import { yandexKey, slidesArray } from './variables';
import alertWithMessage from './alertWithMessage';
import mySwiper from './Swiper';
import appendFilms from './appendFilms';
import getFilmsByTitle from './getFilmByTitle';

async function searchHandler(event) {
  event.preventDefault(); // disable form sending and page reloading

  const button = document.querySelector('.form-search__button');
  button.innerHTML = '<div class="spinner-border" role="status"><span class="sr-only"></span></div>';

  // use Yandex Translate API to detect language
  const input = document.querySelector('.form-search__input');
  try {
    if (!input.value) {
      throw Error('Yandex API error: empty request');
    }
    const urlDetect = `https://translate.yandex.net/api/v1.5/tr.json/detect?key=${yandexKey}&text=${input.value}&hint=ru,en`;
    const responseLanguage = await fetch(urlDetect);
    const json = await responseLanguage.json();
    // use Yandex Translate API to translate search request
    if (json.code === 200 && json.lang === 'ru') {
      const urlTranslate = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandexKey}&text=${input.value}&lang=en`;
      const responseTranslate = await fetch(urlTranslate);
      const translation = await responseTranslate.json();
      const message = `Showing results for ${translation.text[0]}`;
      alertWithMessage(message, 'primary');
      [input.value] = translation.text;
    }
  } catch (e) {
    alertWithMessage(e);
  }
  // get data with IMDb API
  const films = await getFilmsByTitle(input.value)
    .catch((error) => {
      if (error.message) {
        setTimeout(() => {
          alertWithMessage(error.message);
          button.innerHTML = 'Search';
        }, 1500);
      }
    });

  if (!films) { return; }

  mySwiper.removeAllSlides(); // clear swiper container
  slidesArray.length = 0;
  appendFilms(films)
    .finally(() => {
      setTimeout(() => {
        button.innerHTML = 'Search';
      }, 1500);
    });
}

export default searchHandler;
