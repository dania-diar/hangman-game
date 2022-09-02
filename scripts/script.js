const myLives = document.getElementById("mylives");
const getHint = document.getElementById("hint");
const hint = document.getElementById("clue");
const resetButton = document.getElementById("reset");

const alphabet = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
const myStickman = document.getElementById("stickman");
const context = myStickman.getContext("2d");

let winWord = "";

let guesses = [];
let counter = 0;
let lives = 10;

const frame1 = () => {
  draw(0, 150, 150, 150);
};

const frame2 = () => {
  draw(10, 0, 10, 600);
};

const frame3 = () => {
  draw(0, 5, 70, 5);
};

const frame4 = () => {
  draw(60, 5, 60, 15);
};

const torso = () => {
  draw(60, 36, 60, 70);
};

const rightArm = () => {
  draw(60, 46, 100, 50);
};

const leftArm = () => {
  draw(60, 46, 20, 50);
};

const rightLeg = () => {
  draw(60, 70, 100, 100);
};

const leftLeg = () => {
  draw(60, 70, 20, 100);
};

const canvas = () => {
  context.beginPath();
  context.strokeStyle = "#fff";
  context.lineWidth = 2;
};

const head = () => {
  const myStickman = document.getElementById("stickman");
  const context = myStickman.getContext("2d");
  context.beginPath();
  context.arc(60, 25, 10, 0, Math.PI * 2, true);
  context.stroke();
};

const draw = ($pathFromx, $pathFromy, $pathTox, $pathToy) => {
  context.moveTo($pathFromx, $pathFromy);
  context.lineTo($pathTox, $pathToy);
  context.stroke();
};

const drawArray = [
  rightLeg,
  leftLeg,
  rightArm,
  leftArm,
  torso,
  head,
  frame4,
  frame3,
  frame2,
  frame1,
];

const animate = () => {
  const drawMe = lives;
  drawArray[drawMe]();
};

const renderButtons = (word) => {
  const buttonContainer = document.getElementById("buttons");
  const letters = document.createElement("ul");

  for (let i = 0; i < alphabet.length; i += 1) {
    letters.id = "alphabet";
    const letter = document.createElement("li");
    letter.id = "letter";
    letter.innerHTML = alphabet[i];

    letter.onclick = function () {
      if (lives < 1) {
        this.onclick = null;
        return;
      }
      const guessWord = this.innerHTML;
      this.setAttribute("class", "active");
      this.onclick = null;

      for (let i = 0; i < word.length; i++) {
        if (word[i] === guessWord) {
          // here is th error because we didnt define word --
          guesses[i].innerHTML = guessWord;
          counter += 1;
        }
      }
      const j = word.indexOf(guessWord);
      console.log(j);
      if (j === -1) {
        lives -= 1;
        animate();
      }
      showLives();
    };
    letters.appendChild(letter);
  }
  buttonContainer.appendChild(letters);
};

const showLives = () => {
  myLives.innerHTML = "You have " + lives + " lives";
  if (lives < 1) {
    myLives.innerHTML = "Game Over";
  }
  for (let i = 0; i < guesses.length; i++) {
    if (counter === guesses.length) {
      myLives.innerHTML = "You Win!";
    }
  }
};

const renderWordPlaceHolders = (word) => {
  const wordContainer = document.getElementById("hold");
  const wordHolder = document.createElement("ul");
  wordHolder.id = "my-word";
  for (let i = 0; i < word.length; i++) {
    const guess = document.createElement("li");
    guess.setAttribute("class", "guess");
    guess.innerHTML = "_";
    guesses.push(guess);

    wordHolder.appendChild(guess);
  }
  wordContainer.appendChild(wordHolder);
};

const startGame = async () => {
  const word = await fetch(
    "https://random-word-api.herokuapp.com/word?number=1"
  )
    .then((response) => response.json())
    .then((data) => {
      return data[0];
    });

  winWord = word;

  renderWordPlaceHolders(word);

  renderButtons(word);
};

resetButton.onclick = () => {
  const wordHolder = document.getElementById("my-word");
  wordHolder.parentNode.removeChild(wordHolder);

  const letters = document.getElementById("alphabet");
  letters.parentNode.removeChild(letters);
  hint.innerHTML = "";
  guesses = [];
  context.clearRect(0, 0, 400, 400);
  startGame();
};

getHint.onclick = () => {
  hint.innerHTML = "Clue: - " + winWord.slice(0, 3);
};

onload = async () => {
  startGame();
};
