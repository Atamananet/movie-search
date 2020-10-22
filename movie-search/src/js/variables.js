import showTrailer from './showTrailer';

/** private key to Yandex Transate API */
const yandexKey = 'trnsl.1.1.20200430T142719Z.fc3de47da4df3577.547da0b45a7aa24ade7fcb685ee1a79adfe22b16';
const imdbKey = '1d7bd802';

const input = document.querySelector('.form-search__input');
const button = document.querySelector('.form-search__button');
/** 
@mixin 
search page IMDbAPI param
*/
const searchPage = { 
  current: 0,
  implement() { this.current += 1; },
  get() { return this.current; },
};

/** @type { Slide }  Array with current slides */
const slidesArray = [];

const player = document.querySelector('#player');
player.showTrailer = showTrailer;

const playerContainer = document.querySelector('.player-container');
const swiperContainer = document.querySelector('.swiper-controls-container');
const buttonClear = document.querySelector('.form-search__clear');

Element.prototype.hide = function() { this.style.zIndex = -1; }
Element.prototype.show = function() { this.style.zIndex = 1; }

export {
  yandexKey, imdbKey, input, button, searchPage, slidesArray, player, playerContainer, swiperContainer, buttonClear
};
