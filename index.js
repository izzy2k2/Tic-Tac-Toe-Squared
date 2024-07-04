const ARRAYSIZE = 3;
const subGames = document.querySelectorAll('.subGame')

const startPauseButton = document.querySelector("#start-end-button")
var gameRunning = true;

let overAllArray = []
// Turning subGames into a 2d array- overAllArray[x] is the set of boxes at subGames[x]
overAllArray[0] = document.querySelectorAll("[id^='0-']")
overAllArray[1] = document.querySelectorAll("[id^='1-']")
overAllArray[2] = document.querySelectorAll("[id^='2-']")
overAllArray[3] = document.querySelectorAll("[id^='3-']")
overAllArray[4] = document.querySelectorAll("[id^='4-']")
overAllArray[5] = document.querySelectorAll("[id^='5-']")
overAllArray[6] = document.querySelectorAll("[id^='6-']")
overAllArray[7] = document.querySelectorAll("[id^='7-']")
overAllArray[8] = document.querySelectorAll("[id^='8-']")

// Reset a sub-game in the case of a tic tac toe win/cat game or reset 
function resetSubGame(boxToReset){
    for(i = 0; i < 9; i++){
            overAllArray[boxToReset][i].classList.remove('x', 'o', 'c', 'unavailable')
    }
}

// Resets the game, resetting both boxes and subGames by removing their extra tags
function resetGame(){
    subGames.forEach(game =>
        game.classList.remove('x', 'o', 'c', 'unavailableBox')
    )

    // only doing this because this version of the game is locked in size
    for(j = 0; j<9; j++){    
        resetSubGame(j);
    }
}

startPauseButton.addEventListener('click', () => {
        gameRunning = !gameRunning
        if(gameRunning){
            alert("Let's start playing! You're Os")
            runGame();
        }
    }
);

// temp function for testing, gives clicked id
function gotClick(clicked_id){
    lastClicked = clicked_id;
    alert(clicked_id);
}

// Checks if the box has come out as a win, or if it has become a cat's game
// inArray is the array being checked, newThing is the newest play from 0-8
function checkWin(inArray, newThing){
    // a is row, b is col
    let a = newThing % ARRAYSIZE;
    let b = newThing - (a * ARRAYSIZE);
    let wins = false;
    //check row
    if(inArray[a][0] == inArray[a][1] == inArray[a][2]){
        wins = true;
    }

    //check col
    if(inArray[0][b] == inArray[1][b] == inArray[2][b]){
        wins = true;
    }

        // Means it's on diagonal
    if(newThing % 2 == 0){

            // top left to bottom right diagonal, checked in the second part
        if(newThing % 4 == 0 && (inArray[0][0] == inArray[1][1] == inArray[2][2])){
            wins = true;
        }
            // other diagonal, checked in the second part
        if((newThing == 2 || newThing == 4 || newThing == 6) && (inArray[0][2] == inArray[1][1] == inArray[2][0])){
            wins = true;
        }
    }
    return wins;
};

// Delegating placement of X and O
function placeIt(arrayIn, pos, character){
    let a = pos % ARRAYSIZE;
    let b = pos - (a * ARRAYSIZE);
    arrayIn[a][b] = character;
};

// Seeing if a spot is occupied in the array
// Will see if this is superfluous
function isOccupied(arrayCheck, pos){
    let a = pos % ARRAYSIZE;
    let b = pos - (a * ARRAYSIZE);
    if(arrayCheck[a][b] == 0){
        return false;
    }
    return true;
}

// Seeing if a box the player would select or be sent to is full
function isFull(arrayToCheck){
    return subGames[arrayToCheck].classList.contains('o', 'x', 'c')
}

// To see if the array has become a cat's game
function isCat(arrayToCheck){
    if(!isFull(arrayToCheck)){
        return false;
    }
    if(checkWin(arrayToCheck, 0)){
        return false;
    }
    else if(checkWin(arrayToCheck, 2)){
        return false;
    }
    else if(checkWin(arrayToCheck, 5)){
        return false;
    }
    else if(checkWin(arrayToCheck, 7)){
        return false;
    }
}


// Should work for any 2 player games, until one box is full and someone gets sent there, it doesn't know how to handle that yet
// Resets the game after the game is over, before ending
function runGame(playerCount = 2){
    // square is whatever subGames section it's placed in

    let completed = ['0', '0', '0', '0', '0', '0', '0', '0', '0'];

    console.log("You are the Os");
    // Using userPos as a temp variable number, will request from 0-8
    // If number is 9, will exit
    // If the user doesn't give a number, will try again
    let currBoxNo = 9;
    let gameWin = null;
    
    let currPlayer = 'O';

    while(!gameWin && gameRunning){
        // making sure play is viable, then placing it, then checking it.
        let unoccupied = false;
        while(unoccupied){
            userPos = prompt("Your next play? 0-8, 9 exits.");
            unoccupied = isOccupied(currBox, userPos);
        }
        placeIt(currBox, userPos, currPlayer);
        let isWin = checkWin(currBox, userPos);

        // place it on the 'completed' list if the box is completed, either as a win to one of the players or not
        if(isWin){
            resetSubGame(currBoxNo);
            completed[currBoxNo] = currPlayer;
        }
        if(!isWin && isCat(currBox)){
            completed[currBoxNo] = 'C';
        }

        // will return char if someone won the game
        if(isWin){
            // time to check the big boxes to see about complete fill
            let a = currBox % ARRAYSIZE;
            let b = currBox - (a * ARRAYSIZE);

            // row check
            if(completed[a] == completed[a + 1] == completed[a + 2]){
                alert(completed[a] + " has won!");
                return;
            }

            // column check
            if(completed[b] == completed[b + 3] == completed[b + 6]){
                alert(completed[b] + " has won!");
                return;
            }

            // diagonals
            if(currBox % 2 == 0){
                // top left to bottom right
                if(currBox % 4 == 0 && (completed[0] == completed[4] == completed[8])){
                    alert(completed[0] + " has won!");
                    return;
                }
                if(completed[2] == completed [4] == completed [6]){
                    alert(completed[2] + " has won!");
                    return;
                }
            }
        }

        // making sure any full size cat games are caught, just seeing if the entirety of completed is full given the prior check caught any win
        if(completed[currBoxNo] == 'C'){
            completion = true;
            for(i = 0; i < 9 && completion; i++){
                completion = completed[i] != '0';
            }
            if(completion){
                alert("Cat's game!");
                gameRunning = false;
            }
        }
        currBoxNo = userPos;

        // swap between X and O, can comment out... use if(== X) for AI
        if(currPlayer == 'O'){
            currPlayer = 'X';
        }
        else{
            currPlayer = 'O';
        }

        if(playerCount !=2 && gameRunning){
            // do AI turn, else other player's turn
        }
    }

    //reset game once the game has been ended
    resetGame();
};

// The intelligence for the AI's turn
function aiTurn(){

};