let diceValues = [];
let rollsLeft = 3;
let scores = {
    ones: 0,
    twos: 0,
    threes: 0,
    fours: 0,
    fives: 0,
    sixes: 0
};

//hoeveel rollen je krijgt
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

        // Update de teller 
        updateRollsLeft();
        calculateScore();

        if (rollsLeft === 0) {
            rollsLeft = 3;
        }
    }
}

function updateRollsLeft() {
    // Update de teller 
    document.getElementById('rolls-left').textContent = rollsLeft;
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

function calculateScore() {
    // Reset score
    for (let category in scores) {
        scores[category] = 0;
    }

    // Rekenen scores
    for (let i = 0; i < diceValues.length; i++) {
        let diceValue = diceValues[i];
        scores['ones'] += (diceValue === 1) ? 1 : 0;
        scores['twos'] += (diceValue === 2) ? 2 : 0;
        scores['threes'] += (diceValue === 3) ? 3 : 0;
        scores['fours'] += (diceValue === 4) ? 4 : 0;
        scores['fives'] += (diceValue === 5) ? 5 : 0;
        scores['sixes'] += (diceValue === 6) ? 6 : 0;
    }

    // Update individueel scores
    for (let category in scores) {
        let scoreElement = document.getElementById('score-' + category);
        scoreElement.textContent = scores[category];
    }

    // Rekenen en update totaale score
    let totalScore = 0;
    for (let category in scores) {
        totalScore += scores[category];
    }
    document.getElementById('total-score').textContent = totalScore;
}

//onclick en een funcie om de score te blijiven houden dus break.