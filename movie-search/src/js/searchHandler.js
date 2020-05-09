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
  try {
    const input = document.querySelector('.form-search__input');
    if (!input.value) {
      throw Error('Yandex API error: empty request');
    }

    if (await input.isRussian()) { // use Yandex Translate API to translate search request
      input.value = await input.toEnglish(); // translate input value to english
    }
    const films = await input.getFilmsByTitle(); // get data with IMDb API

    if (films.Response !== 'True') {
      throw Error(`Not found for ${input.value}`);
    }

    mySwiper.removeAllSlides(); // clear swiper container
    slidesArray.length = 0;
    appendFilms(films);
    button.innerHTML = 'Search';
  } catch (error) {
    button.innerHTML = 'Search';
    if (error.message == 'Failed to fetch') {
      alertWithMessage('No internet connection');
      return;
    }
    alertWithMessage(error);
  }
}

export default searchHandler;
