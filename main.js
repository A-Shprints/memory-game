// Этап 1. Создайте функцию, генерирующую массив парных чисел. Пример массива, который должна возвратить функция: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8].count - количество пар.

function createNumbersArray(pairCount) {
  let arr = [];
  for (let i = 1; i < pairCount + 1; i++) {
    arr.push(i);
    arr.push(i);
  }
  return arr;
}

// Этап 2. Создайте функцию перемешивания массива.Функция принимает в аргументе исходный массив и возвращает перемешанный массив. arr - массив чисел

function shuffle(arr) {
  for (let i = 0; i < arr.length; i++) {
    // Случайным образом генерируем индекс в массиве
    let randomIndex = Math.trunc(Math.random() * arr.length);

    // Сохраняем текущее число массива в цикле во временную переменную

    let temp = arr[i];

    // Присваиваем текущему числу массива в цикле значение числа по случайному индексу

    arr[i] = arr[randomIndex];

    // Присваиваем числу по случайному индексу значение числа по текущему индексу

    arr[randomIndex] = temp;
  }
  return arr;
}

// Этап 3. Используйте две созданные функции для создания массива перемешанными номерами. На основе этого массива вы можете создать DOM-элементы карточек. У каждой карточки будет свой номер из массива произвольных чисел. Вы также можете создать для этого специальную функцию. count - количество пар.

let playArea = document.createElement("div");
let seconds;

function startGame(pairCount) {
  let initialArr = createNumbersArray(pairCount);
  let shuffledArr = shuffle(initialArr);
  let container = document.createElement("div");
  seconds = gameTimer;
  container.classList.add("container");
  document.body.append(container);
  playArea.classList.add("play-area");
  playArea.innerHTML = "";
  container.append(playArea);
  for (let i = 0; i < shuffledArr.length; i++) {
    let card = document.createElement("button");
    card.classList.add("card");
    card.innerHTML = "?";
    card.addEventListener("click", cardClick);
    playArea.append(card);
  }

  // Добавляем див с кнопкой для сброса игры

  let buttonArea = document.createElement("div");
  container.appendChild(buttonArea);
  buttonArea.classList.add("button-area");
  let resetButton = document.createElement("button");
  resetButton.classList.add("reset-button");
  resetButton.innerText = "Начать заново";
  buttonArea.appendChild(resetButton);
  resetButton.onclick = function () {
    deleteAll();
    startGame(pairCount);
    clearInterval(timerId);
  };

  // Объявляем переменные для обозначения клика на первой и второй карточках (индекс и значение)
  let firstClickedCardIndex;
  let firstClickedCardContent;
  let secondClickedCardIndex;
  let clickedCardSecondContent;

  // Объявляем массив, содержащий отгаданные карточки

  let guessedArr = [];

  function cardClick() {
    // Первый клик в попытке
    // Проверяем была ли нажата раньше карточка
    if (firstClickedCardContent == undefined) {
      // Присваиваем переменным firstClicked... индекс и значение нажатой карточки
      firstClickedCardIndex = Array.from(playArea.children).indexOf(this);
      firstClickedCardContent = shuffledArr[firstClickedCardIndex];
      // Показываем пользователю содержимое нажатой карточки
      this.innerHTML = shuffledArr[firstClickedCardIndex];
      // Запрещаем повторный клик по данной карточке
      this.disabled = true;
      // Добавляем стиль для нажатой карточки
      playArea.children[firstClickedCardIndex].classList.add("card--clicked");
      // Если ранее карточка была нажата
    } else {
      // Второй клик в попытке
      // Присваиваем переменным firstClicked... индекс и значение нажатой карточки
      // Запрещаем повторный клик по всем карточкам
      for (let i = 0; i < playArea.children.length; i++) {
        playArea.children[i].disabled = true;
      }

      secondClickedCardIndex = Array.from(playArea.children).indexOf(this);
      clickedCardSecondContent = shuffledArr[secondClickedCardIndex];
      // Добавляем стиль для нажатой карточки
      playArea.children[secondClickedCardIndex].classList.add("card--clicked");
      // Показываем пользователю содержимое нажатой карточки
      this.innerHTML = shuffledArr[secondClickedCardIndex];
      // Делаем проверку на совпадение значений нажатой карточки и той, которая была открыта прошлым кликом
      if (firstClickedCardContent === clickedCardSecondContent) {
        // Если карточки совпадают
        // Сбрасываем переменную firstClickedCardContent
        firstClickedCardContent = undefined;
        // Добавляем в массив отгаданных карточек две наших только что отгаданные карточки
        guessedArr.push(firstClickedCardIndex, secondClickedCardIndex);
        // Применяем стиль к отгаданным карточек
        playArea.children[firstClickedCardIndex].classList.add("card--guessed");
        playArea.children[secondClickedCardIndex].classList.add(
          "card--guessed"
        );
        setTimeout(() => {
          playArea.children[firstClickedCardIndex].classList.remove(
            "card--clicked"
          );
          playArea.children[firstClickedCardIndex].disabled = false;
          this.disabled = false;
          this.classList.remove("card--clicked");
          // Снимаем disabled со всех карточек
          for (let i = 0; i < playArea.children.length; i++) {
            playArea.children[i].disabled = false;
          }
          // Возвращаем disabled на уже отгаданные карточки
          guessedArr.forEach((index) => {
            let card = playArea.children[index];
            if (card) {
              card.disabled = true;
            }
          });
        }, 500);
      } else {
        // Если карточки не совпадают
        // Сбрасываем переменную firstClickedCardContent
        firstClickedCardContent = undefined;
        // Скрываем содержимое первой и второй карточки в данной попытке с таймаутом
        setTimeout(() => {
          playArea.children[firstClickedCardIndex].innerHTML = "?";
          playArea.children[firstClickedCardIndex].classList.remove(
            "card--clicked"
          );
          playArea.children[firstClickedCardIndex].disabled = false;
          this.innerHTML = "?";
          this.disabled = false;
          this.classList.remove("card--clicked");
          // Снимаем disabled со всех карточек
          for (let i = 0; i < playArea.children.length; i++) {
            playArea.children[i].disabled = false;
          }
          // Возвращаем disabled на уже отгаданные карточки
          guessedArr.forEach((index) => {
            let card = playArea.children[index];
            if (card) {
              card.disabled = true;
            }
          });
        }, 500);
      }
    }
  }

  // Функция удаления контейнера перед началом новой игры

  function deleteAll() {
    container.removeChild(playArea);
    document.body.removeChild(container);

    clearInterval(timerId);
    clearInterval(winId);
    guessedArr.length = 0;
  }

  // Запускаем таймер
  let timer = document.createElement("span");
  timer.classList.add("timer");
  buttonArea.insertBefore(timer, resetButton);
  timer.innerHTML = "До конца игры: " + seconds;

  let timerId = setInterval(updateTimer, 1000);

  // Функция таймера

  function updateTimer() {
    seconds--;
    timer.innerHTML = "До конца игры: " + seconds;
    if (seconds == 0) {
      alert("Вы проиграли :( \nПосле клика на кнопку ОК игра начнется заново");
      deleteAll();
      startGame(pairCount);
      clearInterval(timerId);
      guessedArr.length = 0;
    }
  }

  // Функция для проверки условий выигрыша

  let winId = setInterval(testWinCondition, 1000);

  function testWinCondition() {
    let remainingCards = shuffledArr.length - guessedArr.length;

    if (remainingCards === 0) {
      alert(
        "Вы отгадали все карточки! \nПосле клика на кнопку ОК игра начнется заново"
      );
      guessedArr.length = 0;
      deleteAll();
      startGame(pairCount);
      clearInterval(winId);
    }
  }
}

