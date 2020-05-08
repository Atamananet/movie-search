import Slide from './Slide';
import mySwiper from './Swiper';
import { slidesArray } from './variables';

async function appendFilms(data) {
  if (!data) { return; }
  // push search results into swiper
  data.Search.forEach(async (film) => {
    const swiperSlide = document.createElement('DIV');
    const slideData = new Slide(film);
    
    swiperSlide.className = 'swiper-slide';
    slidesArray.push(slideData);
    mySwiper.appendSlide(slideData.getFilm());
  });
}

export default appendFilms;
