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
let selectedScores = {};
let scoreHistory = [0, 0, 0]; // dit inpv cata

//hoeveel rollen je krijgt
function rollDice() {
    let diceContainer = document.getElementById('dice-container');

    if (rollsLeft > 0) {
        diceContainer.innerHTML = '';  // Leegmaken van de container

        for (let i = 0; i < 5; i++) {
            if (!selectedDice.includes(i)) {
                // Alleen nieuwe waarde genereren voor niet-geselecteerde dobbelstenen
                diceValues[i] = Math.floor(Math.random() * 6) + 1;
            }

            // Creëer en voeg dobbelsteen toe aan de container
            let diceElement = createDiceElement(i, diceValues[i]);
            diceContainer.appendChild(diceElement);
        }
        
        rollsLeft--;
        updateRollsLeft();
        calculateScore();
    }

    if (rollsLeft === -1) {
        rollsLeft = ''; // Reset rollsLeft voor volgende beurt
    }
}

function createDiceElement(index, value) {
    let diceElement = document.createElement('div');
    diceElement.className = 'dice';
    diceElement.textContent = value;
    diceElement.setAttribute('data-index', index);
    diceElement.onclick = toggleHold;

    if (selectedDice.includes(index)) {
        diceElement.classList.add('selected');
    }

    return diceElement;
}

//reset na 3 rolls
function resetGameState() {
    rollsLeft = 3;
    selectedDice = [];
    updateRollsLeft();
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
    calculateUpperSectionScores();
    calculateLowerSectionScores();

    // Update individual scores in the HTML
    for (let key in scores) {
        let scoreElement = document.getElementById('score-' + key);

        // Update score only if not selected
        if (!selectedScores.hasOwnProperty(key)) {
            if (scoreElement) {
                scoreElement.textContent = scores[key];
            }
        }
    }

    // Calculate and display total score
    let totalScore = Object.values(selectedScores).reduce((sum, value) => sum + value, 0);
    document.getElementById('total-score').textContent = totalScore;
}

function resetNonSelectedScores() {
    for (let key in scores) {
        if (!selectedScores.hasOwnProperty(key)) {
            scores[key] = 0;
        }
    }
}

// een select score die wel iets kan selecteren maar niks in kan doen
function selectScore(scoreType) {
    let scoreElement = document.getElementById('score-' + scoreType);
    if (scoreElement && scoreElement.onclick !== null) {
        scoreElement.style.backgroundColor = 'red';
        scoreElement.style.cursor = 'default';
        scoreElement.onclick = null; // Remove the click event listener

        // Store the selected score and reset others
        selectedScores[scoreType] = scores[scoreType];
        resetNonSelectedScores();

        resetGameState();
        calculateScore();
    }
}


function addTotalScore(selectScore){
    let totalScoreElement = document.getElementById('total-score');
    totalScore.textContent = totalScoreElement + selectScore;
}

function calculateUpperSectionScores(){

    scores['ones'] = 0;
    scores['twos'] = 0;
    scores['threes'] = 0;
    scores['fours'] = 0;
    scores['fives'] = 0;
    scores['sixes'] = 0;
    
    for (let i = 0; i < diceValues.length; i++) {
        let diceValue = diceValues[i];
        scores['ones'] += (diceValue === 1) ? 1 : 0;
        scores['twos'] += (diceValue === 2) ? 2 : 0;
        scores['threes'] += (diceValue === 3) ? 3 : 0;
        scores['fours'] += (diceValue === 4) ? 4 : 0;
        scores['fives'] += (diceValue === 5) ? 5 : 0;
        scores['sixes'] += (diceValue === 6) ? 6 : 0;
    }
}

function calculateLowerSectionScores(){

    scores['threeOfaKind'] = 0;
    scores['fourOfaKind'] = 0;
    scores['fullHouse'] = 0;
    scores['smallStraight'] = 0;
    scores['LargeStraight'] = 0;
    scores['yahtzee'] = 0;
    scores['chanceBonus'] = 0;


    calculateBonusScore();
    calculateThreeOfAKind();
    calculateFourOfAKind();
    calculateFullHouse();
    calculateSmallStraight();
    calculateLargeStraight();
    calculateYahtzee();
    calculateBonusScore();
}

//----------------------------Alle scores functions-------------------------------------------------------------------------------------------------


// Bonus score 
function calculateBonusScore() {
    const upperSectionSum = scores.ones + scores.twos + scores.threes + scores.fours + scores.fives + scores.sixes;
    const bonusThreshold = 63;

    scores.bonus = upperSectionSum >= bonusThreshold ? 35 : 0;
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
}

    // Full house
function calculateFullHouse() {
    const sortedValues = diceValues.slice().sort();
    
    if ((sortedValues[0] === sortedValues[1] && sortedValues[1] === sortedValues[2] && sortedValues[3] === sortedValues[4]) ||
        (sortedValues[0] === sortedValues[1] && sortedValues[2] === sortedValues[3] && sortedValues[3] === sortedValues[4])) {
        scores.fullHouse = 25;
    }
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
}

    // Yhatzee score
function calculateYahtzee() {
    // Check if all dice values are the same
    if (diceValues.every(value => value === diceValues[0])) {
        scores.yahtzee = 50;
    }
}
    // Chance bonus score
function calculateChanceBonus() {
    scores.chanceBonus = diceValues.reduce((total, value) => total + value, 0);
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