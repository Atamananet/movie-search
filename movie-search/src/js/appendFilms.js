import Slide from './Slide';
import mySwiper from './Swiper';
import { slidesArray } from './variables';

async function appendFilms(data) {
  if (!data) { return; }
  // push search results into swiper
  data.Search.forEach(async (film) => {
    const swiperSlide = document.createElement('DIV');
    swiperSlide.className = 'swiper-slide';
    const slideData = new Slide(film);
    slidesArray.push(slideData);
    mySwiper.appendSlide(slideData.getElements());
  });
}

export default appendFilms;
