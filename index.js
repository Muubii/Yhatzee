let diceValues = [];
let rollsLeft = 3;
let scores = {
    ones: 0,
    twos: 0,
    threes: 0,
    fours: 0,
    fives: 0,
    sixes: 0,
    threeOfaKind: 0,
    fourOfaKind: 0,
    fullHouse: 0,
    smallStraight: 0,
    largeStraight: 0,
    yahtzee: 0,
    chanceBonus: 0
};
let selectedDice = [];
let scoreHistory = [0, 0, 0];
let selectedScoreCategories = []; 

//hoeveel rollen je krijgt
function rollDice() {
    if (rollsLeft > 0) {
        let diceContainer = document.getElementById('dice-container');
        diceContainer.innerHTML = '';

        for (let i = 0; i < 5; i++) {
            let diceValue;

            // Controleer of de dobbelsteen geselecteerd is
            if (selectedDice.includes(i)) {
                diceValue = diceValues[i];
            } else {
                diceValue = Math.floor(Math.random() * 6) + 1;
            }

            diceValues[i] = diceValue;

            let diceElement = document.createElement('div');
            diceElement.className = 'dice';
            diceElement.textContent = diceValue;
            diceElement.setAttribute('data-index', i);
            diceElement.onclick = toggleHold;

            // Voeg de 'selected'-klasse toe als de dobbelsteen geselecteerd is
            if (selectedDice.includes(i)) {
                diceElement.classList.add('selected');
            }

            diceContainer.appendChild(diceElement);
        }

        rollsLeft--;
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
    

    toggleSelect(diceElement);
}

function toggleSelect(diceElement) {
    diceElement.classList.toggle('selected');
    let index = parseInt(diceElement.getAttribute('data-index'));

    // Voeg of verwijder de dobbelsteen uit de geselecteerde lijst
    if (selectedDice.includes(index)) {
        selectedDice = selectedDice.filter(item => item !== index);
    } else {
        selectedDice.push(index);
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

    //Update de scoreboard totaal
    scoreHistory.push(totalScore);
    if (scoreHistory.length > 3) {
    scoreHistory.shift();
    }
        
    // Update de scoregeschiedenis in de HTML

    
    calculateBonusScore();
    calculateThreeOfAKind();
    calculateFullHouse();
    calculateSmallStraight();
    calculateLargeStraight();
    calculateYahtzee();
    calculateChanceBonus();
    calculateFourOfAKind();
}

// Bonus score 
function calculateBonusScore() {
    const upperSectionSum = scores.ones + scores.twos + scores.threes + scores.fours + scores.fives + scores.sixes;
    const bonusThreshold = 63;

    scores.bonus = upperSectionSum >= bonusThreshold ? 35 : 0;
    document.getElementById('score-bonus').textContent = scores.bonus;
}

//Three of a kind score
function calculateThreeOfAKind() {
    const sortedValues = diceValues.slice().sort();
    
    for (let i = 0; i <= sortedValues.length - 3; i++) {
        if (sortedValues[i] === sortedValues[i + 1] && sortedValues[i + 1] === sortedValues[i + 2]) {
            scores.threeOfaKind = sortedValues.reduce((total, value) => total + value, 0);
            break;
        }
    }

    document.getElementById('score-threeOfaKind').textContent = scores.threeOfaKind;
}


// Four of a kind score
function calculateFourOfAKind() {
    const sortedValues = diceValues.slice().sort();
    
    for (let i = 0; i <= sortedValues.length - 4; i++) {
        if (sortedValues[i] === sortedValues[i + 1] && sortedValues[i + 1] === sortedValues[i + 2] && sortedValues[i + 2] === sortedValues[i + 3]) {
            scores.fourOfaKind = sortedValues.reduce((total, value) => total + value, 0);
            break;
        }
    }

    document.getElementById('score-fourOfaKind').textContent = scores.fourOfaKind;
}

    // Full house
function calculateFullHouse() {
    const sortedValues = diceValues.slice().sort();
    
    if ((sortedValues[0] === sortedValues[1] && sortedValues[1] === sortedValues[2] && sortedValues[3] === sortedValues[4]) ||
        (sortedValues[0] === sortedValues[1] && sortedValues[2] === sortedValues[3] && sortedValues[3] === sortedValues[4])) {
        scores.fullHouse = 25;
    }

    document.getElementById('score-fullHouse').textContent = scores.fullHouse;
}

    // Small straight 
function calculateSmallStraight() {
    const uniqueValues = Array.from(new Set(diceValues)).sort();

    // Check for a small straight (four consecutive values)
    if (
        (uniqueValues[0] === 1 && uniqueValues[1] === 2 && uniqueValues[2] === 3 && uniqueValues[3] === 4) ||
        (uniqueValues[1] === 2 && uniqueValues[2] === 3 && uniqueValues[3] === 4 && uniqueValues[4] === 5) ||
        (uniqueValues[2] === 3 && uniqueValues[3] === 4 && uniqueValues[4] === 5 && uniqueValues[5] === 6)
    ) {
        scores.smallStraight = 30;
    }

    document.getElementById('score-smallStraight').textContent = scores.smallStraight;
}

function calculateLargeStraight() {
    const uniqueValues = Array.from(new Set(diceValues)).sort();

    //Large straight score
    if (
        (uniqueValues[0] === 1 && uniqueValues[1] === 2 && uniqueValues[2] === 3 && uniqueValues[3] === 4 && uniqueValues[4] === 5) ||
        (uniqueValues[1] === 2 && uniqueValues[2] === 3 && uniqueValues[3] === 4 && uniqueValues[4] === 5 && uniqueValues[5] === 6)
    ) {
        scores.largeStraight = 40;
    }

    document.getElementById('score-largeStraight').textContent = scores.largeStraight;
}

    // Yhatzee score
function calculateYahtzee() {
    // Check if all dice values are the same
    if (diceValues.every(value => value === diceValues[0])) {
        scores.yahtzee = 50;
    }

    document.getElementById('score-yahtzee').textContent = scores.yahtzee;
}

    // Chance bonus score
function calculateChanceBonus() {
    scores.chanceBonus = diceValues.reduce((total, value) => total + value, 0);
    document.getElementById('score-chanceBonus').textContent = scores.chanceBonus;
}


function selectScore(category) {

    switch (category){

        case 'threeOfaKind':
            score = calculateThreeOfAKind();
            break;
        case 'fourOfaKind':
            score = calculateFourOfAKind();
            break;
        case 'fullHouse':
            score = calculateFullHouse();
            break;
        case 'smallStraight':
            score = calculateSmallStraight();
            break;
        case 'largeStraight':
            score = calculateLargeStraight();
            break;
        case 'yahtzee':
            score = calculateYahtzee();
            break;
        case 'chanceBonus':
            score = calculateChanceBonus();
            break;
    }
        selectedScoreCategories.push(category);
    
}



// toggle aidio play/pauze
let playPause = document.getElementById("playPause");
let audio;

function togglePlayPause() {
  if (!audio || audio.paused) {
    if (!audio) {
      audio = new Audio("music/mixSongBySam.mp3");
    }
    audio.play();
    playPause.innerText = "Pause";
  } else {
    audio.pause();
    playPause.innerText = "Play";
  }
}

playPause.addEventListener("click", togglePlayPause);
