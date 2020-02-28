const _macKeyboard = ['§ ±', '1 !', '2 @', '3 #', '4 $', '5 %', '6 ˆ', '7 &', '8 *', '9 (', '0 )', '- _', '= +', 'Backspace' ,'',
    'Tab', 'q Q', 'w W', 'e E', 'r R', 't T', 'y Y', 'u U', 'i I', 'o O', 'p P', '[ {', '] }', '',
    'CapsLock', 'a A', 's S', 'd D', 'f F', 'g G', 'h H', 'j J', 'k K', 'l L', '; :', '\' \"', '\\ |', '',
    'Shift', '` ˜', 'z Z', 'x X', 'c C', 'v V', 'b B', 'n N', 'm M', ', <', '. >', '/ ?', 'Enter', '', 
    'Control', 'Alt', 'Meta', 'Space'];

function createKeyboard(keysArray) {
    let keyboard = document.createElement('div');
    keyboard.classList.add('keyboard');
    keysArray.forEach((item) => {
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
    function keyType(button) {
        // add extra width style for buttons
        // add permament 'press' on 'click' event
        if (button == '') { console.log('ITS NEW LINE'); return 'new line';}
        if (['CapsLock', 'Shift', 'Ctrl', 'Meta', 'Alt', 'Control'].includes(button.toString())) {
            return 'command';
        }
        if ('qwertyuiopasdfghjklzxcvbnm'.split('').includes(button.toString().toLowerCase())) {
            return 'letter';
        }
        else { return 'simbol'; }
    }
    // *********************************** //
    // return SpanHTMLElement (key button) //
    function createKey(simbol) {
        let htmlFragment = document.createElement('span');
        if (keyType(simbol) == 'new line') {
            return document.createElement('br')
        }
        htmlFragment.innerHTML = simbol;
        htmlFragment.id = simbol;
        htmlFragment.classList.add(keyType(simbol));
        return htmlFragment;
    }
}





// ********************** //
// keyboard event handler //
let keyDownHandler = (event) => {

    if (event.code == 'CapsLock') {
        // change letter buttons
        letters.forEach((i) => i.classList.toggle('hidden'));
    }
    if (event.key == 'Tab') {
        // avoid focus by TAB button
        event.preventDefault(); // Tab focus disabling
    }
    if (event.key == 'Shift') {
        // simbol buttons toggle
        keys.forEach((i) => (i.classList.toggle('hidden')));
        // toggle letter buttons 
        letters.forEach((i) => (i.classList.toggle('hidden')));
    }
    if (event.code == 'Space') {
        // find element not by 'event.code' == "Space" 
        // because event.key == ' ';
        document.getElementById(event.code).classList.add('pressed');
    } else {
        document.getElementById(event.key).classList.toggle('pressed');
    }
    // add .key to textarea
    switch (event.key) {
        case 'Backspace':
            let area = document.getElementById('text-area');
            area.value = area.value.slice(0, -1);
            break;
        case 'Enter':
            document.getElementById('text-area').value += '\n';
            break;
        case 'Tab':
            document.getElementById('text-area').value += '\t';
            break;
        default:
        if (event.key.length <= 1) {
                document.getElementById('text-area').value += event.key;
            }
            break;
    }
}

let keyUpHandler = (event) => {

    if (event.code == 'Space') {
        document.getElementById(event.code).classList.remove('pressed');
    } else {
        document.getElementById(event.key).classList.toggle('pressed');
    }
}




// ******************* //
// mouse event handler // 
let mouseDownHandler = (event) => {
    event.currentTarget.onmousedown = () => (false);
    event.currentTarget.ondbclick = () => (false);
    event.currentTarget.classList.toggle('pressed');
    let textArea = document.getElementById('text-area');
    // mouse click by buttons add text to textarea
    switch (event.currentTarget.id) {
        case 'Backspace':
            textArea.value = textArea.value.slice(0, -1);
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
        default:
            // if letter add letter value
            if (event.currentTarget.id.length <= 1) {
                textArea.value += event.currentTarget.id;
            }
            break;
    }
    // toggle letters / keys to upper case
    if (event.currentTarget.id == 'CapsLock') {
        letters.forEach((i) => i.classList.toggle('hidden'));
    }
    if (event.currentTarget.id == 'Shift') {
        [...keys, ...letters].forEach((i) => i.classList.toggle('hidden'));
    }

};
let mouseUpHandler = (event) => {
    if (!event.currentTarget.classList.contains('command')) {
        event.currentTarget.classList.toggle('pressed');
    }
};



let keyboardWrapper = document.createElement('div');
let textArea = document.createElement('textarea');
// block mouse focus and direct input
textArea.disabled = true;
textArea.id = 'text-area';


// create markup and set keyboard layout //
document.body.append(textArea, createKeyboard(_macKeyboard));

// nodes arrays by behavior  
const keys = [...document.getElementsByClassName('simbol')];
const letters = [...document.getElementsByClassName('letter')];
const commands = [...document.getElementsByClassName('command')];

// keyboard events listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);
// mouse events listeners
[...keys, ...letters, ...commands].forEach((item) => item.addEventListener('mousedown', mouseDownHandler));
[...keys, ...letters, ...commands].forEach((item) => item.addEventListener('mouseup', mouseUpHandler));
// disable text selecting by double click
[...keys, ...letters, ...commands].forEach((item) => item.addEventListener('dblclick', () => (false)));
