async function getFilmsByTitle(page = 1, title = this.value) {
  const imdbKey = '1d7bd802'; // private key
  const url = `https://www.omdbapi.com/?s=${title}&apikey=${imdbKey}&i&plot=full&page=${page}`;
  const response = await fetch(url)
    .catch((e) => {
      if (e.message === 'Failed to fetch') {
        throw Error('Request Error: no connection');
      }
    });
  const data = await response.json();

  if (data.Response !== 'True') { //
    throw Error(`Not found for " ${title} "`);
  }

  return data;
}

export default getFilmsByTitle;