const yandexKey = 'trnsl.1.1.20200430T142719Z.fc3de47da4df3577.547da0b45a7aa24ade7fcb685ee1a79adfe22b16';
const input = document.querySelector('.form-search__input');
const button = document.querySelector('.form-search__button');
const searchPage = { // search page IMDbAPI param
    current: 0,
    implement() { this.current++; },
    get () { return this.current; }
}; 

const slidesArray = [];

export {
  yandexKey, input, button, searchPage, slidesArray,
};
