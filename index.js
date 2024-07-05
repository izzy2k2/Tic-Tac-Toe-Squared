const ARRAYROWSIZE = 3;
const subGames = document.querySelectorAll('.subGame')

const startPauseButton = document.querySelector("#start-end-button")
var gameRunning = false;
var userCount = document.querySelector("label[for=playerCount]");
var playerCount = 1;
var currPlayer = 'o';
var currBox = 9;

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

// Entirely functional start/end button
startPauseButton.addEventListener('click', () => {
        gameRunning = !gameRunning;
        playerCount = userCount;
        // if it's just been set to true, start game; if newly yset to false, reset
        if(gameRunning){
            if(playerCount == 1){
                alert("Let's start playing! You're Os");
            }
            else{
                alert("Let's start playing! Os start.");
            }
        }
        else{
            resetGame();
        }
    }
);

// adding event listeners to each box, ensuring the chosen box has functionality
for(i = 0; i < 9; i++){
    overAllArray[i].forEach(box =>
        box.addEventListener('click', () => {
            // when clicked, if it doesn't have a selection or its subGame isn't won, and the game is in play, make one, if not don't
            
            // get which subGame it's in
            let chosenGame = box.id.substring(0,1)
            
            // if the position has been claimed or not, as well as if the subGame has been won or is otherwise unavailable
            let isTaken = singleContainsOr(box, ['o', 'x', 'c', 'unavailableBox']) || singleContainsOr(subGames[chosenGame], ['o', 'x', 'c', 'notHere']);
            if(gameRunning && !isTaken){
                //is available
                box.classList.add(currPlayer, 'unavailableBox');

                // get rest of the box position in overAllArray
                let chosenBox = box.id.substring(2,3)
                endTurn(chosenGame, chosenBox);

                // AI turn if the game isn't won
                if(gameRunning && playerCount == 1){
                    aiTurn();
                }         
            }
        })
    )
}

// Self explanatory
function tradePlayer(){
    if(currPlayer == 'o'){
        currPlayer = 'x'
    }
    else{
        currPlayer = 'o'
    }   
}

// Reset a sub-game in the case of a tic tac toe win/cat game or reset 
function resetSubGame(boxToReset){
    for(i = 0; i < 9; i++){
            overAllArray[boxToReset][i].classList.remove('x', 'o', 'c', 'unavailableBox')
    }
}

// Resets the game, resetting both boxes and subGames by removing their extra tags
function resetGame(){
    subGames.forEach(game =>
        game.classList.remove('x', 'o', 'c', 'unavailable', 'notHere')
    )

    // only doing this because this version of the game is locked in size
    for(j = 0; j<9; j++){    
        resetSubGame(j);
    }
    currPlayer = 'o';
}

// gives here/notHere functionality
function selectSub(clicked_box_pos){

    // start by seeing if the subgame isn't won
    if(!singleContainsOr(subGames[clicked_box_pos], ['x', 'o', 'c'])){
        subGames.forEach(game =>
            game.classList.add('notHere')
        )        
        // can select only the one directed to, if the one directed to is allowed
        subGames[clicked_box_pos].classList.remove('notHere')
        currBox = clicked_box_pos;
    }
    // alternatively, ensures the player has access to all allowed squares
    else{
        // makes sure notHere isn't in any of the subGames since the player can choose any of them
        subGames.forEach(game =>
            game.classList.remove('notHere')
        )        
    }
}

// Checks if the box has come out as a win, or if it has become a cat's game
// inArray is the array being checked, newThing is the newest play in its index
function checkWin(inArray, newThing){
    // a is row, b is col
    let a = newThing % ARRAYROWSIZE;
    let b = newThing - (a * ARRAYROWSIZE);
    let wins = false;

    // check row
    if(inArray[a][0] == inArray[a][1] == inArray[a][2]){
        wins = true;
    }

    //check col
    else if(!wins && (inArray[0][b] == inArray[1][b] == inArray[2][b])){
        wins = true;
    }

    // On diagonal if true
    else if(!wins && newThing % 2 == 0){

        // a bit less efficient, but more readable by a little bit
        // top left to bottom right diagonal, checked in the second part of check
        if(newThing % 4 == 0 && (inArray[0][0] == inArray[1][1] == inArray[2][2])){
            wins = true;
        }
        // other diagonal, checked in the second part of check
        else if(!wins && (newThing == 2 || newThing == 4 || newThing == 6) && (inArray[0][2] == inArray[1][1] == inArray[2][0])){
            wins = true;
        }
    }
    return wins;
};

// To see if the array has become a cat's game
function isCat(arrayToCheck){
    var done = true;
    for(i = 0; done && i < 9; i++){
        // if it hits any position that hasn't been filled, the game isn't cat's
        done = singleContainsOr(arrayToCheck, ['o', 'x', 'c']);
    }
    return done;
}


// Completely defunct, good for remembering how it goes, not good for actual play in js

// Should work for any 2 player games, until one box is full and someone gets sent there, it doesn't know how to handle that yet
// Resets the game after the game is over, before ending
function runGame(playerCount = 2){
    // square is whatever subGames section it's placed in

    // Don't really need completed here
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
            let a = currBox % ARRAYROWSIZE;
            let b = currBox - (a * ARRAYROWSIZE);

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


// calls to check for win or cat in subGame, if won calls to check for win
function endTurn(currSubGame, positionIn){
    // check to see if the subGame is won
    var checkIsWin = checkWin(overAllArray[currSubGame], positionIn)
    var isACat = isCat(subGames)

    // if the subGame has been won, do this stuff
    if(checkIsWin || isACat){
        subWon(currSubGame);

        // this is in here to make sure the grid is cleared first
        if(checkIsWin){
            subGames[currSubGame].classList.add(currPlayer)
        }
        else{
            subGames[currSubGame].classList.add('c')
        }

        // SubGame has been won, is the full game won? if not leave it
        if(checkWin(subGames, currSubGame)){
            // Game is won
            alert(currPlayer + "has won!");
            gameRunning = false;
            resetGame();
        }
        else if(isCat(subGames)){
            // Game is cat
            alert("Cat's game!");
            gameRunning = false;
            resetGame();
        }
    }

    // This goes at the end of every turn to set up next turn, so it's better here
    if(gameRunning){
        selectSub(currSubGame);
    }
    tradePlayer();
};

// Array contains a class check for multiple values
function arrayContainsOr(arrayToCheck, valuesArray){
    doesContain = false;
    for(i = 0; !doesContain && i < arrayToCheck.length; i++){
        for(j = 0; !doesContain && j < valuesArray.length; j++){
            doesContain = arrayToCheck[i].classList.contains(valuesArray[j])
        }
    }
};

// Single item contains from array
function singleContainsOr(itemToCheck, valuesArray){
    var itContains = false;
    for(i = 0; !itContains && i < valuesArray.length; i++){
        itContains = itemToCheck.classList.contains(valuesArray[i])
    }
    return itContains;
};

// Handles the availability and reset of the subGame information
function subWon(subPos){
    resetSubGame(subPos);
    subGames[subPos].classList.add('unavailable');
}

// The intelligence for the AI's turn
function aiTurn(){

    // end by ending turn
    endTurn()
};