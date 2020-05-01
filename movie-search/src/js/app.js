//import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import Swiper from 'swiper';
import 'swiper/css/swiper.min.css';
import '../css/main.css';

const apiKey = '1d7bd802'; // private key 
const yandexApiKey = 'trnsl.1.1.20200430T142719Z.fc3de47da4df3577.547da0b45a7aa24ade7fcb685ee1a79adfe22b16';
const input = document.querySelector('.form-search__input');
const button = document.querySelector('.form-search__button');
const swiperWrapper = document.querySelector('.swiper-wrapper');
let searchPage = 0; // search page param
const mySwiper = new Swiper('.swiper-container', {
    autoHeight: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    speed: 400,
    breakpoints: {
        // when window width is >= 320px
        320: {
            slidesPerView: 1,
            spaceBetween: 20
        },
        // when window width is >= 640px
        567: {
            slidesPerView: 2,
            spaceBetween: 40
        },
        767: {
            slidesPerView: 3,
            spaceBetween: 40
        },
        1024: {
            slidesPerView: 4,
            spaceBetween: 40
        },
        1300: {
            slidesPerView: 5,
            spaceBetween: 40
        }
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
mySwiper.on('reachEnd', async function loadNextPage() {
    if (mySwiper.isEnd && mySwiper.activeIndex > 4) {
        searchPage += 1;
        if (mySwiper.pagination.bullets.length > 20){
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

class Slide {
    constructor(searchObject) {
        this.title = searchObject.Title;
        this.poster = new Image(270, 400);
        this.poster.src = searchObject.Poster === 'N/A' ? './src/img/no-poster-available.png' : searchObject.Poster;
        this.year = searchObject.Year;
        this.imdbID = searchObject.imdbID;
        this.url = `http://www.omdbapi.com/?i=${this.imdbID}&plot=full&apikey=${apiKey}`;
        this.rating = document.createElement('DIV');
        this.rating.className = 'swiper-slide__rating';
    }

    getElements() {
        const title = document.createElement('A');
        const poster = document.createElement('DIV');
        const year = document.createElement('DIV');
        const wrapper = document.createElement('DIV');
        const rating = document.createElement('DIV');

        title.className = 'swiper-slide__title';
        poster.className = 'swiper-slide__poster';
        year.className = 'swiper-slide__year';
        wrapper.className = 'swiper-slide';
        rating.className = 'swiper-slide__rating';

        title.innerText = this.title;
        title.href = `https://www.imdb.com/title/${this.imdbID}`;
        poster.append(this.poster);
        year.innerHTML = this.year;
        this.setRating();
        wrapper.append(title, poster, year, this.rating);

        return wrapper;
    }

    async setRating() {
        let response = await fetch(this.url);
        let data = await response.json();
        if (data.imdbRating === 'N/A') {
            this.rating.innerHTML = 0;
        } else {
            const fromFive = Math.floor(data.imdbRating / 2);
            const starFull = '<i class="fas fa-star fass_full"></i>';
            const starPool = '<i class="fas fa-star fass_pool"></i>';
            this.rating.innerHTML = starFull.repeat(fromFive) + starPool.repeat(5 - fromFive) + data.imdbRating;
        }
    }
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
    
    if (!films) {return; }

    mySwiper.removeAllSlides(); // clear swiper container
    appendFilms(films)
        .finally(() => button.innerHTML = 'Search');
});

// show alert message below search
function alertWithMessage(message) {
    const alert = document.querySelector('.container__alert .alert');
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