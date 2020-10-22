import 'reset-css';
import '../style/custom.scss';
import '../style/main.scss';
// import './Keyboard';
import mySwiper from './Swiper';
import alertWithMessage from './alertWithMessage';
import appendFilms from './appendFilms';
import searchHandler from './searchHandler';
import {
  input,
  button,
  player,
  playerContainer,
  swiperContainer,
  buttonClear
} from './variables';


button.addEventListener('click', searchHandler);

// for start page
(async () => {
  const films = await input.getFilmsByTitle(1, 'red');
  button.innerHTML = 'Search';
  appendFilms(films);
})();


// clear button show/hide
input.addEventListener('input', () => {
  !input.value.length ? buttonClear.hide() : buttonClear.show();
});

// clear-input button click event
buttonClear.addEventListener('click', () => {
  input.value = '';
});

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

document.addEventListener('DOMContentLoaded', (e) => import('./Keyboard')
  .then(module => {
    const keyboard = module.default;
    keyboard.init();
    keyboard.hide();
  })
);