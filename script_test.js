alert('enter some letter button');
document.addEventListener('keydown', (e) => {
    if (e.code[e.code.length - 1].toLowerCase() === e.key.toLowerCase()) {
        alert(`$e.code = ${e.code}, e.key = ${e.key}`);
    }
});
