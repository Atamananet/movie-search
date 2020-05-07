import 'reset-css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'swiper/css/swiper.min.css';
import '../style/custom.scss';
import '../style/main.scss';
import mySwiper from './Swiper';
import './Keyboard';
import alertWithMessage from './alertWithMessage';
import getFilmsByTitle from './getFilmByTitle';
import appendFilms from './appendFilms';
import { input, button, searchPage } from './variables';
import getTrailer from './getTrailer';
import searchHandler from './searchHandler';

// load next 10 films when slides end
mySwiper.on('reachEnd', async () => {
  if (mySwiper.isEnd && mySwiper.activeIndex > 5) {
    debugger;
    searchPage.implement();
    button.innerHTML = '<div class="spinner-border" role="status"></div>';
    const films = await getFilmsByTitle(input.value, searchPage)
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
  const films = await getFilmsByTitle('RED')
    .catch((error) => {
      if (error.message === 'Not found') {
        alertWithMessage(error.message);
      }
    });

  appendFilms(films)
    .finally(() => { button.innerHTML = 'Search'; });
})();

const buttonClear = document.querySelector('.form-search__clear');
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
