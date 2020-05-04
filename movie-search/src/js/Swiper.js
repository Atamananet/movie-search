import Swiper from 'swiper';

const mySwiper = new Swiper('.swiper-container', {
    autoHeight: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    speed: 400,
    breakpoints: {
        // when window width is >= 320px
        320: {
            slidesPerView: 1,
            spaceBetween: 20
        },
        // when window width is >= 640px
        567: {
            slidesPerView: 2,
            spaceBetween: 40
        },
        767: {
            slidesPerView: 3,
            spaceBetween: 40
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 40
        },
        1400: {
            slidesPerView: 4,
            spaceBetween: 40
        }
    },
    mousewheel: {
        invert: true,
    },
    pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
    },
});

export default mySwiper;