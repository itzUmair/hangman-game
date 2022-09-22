const wordDisplay = document.querySelector(".wordDisplay");
const keyboard = document.querySelector(".keyboard");
const lifeDisplay = document.querySelector(".lifeDisplay");
const result = document.querySelector(".result");

let url = [
    "pk.json",
    "vegetables.json" 
]

let city;
let vegetable;
let guess;
let guessResult;
let wordCount = 0;
let tries = 0;
let maxTries = 7;

async function getCity() {
    let file = Math.round(Math.random())
    let value;
    if (file === 0) {
        value = Math.floor((Math.random())*200)
    } else {
        value = Math.floor((Math.random())*40)
    }
    const resp = await fetch(url[file])
    const respData = await resp.json()
    respData[value] === undefined ? displayData(respData[value], file) : displayData(respData[value], file)
}

function displayData(data, file) {
    let hint;
    if (file === 0) {
        city = data.city
        city = city.toLowerCase()
        guessResult = city.replace(/\s/g, '')
        city = city.split("")
        hint = `City of ${data.country}`
        guess = city

        createElements(hint, guess);

    } else {
        vegetable = data.vegetable
        vegetable = vegetable.toLowerCase()
        guessResult = vegetable.replace(/\s/g, '')
        vegetable = vegetable.split("")
        hint = "Vegetable"
        guess = vegetable;

        createElements(hint, guess);
    }
}

function createElements(hint, word) {
    let tag = document.createElement("h3");
    word.forEach(alphabet => {
        let container = document.createElement("div");
        tag.textContent = hint;
        container.dataset.alphabet = alphabet
        if (alphabet === " " || alphabet === "'") {
            container.textContent = "-"
            container.textContent = "'"
        } else {
            container.textContent = ""
        }
        wordDisplay.appendChild(container)
    });
    wordDisplay.appendChild(tag)
}


function getKeyboardResponse(e) {
    if (!e.target.classList.contains("key")) {
        e.stopPropogation();
    } else {
        if (tries < maxTries) {
            if(city === undefined && (vegetable.includes(e.target.getAttribute("data-key"))) || vegetable === undefined && (city.includes(e.target.getAttribute("data-key")))) {
                for (let i=0; i<(wordDisplay.children).length; i++) {
                    if (wordDisplay.children[i].dataset.alphabet === e.target.getAttribute("data-key")) {
                        wordCount += 1
                        wordDisplay.children[i].textContent = e.target.getAttribute("data-key");
                        keyboardMod("correct", e.target.getAttribute("data-key"));
                    }
                } 
            } else { 
                tries += 1;
                keyboardMod("wrong", e.target.getAttribute("data-key"))
                lifeDisplay.textContent = maxTries - tries;
            }
        }
    }
}

function keyboardMod (state, key) {
    for (let i=0; i<keyboard.children.length; i++) {
        if (keyboard.children[i].dataset.key === key && state === "wrong") {
            keyboard.children[i].style.backgroundColor = "red";
            keyboard.children[i].disabled = "disabled";
            keyboard.children[i].style.color = "white";
        } else if(keyboard.children[i].dataset.key === key && state === "correct") {
            keyboard.children[i].style.backgroundColor = "green";
            keyboard.children[i].disabled = "disabled";
            keyboard.children[i].style.color = "white";
        }
    }
}

function gameCheck() {
    if (wordCount === (guessResult.length)) {
        result.style.display = "block";
        result.textContent = "great work";
    } else if (tries === maxTries){
        result.style.display = "block";
        result.textContent = "try again";
        for (let i=0; i<(wordDisplay.children).length; i++) {
            wordDisplay.children[i].textContent = wordDisplay.children[i].dataset.alphabet;
            wordDisplay.children[i].classList.add("active");
        }
    }
}

setInterval(gameCheck, 500);

lifeDisplay.textContent = maxTries;

window.addEventListener("click", getKeyboardResponse)

getCity()