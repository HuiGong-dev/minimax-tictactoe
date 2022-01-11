const X_CLASS = 'x';
const O_CLASS = 'o';
const LOGO_X = 'logo__x';
const LOGO_O = 'logo__o';
const PICK = 'pick';
const UNPICK = 'unpick';
const SHOW = "show";
const WINNING_PATTERNS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
// game board elements
const turnIndicator = document.getElementById('turn-indicator');
const indicatorLogo = turnIndicator.childNodes[1];
const refreshButton = document.getElementById('restart-button');
const cellElements = document.querySelectorAll('[data-cell');
const board = document.getElementById('board');
const xWinsCount = document.getElementById('x-wins-count');
const oWinsCount = document.getElementById('o-wins-count');
const tieCount = document.getElementById('tie-count');
// winning message elements
const winningMessage = document.getElementById('winning-message');
const whoWinsText = document.getElementById('banner-who-wins');
const whoTakesRound = document.getElementById('banner-who-takes-the-round');
const quitButton = document.getElementById('quit-button');
const nextRoundButton = document.getElementById('next-round-button');
// intro page elements
const intro = document.getElementById('intro');
const introPickLogoX = document.getElementById('intro__pick__logo__x');
const introPickLogoO = document.getElementById('intro__pick__logo__o');
const introNewGameVsCpu = document.getElementById('new-game-vs-cpu');
const introNewGameVsPlayer = document.getElementById('new-game-vs-player');
// game status
let isGameStarted = false;
// intro page letiables
let playerOnePickedCircle = true;
let playerOneVsCpu;
// game page variables
let circleTurn;
let xWinsCountText = xWinsCount.getElementsByTagName('span')[0];
let xWinsCountNumber = xWinsCount.getElementsByTagName('span')[1];
let tieCountNumber = tieCount.getElementsByTagName('span')[1];
let oWinsCountText = oWinsCount.getElementsByTagName('span')[0];
let oWinsCountNumber = oWinsCount.getElementsByTagName('span')[1];
let whoTakesRoundLogo = whoTakesRound.getElementsByTagName('div')[0];
let whoTakesRoundText = whoTakesRound.getElementsByTagName('div')[1];
// variable for minimax algorithm
let arrayForMinimax = [];
// show intro page
intro.classList.add(SHOW);


// handle player 1 pick mark events
introPickLogoX.addEventListener('click', () => {
    if (playerOnePickedCircle) {
        introPickLogoX.classList.add(PICK);
        introPickLogoO.classList.add(UNPICK);
        playerOnePickedCircle = !playerOnePickedCircle;
        xWinsCountText.innerText = 'X (YOU)';
    }
});

introPickLogoO.addEventListener('click', () => {
    if (!playerOnePickedCircle) {
        introPickLogoX.classList.remove(PICK);
        introPickLogoO.classList.remove(UNPICK);
        playerOnePickedCircle = !playerOnePickedCircle;
        oWinsCountText.innerText = 'O (YOU)';
    }
});
// Enter new game. hide intro page. show game page. 
introNewGameVsCpu.addEventListener('click', () => {
    playerOneVsCpu = true;
    if (playerOnePickedCircle) {
        xWinsCountText.innerText = 'X (CPU)';
    } else {
        oWinsCountText.innerText = 'O (CPU)';
    }
    startGame();
    isGameStarted = true;
    intro.classList.remove(SHOW);

});
introNewGameVsPlayer.addEventListener('click', () => {
    playerOneVsCpu = false;
    if (playerOnePickedCircle) {
        xWinsCountText.innerText = 'X (PLAYER)';
    } else {
        oWinsCountText.innerText = 'O (PLAYER)';
    }
    startGame();
    isGameStarted = true;
    intro.classList.remove(SHOW);
});

// game page logic
refreshButton.addEventListener('click', () => {
    if (isGameStarted) {
        resetGameBoard();
        if(playerOnePickedCircle && playerOneVsCpu){
            cpuPlaceMark();
        }
    }

});

quitButton.addEventListener('click', quitGame);
nextRoundButton.addEventListener('click', nextRound);

function startGame() {
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleCellClick);
        cell.addEventListener('click', handleCellClick, {
            once: true
        });
    });
    winningMessage.classList.remove(SHOW);

    if(playerOnePickedCircle && playerOneVsCpu){
        cpuPlaceMark();
    }
}


