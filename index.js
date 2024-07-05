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

                // get rest of the box position in overAllArray, definitely accurate
                let chosenBox = parseInt(box.id.substring(2,3));
                endTurn(chosenGame, chosenBox);

                // AI turn if the game isn't won
                if(gameRunning && playerCount == 1){
                    aiTurn();
                }         
            }
        })
    )
}

// Self explanatory, swaps whose turn it is
function tradePlayer(){
    if(currPlayer == 'o'){
        currPlayer = 'x'
    }
    else{
        currPlayer = 'o'
    }   
}

// Handles the availability and reset of the subGame information
function subWon(subPos){
    resetSubGame(subPos);
    subGames[subPos].classList.add('unavailable');
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

// Checks if the box has come out as a win, or if it has become a cat's game
// inArray is the array being checked, newThing is the newest play in its index
function checkWin(inArray, newThing){
    // a is row, b is col
    let a = Math.floor(newThing / ARRAYROWSIZE);
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
        done = singleContainsOr(arrayToCheck[i], ['o', 'x', 'c']);
    }
    return done;
}

// calls to check for win or cat in subGame, if won calls to check for win
function endTurn(currSubGame, positionIn){
    // check to see if the subGame is won
    var checkIsWin = checkWin(overAllArray[currSubGame], positionIn);
    var isACat = isCat(overAllArray[currSubGame]);

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
        selectSub(positionIn);
    }
    tradePlayer();
};

// The intelligence for the AI's turn
function aiTurn(){

    // end by ending turn
    endTurn()
};