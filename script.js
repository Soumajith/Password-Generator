// fetching using custom attribute
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMessage = document.querySelector("[data-copymessage]");
const copyButton = document.querySelector("[data-copybutton]");
const uppercasecheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#lowercase");
const numbercheck = document.querySelector("#numbers");
const symbolcheck = document.querySelector("#symbols");
const dataIndicator = document.querySelector("[data-indicator]");
const generatebtn = document.querySelector(".generate-password");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let passwordlength = 10;
let password = "";
let checkCount = 0;
setIndicator("#fff")

function handleSlider() {
    inputSlider.value = passwordlength;
    lengthDisplay.innerText = passwordlength;
    let width_slider = passwordlength * 5;
    console.log(width_slider);
    inputSlider.style.backgroundSize = `${width_slider}%`;
}
handleSlider();

function setIndicator(color) {
    dataIndicator.style.cssText = `background-color: ${color}; box-shadow: 0 0 10px 4px ${color};`;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandomInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
    return String.fromCharCode(getRandomInteger(33, 64));
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasSym = false;
    let hasNum = false;

    if (uppercasecheck.checked) hasUpper = true;
    if (lowercasecheck.checked) hasLower = true;
    if (numbercheck.checked) hasNum = true;
    if (symbolcheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordlength >= 8) {
        setIndicator('#0f0');
    }
    else if (hasUpper && (hasNum || hasSym) && passwordlength >= 4) {
        setIndicator('#ff0');
    }
    else {
        setIndicator('#f00');
    }
}

async function copyContent() {
    // const text
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMessage.innerText = 'copied';
    }
    catch (error) {
        console.log(error);
        copyMessage.innerText = 'failed';
    }
    copyMessage.classList.add('active');

    setTimeout(() => {
        copyMessage.innerText = "";
        copyMessage.classList.remove('active');
    }, 2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordlength = e.target.value;
    handleSlider();
})

copyButton.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
})

function countCheckedBox() {
    checkCount = 0;
    allCheckBox.forEach((check) => {
        if (check.checked)
            checkCount++;
    })

    //special case
    if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((check) => {
    check.addEventListener('change', countCheckedBox);
});

generatebtn.addEventListener('click', () => {
    if (checkCount == 0) return;

    if (passwordlength < checkCount) {
        passwordlength = checkCount;
        handleSlider();
    }

    //reset the password
    password = "";

    //making a function array;
    let funcArr = [];
    if (uppercasecheck.checked) funcArr.push(generateUpperCase);
    if (lowercasecheck.checked) funcArr.push(generateLowerCase);
    if (numbercheck.checked) funcArr.push(generateRandomNumber);
    if (symbolcheck.checked) funcArr.push(generateSymbol);

    //compulsory

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    //random
    for (let i = 0; i < passwordlength - funcArr.length; i++) {
        let randIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    password = reshuffle(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();

})

function reshuffle(array) {
    // Fisher yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "";
    array.forEach((e) => str += e)
    return str;
}