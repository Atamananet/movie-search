import { slidesArray } from './variables';

document.addEventListener('mousemove', callAfterTimer(showDescription, 1000));

function callAfterTimer(callback, timeout) {
    let timer; // use loop

    return (event) => {
        if (event.target.matches('.swiper-slide__poster') && !timer) {
            timer = setTimeout(() => {
                callback(event);
            }, timeout);

            event.target.addEventListener('mouseout', () => {
                clearInterval(timer);
                timer = false;
            });
        }
    }
}

function showDescription(event) {
    const poster = document.elementFromPoint(event.clientX, event.clientY);
    const title = poster.previousSibling.innerText;
    const currentSlide = slidesArray.find((slide) => slide.title === title);

    const plot = document.createElement('DIV');
    plot.className = 'description-constainer';
    if (currentSlide &&
        currentSlide.data &&
        currentSlide.data.Plot) {
        plot.innerText = currentSlide.data.Plot;
        
    }

    document.body.append(plot);

    if (window.innerHeight - event.clientY > 300) {
        plot.style.top = `${event.clientY + 20}px`;
    } else {
        plot.style.top = `${event.clientY - 300}px`;
    }

    if (window.innerWidth - event.clientX > 300) {
        plot.style.left = `${event.clientX + 20}px`;
    } else {
        plot.style.left = `${event.clientX - 300}px`;
    }

    poster.addEventListener('mouseout', () => { plot.outerHTML = ""; }, { once: true });
}
