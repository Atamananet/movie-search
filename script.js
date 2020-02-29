const _macKeysLayout = ['§ ±', '1 !', '2 @', '3 #', '4 $', '5 %', '6 ˆ', '7 &', '8 *', '9 (', '0 )', '- _', '= +', 'Backspace', '',
    'Tab', 'q Q', 'w W', 'e E', 'r R', 't T', 'y Y', 'u U', 'i I', 'o O', 'p P', '[ {', '] }', '',
    'CapsLock', 'a A', 's S', 'd D', 'f F', 'g G', 'h H', 'j J', 'k K', 'l L', '; :', '\' \"', '\\ |', '',
    'Shift', '` ˜', 'z Z', 'x X', 'c C', 'v V', 'b B', 'n N', 'm M', ', <', '. >', '/ ?', 'Enter', '',
    'Control', 'Alt', 'Meta', 'Space'];

const _ruKeysLayout = ['ё Ё', '1 !', '2 "', '3 №', '4 ;', '5 %', '6 :', '7 ?', '8 *', '9 (', '0 )', '- _', '= +', 'Backspace', '',
    'Tab', 'й Й', 'ц Ц', 'у У', 'к К', 'е Е', 'н Н', 'г Г', 'ш Ш', 'щ Щ', 'з З', 'х Х', 'ъ Ъ',
    'CapsLock', 'ф Ф', 'ы Ы', 'в В', 'а А', 'п П', 'р Р', 'о О', 'л Л', 'д Д', 'ж Ж', 'э Э', '\\ /', '',
    'Shift', '] [', 'я Я', 'ч Ч', 'с С', 'м М', 'и И', 'т Т', 'ь Ь', 'б Б', 'ю Ю', '. ,', 'Enter', '',
    'Control', 'Alt', 'Meta', 'Space'];


let textArea = document.createElement('textarea');
textArea.disabled = true; // block mouse focus and direct input
textArea.id = 'text-area';

// create markup and set keyboard layout //
let engKeyboard = createKeyboard(_macKeysLayout); 
let ruKeyboard = createKeyboard(_ruKeysLayout);
ruKeyboard.classList.add('hidden');
document.body.append(textArea, engKeyboard, ruKeyboard);

// nodes arrays by behavior  
const simbols = [...document.getElementsByClassName('simbol')];
const letters = [...document.getElementsByClassName('letter')];
const commands = [...document.getElementsByClassName('command')];

// keyboard events listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
// mouse events listeners
[...simbols, ...letters, ...commands].forEach((item) => item.addEventListener('mousedown', mouseDownHandler));
[...simbols, ...letters, ...commands].forEach((item) => item.addEventListener('mouseup', mouseUpHandler));
// checkbox event (keyboard layout)
document.getElementById('lang').addEventListener('mousedown', changeLanguage);
// disable text selecting by double click
[...simbols, ...letters, ...commands].forEach((item) => item.addEventListener('dblclick', () => (false)));


function createKeyboard(keysLayout) {
    let keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');
    keysLayout.forEach((item) => {
        item = item.split(' ');
        let lower = createKey(item[0] || item); // item if control button
        let upper = createKey(item[1] || item); // and item not an array
        upper.classList.add('hidden');
        keyboard.append(lower);
        keyboard.append(upper);
    });
    return keyboard;

    // ********************************* //
    // return string with type of button //
    // add extra width style for buttons
    // add permament 'press' on 'click' event
    function keyType(button) {
        button = button.toString();
        let alphabet = 'qwertyuiopasdfghjklzxcvbnmёйцукенгшщзхъфывапролджэячсмитьбю'.split('');
        let controls = ['CapsLock', 'Shift', 'Ctrl', 'Meta', 'Alt', 'Control'];
        
        if (button == '') { 
            return 'new line'; 
        }
        if (controls.includes(button)) {
            return 'command';
        }
        if (alphabet.includes(button.toLowerCase())) {
            return 'letter';
        }
        return 'simbol'; 
    }
    
    // *********************************** //
    // return SpanHTMLElement (key button) //
    function createKey(type) {
        let span = document.createElement('span');
        if (keyType(type) == 'new line') {
            return document.createElement('br')
        }
        span.innerHTML = type;
        span.id = type;
        span.classList.add(keyType(type));
        return span;
    }
}

// ********************** //
// keyboard event handler //
function keyDownHandler(event) {
    if (event.altKey && event.shiftKey){
        changeLanguage();
    }
    if (event.code == 'CapsLock') {     // change letter buttons 
        letters.forEach((i) => i.classList.toggle('hidden'));
    }
    if (event.key == 'Tab') {           // avoid focus by TAB button
        event.preventDefault();         // Tab focus disabling
    }
    if (event.key == 'Shift') {         // simbol & letters buttons toggle
        [...simbols, ...letters].forEach((i) => (i.classList.toggle('hidden')));
    }
    if (event.code == 'Space') { 
        // find element not by 'event.code' == "Space" because event.key == ' ';
        document.getElementById(event.code).classList.add('pressed');
    } else {
        document.getElementById(event.key).classList.toggle('pressed');
    }
    // add .key to textarea
    let textarea = document.getElementById('text-area');
    switch (event.key) {
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
            if (event.key.length <= 1) {
                textarea.value += event.key;
            }
    }
}

function keyUpHandler(event) {
    if (event.code == 'Space') {
        document.getElementById(event.code).classList.remove('pressed');
    } else {
        document.getElementById(event.key).classList.toggle('pressed');
    }
    if (event.key == 'Shift') {
        [...simbols, ...letters].forEach((i) => (i.classList.toggle('hidden'))); // simbol & letters toggle
    }
    if (event.code == 'CapsLock') {
        letters.forEach((i) => i.classList.toggle('hidden')); // change letter buttons
    }
}

// ******************* //
// mouse event handler // 
function mouseDownHandler(event) {
    event.currentTarget.classList.toggle('pressed');
    let textarea = document.getElementById('text-area');

    switch (event.currentTarget.id) {   // mouse click by buttons add text to textarea
        case 'Backspace':
            textarea.value = textarea.value.slice(0, -1);
            break;
        case 'Enter':
            textArea.value += '\n';
            break;
        case 'Tab':
            textArea.value += '\t';
            break;
        case 'Space':
            textArea.value += ' ';
            break;
        default:                        // if letter add letter value
            if (event.currentTarget.id.length <= 1) {
                textarea.value += event.currentTarget.id;
            }
    }
    // toggle letters / keys to upper case
    if (event.currentTarget.id == 'CapsLock') {
        letters.forEach((i) => i.classList.toggle('hidden'));
    }
    if (event.currentTarget.id == 'Shift') {
        [...simbols, ...letters].forEach((i) => i.classList.toggle('hidden'));
    }

};
function mouseUpHandler(event) {
    if (!event.currentTarget.classList.contains('command')) {
        event.currentTarget.classList.toggle('pressed');
    }
};

function changeLanguage(){
    engKeyboard.classList.toggle('hidden');
    ruKeyboard.classList.toggle('hidden');
    document.getElementById('lang').classList.toggle('hover');
}