function handleCellClick(e) {
    //handle click cell events only when game started and 
    //((it's player one's turn) or (player vs player))
    console.log("clicked!")
    if (isGameStarted &&
        ((circleTurn === playerOnePickedCircle) || (!playerOneVsCpu))) {
        const cell = e.target;
        if (!cell.classList.contains(O_CLASS) && !cell.classList.contains(X_CLASS)){
            const currentClass = circleTurn ? O_CLASS : X_CLASS;
            placeMark(cell, currentClass);
            if (checkWin(currentClass)) {
                endGame(false);
            } else if (isTie()) {
                endGame(true);
            } else {
                swapTurns();
                swapIndicatorLogo();
            }
        }
    }
}

function swapIndicatorLogo() {
    if (indicatorLogo.classList[0] === LOGO_X) {
        indicatorLogo.classList.replace(LOGO_X, LOGO_O);
    } else {
        indicatorLogo.classList.replace(LOGO_O, LOGO_X);
    }

}

function swapTurns() {
    circleTurn = !circleTurn;
    // if next is cpu's turn, call cpuPlaceMark().
    if (circleTurn && !playerOnePickedCircle && playerOneVsCpu){
        cpuPlaceMark();
    }
    if (!circleTurn && playerOnePickedCircle && playerOneVsCpu){
        cpuPlaceMark();
    }

}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
}

function checkWin(currentClass) {
    return WINNING_PATTERNS.some(pattern => {
        return pattern.every(index => {
            return cellElements[index].classList.contains(currentClass)
        });
    });
}

function isTie() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

// winning message logic

function handleTie() {
    tieCountNumber.innerText = Number(tieCountNumber.innerText) + 1;
    whoWinsText.innerText = 'IT\'S A TIE';
    if (!whoTakesRound.classList.contains('tie')) {
        whoTakesRound.classList.add('tie');
    }
    whoTakesRoundText.innerText = "WANNA TRY AGAIN?"
}

function handleCircleWon() {
    oWinsCountNumber.innerText = Number(oWinsCountNumber.innerText) + 1;
    if (!playerOnePickedCircle) {
        whoWinsText.innerText = "YOU LOSE!"
    } else {
        whoWinsText.innerText = "YOU WON!"
    }
    whoTakesRoundLogo.classList.remove(LOGO_X);
    if (!whoTakesRoundLogo.classList.contains(LOGO_O)) {
        whoTakesRoundLogo.classList.add(LOGO_O);
    }
    if (!whoTakesRoundText.classList.contains('o-win')) {
        whoTakesRoundText.classList.add('o-win');
    }
}

function handleCrossWon() {
    xWinsCountNumber.innerText = Number(xWinsCountNumber.innerText) + 1;
    if (!playerOnePickedCircle) {
        whoWinsText.innerText = "YOU WON!"
    } else {
        whoWinsText.innerText = "YOU LOSE!"
    }
    whoTakesRoundLogo.classList.remove(LOGO_O);
    if (!whoTakesRoundLogo.classList.contains(LOGO_X)) {
        whoTakesRoundLogo.classList.add(LOGO_X);
    }
    whoTakesRoundText.classList.remove('o-win');

}

function endGame(tie) {
    if (tie) {
        handleTie();
    } else {
        whoTakesRoundText.innerText = "TAKES THE ROUND"
        if (circleTurn) {
            handleCircleWon();
        } else {
            handleCrossWon();
        }
    }
    isGameStarted = false;
    winningMessage.classList.add(SHOW);
}

// reset historical win, lose and tie data
// reset mark and vs info
function quitGame() {
    xWinsCountNumber.innerText = 0;
    tieCountNumber.innerText = 0;
    oWinsCountNumber.innerText = 0;
    if(!playerOnePickedCircle){
        introPickLogoX.classList.remove(PICK);
        introPickLogoO.classList.remove(UNPICK);
    }
    playerOnePickedCircle = true;
    resetGameBoard();
    
    winningMessage.classList.remove(SHOW);
    intro.classList.add(SHOW);
}

function nextRound(){
    winningMessage.classList.remove(SHOW);
    resetGameBoard();
    isGameStarted = true;
    if(playerOnePickedCircle && playerOneVsCpu){
        cpuPlaceMark();
    }
}

