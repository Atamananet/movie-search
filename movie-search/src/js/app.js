import 'reset-css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css/swiper.min.css';
import '../style/custom.scss';
import '../style/main.scss';
import mySwiper from './Swiper';
import Slide from './Slide';
import './Keyboard';

const imdbKey = '1d7bd802'; // private key
const yandexKey = 'trnsl.1.1.20200430T142719Z.fc3de47da4df3577.547da0b45a7aa24ade7fcb685ee1a79adfe22b16';
const input = document.querySelector('.form-search__input');
const button = document.querySelector('.form-search__button');
let searchPage = 0; // search page IMDbAPI param
const slidesArray = [];

async function getFilmsByTitle(title, page = 1) {
  const url = `https://www.omdbapi.com/?s=${title}&apikey=${imdbKey}&i&plot=full&page=${page}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === 'False') { //
    throw Error(`Not found for " ${title} "`);
  }
  return data;
}

async function appendFilms(data) {
  if (!data) { return; }
  // push search results into swiper
  data.Search.forEach(async (film) => {
    const swiperSlide = document.createElement('DIV');
    swiperSlide.className = 'swiper-slide';
    const slideData = new Slide(film);
    slidesArray.push(slideData);
    mySwiper.appendSlide(slideData.getElements());
  });
}

async function getTrailer(slideIndex) {
  // get mySwiper.clickedIndex
  // add youtube trailer
  const player = document.getElementById('player');
  const slide = slidesArray[slideIndex];
  const trailer = await slide.getTrailerIframe()
    .catch((e) => { alertWithMessage(e.message); });

  player.innerHTML = '';
  player.append(trailer);
}

// show alert message below search
function alertWithMessage(message, type = 'danger') {
  const alert = document.querySelector(`.container__alert .alert-${type}`);
  alert.hidden = false;
  alert.innerText = message;
  setTimeout(() => { alert.hidden = true; }, 3000);
}

async function searchHandler(event) {
  event.preventDefault(); // disable form sending and page reloading

  button.innerHTML = '<div class="spinner-border" role="status"><span class="sr-only"></span></div>';
  // use Yandex Translate API to detect language
  try {
    if (!input.value) {
      throw Error('Yandex API error: empty request');
    }
    const urlDetect = `https://translate.yandex.net/api/v1.5/tr.json/detect?key=${yandexKey}&text=${input.value}&hint=ru,en`;
    const responseLanguage = await fetch(urlDetect);
    const json = await responseLanguage.json();
    // use Yandex Translate API to translate search request
    debugger;
    if (json.code === 200 && json.lang === 'ru') {
      const urlTranslate = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandexKey}&text=${input.value}&lang=en`;
      const responseTranslate = await fetch(urlTranslate);
      const translation = await responseTranslate.json();
      const message = `Showing results for ${translation.text[0]}`;
      alertWithMessage(message, 'primary');
      [input.value] = translation.text;
      debugger;
    }
  } catch (e) {
    alertWithMessage(e);
  }

  // get data with IMDb API
  const films = await getFilmsByTitle(input.value)
    .catch((error) => {
      if (error.message) {
        alertWithMessage(error.message);
        button.innerHTML = 'Search';
      }
    });

  if (!films) { return; }

  mySwiper.removeAllSlides(); // clear swiper container
  slidesArray.length = 0;
  appendFilms(films)
    .finally(() => { button.innerHTML = 'Search'; });
}

// load next 10 films when slides end
mySwiper.on('reachEnd', async () => {
  if (mySwiper.isEnd) {
    searchPage += 1;
    button.innerHTML = '<div class="spinner-border" role="status"></div>';
    const films = await getFilmsByTitle(input.value, searchPage)
      .catch((error) => alertWithMessage(error.message));

    appendFilms(films)
      .catch((e) => {
        alertWithMessage(e);
      })
      .finally(() => { button.innerHTML = 'Search'; });
  }
});

button.addEventListener('click', searchHandler);

// for start page
(async () => {
  const films = await getFilmsByTitle('RED')
    .catch((error) => {
      if (error.message === 'Not found') {
        alertWithMessage(error.message);
      }
      // console.error('URLRequestError:' + error.message);
    });

  appendFilms(films)
    .finally(() => { button.innerHTML = 'Search'; });
})();

const buttonClear = document.querySelector('.form-search__clear');
buttonClear.hide = function () { this.style.zIndex = -1; };
buttonClear.show = function () { this.style.zIndex = 1; };

// clear button show/hide
input.addEventListener('input', () => {
  if (input.value === '') {
    buttonClear.hide();
  } else {
    buttonClear.show();
  }
});

// clear-input button click event
document.addEventListener('click', (event) => {
  // clear input on click
  if (event.target.closest('.form-search__clear')) {
    input.value = '';
    buttonClear.hide();
  }
  // hide button if click not in input
  if (!event.target.closest('.form-search__input')) {
    buttonClear.hide();
    return;
  }
  // if click in input
  if (input.value) { // show if input not empty
    buttonClear.show();
  }
});

// getTrailer handler
document.addEventListener('click', (event) => {
  const player = document.querySelector('#player');
  const playerContainer = document.querySelector('.player-container');
  const swiperContainer = document.querySelector('.swiper-controls-container');
  if (event.target.closest('.swiper-slide__poster')) {
    playerContainer.hidden = false;
    swiperContainer.style.opacity = 0;
    getTrailer(mySwiper.clickedIndex);
  } else {
    player.innerHTML = '';
    playerContainer.hidden = true;
    swiperContainer.style.opacity = 1;
  }
});
