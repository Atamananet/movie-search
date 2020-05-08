import { slidesArray } from './variables';
import alertWithMessage from './alertWithMessage';
import mySwiper from './Swiper';
import appendFilms from './appendFilms';
import getFilmsByTitle from './getFilmsByTitle';
import toEnglish from './toEnglish';
import isRussian from './isRussian';

Element.prototype.getFilmsByTitle = getFilmsByTitle;
Element.prototype.isRussian = isRussian;
Element.prototype.toEnglish = toEnglish;

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

    // use Yandex Translate API to translate search request
    if (input.isRussian()) {
      // translate input value to english
      input.value = await input.toEnglish();
    }
  } catch (e) {
    alertWithMessage(e);
  }
  // get data with IMDb API
  const films = await input.getFilmsByTitle()
    .catch((error) => {
      setTimeout(() => {
        alertWithMessage(error.message);
        button.innerHTML = 'Search';
      }, 1500);
    });

  if (!films) { return; }

  mySwiper.removeAllSlides(); // clear swiper container
  slidesArray.length = 0;
  appendFilms(films);
}

export default searchHandler;
