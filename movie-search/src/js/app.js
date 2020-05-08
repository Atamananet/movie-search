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
player.showTrailer = showTrailer;
const playerContainer = document.querySelector('.player-container');
const swiperContainer = document.querySelector('.swiper-controls-container');
const buttonClear = document.querySelector('.form-search__clear');

// load next 10 films when slides end
mySwiper.on('reachEnd', async () => {
  if (mySwiper.isEnd && mySwiper.activeIndex > 4) {
    searchPage.implement();
    button.innerHTML = '<div class="spinner-border" role="status"></div>';
    const films = await input.getFilmsByTitle(searchPage.current)
      .catch((error) => alertWithMessage(error.message));

    appendFilms(films)
      .catch((e) => {
        alertWithMessage(e);
      })
      .finally(() => {
        setTimeout(() => {
          button.innerHTML = 'Search';
        }, 1500);
      });
  }
});

button.addEventListener('click', searchHandler);

// for start page
(async () => {
  const films = await input.getFilmsByTitle(1, 'red')
    .catch((error) => {
      alertWithMessage(error.message);
    });

  appendFilms(films)
    .finally(() => { button.innerHTML = 'Search'; });
})();

buttonClear.hide = function hide() { this.style.zIndex = -1; };
buttonClear.show = function show() { this.style.zIndex = 1; };

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

// showTrailer handler
document.addEventListener('click', (event) => {
  if (event.target.closest('.swiper-slide__poster')) {
    playerContainer.hidden = false;
    swiperContainer.style.opacity = 0;
    player.showTrailer(mySwiper.clickedIndex);
  } else {
    player.innerHTML = '';
    playerContainer.hidden = true;
    swiperContainer.style.opacity = 1;
  }
});
