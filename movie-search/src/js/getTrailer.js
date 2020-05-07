import { slidesArray } from './variables';
import alertWithMessage from './alertWithMessage';

async function getTrailer(slideIndex) {
  // get mySwiper.clickedIndex
  // add youtube trailer
  const player = document.getElementById('player');
  const slide = slidesArray[slideIndex];
  const trailer = await slide.getTrailerIframe()
    .catch((e) => {
      alertWithMessage(e.message);
    });
  if (!trailer) {
    const stug = document.createElement('DIV');
    stug.className = 'stug';
    player.append(stug);
    return;
  }
  player.innerHTML = '';
  player.append(trailer);
}


export default getTrailer;
