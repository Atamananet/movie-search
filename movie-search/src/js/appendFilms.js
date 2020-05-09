import Slide from './Slide';
import mySwiper from './Swiper';
import { slidesArray } from './variables';


/**
 * Add slides into Swiper
 * 
 * Сonverts data received from the API into Slide objects
 * and adds them to the slider
 *
 * @param {Object} data   response.json() from OMDb API.
 * 
 * @return {Promise}
 */
async function appendFilms(data) {
  if (!data || !data.hasOwnProperty('Search')) {
    throw Error('No more films');
  }
  // push search results into swiper
  data.Search.forEach(async (film) => {
    const swiperSlide = document.createElement('DIV');
    const slideData = new Slide(film);

    swiperSlide.className = 'swiper-slide';
    slidesArray.push(slideData);
    mySwiper.appendSlide(slideData.getFilm());
    mySwiper.update(); // let it be
  });
}

export default appendFilms;
