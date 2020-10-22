import Swiper from 'swiper';
import 'swiper/swiper.scss';
import appendFilms from './appendFilms';
import alertWithMessage from './alertWithMessage';
import './description';

import {
  input,
  button,
  searchPage
} from './variables';

const mySwiper = new Swiper('.swiper-container', {
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  speed: 400,
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    // when window width is >= 640px
    560: {
      slidesPerView: 2,
      spaceBetween: 15,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
    1300: {
      slidesPerView: 5,
      spaceBetween: 40,
    },
  },
  mousewheel: {
    invert: true,
  },
  pagination: {
    el: '.swiper-pagination',
    type: 'bullets',
  },
});

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

export default mySwiper;