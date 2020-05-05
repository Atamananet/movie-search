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
        this.starsContainer = document.createElement('DIV');
        this.starsContainer.className = 'swiper-slide__stars';
        this.rating = document.createElement('DIV');
        this.rating.className = 'swiper-slide__rating';
        this.trailerID;
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
        wrapper.append(title, poster, year, this.starsContainer);

        return wrapper;
    }

    async setRating() {
        let response = await fetch(this.url);
        let data = await response.json();
        if (data.imdbRating === 'N/A') {
            this.starsContainer.innerHTML = 0;
        } else {
            const rating = Math.round(data.imdbRating);
            const [full, half] = [Math.floor(rating / 2), Math.floor(rating % 2)];
            const starFull = '<i class="fas fa-star fass_full"></i>';
            const starHalf = '<i class="fas fa-star-half-alt"></i>';
            const starPool = '<i class="far fa-star fass_pool"></i>';
            this.starsContainer.innerHTML = starFull.repeat(full) + starHalf.repeat(half) + starPool.repeat(5 - full - half);
            this.rating.innerHTML = `<span>IMDb<span> ${data.imdbRating}`;
        }
    }

    async getTrailerIframe(width = 640, height = 480) {
        if (!this.title) { return; }

        const youtubeID = await movieTrailer(this.title, { id: true });
        // >> add year param <<
        const url = `https://www.youtube.com/watch?v=${youtubeID}`;
        
        const iframe = document.createElement('IFRAME');
        iframe.src = `https://www.youtube.com/embed/${youtubeID}`;
        iframe.width = width;
        iframe.height = height;
        iframe.frameborder = 0;
        iframe.encryptedMedia = true;
        iframe.allowfullscreen = true;
        debugger;
        return iframe;
    }
}

export default Slide;