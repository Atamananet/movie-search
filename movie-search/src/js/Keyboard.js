import '../style/keyboard.css';

function toggleHidden(element) { element.classList.toggle('hidden'); }
class Keyboard {
  constructor(params) {
    this.ENGLISH = ['§ ±', '1 !', '2 @', '3 #', '4 $', '5 %', '6 ˆ', '7 &', '8 *', '9 (', '0 )', 'Backspace', '',
      'Tab', 'q Q', 'w W', 'e E', 'r R', 't T', 'y Y', 'u U', 'i I', 'o O', 'p P', 'STUB', 'STUB', '',
      'CapsLock', 'a A', 's S', 'd D', 'f F', 'g G', 'h H', 'j J', 'k K', 'l L', '; :', 'STUB', '',
      'Shift', 'z Z', 'x X', 'c C', 'v V', 'b B', 'n N', 'm M', 'Enter', 'STUB', 'STUB', '',
      'Control', 'Alt', 'Meta', 'Space'];

    this.RUSSIAN = ['ё Ё', '1 !', '2 "', '3 №', '4 ❤️️', '5 %', '6 :', '7 ?', '8 *', '9 (', '0 )', 'Backspace', '',
      'Tab', 'й Й', 'ц Ц', 'у У', 'к К', 'е Е', 'н Н', 'г Г', 'ш Ш', 'щ Щ', 'з З', 'х Х', 'ъ Ъ', '',
      'CapsLock', 'ф Ф', 'ы Ы', 'в В', 'а А', 'п П', 'р Р', 'о О', 'л Л', 'д Д', 'ж Ж', 'э Э', '',
      'Shift', 'я Я', 'ч Ч', 'с С', 'м М', 'и И', 'т Т', 'ь Ь', 'б Б', 'ю Ю', 'Enter', '',
      'Control', 'Alt', 'Meta', 'Space'];

    this.btnCombination = [];
    params.switchLanguageKeys.forEach((key) => {
      switch (key.toLowerCase()) {
        case 'shift':
          this.btnCombination.push('shiftKey');
          break;
        case 'ctrl':
          this.btnCombination.push('ctrlKey');
          break;
        case 'alt':
          this.btnCombination.push('altKey');
          break;
        case 'win':
        case 'cmd':
          this.btnCombination.push('metaKey');
          break;
        case 'space':
          this.btnCombination.push('space');
          break;
        default:
          throw new SyntaxError('Wrong key. Use [ctrl, shift, alt, win/cmd, space]');
      }
    });

    this.textArea = document.querySelector(params.inputSelector);

    this.textArea.id = 'text-area';
  }


  // switch keyboard language
  langChangeHandler(event) {
    const buttons = this.btnCombination;
    if (buttons.every((i) => event[i])) {
      [...document.querySelectorAll('.keyboard')].forEach(toggleHidden);
    }
  }

  // return string with type of button
  keyType(button) {
    const currBtn = button.toString();
    const alphabet = 'qwertyuiopasdfghjklzxcvbnmёйцукенгшщзхъфывапролджэячсмитьбю'.split('');
    const controls = ['CapsLock', 'Shift', 'Ctrl', 'Meta', 'Alt', 'Control'];

    if (currBtn === '') { return 'new line'; }
    if (controls.includes(currBtn)) { return 'command'; }
    if (alphabet.includes(currBtn.toLowerCase())) { return 'letter'; }

    return 'simbol';
  }

  // return SpanHTMLElement (key button) //
  createKey(char) {
    if (this.keyType(char) === 'new line') {
      return document.createElement('br');
    }
    const span = document.createElement('span');
    span.innerHTML = char;
    span.id = char;
    span.classList.add(this.keyType(char));

    return span;
  }

  createKeyboard(layout) {
    const keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');

    layout.forEach((key) => {
      const [lower, upper] = key.split(' ');
      const lowerKey = this.createKey(lower || key); // item if control button
      const upperKey = this.createKey(upper || key); // and item not an array
      upperKey.classList.add('hidden');

      keyboard.append(lowerKey, upperKey);
    });

    return keyboard;
  }

  print(key) {
    const input = this.textArea;

    switch (key) {
      case 'Backspace':
        input.value = input.value.slice(0, -1);
        break;
      case 'Enter':
        input.value += '\n';
        break;
      case 'Tab':
        input.value += '\t';
        break;
      case ' ':
        input.value += ' ';
        break;
      default:
        if (key.length <= 2) { // letters, simbols, arrows
          const pressedBtn = document.querySelector('.keyboard:not(.hidden) .pressed:not(.hidden):not(.command)');
          input.value += (pressedBtn) ? pressedBtn.id : key; // for simbols
        }
    }
  }

  // adds a class to a pressed key on ALL layouts
  togglePressed(event, add = false) {
    let pressed = [...this.ENGLISH, ...this.RUSSIAN].find((i) => i.split(' ').includes(event.key)); // find pressed keys in layout

    if (this.ENGLISH.includes(pressed)) {
      pressed = [pressed, this.RUSSIAN[this.ENGLISH.indexOf(pressed)]];
    } else {
      pressed = [pressed, this.ENGLISH[this.RUSSIAN.indexOf(pressed)]];
    }
    // DANGEROUS !!! BUTTHURT !!!
    pressed.filter((i) => i).join(' ').split(' ').forEach((item) => {
      const elems = document.querySelectorAll(`[id='${item}']`);
      elems.forEach((elem) => ((add) ? elem.classList.add('pressed') : elem.classList.remove('pressed')));
    });
  }

