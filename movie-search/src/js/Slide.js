class Slide {
    constructor(json) {
        this.apiKey = '1d7bd802'; // private key 
        this.title = json.Title;
        this.poster = new Image(270, 400);
        this.poster.src = json.Poster === 'N/A' ? './src/img/no-poster-available.png' : json.Poster;
        this.year = json.Year;
        this.imdbID = json.imdbID;
        this.url = `http://www.omdbapi.com/?i=${this.imdbID}&plot=full&apikey=${this.apiKey}`;
        this.rating = document.createElement('DIV');
        this.rating.className = 'swiper-slide__rating';
    }

    getElements() {
        const title = document.createElement('A');
        const poster = document.createElement('DIV');
        const year = document.createElement('DIV');
        const wrapper = document.createElement('DIV');
        const rating = document.createElement('DIV');

        title.className = 'swiper-slide__title';
        poster.className = 'swiper-slide__poster';
        year.className = 'swiper-slide__year';
        wrapper.className = 'swiper-slide';
        rating.className = 'swiper-slide__rating';

        title.innerText = this.title;
        title.href = `https://www.imdb.com/title/${this.imdbID}`;
        poster.append(this.poster);
        year.innerHTML = this.year;
        this.setRating();
        wrapper.append(title, poster, year, this.rating);

        return wrapper;
    }

    async setRating() {
        let response = await fetch(this.url);
        let data = await response.json();
        if (data.imdbRating === 'N/A') {
            this.rating.innerHTML = 0;
        } else {
            const rating = Math.round(data.imdbRating);
            const [full, half] = [Math.floor(rating / 2), Math.floor(rating % 2)];
            const starFull = '<i class="fas fa-star fass_full"></i>';
            const starHalf = '<i class="fas fa-star-half-alt"></i>';
            const starPool = '<i class="fas fa-star fass_pool"></i>';
            this.rating.innerHTML = starFull.repeat(full) + starHalf.repeat(half) + starPool.repeat(5 - full - half) + data.imdbRating;
        }
    }
}

export default Slide;