import '../js/getFilmByTitle';
import 'whatwg-fetch';

describe('test getFilmsByTitle', () => {
    const myInput = {};
    myInput.prototype = input;
    myInput.value = 'interstellar';

    test('request by title "interstellar"', async () => {
        const have = await myInput.getFilmByTitle(1);
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
        expect(() => { getFilmByTitle('').toThrow(); });
        expect(() => { getFilmByTitle(undefined).toThrow(); });
        expect(() => { getFilmByTitle(null).toThrow(); });
        expect(() => { getFilmByTitle({}).toThrow(); });
    });
});