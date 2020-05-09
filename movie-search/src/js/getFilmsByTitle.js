/**
 * Get data from www.omdbapi.com by title and page
 *
 * Used as HTMLInputElement method or themself.
 * Sends a request using the "value" property (input.value) 
 * if parameter isn't passed
 * 
 * @param {number} page     API param page number should return
 * @param {string} title    param used for fallback
 * 
 * @return {Object}         data from OMDb API
 */
async function getFilmsByTitle(page = 1, title = this.value) {
  const imdbKey = '1d7bd802'; // private key
  const url = `https://www.omdbapi.com/?s=${title}&apikey=${imdbKey}&i&plot=full&page=${page}&type=movie`;
  const response = await fetch(url);
  const data = await response.json();
  
  return data;
}

export default getFilmsByTitle;