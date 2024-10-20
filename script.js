
const emojis = ['🐨', '🐼', '🐸', '🦄', '🐔', '🐽', '🦎', '🐬', '🦞', '🦢', '🦜', '🦋', '🐤', '🪲', '🎃', '🎁', '💋', '🎖️', '🪆', '🧲', '💡', '📖', '💰', '⏰', '🍕', '🍗', '🍼', '🍺', '🍉', '🌺', '🚗', '✈️', '🚀', '🚁', '🌎', '🏠', '🌤️', '🌛', '⭐', '⚡', '🔥', '❤️'];

let selectedEmojis = [];
let targetEmoji = null;
let lockBoard = false;
let cardCount = document.getElementById('card-qty').value // Начинаем с 4 карточек
let time = Number(document.getElementById('time').value) * 1000

function startGame() {
    cardCount = document.getElementById('card-qty').value; // Сбрасываем количество карточек до 4 при старте
    reset();
    setupBoard(cardCount);
    
    // Показать карточки на 2 секунды
    revealAllCards();
}

function setupBoard(numberOfCards) {
    const board = document.getElementById('board');
    board.innerHTML = '';

    // Задаем 4 столбца и автоматическое количество строк
    board.style.gridTemplateColumns = `repeat(4, 100px)`;
    board.style.gridTemplateRows = `repeat(${Math.ceil(numberOfCards / 4)}, 100px)`;

    // Выбираем случайные эмодзи
    selectedEmojis = shuffleArray(emojis).slice(0, numberOfCards);
    
    // Создаем карточки
    selectedEmojis.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;

        const emojiElement = document.createElement('span');
        emojiElement.textContent = emoji;
        emojiElement.style.visibility = 'hidden';
        card.appendChild(emojiElement);

        card.addEventListener('click', () => handleCardClick(card, emojiElement));

        board.appendChild(card);
    });

    // Добавляем пустую строку для разделения между основными карточками и отдельной карточкой
    const separator = document.createElement('div');
    separator.style.gridColumn = 'span 4';
    separator.style.height = '20px';
    board.appendChild(separator);

    // Создаем отдельную карточку
    const separateCard = document.createElement('div');
    separateCard.classList.add('card', 'separate-card');
    separateCard.dataset.emoji = '';
    const separateEmojiElement = document.createElement('span');
    separateEmojiElement.textContent = '';
    separateCard.appendChild(separateEmojiElement);
    board.appendChild(separateCard);
}

function revealAllCards() {
    const allCards = document.querySelectorAll('.card:not(.separate-card)');
    time = Number(document.getElementById('time').value) * 1000
    console.log(time)
    console.log(document.getElementById('time'))

    allCards.forEach(card => {
        card.classList.add('flipped');
        card.firstChild.style.visibility = 'visible';
    });

    // Через 2 секунды все карточки будут скрыты
    setTimeout(() => {
        allCards.forEach(card => {
            card.classList.remove('flipped');
            card.firstChild.style.visibility = 'hidden';
        });

        // Показать отдельную карточку
        revealSeparateCard();
    }, time);
}

function revealSeparateCard() {
    // Выбираем одну случайную эмодзи из карточек
    targetEmoji = selectedEmojis[Math.floor(Math.random() * selectedEmojis.length)];

    const separateCard = document.querySelector('.separate-card');
    separateCard.dataset.emoji = targetEmoji;
    separateCard.firstChild.textContent = targetEmoji;
    
    // Показываем отдельную карточку
    separateCard.classList.add('flipped');
    separateCard.firstChild.style.visibility = 'visible';
}

function handleCardClick(card, emojiElement) {
    if (lockBoard || card.classList.contains('matched')) {
        return;
    }

    

    // Переворачиваем карточку при клике
    card.classList.add('flipped');
    emojiElement.style.visibility = 'visible';

    if (card.dataset.emoji === targetEmoji) {
        // Если угадал правильно
        card.classList.add('matched');
        alert('Правильно!');

        // Через 2 секунды увеличиваем количество карточек и продолжаем игру
        setTimeout(() => {
            //cardCount++; // Увеличиваем количество карточек
            setupBoard(cardCount); // Перезапускаем игру с новым количеством карточек
            revealAllCards(); // Снова показываем карточки
        }, time);
    } else {
        // Неправильный выбор, карточка остаётся перевёрнутой, но игра продолжается
        alert('Неправильно. Попробуй ещё раз.');
    }
}

function reset() {
    selectedEmojis = [];
    targetEmoji = null;
    lockBoard = false;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.getElementById('btn-start').addEventListener('click', startGame);
