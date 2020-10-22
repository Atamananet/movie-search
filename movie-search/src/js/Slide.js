import movieTrailer from 'movie-trailer';
import {imdbKey} from './variables';

const _createElement = (tag, className, innerText = "") => {
  const elem = document.createElement(tag);
  elem.innerText = innerText;
  elem.classList.add(className);
  return elem;
}

class Slide {
  constructor(json) {
    this.apiKey = imdbKey; // private key
    this.title = json.Title;
    this.poster = new Image(270, 400);
    this.poster.src = json.Poster === 'N/A' ? './src/img/no-poster-available.png' : json.Poster;
    this.year = json.Year;
    this.imdbID = json.imdbID;
    this.url = `https://www.omdbapi.com/?i=${this.imdbID}&plot=full&apikey=${this.apiKey}&type=movie`;
    this.starsLine = _createElement('DIV', 'swiper-slide__stars');
    this.rating = _createElement('DIV', 'swiper-slide__rating');
    this.trailerID = null;
  }

  getFilm() {
    const title = _createElement('A', 'swiper-slide__title', this.title);
    const poster = _createElement('DIV', 'swiper-slide__poster');
    const year = _createElement('DIV', 'swiper-slide__year', this.year);
    const film = _createElement('DIV', 'swiper-slide');

    title.href = `https://www.imdb.com/title/${this.imdbID}/videogallery/`;
    poster.append(this.rating, this.poster);
    this.setRating();
    film.append(title, poster, year, this.starsLine);

    return film;
  }

  async setRating() {
    const response = await fetch(this.url);
    this.data = await response.json();
    
    if (this.data.imdbRating === 'N/A') {
      this.starsLine.innerHTML = '';
      this.rating.outerHTML = '';
    } else {
      const rating = Math.round(this.data.imdbRating);
      const [full, half] = [Math.floor(rating / 2), Math.floor(rating % 2)];
      
      const sFull = '<i class="fas fa-star fass_full"></i>';
      const sHalf = '<i class="fas fa-star-half-alt"></i>';
      const sPool = '<i class="far fa-star fass_pool"></i>';
      
      this.starsLine.innerHTML += sFull.repeat(full);
      this.starsLine.innerHTML += sHalf.repeat(half);
      this.starsLine.innerHTML += sPool.repeat(5 - full - half);
      this.rating.innerHTML = `<span>IMDb<span> ${this.data.imdbRating}`;
    }
  }

  async getTrailerIframe() {
    if (!this.title) { return null; }

    const youtubeID = await movieTrailer(this.title, { id: true });

    if (!youtubeID) {
      throw Error('trailer not found');
    }
    const iframe = _createElement('IFRAME', 'youtube-video');
    
    iframe.src = `https://www.youtube.com/embed/${youtubeID}`;
    iframe.frameborder = 0;
    iframe.encryptedMedia = true;
    iframe.allowfullscreen = true;

    return iframe;
  }
}

export default Slide;
