(function KEYBOARD() {
  const ENGLISH = ['§ ±', '1 !', '2 @', '3 #', '4 $', '5 %', '6 ˆ', '7 &', '8 *', '9 (', '0 )', '- _', '= +', 'Backspace', '😍', '😂', '😎', '',
    'Tab', 'q Q', 'w W', 'e E', 'r R', 't T', 'y Y', 'u U', 'i I', 'o O', 'p P', '[ {', '] }', '🤣', '😊', '🤩', '',
    'CapsLock', 'a A', 's S', 'd D', 'f F', 'g G', 'h H', 'j J', 'k K', 'l L', '; :', '\' "', '\\ |', '😭', '✌', '☝', '',
    'Shift', '` ˜', 'z Z', 'x X', 'c C', 'v V', 'b B', 'n N', 'm M', ', <', '. >', '/ ?', 'Enter', 'STUB', 'ArrowUp', '',
    'Control', 'Alt', 'Meta', 'Space', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];

  const RUSSIAN = ['ё Ё', '1 !', '2 "', '3 №', '4 ❤️️', '5 %', '6 :', '7 ?', '8 *', '9 (', '0 )', '- _', '= +', 'Backspace', '😍', '😂', '😎', '',
    'Tab', 'й Й', 'ц Ц', 'у У', 'к К', 'е Е', 'н Н', 'г Г', 'ш Ш', 'щ Щ', 'з З', 'х Х', 'ъ Ъ', '🤣', '😊', '🤩', '',
    'CapsLock', 'ф Ф', 'ы Ы', 'в В', 'а А', 'п П', 'р Р', 'о О', 'л Л', 'д Д', 'ж Ж', 'э Э', '® ©', '😭', '✌', '☝', '',
    'Shift', '¥ £', 'я Я', 'ч Ч', 'с С', 'м М', 'и И', 'т Т', 'ь Ь', 'б Б', 'ю Ю', '« »', 'Enter', 'STUB', 'ArrowUp', '',
    'Control', 'Alt', 'Meta', 'Space', 'ArrowLeft', 'ArrowDown', 'ArrowRight'];

  let characters; // simbols keyboard
  let letters;
  const btnCombination = new Set();
  const textArea = document.createElement('textarea');
  textArea.disabled = true; // block mouse focus and direct input
  textArea.id = 'text-area';

  const toggleHidden = (element) => element.classList.toggle('hidden');

  // switch keyboard language
  const langChangeHandler = (event) => {
    const a = [...btnCombination];
    if (a.every((i) => event[i])) {
      [...document.querySelectorAll('.keyboard')].forEach(toggleHidden);
      localStorage.language = (localStorage.language === 'english') ? 'russian' : 'english';
    }
  };

  const detectCombination = (event) => {
    if (event.shiftKey) { btnCombination.add('shiftKey'); }
    if (event.ctrlKey) { btnCombination.add('ctrlKey'); }
    if (event.altKey) { btnCombination.add('altKey'); }
    if (event.metaKey) { btnCombination.add('metaKey'); }
    if (event.code === 'Space') { btnCombination.add('space'); }
  };

  const setCombination = () => {
    if (btnCombination.size < 2) { return; }
    setTimeout(() => {
      const combination = document.querySelector('.combination');
      combination.innerHTML = [...btnCombination].join(' + ');
      document.querySelector('.description').style.borderLeftColor = 'green';
      document.removeEventListener('keydown', detectCombination);
      document.addEventListener('keydown', langChangeHandler);
    }, 500);
    setTimeout(() => { document.querySelector('.request').style.opacity = '0'; }, 1000);
  };

  // return string with type of button
  const keyType = (button) => {
    const currBtn = button.toString();
    const alphabet = 'qwertyuiopasdfghjklzxcvbnmёйцукенгшщзхъфывапролджэячсмитьбю'.split('');
    const controls = ['CapsLock', 'Shift', 'Ctrl', 'Meta', 'Alt', 'Control'];
    const arrows = ['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'];

    if (currBtn === '') { return 'new line'; }
    if (controls.includes(currBtn)) { return 'command'; }
    if (alphabet.includes(currBtn.toLowerCase())) { return 'letter'; }
    if (arrows.includes(currBtn)) { return 'arrow'; }

    return 'simbol';
  };

  // return SpanHTMLElement (key button) //
  const createKey = (char) => {
    if (keyType(char) === 'new line') {
      return document.createElement('br');
    }
    const span = document.createElement('span');
    span.innerHTML = char;
    span.id = char;
    span.classList.add(keyType(char));

    return span;
  };

  const createKeyboard = (layout) => {
    const keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');

    layout.forEach((key) => {
      const [lower, upper] = key.split(' ');
      const lowerKey = createKey(lower || key); // item if control button
      const upperKey = createKey(upper || key); // and item not an array
      upperKey.classList.add('hidden');

      keyboard.append(lowerKey, upperKey);
    });

    return keyboard;
  };

  const print = (key) => {
    const textarea = document.querySelector('textarea');
    const elem = document.querySelector(`[id='${key}']`);
    switch (key) {
      case 'Backspace':
        textarea.value = textarea.value.slice(0, -1);
        break;
      case 'Enter':
        textarea.value += '\n';
        break;
      case 'Tab':
        textarea.value += '\t';
        break;
      case ' ':
        textarea.value += ' ';
        break;
      default:
        if (key.length <= 2) { // letters, simbols, arrows
          const pressedBtn = document.querySelector('.keyboard:not(.hidden) .pressed:not(.hidden):not(.command)');
          textarea.value += (pressedBtn) ? pressedBtn.id : key; // for simbols
        }
        if (elem && elem.classList.contains('arrow')) {
          textarea.value += elem.innerHTML;
        }
    }
  };

  // adds a class to a pressed key on ALL layouts
  const togglePressed = (event, add = false) => {
    let pressed = [...ENGLISH, ...RUSSIAN].find((i) => i.split(' ').includes(event.key)); // find pressed keys in layout

    if (ENGLISH.includes(pressed)) {
      pressed = [pressed, RUSSIAN[ENGLISH.indexOf(pressed)]];
    } else {
      pressed = [pressed, ENGLISH[RUSSIAN.indexOf(pressed)]];
    }
    // DANGEROUS !!! BUTTHURT !!!
    pressed.filter((i) => i).join(' ').split(' ').forEach((item) => {
      const elems = document.querySelectorAll(`[id='${item}']`);
      elems.forEach((elem) => ((add) ? elem.classList.add('pressed') : elem.classList.remove('pressed')));
    });
  };

  // keyboard events handlers
  const keydownHandler = (event) => {
    if (event.key === 'Tab') { event.preventDefault(); } // avoid focus by TAB button
    if (event.key === 'Shift') { [...characters, ...letters].forEach(toggleHidden); }
    if (event.code === 'CapsLock') { letters.forEach(toggleHidden); }
    if (event.code === 'Space') { // find element not by 'event.code' == "Space"
      document.querySelectorAll(`#${event.code}`).forEach((i) => i.classList.add('pressed')); // because event.key == ' ';
    } else { togglePressed(event, true); }
    print(event.key); // add .key to textarea
  };
  const keyupHandler = (event) => {
    if (event.code === 'CapsLock') { letters.forEach(toggleHidden); }
    if (event.key === 'Shift') { [...characters, ...letters].forEach(toggleHidden); }
    if (event.code === 'Space') {
      document.querySelectorAll(`#${event.code}`).forEach((i) => i.classList.remove('pressed')); // because event.key == ' ';
    } else { togglePressed(event); }
  };

  // mouse events handlers
  const mousedownHandler = (event) => {
    if (event.target.tagName !== 'SPAN') { return; }
    event.target.classList.toggle('pressed');
    if (event.target.id === 'CapsLock') { letters.forEach(toggleHidden); } // toggle letters
    if (event.target.id === 'Shift') { [...characters, ...letters].forEach(toggleHidden); } // toggle letters and simbols
    print(event.target.id); // add to textarea
  };

  const mouseupHandler = (event) => {
    if (event.target.tagName !== 'SPAN') { return; }
    if (!event.target.classList.contains('command')) { // commands butons still pressed
      event.target.classList.toggle('pressed');
    }
  };

  const createReadme = () => {
    const readme = document.createElement('div');
    const request = document.createElement('p');
    const description = document.createElement('p');
    const combinationEl = document.createElement('code');
    const system = document.createElement('p');
    system.innerText = 'MacOS, комбинация определяется вами (не менее 2 кнопок, допустимы: Shift, Alt, Ctrl, Cmd / Win (Meta))';
    readme.classList.add('loader');
    request.classList.add('request');
    description.classList.add('description');
    description.innerText = 'Your combination:';
    combinationEl.classList.add('combination');
    request.innerText = 'Please, press buttons combination to switch keyboard layout...';
    description.append(combinationEl);
    readme.append(request, description, system);

    return readme;
  };

  // create markup and set keyboard layout //
  const engKeyboard = createKeyboard(ENGLISH);
  const ruKeyboard = createKeyboard(RUSSIAN);
  const readme = createReadme();
  // hide all layouts
  engKeyboard.classList.add('english', 'hidden');
  ruKeyboard.classList.add('russian', 'hidden');
  document.body.append(readme, textArea, engKeyboard, ruKeyboard);

  if (!localStorage.getItem('language')) {
    localStorage.setItem('language', 'english');
  }
  // show selected layout
  document.querySelector(`.${localStorage.getItem('language')}`).classList.remove('hidden');

  // set buttons combination to switch languages
  document.addEventListener('keydown', detectCombination);
  document.addEventListener('keydown', setCombination);

  // nodes arrays by behavior
  characters = [...document.getElementsByClassName('simbol')];
  letters = [...document.getElementsByClassName('letter')];

  // keyboard events listeners
  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);
  // mouse events listeners
  document.addEventListener('mousedown', mousedownHandler);
  document.addEventListener('mouseup', mouseupHandler);

  // arrows content
  document.querySelectorAll('#ArrowUp').forEach((i) => { const j = i; j.innerHTML = '⇧'; });
  document.querySelectorAll('#ArrowDown').forEach((i) => { const j = i; j.innerHTML = '⇩'; });
  document.querySelectorAll('#ArrowRight').forEach((i) => { const j = i; j.innerHTML = '⇨'; });
  document.querySelectorAll('#ArrowLeft').forEach((i) => { const j = i; j.innerHTML = '⇦'; });
}());