  // keyboard events handlers
  keydownHandler(event) {
    if (event.key === 'Tab') { event.preventDefault(); } // avoid focus by TAB button
    if (event.key === 'Shift') { [...this.characters, ...this.letters].forEach(toggleHidden); }
    if (event.code === 'CapsLock') { this.letters.forEach(toggleHidden); }
    if (event.code === 'Space') { // find element not by 'event.code' == "Space"
      document.querySelectorAll(`#${event.code}`).forEach((i) => i.classList.add('pressed')); // because event.key == ' ';
    } else { this.togglePressed(event, true); }
    this.print(event.key); // add .key to textarea
  }

  keyupHandler(event) {
    if (event.code === 'CapsLock') { this.letters.forEach(toggleHidden); }
    if (event.key === 'Shift') { [...this.characters, ...this.letters].forEach(toggleHidden); }
    if (event.code === 'Space') {
      document.querySelectorAll(`#${event.code}`).forEach((i) => i.classList.remove('pressed')); // because event.key == ' ';
    } else { this.togglePressed(event); }
  }

  // mouse events handlers
  mousedownHandler(event) {
    if (event.target.tagName !== 'SPAN') { return; }
    event.target.classList.toggle('pressed');
    if (event.target.id === 'CapsLock') { this.letters.forEach(toggleHidden); } // toggle letters
    if (event.target.id === 'Shift') { [...this.characters, ...this.letters].forEach(toggleHidden); } // toggle letters and simbols
    this.print(event.target.id); // add to textarea
  }

  mouseupHandler(event) {
    if (event.target.tagName !== 'SPAN') { return; }
    if (!event.target.classList.contains('command')) { // commands butons still pressed
      event.target.classList.toggle('pressed');
    }
  }

  init() {
    // create markup and set keyboard layout //
    const engKeyboard = this.createKeyboard(this.ENGLISH);
    const ruKeyboard = this.createKeyboard(this.RUSSIAN);
    // hide all layouts
    engKeyboard.classList.add('english', 'hidden');
    ruKeyboard.classList.add('russian', 'hidden');
    const container = document.createElement('DIV');
    container.className = 'd-flex justify-content-center';
    container.append(engKeyboard, ruKeyboard);
    document.body.append(container);

    if (!localStorage.getItem('language')) {
      localStorage.setItem('language', 'english');
    }
    // show selected layout
    document.querySelector(`.${localStorage.getItem('language')}`).classList.remove('hidden');

    // nodes arrays by behavior
    this.characters = [...document.getElementsByClassName('simbol')];
    this.letters = [...document.getElementsByClassName('letter')];

    // keyboard events listeners
    this.handler = this.keydownHandler.bind(this);
    document.addEventListener('keydown', this.handler);
    document.addEventListener('keyup', this.keyupHandler.bind(this));
    document.addEventListener('keydown', this.langChangeHandler.bind(this));
    // mouse events listeners
    document.addEventListener('mousedown', this.mousedownHandler.bind(this));
    document.addEventListener('mouseup', this.mouseupHandler.bind(this));
  }

  show() {
    document.removeEventListener('keydown', this.handler);
    document.addEventListener('keydown', this.handler);
    const keyboards = this.keyboards || document.querySelectorAll('.keyboard');
    keyboards.forEach((keyboard) => {
      keyboard.hidden = false;
    });
  }

  hide() {
    document.removeEventListener('keydown', this.handler);
    const keyboards = this.keyboards || document.querySelectorAll('.keyboard');
    keyboards.forEach((keyboard) => {
      const el = keyboard;
      el.hidden = true;
    });
  }
}

const keyboard = new Keyboard({
  inputSelector: '.form-search__input',
  switchLanguageKeys: ['Shift', 'CTRL'],
});

const buttonKeyboard = document.querySelector('.form-search__keyboard');
const input = document.querySelector('.form-search__input');

buttonKeyboard.addEventListener('click', (event) => {
  event.preventDefault(); // stop sending form
  const buttonSearch = document.querySelector('.form-search__button');
  buttonSearch.focus(); // search by Enter button

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault(); // don't search by Space
    }
  }, true);

  document.addEventListener('mousedown', (e) => {
    if (e.target.id === 'Enter') {
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


// Drag'n'Drop Virtual Keyboard
document.addEventListener('mousedown', (event) => {
  const currKeyboard = event.target.closest('.keyboard');

  if (!currKeyboard) { return; }

  const shiftX = event.clientX - currKeyboard.getBoundingClientRect().left;
  const shiftY = event.clientY - currKeyboard.getBoundingClientRect().top;

  function moveAt(pageX, pageY) {
    currKeyboard.style.left = `${pageX - shiftX}px`;
    currKeyboard.style.top = `${pageY - shiftY}px`;
  }

  function onMouseMove(e) {
    moveAt(e.pageX, e.pageY);
  }

  currKeyboard.style.position = 'absolute';
  currKeyboard.style.zIndex = 1000;
  document.body.append(currKeyboard);

  moveAt(event.pageX, event.pageY);

  document.addEventListener('mousemove', onMouseMove);

  currKeyboard.onmouseup = function () {
    document.removeEventListener('mousemove', onMouseMove);
    currKeyboard.onmouseup = null;
  };
});

document.ondragstart = () => false;

export default keyboard;
