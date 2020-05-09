import 'reset-css';
import '../style/custom.scss';
import '../style/main.scss';
import './Keyboard';
import mySwiper from './Swiper';
import alertWithMessage from './alertWithMessage';
import appendFilms from './appendFilms';
import showTrailer from './showTrailer';
import searchHandler from './searchHandler';
import { input, button, searchPage } from './variables';

const player = document.querySelector('#player');
const playerContainer = document.querySelector('.player-container');
const swiperContainer = document.querySelector('.swiper-controls-container');
const buttonClear = document.querySelector('.form-search__clear');

player.showTrailer = showTrailer;

buttonClear.hide = function hide() { this.style.zIndex = -1; };
buttonClear.show = function show() { this.style.zIndex = 1; };

// load next 10 films when slides end
mySwiper.on('reachEnd', async () => {
  if (mySwiper.isEnd && mySwiper.activeIndex > 4 && input.value) {
    searchPage.implement();
    button.innerHTML = '<div class="spinner-border" role="status"></div>';
    const films = await input.getFilmsByTitle(searchPage.current)
      .catch((error) => alertWithMessage(error.message));

    appendFilms(films)
      .catch((error) => alertWithMessage(error.message));

    setTimeout(() => {
      button.innerHTML = 'Search';
    }, 1500);
  }
});

button.addEventListener('click', searchHandler);

// for start page
(async () => {
  const films = await input.getFilmsByTitle(1, 'red');
  button.innerHTML = 'Search';
  appendFilms(films);
})();


// clear button show/hide
input.addEventListener('input', () => {
  if (input.value === '') {
    buttonClear.hide();
  }
  else { buttonClear.show(); }
});

// clear-input button click event
buttonClear.addEventListener('click', () => { input.value = ''; });

// showTrailer handler
document.addEventListener('click', (event) => {
  if (event.target.closest('.swiper-slide__poster')) {
    player.showTrailer(mySwiper.clickedIndex)
      .then(() => {
        playerContainer.hidden = false;
        swiperContainer.style.opacity = 0;
      })
      .catch((e) => {
        if (e.message === 'API - No results found') {
          alertWithMessage('No trailer found');
        }
      });

  } else {
    player.innerHTML = '';
    playerContainer.hidden = true;
    swiperContainer.style.opacity = 1;
  }
});
