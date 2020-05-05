// import 'bootstrap';
import 'reset-css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/all.js';
import 'swiper/css/swiper.min.css';
import '../style/custom.scss';
import '../style/main.scss';
import mySwiper from './Swiper';
import Slide from './Slide';
import keyboard from './Keyboard';

const apiKey = '1d7bd802'; // private key 
const yandexApiKey = 'trnsl.1.1.20200430T142719Z.fc3de47da4df3577.547da0b45a7aa24ade7fcb685ee1a79adfe22b16';
const input = document.querySelector('.form-search__input');
const button = document.querySelector('.form-search__button');
const swiperWrapper = document.querySelector('.swiper-wrapper');
let searchPage = 0; // search page param


// load next 10 films when slides end
mySwiper.on('reachEnd', async function loadNextPage() {
    if (mySwiper.isEnd && mySwiper.activeIndex > 4) {
        searchPage += 1;
        if (mySwiper.pagination.bullets.length > 20) {
            mySwiper.pagination.bullets.length = 20;
        }
        button.innerHTML = '<div class="spinner-border" role="status"></div>';
        const films = await getFilmsByTitle(input.value, searchPage)
            .catch((error) => console.log(error));

        appendFilms(films)
            .finally(() => button.innerHTML = 'Search');
    }
});

async function getFilmsByTitle(title, page = 1) {
    let response = await fetch(`https://www.omdbapi.com/?s=${title}&apikey=${apiKey}&i&plot=full&page=${page}`);
    let data = await response.json();

    if (data.Response === 'False') { //
        throw Error('Not found');
    }
    return data;
}

async function appendFilms(data) {
    if (!data) { return; }
    // push search results into swiper 
    data.Search.forEach((film) => {
        const swiperSlide = document.createElement('DIV');
        swiperSlide.className = 'swiper-slide';
        const slideData = new Slide(film);
        mySwiper.appendSlide(slideData.getElements());
    });
}

button.addEventListener('click', async (event) => {
    event.preventDefault(); // disable form sending and page reloading

    button.innerHTML = '<div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div>Search';

    // use Yandex Translate API to detect language
    const responseLanguage = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/detect?key=${yandexApiKey}&text=${input.value}&hint=ru,en`);
    const json = await responseLanguage.json();

    // use Yandex Translate API to translate search request
    if (json.code === 200 && json.lang === 'ru') {
        const responseTranslate = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${yandexApiKey}&text=${input.value}&lang=en`);
        const translation = await responseTranslate.json();
        const message = `Showing results for ${translation.text[0]}`;
        alertWithMessage(message, 'primary');
        input.value = translation.text[0];
    }

    // get data with IMDb API
    let films = await getFilmsByTitle(input.value)
        .catch((error) => {
            if (error.message = 'Not found') {
                alertWithMessage(error.message);
                button.innerHTML = 'Search';
            }
            console.error('URLRequestError:' + error.message);
        });

    if (!films) { return; }

    mySwiper.removeAllSlides(); // clear swiper container
    appendFilms(films)
        .finally(() => button.innerHTML = 'Search');
});

// show alert message below search
function alertWithMessage(message, type = 'danger') {
    const alert = document.querySelector(`.container__alert .alert-${type}`);
    alert.hidden = false;
    alert.innerText = message;
    setTimeout(() => { alert.hidden = true }, 3000);
}

// for start page
(async () => {
    let films = await getFilmsByTitle('RED')
        .catch((error) => {
            if (error.message = 'Not found') {
                alertWithMessage(error.message);
            }
            console.error('URLRequestError:' + error.message);
        });

    appendFilms(films)
        .finally(() => button.innerHTML = 'Search');
})();

const buttonKeyboard = document.querySelector('.form-search__keyboard');
buttonKeyboard.addEventListener('click', (event) => {
    event.preventDefault(); // stop sending form
    const buttonSearch = document.querySelector('.form-search__button');
    buttonSearch.focus(); // search by Enter button
    
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space') {
            event.preventDefault(); // don't search by Space
        }
    }, true);

    document.addEventListener('mousedown', (event) => {
        if (event.target.id === 'Enter') {
            buttonSearch.click(); // search by virtual Enter
        }
    }, true);

    if (!document.querySelector('.keyboard')) {
        keyboard.init();
        return;
    }

    const isKeyboardShow = document.querySelector('.keyboard:not([hidden])');

    if (isKeyboardShow) {
        input.disabled = false; // disable double input (virtual & phisical)
        input.focus();
        keyboard.hide();
        buttonSearch.blur();
        return;
    }

    input.disabled = true;
    keyboard.show();    
});

const buttonClear = document.querySelector('.form-search__clear');
input.addEventListener('input', (event) => {
    if (input.value === '') {
        buttonClear.style.zIndex = -1;
    } else {
        buttonClear.style.zIndex = 1;
    }
});


// clear-input button click event
document.addEventListener('click', (event) => {
    // clear input on click
    if (event.target.closest('.form-search__clear')){
        input.value = '';
        buttonClear.style.zIndex = -1;
    }
    // hide button if click not in input
    if (!event.target.closest('.form-search__input')) {
        buttonClear.style.zIndex = -1;
    } else { // if click in input
        if (input.value){ // show if input not empty
            buttonClear.style.zIndex = 1;
        }
    }
});

// Drag'n'Drop Virtual Keyboard
document.addEventListener('mousedown', function(event) {
    const currKeyboard = event.target.closest('.keyboard');
    
    if (!currKeyboard) { return; }

    let shiftX = event.clientX - currKeyboard.getBoundingClientRect().left;
    let shiftY = event.clientY - currKeyboard.getBoundingClientRect().top;
  
    currKeyboard.style.position = 'absolute';
    currKeyboard.style.zIndex = 1000;
    document.body.append(currKeyboard);
  
    moveAt(event.pageX, event.pageY);
  
    function moveAt(pageX, pageY) {
        currKeyboard.style.left = pageX - shiftX + 'px';
        currKeyboard.style.top = pageY - shiftY + 'px';
    }
  
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
  
    document.addEventListener('mousemove', onMouseMove);

    currKeyboard.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      currKeyboard.onmouseup = null;
    };
  
  });
  
  document.ondragstart = function() {
    return false;
  };
