import getFilmByTitle from '../js/getFilmByTitle';
import 'whatwg-fetch';

describe('test getFilmsByTitle', () => {
    test('request by title "interstellar"', async () => {
        const have = await getFilmByTitle('interstellar');
        const expected = {
            Poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
            Title: "Interstellar",
            Type: "movie",
            Year: "2014",
            imdbID: "tt0816692",
        };
        expect(have).toHaveProperty('Search'); // true
        expect(have).toHaveProperty('Search.0', expected); // true
        expect(have).toHaveProperty('Response', "True"); // true
    });
});