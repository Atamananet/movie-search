import { slidesArray } from './variables';
import alertWithMessage from './alertWithMessage';

// add youtube trailer
async function showTrailer(slideIndex) {
  // get mySwiper.clickedIndex
  const slide = slidesArray[slideIndex];
  const trailer = await slide.getTrailerIframe();

  if (!trailer) {
    const stug = document.createElement('DIV');
    stug.className = 'stug';
    this.append(stug);
    return;
  }
  this.innerHTML = '';
  this.append(trailer);
}

export default showTrailer;
