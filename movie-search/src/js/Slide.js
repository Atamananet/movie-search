import movieTrailer from 'movie-trailer';

class Slide {
  constructor(json) {
    this.apiKey = '1d7bd802'; // private key
    this.title = json.Title;
    this.poster = new Image(270, 400);
    this.poster.src = json.Poster === 'N/A' ? './src/img/no-poster-available.png' : json.Poster;
    this.year = json.Year;
    this.imdbID = json.imdbID;
    this.url = `https://www.omdbapi.com/?i=${this.imdbID}&plot=full&apikey=${this.apiKey}`;
    this.starsLine = document.createElement('DIV');
    this.starsLine.className = 'swiper-slide__stars';
    this.rating = document.createElement('DIV');
    this.rating.className = 'swiper-slide__rating';
    this.trailerID = null;
  }

  getElements() {
    const title = document.createElement('A');
    const poster = document.createElement('DIV');
    const year = document.createElement('DIV');
    const wrapper = document.createElement('DIV');

    title.className = 'swiper-slide__title';
    poster.className = 'swiper-slide__poster';
    year.className = 'swiper-slide__year';
    wrapper.className = 'swiper-slide';

    title.innerText = this.title;
    title.href = `https://www.imdb.com/title/${this.imdbID}/videogallery/`;
    poster.append(this.rating, this.poster);
    year.innerHTML = this.year;
    this.setRating();
    wrapper.append(title, poster, year, this.starsLine);

    return wrapper;
  }

  async setRating() {
    const response = await fetch(this.url);
    const data = await response.json();
    if (data.imdbRating === 'N/A') {
      this.starsLine.innerHTML = '';
      this.rating.outerHTML = '';
    } else {
      const rating = Math.round(data.imdbRating);
      const [full, half] = [Math.floor(rating / 2), Math.floor(rating % 2)];
      const sFull = '<i class="fas fa-star fass_full"></i>';
      const sHalf = '<i class="fas fa-star-half-alt"></i>';
      const sPool = '<i class="far fa-star fass_pool"></i>';
      this.starsLine.innerHTML += sFull.repeat(full);
      this.starsLine.innerHTML += sHalf.repeat(half);
      this.starsLine.innerHTML += sPool.repeat(5 - full - half);
      this.rating.innerHTML = `<span>IMDb<span> ${data.imdbRating}`;
    }
  }

  async getTrailerIframe() {
    if (!this.title) { return null; }

    const youtubeID = await movieTrailer(this.title, { id: true });

    if (!youtubeID) {
      throw Error('trailer not found');
    }
    const iframe = document.createElement('IFRAME');
    iframe.src = `https://www.youtube.com/embed/${youtubeID}`;
    iframe.frameborder = 0;
    iframe.encryptedMedia = true;
    iframe.allowfullscreen = true;
    iframe.className = 'youtube-video';

    return iframe;
  }
}

export default Slide;
