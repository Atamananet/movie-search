// import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import 'swiper/css/swiper.min.css';
import '../css/main.css';
import mySwiper from './Swiper';
import Slide from './Slide';
import keyboard from './Keyboard';

const apiKey = '1d7bd802'; // private key 
const yandexApiKey = 'trnsl.1.1.20200430T142719Z.fc3de47da4df3577.547da0b45a7aa24ade7fcb685ee1a79adfe22b16';
const input = document.querySelector('.form-search__input');
const button = document.querySelector('.form-search__button');
const swiperWrapper = document.querySelector('.swiper-wrapper');
let searchPage = 0; // search page param


// load next 10 films when slides end
mySwiper.on('reachEnd', async function loadNextPage() {
    if (mySwiper.isEnd && mySwiper.activeIndex > 4) {
        searchPage += 1;
        if (mySwiper.pagination.bullets.length > 20) {
            mySwiper.pagination.bullets.length = 20;
        }
        button.innerHTML = '<div class="spinner-border" role="status"></div>';
        const films = await getFilmsByTitle(input.value, searchPage)
            .catch((error) => console.log(error));

        appendFilms(films)
            .finally(() => button.innerHTML = 'Search');
    }
});

async function getFilmsByTitle(title, page = 1) {
    let response = await fetch(`http://www.omdbapi.com/?s=${title}&apikey=${apiKey}&i&plot=full&page=${page}`);
    let data = await response.json();

    if (data.Response === 'False') { //
        throw Error('Not found');
    }
    return data;
}

async function appendFilms(data) {
    if (!data) { return; }
    // push search results into swiper 
    data.Search.forEach((film) => {
        const swiperSlide = document.createElement('DIV');
        swiperSlide.className = 'swiper-slide';
        const slideData = new Slide(film);
        mySwiper.appendSlide(slideData.getElements());
    });
}



button.addEventListener('click', async (event) => {
    event.preventDefault(); // disable form sending and page reloading

    button.innerHTML = '<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>Search';

    // use Yandex Translate API to detect language
    const responseLanguage = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/detect?key=${yandexApiKey}&text=${input.value}&hint=ru,en`);
    const json = await responseLanguage.json();

    // use Yandex Translate API to translate search request
    if (json.code === 200 && json.lang === 'ru') {
        const responseTranslate = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandexApiKey}&text=${input.value}&lang=en`);
        const translation = await responseTranslate.json();
        const message = `Showing results for ${translation.text[0]}`;
        alertWithMessage(message, 'primary');
        input.value = translation.text[0];
    }

    // get data with IMDb API
    let films = await getFilmsByTitle(input.value)
        .catch((error) => {
            if (error.message = 'Not found') {
                alertWithMessage(error.message);
                button.innerHTML = 'Search';
            }
            console.error('URLRequestError:' + error.message);
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
    let films = await getFilmsByTitle('interstellar')
        .catch((error) => {
            if (error.message = 'Not found') {
                alertWithMessage(error.message);
            }
            console.error('URLRequestError:' + error.message);
        });

    appendFilms(films)
        .finally(() => button.innerHTML = 'Search');
})();

document.querySelector('.form-search__keyboard').addEventListener('click', (event) => {
    event.preventDefault();

    if (!document.querySelector('.keyboard')) {
        keyboard.init();
        return;
    }

    const isKeyboardShow = document.querySelector('.keyboard:not([hidden])');

    if (isKeyboardShow) {
        input.disabled = false;
        keyboard.hide();
        return;
    }

    input.disabled = true;
    keyboard.show();    
});
