let diceValues = [];
let Amount;
let rollsLeft = 3;
let scores = {
    ones: 0,
    twos: 0,
    threes: 0,
    fours: 0,
    fives: 0,
    sixes: 0
};

// rollen hoeveel je krijgt
function rollDice() {
    if (rollsLeft > 0) {
        diceValues = [];
        let diceContainer = document.getElementById('dice-container');
        diceContainer.innerHTML = '';

        for (let i = 0; i < 5; i++) {
            let diceValue = Math.floor(Math.random() * 6) + 1;
            diceValues.push(diceValue);

            let diceElement = document.createElement('div');
            diceElement.className = 'dice';
            diceElement.textContent = diceValue;
            diceElement.setAttribute('data-index', i);
            diceElement.onclick = toggleHold;
            diceContainer.appendChild(diceElement);
        }

        rollsLeft--;

        if (rollsLeft === 0) {
            calculateScore();
        }
    }
}

function toggleHold(event) {
    let index = event.target.getAttribute('data-index');
    let diceElement = document.querySelector('[data-index="' + index + '"]');

    if (diceElement.classList.contains('held')) {
        diceElement.classList.remove('held');
    } else {
        diceElement.classList.add('held');
    }
}
