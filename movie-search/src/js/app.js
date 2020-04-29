//import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swiper from 'swiper';
import 'swiper/css/swiper.min.css';
import '../css/main.css';

const apikey = '1d7bd802'; // private key 
const input = document.querySelector('.form-search__input');
const button = document.querySelector('.form-search__button');
const swiperWrapper = document.querySelector('.swiper-wrapper');
let searchPage = 1; // search page param
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
            spaceBetween: 20
        },
        // when window width is >= 640px
        640: {
            slidesPerView: 2,
            spaceBetween: 40
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 40
        },
        1300: {
            slidesPerView: 4,
            spaceBetween: 40
        }
    },
    mousewheel: {
        invert: true,
    },
});

mySwiper.on('slideChange', async function loadNextPage() {
    if (mySwiper.isEnd) {
        searchPage += 1;
        button.innerHTML = '<div class="spinner-border" role="status"></div>';
        const films = await getFilmsByTitle(input.value, searchPage)
            .catch((error) => {
                console.log(error)
            });

        appendFilms(films)
            .then(() => mySwiper.slideNext())
            .catch((error) => console.log(error))
            .finally(() => button.innerHTML = 'Search');
    }
});

async function getFilmsByTitle(title, page = 1) {
    let response = await fetch(`http://www.omdbapi.com/?s=${title}&apikey=${apikey}&i&plot=full&page=${page}`);
    let data = await response.json();

    if (data.Response === 'False') { // not found
        throw Error('Not found');
    }
    return data;
}

async function appendFilms(data) {
    if (!data) { return; }

    if (data.Response === 'False') { // not found
        mySwiper.appendSlide('<div class="swiper-slide">Not found</div>');
        throw Error('Not found');
    }
    debugger;
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
        this.url = `http://www.omdbapi.com/?i=${this.imdbID}&plot=full&apikey=${apikey}`;
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
        this.rating.innerText = data.imdbRating;
    }
}

button.addEventListener('click', async (event) => {
    event.preventDefault(); // disable form sending
    mySwiper.removeAllSlides(); // clear swiper container

    button.innerHTML = '<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>Search';
    let title = input.value;
    let films = await getFilmsByTitle(title)
        .catch((error) => {
            console.log(error);
            return;
        });
    appendFilms(films)
        .finally(() => button.innerHTML = 'Search')
        .catch((error) => {
            console.log(error);
            return;
        });
});


