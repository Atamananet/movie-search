import { slidesArray } from './variables';

/**
 * Show Youtube video in container
 *
 * Used 'slideIndex' as a paramert to find current slide
 * and add Youtube player iframe into 'this'   
 * 
 * @param {number} slideIndex     Used to get current Slide object in slidesArray
 */
async function showTrailer(slideIndex) {
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
