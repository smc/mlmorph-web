const onesStr = [
    'പൂജ്യം',
    'ഒന്ന്',
    'രണ്ട്',
    'മൂന്ന്',
    'നാല്',
    'അഞ്ച്',
    'ആറ്',
    'ഏഴ്',
    'എട്ട്',
    'ഒമ്പത്'
];

function positionValues(value) {
    let result = '';
    let crores = value > 10000000 ? parseInt(value / 10000000) : 0;
    let lakhs = parseInt((value % 10000000) / 100000);
    let thousands = parseInt((value % 100000) / 1000);
    let hundreds = parseInt((value % 1000) / 100);
    let tens = parseInt((value % 100) / 10);
    let ones = parseInt((value % 10) / 1);
    result =
        (crores > 0 ? positionValues(crores) + '<crores>' : '') +
        (lakhs > 0 ? positionValues(lakhs) + '<lakhs>' : '') +
        (thousands > 0 ? positionValues(thousands) + '<thousands>' : '') +
        (hundreds > 0 ? positionValues(hundreds) + '<hundreds>' : '') +
        (tens > 0 ? positionValues(tens) + '<tens>' : '') +
        (ones > 0 ? onesStr[ones] + '<ones>' : '') +
        (value === 0 ? onesStr[ones] + '<zero>' : '');

    return clean(result);
}

function spellout(word) {
    return fetch('/api/generate?word=' + word).then(res => res.json());
}

function onNumberChange() {
    let value = document.getElementById('num').value;
    value = Number(value);
    numberGen = '';
    numberGen = positionValues(value) + '<cardinal>';
    document.getElementById('analysis').innerText = numberGen;
    return spellout(numberGen).then((data) => {
        let result = data.result && data.result[0];
        document.getElementById('result').innerText = result;
    });
}

// Some cleanup for better results
function clean(result) {
    result = result.replace('<ones><hundreds>', '<hundreds>');
    result = result.replace('<ones><tens>', '<tens>');
    result = result.replace('ഒന്ന്<ones><hundredsa>', '<hundreds>');
    result = result.replace('ഒന്ന്<ones><thousands>', '<thousands>');
    return result;
}

window.addEventListener('load', () => {
    let numElement = document.getElementById('num');
    numElement.addEventListener('change', onNumberChange);
    numElement.addEventListener('keyup', onNumberChange);
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
});