function resetGameBoard(){
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(O_CLASS);
        cell.removeEventListener('click', handleCellClick);
        cell.addEventListener('click', handleCellClick, {
            once: true
        });
    });
    circleTurn = false;
    if (indicatorLogo.classList[0] !== LOGO_X) {
        indicatorLogo.classList.replace(LOGO_O, LOGO_X);
    }
}

function cpuPlaceMark(){
    const availableCells = [];
    cellElements.forEach((cell)=>{
        if (!cell.classList.contains(O_CLASS) && !cell.classList.contains(X_CLASS)){
            availableCells.push(cell);
        }
    });
    console.log("available cells for cpu: "+availableCells);
    
    //const cpuPickedCell = randomNextMove(availableCells);
    const cpuPickedCell = minimaxNextMove();
    const currentClass = circleTurn ? O_CLASS : X_CLASS;
    setTimeout(() => {
        placeMark(cpuPickedCell, currentClass);
        if (checkWin(currentClass)) {
            endGame(false);
        } else if (isTie()) {
            endGame(true);
        } else {
            swapTurns();
            swapIndicatorLogo();
        }
    }, 300);
}
//just random
function randomNextMove(availableCellsList) {
    return availableCellsList[Math.floor(Math.random() * availableCellsList.length)];
}











// find next move based on minimax algorithm
function minimaxNextMove(){
    // abstract board and only use the class information for minimax
    arrayForMinimax = abstractCurrentBoard();
    // x is maximizing player o is minimizing player
    // player 1 picked o then cpu is x (aka miximizing player) and vice versa 
    let isCpuMaximizing = playerOnePickedCircle;
    console.log("is cpu maximizing?" + isCpuMaximizing);
    let currentPlayerMinimax = isCpuMaximizing? 'x' : 'o';
    let bestScore = isCpuMaximizing? (-Infinity) : (+Infinity);
    let move;
    for (let i = 0; i < 9; i++){
        if(arrayForMinimax[i] === ''){
            arrayForMinimax[i] = currentPlayerMinimax;
            // next move is the player 1 not cpu, that's why !isCpuMaximizing
            let score = minimax(0, !isCpuMaximizing);
            arrayForMinimax[i] = '';
            if (isCpuMaximizing){
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            } else {
                if (score < bestScore) {
                    bestScore = score;
                    move = i
                }
            }
        }
    }
    return cellElements[move];
}

let scores = {
    x: 10,
    o: -10,
    tie: 0
}

function minimax(depth, isMaximizing) {
    let currentPlayer = isMaximizing? 'x' : 'o';
    if(checkWinForminimax(currentPlayer)){
        return scores[currentPlayer];
    } else if (checkTieForMinimax()) {
        return scores['tie']
    } 

    if (isMaximizing){
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++){
            if (arrayForMinimax[i] === ''){
                arrayForMinimax[i] = 'x';
                let score = minimax(depth + 1, false);
                arrayForMinimax[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++){
            if (arrayForMinimax[i] === ''){
                arrayForMinimax[i] = 'o';
                let score = minimax(depth + 1, true);
                arrayForMinimax[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}






// check win based on minimax array
function checkWinForminimax(currentClassInminimax) {
    return WINNING_PATTERNS.some(pattern => {
        return pattern.every(index => {
            return arrayForMinimax[index] === currentClassInminimax;
        });
    });
}

function checkTieForMinimax() {
    return [...arrayForMinimax].every(cell => {
        return cell === 'o' || cell === 'x';
    });
}

function placeMarkForMinimax(cellIndexInminimax, currentClassInminimax){
    arrayForMinimax[cellIndexInminimax] = currentClassInminimax;
}
//abstract current board to an array for minimax algorithm
function abstractCurrentBoard() {
    arrayForMinimax = [];
    cellElements.forEach(cell => {
        if(cell.classList.contains(O_CLASS)){
            arrayForMinimax.push('o');
        } else if (cell.classList.contains(X_CLASS)){
            arrayForMinimax.push('x');
        } else {
            arrayForMinimax.push('');
        }
    });
    console.log("abstracted board: " + arrayForMinimax );
    return arrayForMinimax;
}
