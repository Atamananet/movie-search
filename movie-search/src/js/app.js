//import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swiper from 'swiper';
import 'swiper/css/swiper.min.css';
import '../css/main.css';

const apikey = '1d7bd802'; // private key 

const mySwiper = new Swiper('.swiper-container', {
    speed: 400,
    spaceBetween: 100
});

async function setTitle(title, index) {
    debugger;
    let response = await fetch(`http://www.omdbapi.com/?t=${title}&apikey=${apikey}`);
    let data =  await response.json();
    console.log(data);
    mySwiper.slides[0].innerText = data.Title;
}

const search = {
    input : document.querySelector('.form-search__input'),
    button : document.querySelector('.form-search__button')
};

search.button.addEventListener('click', async () => {
   let title = search.input.value;
   setTitle(title, 0);
});
// setTitle('Avatar', 0);