// Добавляем форму для для запуска игры

addEventListener("DOMContentLoaded", function () {
  let startForm = document.createElement("form");
  let startInput = document.createElement("input");
  let startInputLabel = document.createElement("label");
  let startButton = document.createElement("button");
  let wrapper = document.createElement("div");
  let lineBreak = document.createElement("br");
  startForm.classList.add("form");
  startInput.type = "number";
  startInput.value = 4;
  startInput.min = 4;
  startInput.max = 10;
  startInputLabel.innerHTML =
    "Введите количество карточек по вертикали/горизонтали (четное число от 2 до 10):";
  startInputLabel.classList.add("label");
  startInput.classList.add("input");
  startButton.classList.add("button-start");
  startButton.innerText = "Начать игру";

  startButton.onclick = function (e) {
    e.preventDefault();
    document.body.removeChild(startForm);
    let userInput = parseInt(startInput.value);
    // Проверяем введенное число карточек на четность и диапазон
    if (userInput === 2) {
      playArea.setAttribute("id", "side-2");
      pairCount = parseInt((startInput.value * startInput.value) / 2);
      gameTimer = 5;
      seconds = gameTimer;
    } else if (userInput === 4) {
      playArea.setAttribute("id", "side-4");
      pairCount = parseInt((startInput.value * startInput.value) / 2);
      gameTimer = 40;
      seconds = gameTimer;
    } else if (userInput === 6) {
      playArea.setAttribute("id", "side-6");
      pairCount = parseInt((startInput.value * startInput.value) / 2);
      gameTimer = 160;
      seconds = gameTimer;
    } else if (userInput === 8) {
      playArea.setAttribute("id", "side-8");
      pairCount = parseInt((startInput.value * startInput.value) / 2);
      gameTimer = 320;
      seconds = gameTimer;
    } else if (userInput === 10) {
      playArea.setAttribute("id", "side-10");
      pairCount = parseInt((startInput.value * startInput.value) / 2);
      gameTimer = 600;
      seconds = gameTimer;
    } else {
      playArea.setAttribute("id", "side-4");
      pairCount = 8;
      gameTimer = 40;
      seconds = gameTimer;
    }
    startGame(pairCount);
  };
  document.body.appendChild(startForm);
  startForm.appendChild(wrapper);
  startForm.appendChild(startButton);
  wrapper.appendChild(startInputLabel);
  wrapper.appendChild(lineBreak);
  wrapper.appendChild(startInput);
});
