const ARRAYSIZE = 3;
const subGames = document.querySelectorAll('.subGame')

const startPauseButton = document.querySelector("#start-end-button")
var gameRunning = true;

let overAllArray = []
// Turning subGames into a 2d array
overAllArray[0] = document.querySelectorAll("[id^='0-']")
overAllArray[1] = document.querySelectorAll("[id^='1-']")
overAllArray[2] = document.querySelectorAll("[id^='2-']")
overAllArray[3] = document.querySelectorAll("[id^='3-']")
overAllArray[4] = document.querySelectorAll("[id^='4-']")
overAllArray[5] = document.querySelectorAll("[id^='5-']")
overAllArray[6] = document.querySelectorAll("[id^='6-']")
overAllArray[7] = document.querySelectorAll("[id^='7-']")
overAllArray[8] = document.querySelectorAll("[id^='8-']")


// Resets the game, resetting both boxes and subGames by removing their extra tags
function resetGame(){
    subGames.forEach(game =>{
        for(i = 0; i < 9; i++){
            game[i].classList.remove('x', 'o', 'c', 'unavailable')
        }},
        game.classList.remove('x', 'o', 'c', 'unavailable')
    )
}

startPauseButton.addEventListener('click', () => 
    {gameRunning = !gameRunning}
);

// temp function for testing, gives clicked id
function gotClick(clicked_id){
    lastClicked = clicked_id;
    alert(clicked_id);
}


// Initializer for small tic tac toes.
function makeToeSquare(){
    let rowCol = [[],[],[]]
    for( i = 0; i < ARRAYSIZE; i++){
        for(j=0; j < ARRAYSIZE; j++){
            rowCol[i][j]=0;
        }
    }
    return rowCol;
};

// Checks if the box has come out as a win, or if it has become a cat's game
// inArray is the array being checked, newThing is the newest play from 0-8
function checkWin(inArray, newThing){
    // a is row, b is col
    let a = newThing % ARRAYSIZE;
    let b = newThing - (a * ARRAYSIZE);

    //check row
    if(inArray[a][0] == inArray[a][1] == inArray[a][2]){
        return true;
    }

    //check col
    if(inArray[0][b] == inArray[1][b] == inArray[2][b]){
        return true;
    }

        // Means it's on diagonal
    if(newThing % 2 == 0){

            // top left to bottom right diagonal, checked in the second part
        if(newThing % 4 == 0 && (inArray[0][0] == inArray[1][1] == inArray[2][2])){
            return true;
        }
            // other diagonal, checked in the second part
        if((newThing == 2 || newThing == 4 || newThing == 6) && (inArray[0][2] == inArray[1][1] == inArray[2][0])){
            return true;
        }
    }
    return false;
};

// Delegating placement of X and O
function placeIt(arrayIn, pos, character){
    let a = pos % ARRAYSIZE;
    let b = pos - (a * ARRAYSIZE);
    arrayIn[a][b] = character;
};

// Seeing if a spot is occupied in the array
function isOccupied(arrayCheck, pos){
    let a = pos % ARRAYSIZE;
    let b = pos - (a * ARRAYSIZE);
    if(arrayCheck[a][b] == 0){
        return false;
    }
    return true;
}

// Seeing if a box the player would be sent to is full
function isFull(arrayToCheck){
    for(i = 0; i < ARRAYSIZE; i++){
        for(j = 0; j < ARRAYSIZE; j++){
            if(arrayToCheck[i][j] == 0){
                return false;
            }
        }
    }
    return true;
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
    let topLeft = makeToeSquare();
    let topMid = makeToeSquare();
    let topRight = makeToeSquare();
    let midLeft = makeToeSquare();
    let trueMid = makeToeSquare();
    let midRight = makeToeSquare();
    let botLeft = makeToeSquare();
    let botMid = makeToeSquare();
    let botRight = makeToeSquare();

    let completed = ['0', '0', '0', '0', '0', '0', '0', '0', '0'];

    console.log("You are the Os");
    // Using userPos as a temp variable number, will request from 0-8
    // If number is 9, will exit
    // If the user doesn't give a number, will try again
    let currBoxNo = 9;
    let gameWin = null;
    let currBox = topLeft;
    
    // initializing to the chosen box
    while(currBoxNo > 8 || currBoxNo < 0){
        currBoxNo = prompt("Which box to start with? 0-8 only");
    }

    let userPos = 0;
    let currPlayer = 'O';

    while(!gameWin && gameRunning){
        userPos = 9;

        // sets currBox correctly for the next action
        switch(currBoxNo){
            case 0:
                currBox = topLeft;
                break;
            case 1:
                currBox = topMid;
                break;
            case 2:
                currBox = topRight;
                break;
            case 3:
                currBox = midLeft;
                break;
            case 4:
                currBox = trueMid;
                break;
            case 5:
                currBox = midRight;
                break;
            case 6:
                currBox = botLeft;
                break;
            case 7:
                currBox = botMid;
                break;
            case 8:
                currBox = botRight;
                break;
        }

        // making sure play is viable, then placing it, then checking it.
        let unoccupied = false;
        while(unoccupied){
            userPos = prompt("Your next play? 0-8, 9 exits.");
            if(!gameRunning){
                break;
            }
            unoccupied = isOccupied(currBox, userPos);
        }
        placeIt(currBox, userPos, currPlayer);
        let isWin = checkWin(currBox, userPos);

        // place it on the 'completed' list if the box is completed, either as a win to one of the players or not
        if(isWin){
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
                return;
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

        if(playerCount !=2){
            // do AI turn, else other player's turn
        }
    }

    //reset game once the game has been ended
    resetGame();
};