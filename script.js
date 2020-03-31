const eng = ['§ ±', '1 !', '2 @', '3 #', '4 $', '5 %', '6 ˆ', '7 &', '8 *', '9 (', '0 )', '- _', '= +', 'Backspace', '',
  'Tab', 'q Q', 'w W', 'e E', 'r R', 't T', 'y Y', 'u U', 'i I', 'o O', 'p P', '[ {', '] }', '',
  'CapsLock', 'a A', 's S', 'd D', 'f F', 'g G', 'h H', 'j J', 'k K', 'l L', '; :', '\' "', '\\ |', '',
  'Shift', '` ˜', 'z Z', 'x X', 'c C', 'v V', 'b B', 'n N', 'm M', ', <', '. >', '/ ?', 'Enter', '',
  'Control', 'Alt', 'Meta', 'Space'];

const ru = ['ё Ё', '1 !', '2 "', '3 №', '4 ;', '5 %', '6 :', '7 ?', '8 *', '9 (', '0 )', '- _', '= +', 'Backspace', '',
  'Tab', 'й Й', 'ц Ц', 'у У', 'к К', 'е Е', 'н Н', 'г Г', 'ш Ш', 'щ Щ', 'з З', 'х Х', 'ъ Ъ',
  'CapsLock', 'ф Ф', 'ы Ы', 'в В', 'а А', 'п П', 'р Р', 'о О', 'л Л', 'д Д', 'ж Ж', 'э Э', '\\ /', '',
  'Shift', '] [', 'я Я', 'ч Ч', 'с С', 'м М', 'и И', 'т Т', 'ь Ь', 'б Б', 'ю Ю', '. ,', 'Enter', '',
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
  document.getElementById('lang').classList.toggle('hover');
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
const createKey = (type) => {
  if (keyType(type) === 'new line') {
    return document.createElement('br');
  }
  const span = document.createElement('span');
  span.innerHTML = type;
  span.id = type;
  span.classList.add(keyType(type));

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
    default:
      if (key.length <= 1) { textarea.value += key; }
  }
};

const keydownHandler = (event) => { // keyboard event handler
  if (event.altKey && event.shiftKey) { changeLanguage(); }
  // avoid focus by TAB button
  if (event.key === 'Tab') { event.preventDefault(); }
  if (event.key === 'Shift') { [...characters, ...letters].forEach(toggleHidden); }
  if (event.code === 'CapsLock') { letters.forEach(toggleHidden); }
  if (event.code === 'Space') { // find element not by 'event.code' == "Space"
    document.getElementById(event.code).classList.add('pressed'); // because event.key == ' ';
  } else {
    document.getElementById(event.key).classList.toggle('pressed'); // define action
  }

  print(event.key); // add .key to textarea
};

const keyupHandler = (event) => {
  if (event.code === 'CapsLock') { letters.forEach(toggleHidden); }
  if (event.key === 'Shift') { [...characters, ...letters].forEach(toggleHidden); }
  if (event.code === 'Space') {
    document.getElementById(event.code).classList.remove('pressed');
  } else {
    document.getElementById(event.key).classList.remove('pressed');
  }
};

const mousedownHandler = (event) => {
  event.target.classList.toggle('pressed');
  if (event.target.id === 'CapsLock') { letters.forEach(toggleHidden); }
  if (event.target.id === 'Shift') { [...characters, ...letters].forEach(toggleHidden); }
  print(event.target.id);
};

const mouseupHandler = (event) => {
  if (!event.target.classList.contains('command')) {
    event.target.classList.toggle('pressed');
  }
};

// create markup and set keyboard layout //
const engKeyboard = createKeyboard(eng);
const ruKeyboard = createKeyboard(ru);
ruKeyboard.classList.add('hidden');
document.body.append(textArea, engKeyboard, ruKeyboard);

// nodes arrays by behavior
characters = [...document.getElementsByClassName('simbol')];
letters = [...document.getElementsByClassName('letter')];
commands.concat(document.getElementsByClassName('command'));

// keyboard events listeners
document.addEventListener('keydown', keydownHandler);
document.addEventListener('keyup', keyupHandler);
// mouse events listeners
[...characters, ...letters, ...commands].forEach((item) => item.addEventListener('mousedown', mousedownHandler));
[...characters, ...letters, ...commands].forEach((item) => item.addEventListener('mouseup', mouseupHandler));
// checkbox event (keyboard layout)
document.getElementById('lang').addEventListener('mousedown', changeLanguage);
// disable text selecting by double click
[...characters, ...letters, ...commands].forEach((item) => item.addEventListener('dblclick', () => (false)));
