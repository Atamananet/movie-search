(function KEYBOARD() {
  const ENGLISH = ['§ ±', '1 !', '2 @', '3 #', '4 $', '5 %', '6 ˆ', '7 &', '8 *', '9 (', '0 )', '- _', '= +', 'Backspace', '',
    'Tab', 'q Q', 'w W', 'e E', 'r R', 't T', 'y Y', 'u U', 'i I', 'o O', 'p P', '[ {', '] }', '',
    'CapsLock', 'a A', 's S', 'd D', 'f F', 'g G', 'h H', 'j J', 'k K', 'l L', '; :', '\' "', '\\ |', '',
    'Shift', '` ˜', 'z Z', 'x X', 'c C', 'v V', 'b B', 'n N', 'm M', ', <', '. >', '/ ?', 'Enter', '',
    'Control', 'Alt', 'Meta', 'Space'];

  const RUSSIAN = ['ё Ё', '1 !', '2 "', '3 №', '4 ❤️️', '5 %', '6 :', '7 ?', '8 *', '9 (', '0 )', '- _', '= +', 'Backspace', '',
    'Tab', 'й Й', 'ц Ц', 'у У', 'к К', 'е Е', 'н Н', 'г Г', 'ш Ш', 'щ Щ', 'з З', 'х Х', 'ъ Ъ', '',
    'CapsLock', 'ф Ф', 'ы Ы', 'в В', 'а А', 'п П', 'р Р', 'о О', 'л Л', 'д Д', 'ж Ж', 'э Э', '® ©', '',
    'Shift', '¥ £', 'я Я', 'ч Ч', 'с С', 'м М', 'и И', 'т Т', 'ь Ь', 'б Б', 'ю Ю', '« »', 'Enter', '',
    'Control', 'Alt', 'Meta', 'Space'];

  let characters; // simbols keyboard
  let letters;
  const commands = [];
  const textArea = document.createElement('textarea');
  textArea.disabled = true; // block mouse focus and direct input
  textArea.id = 'text-area';

  const toggleHidden = (element) => element.classList.toggle('hidden');
  const changeLanguage = () => {
    [...document.querySelectorAll('.keyboard')].forEach(toggleHidden);
    localStorage.language = (localStorage.language === 'english') ? 'russian' : 'english';
  };

  // return string with type of button
  const keyType = (button) => {
    const currBtn = button.toString();
    const alphabet = 'qwertyuiopasdfghjklzxcvbnmёйцукенгшщзхъфывапролджэячсмитьбю'.split('');
    const controls = ['CapsLock', 'Shift', 'Ctrl', 'Meta', 'Alt', 'Control'];

    if (currBtn === '') { return 'new line'; }
    if (controls.includes(currBtn)) { return 'command'; }
    if (alphabet.includes(currBtn.toLowerCase())) { return 'letter'; }
    return 'simbol';
  };

  // return SpanHTMLElement (key button) //
  const createKey = (char) => {
    if (keyType(char) === 'new line') {
      return document.createElement('div');
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
        if (key.length < 2) { // press CHOISING language button
          const pressedBtn = document.querySelector('.keyboard:not(.hidden) .pressed:not(.hidden):not(.command)');
          textarea.value += (pressedBtn) ? pressedBtn.id : key;
        }
    }
  };

  // DANGEROUS !!! BUTTHURT !!!
  const togglePressed = (event, add = false) => {
    let pressed = [...ENGLISH, ...RUSSIAN].find((i) => i.split(' ').includes(event.key)); // find pressed keys in layout

    if (ENGLISH.includes(pressed)) {
      pressed = [pressed, RUSSIAN[ENGLISH.indexOf(pressed)]];
    } else {
      pressed = [pressed, ENGLISH[RUSSIAN.indexOf(pressed)]];
    }
    pressed.filter((i) => i).join(' ').split(' ').forEach((item) => {
      const elems = document.querySelectorAll(`[id='${item}']`);
      elems.forEach((elem) => ((add) ? elem.classList.add('pressed') : elem.classList.remove('pressed')));
    });
  };

  const keydownHandler = (event) => { // keyboard event handler
    // avoid focus by TAB button
    if (event.key === 'Tab') { event.preventDefault(); }
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

  const mousedownHandler = (event) => {
    if (event.target.tagName !== 'SPAN') { return; }
    event.target.classList.toggle('pressed');
    if (event.target.id === 'CapsLock') { letters.forEach(toggleHidden); }
    if (event.target.id === 'Shift') { [...characters, ...letters].forEach(toggleHidden); }
    print(event.target.id);
  };

  const mouseupHandler = (event) => {
    if (event.target.tagName !== 'SPAN') { return; }
    if (!event.target.classList.contains('command')) {
      event.target.classList.toggle('pressed');
    }
  };

  // create markup and set keyboard layout //
  const engKeyboard = createKeyboard(ENGLISH);
  const ruKeyboard = createKeyboard(RUSSIAN);
  engKeyboard.classList.add('english', 'hidden');
  ruKeyboard.classList.add('russian', 'hidden');
  document.body.append(textArea, engKeyboard, ruKeyboard);

  if (!localStorage.getItem('language')) {
    localStorage.setItem('language', 'english');
  }
  document.querySelector(`.${localStorage.getItem('language')}`).classList.remove('hidden');

  const btnCombination = new Set();
  const combination = document.querySelector('.combination');
  function setBtnCombination(event) {
    if (event.shiftKey) { btnCombination.add('shiftKey'); }
    if (event.ctrlKey) { btnCombination.add('ctrlKey'); }
    if (event.altKey) { btnCombination.add('altKey'); }
    if (event.metaKey) { btnCombination.add('metaKey'); }
    if (event.code === 'Space') { btnCombination.add('space'); }
  }

  const langChangeHandler = (e) => {
    const a = [...btnCombination];
    if (a.every((i) => e[i])) changeLanguage();
  };

  document.addEventListener('keydown', setBtnCombination);

  document.addEventListener('keydown', () => {
    if (btnCombination.size < 2) { return; }
    setTimeout(() => {
      combination.innerHTML = [...btnCombination].join(' + ');
      document.querySelector('.description').style.borderLeftColor = 'green';
      document.removeEventListener('keydown', setBtnCombination);
      document.addEventListener('keydown', langChangeHandler);
    }, 500);
    setTimeout(() => { document.querySelector('.request').style.opacity = '0'; }, 1000);
  });

  // nodes arrays by behavior
  characters = [...document.getElementsByClassName('simbol')];
  letters = [...document.getElementsByClassName('letter')];
  commands.concat(document.getElementsByClassName('command'));

  // keyboard events listeners
  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);
  // mouse events listeners
  document.addEventListener('mousedown', mousedownHandler);
  document.addEventListener('mouseup', mouseupHandler);
}());
