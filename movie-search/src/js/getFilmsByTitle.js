async function getFilmsByTitle(page = 1, title = this.value) {
  const imdbKey = '1d7bd802'; // private key
  const url = `https://www.omdbapi.com/?s=${title}&apikey=${imdbKey}&i&plot=full&page=${page}`;
  const response = await fetch(url);
  const data = await response.json();
  
  return data;
}

export default getFilmsByTitle;