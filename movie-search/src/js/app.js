//import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swiper from 'swiper';
import 'swiper/css/swiper.min.css';
import '../css/main.css';

const apikey = '1d7bd802'; // private key 
const input = document.querySelector('.form-search__input');
const button = document.querySelector('.form-search__button');
const swiperWrapper = document.querySelector('.swiper-wrapper');
const mySwiper = new Swiper('.swiper-container', {
    speed: 400,
    //spaceBetween: 50,
    slidesPerView: 2
});

async function setTitle(title) {
    let response = await fetch(`http://www.omdbapi.com/?s=${title}&apikey=${apikey}`);
    let data = await response.json();
    
    mySwiper.removeAllSlides();
    
    data.Search.forEach((film) => {
        const swiperSlide = document.createElement('DIV');
        swiperSlide.className = 'swiper-slide';
        const slideData = new Slide(film);
        mySwiper.appendSlide(slideData.getElements()); 
    });

    swiperWrapper.children[0].classList.add('swiper-slide-active');
    swiperWrapper.children[1].classList.add('swiper-slide-next');

    // Array.prototype.forEach.call(mySwiper.slides, ((slide, index) => {
    //     const slideData = new Search(data.Search[index]); 
    //     slide.append(...slideData.getElements());
    // }));
}

class Slide {
    constructor(searchObject) {
        this.title = searchObject.Title;
        this.poster = new Image(200,400);
        this.poster.src = searchObject.Poster;
        this.year = searchObject.Year;
    }

    getElements() {
        const title = document.createElement('DIV');
        const poster = document.createElement('DIV');
        const year = document.createElement('DIV');
        const wrapper = document.createElement('DIV');

        title.className = 'swiper-slide__title';
        poster.className = 'swiper-slide__poster';
        year.className = 'swiper-slide__year';
        wrapper.className = 'swiper-slide';

        title.innerHTML = this.title;
        poster.append(this.poster);
        year.innerHTML = this.year;
        wrapper.append(title, poster, year);

        return wrapper;
    }
}







button.addEventListener('click', (event) => {
    event.preventDefault(); // disable form sending
    let title = input.value;
    setTitle(title, 0);
});


