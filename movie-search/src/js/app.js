// import 'bootstrap';
import 'reset-css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/all.js';
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
// load next 10 films when slides end
mySwiper.on('reachEnd', async function loadNextPage() {
    if (mySwiper.isEnd && mySwiper.activeIndex > 4) {
        searchPage += 1;
        button.innerHTML = '<div class="spinner-border" role="status"></div>';
        const films = await getFilmsByTitle(input.value, searchPage)
            .catch((error) => console.log(error));

        appendFilms(films)
            .finally(() => button.innerHTML = 'Search');
    }
});

async function getFilmsByTitle(title, page = 1) {
    let response = await fetch(`https://www.omdbapi.com/?s=${title}&apikey=${imdbKey}&i&plot=full&page=${page}`);
    let data = await response.json();

    if (data.Response === 'False') { //
        throw Error(`Not found for "${title}"`);
    }
    return data;
}

async function appendFilms(data) {
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
        .catch((e) => { console.log(e.message); });

    player.innerHTML = '';
    player.append(trailer);
}

button.addEventListener('click', async (event) => {
    event.preventDefault(); // disable form sending and page reloading

    button.innerHTML = '<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>Search';

    // use Yandex Translate API to detect language
    const responseLanguage = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/detect?key=${yandexKey}&text=${input.value}&hint=ru,en`);
    const json = await responseLanguage.json();

    // use Yandex Translate API to translate search request
    if (json.code === 200 && json.lang === 'ru') {
        const responseTranslate = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandexKey}&text=${input.value}&lang=en`);
        const translation = await responseTranslate.json();
        const message = `Showing results for ${translation.text[0]}`;
        alertWithMessage(message, 'primary');
        input.value = translation.text[0];
    }

    // get data with IMDb API
    let films = await getFilmsByTitle(input.value)
        .catch((error) => {
            if (error.message) {
                alertWithMessage(error.message);
                button.innerHTML = 'Search';
            }
        });

    if (!films) { return; }

    mySwiper.removeAllSlides(); // clear swiper container
    appendFilms(films)
        .finally(() => button.innerHTML = 'Search');
});

// show alert message below search
function alertWithMessage(message, type = 'danger') {
    const alert = document.querySelector(`.container__alert .alert-${type}`);
    alert.hidden = false;
    alert.innerText = message;
    setTimeout(() => { alert.hidden = true }, 3000);
}

// for start page
(async () => {
    let films = await getFilmsByTitle('RED')
        .catch((error) => {
            if (error.message = 'Not found') {
                alertWithMessage(error.message);
            }
            //console.error('URLRequestError:' + error.message);
        });

    appendFilms(films)
        .finally(() => button.innerHTML = 'Search');
})();

const buttonClear = document.querySelector('.form-search__clear');
buttonClear.hide = function () { this.style.zIndex = -1; }
buttonClear.show = function () { this.style.zIndex = 1; }

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
    } else { // if click in input
        if (input.value) { // show if input not empty
            buttonClear.show();
        }
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
        return;
    } else {
        player.innerHTML = '';
        playerContainer.hidden = true;
        swiperContainer.style.opacity = 1;
    }
});