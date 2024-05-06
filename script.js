const studyMode = document.querySelector('#study-mode');
const currentWord = document.querySelector('#current-word');
const totalWord = document.querySelector('#total-word');
const wordsProgress = document.querySelector('#words-progress');
const buttonShuffleWords = document.querySelector('#shuffle-words');
const examMode = document.querySelector('#exam-mode');
const examProgress = document.querySelector('#exam-progress');
const correctPercent = document.querySelector('#correct-percent');
const studyCards = document.querySelector('.study-cards');
const slider = document.querySelector('.slider');
const flipCard = document.querySelector('.flip-card');
const titleFront = document.querySelector('.title-front');
const titleBack = document.querySelector('.title-back');
const example = document.querySelector('.example-back');
const buttonBack = document.querySelector('#back');
const buttonExam = document.querySelector('#exam');
const buttonNext = document.querySelector('#next');
const examCards = document.querySelector('#exam-cards');
const time = document.querySelector('#time');

class Item {
  constructor(title, translation, example) {
    this.title = title;
    this.translation = translation;
    this.example = example;
  }
}

const item1 = new Item('cat', 'кот', 'a pet with the habits of a feline predator');
const item2 = new Item('dog', 'собака', 'a pet related to a wolf');
const item3 = new Item('book', 'книга', 'one of the types of printed products');
const item4 = new Item('apple', 'яблоко', 'juicy apple fruit');
const item5 = new Item('street', 'улица', 'a place outside the residential premises, in the open air');
const item6 = new Item('school', 'школа', 'educational institution for general education');

const arr = [item1, item2, item3, item4, item5, item6];

slider.addEventListener('click', function() {
  if (flipCard.classList.contains('active')) {
    flipCard.classList.remove('active');
  } else {
    flipCard.classList.add('active');
  }
})

let currentIndex = 0;

function showCard(content) {
  currentWord.textContent = currentIndex + 1;
  titleFront.textContent = content.title;
  titleBack.textContent = content.translation;
  example.textContent = content.example;
  wordsProgress.value = (currentIndex + 1) / arr.length * 100;
}

showCard(arr[currentIndex]);
buttonNext.addEventListener('click', function() {
  currentIndex++;
  showCard(arr[currentIndex]);
  buttonBack.disabled = false;
  buttonNext.disabled = currentIndex === arr.length - 1;
})

buttonBack.addEventListener('click', function() {
  currentIndex--;
  showCard(arr[currentIndex]);
  buttonNext.disabled = false;
  buttonBack.disabled = currentIndex === 0;
})

totalWord.textContent = arr.length;

buttonShuffleWords.addEventListener('click', function() {
  arr.sort(() => Math.random() - 0.5);
  showCard(arr[currentIndex]);
})

function createTestcard(obj) {
  const divElement = document.createElement('div');
  divElement.classList.add('card');
  const pElement = document.createElement('p');
  pElement.textContent = obj;
  divElement.append(pElement);
  divElement.onclick = function() {
    wordTranslation(divElement);
  }
  return divElement;
}
function addCard() {
  const fragment = new DocumentFragment();
  const newArray = [];
  arr.forEach((array) => {
    newArray.push(createTestcard(array.translation));
    newArray.push(createTestcard(array.title));
  })
  fragment.append(...newArray.sort(() => Math.random() - 0.5));
  examCards.innerHTML = '';
  examCards.append(fragment);
}

let timerId;
let seconds = 0;
let minutes = 0;
let isRunning = false;

function format(val) {
  if (val < 10) {
    return `0${val}`;
  }
  return `${val}`;
}

function countTimer() {
  time.innerHTML = `${format(minutes)}:${format(seconds)}`;
  if (seconds < 59) {
    seconds++;
  } else {
    minutes++;
    seconds = 0;
  }
}
buttonExam.addEventListener('click', function() {
  studyCards.classList.add('hidden');
  studyMode.classList.add('hidden');
  examMode.classList.remove('hidden');
  if (!isRunning) {
    timerId = setInterval(countTimer, 1000);
    isRunning = !isRunning;
  }
  addCard();
})

let selectedCard;
currentIndex = 0;

let cardsCompleted = 0;

function wordTranslation(currentCard) {
  if (!selectedCard) {
    removeCards();
    currentCard.classList.add('correct');
    selectedCard = currentCard;
    currentCard.style.pointerEvents = "none";
  } else {
    const wordObject = arr.find(word => word.translation === selectedCard.textContent || word.title === selectedCard.textContent);

    if (selectedCard !== currentCard) {
      if (wordObject.translation === currentCard.textContent || wordObject.title === currentCard.textContent) {
        currentIndex++;
        cardsCompleted++;

        const percentage = Math.min(cardsCompleted * 17, 100);
        correctPercent.textContent = percentage + '%';
        examProgress.value = percentage;

        currentCard.classList.add('correct');
        removeCorrectCards([currentCard, selectedCard]);

        const cards = document.querySelectorAll('.card');
        let disappeared = true;
        currentCard.style.pointerEvents = "none";
        cards.forEach(card => {
          if (!card.classList.contains('fade-out')) {
            disappeared = false;
          }
        });

        if (disappeared) {
          setTimeout(() => {
            alert('Проверка знаний успешно завершена!');
            clearInterval(timerId);
            isRunning = false;
          }, 1000);
        }
      } else {
        selectedCard.classList.add('correct');
        currentCard.classList.add('wrong');
        setTimeout(() => {
          removeCards();
        }, 500);
        currentCard.style.pointerEvents = "all";
        selectedCard.style.pointerEvents = "all";
      }
    }
    selectedCard = null;
  }
}

function removeCards() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.classList.remove('correct');
    card.classList.remove('wrong');
  })
}

function removeCorrectCards(cards) {
  cards.forEach(card => {
    card.classList.add('fade-out');
  })
}
