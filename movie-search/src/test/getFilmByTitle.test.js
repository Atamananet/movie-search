import getFilmsByTitle from '../js/getFilmsByTitle';
import 'whatwg-fetch';

describe('test getFilmsByTitle', () => {
    test('request by title "interstellar"', async () => {
        const have = await getFilmsByTitle(1, 'interstellar');
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

    test('throw error with falsy', async () => {
        expect(() => { getFilmsByTitle('').toThrow(); });
        expect(() => { getFilmsByTitle(undefined).toThrow(); });
        expect(() => { getFilmsByTitle(null).toThrow(); });
        expect(() => { getFilmsByTitle({}).toThrow(); });
    });
});