const ARRAYROWSIZE = 3;
const subGames = document.querySelectorAll('.subGame');

const startPauseButton = document.querySelector("#start-end-button");
var gameRunning = false;
var userCount = document.getElementById("playerCountVal");
var playerCount = 1;
var currPlayer = 'o';
var currBox = 9;

let overAllArray = [];
// Turning subGames into a 2d array- overAllArray[x] is the set of boxes at subGames[x]
overAllArray[0] = document.querySelectorAll("[id^='0-']");
overAllArray[1] = document.querySelectorAll("[id^='1-']");
overAllArray[2] = document.querySelectorAll("[id^='2-']");
overAllArray[3] = document.querySelectorAll("[id^='3-']");
overAllArray[4] = document.querySelectorAll("[id^='4-']");
overAllArray[5] = document.querySelectorAll("[id^='5-']");
overAllArray[6] = document.querySelectorAll("[id^='6-']");
overAllArray[7] = document.querySelectorAll("[id^='7-']");
overAllArray[8] = document.querySelectorAll("[id^='8-']");

// Entirely functional start/end button
startPauseButton.addEventListener('click', () => {
        gameRunning = !gameRunning;
        playerCount = userCount.value;
        // if it's just been set to true, start game; if newly yset to false, reset
        if(gameRunning){
            if(playerCount == 1){
                // trade these alerts for something in the html that can be swapped out- current player to the html spot
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

// has issues if the user accidentally taps between boxes or fatfingers two at once
// adding event listeners to each box, ensuring the chosen box has functionality
for(i = 0; i < 9; i++){
    overAllArray[i].forEach(box =>
        box.addEventListener('click', () => {
            // when clicked, if it doesn't have a selection or its subGame isn't won, and the game is in play, make one, if not don't
            
            // get which subGame it's in
            let chosenGame = box.id.substring(0,1);
            
            // if the position has been claimed or not, as well as if the subGame has been won or is otherwise unavailable
            let isTaken = box.classList.contains('unavailableBox') || singleContainsOr(subGames[chosenGame], ['o', 'x', 'c', 'notHere']);
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
    );
}

// Self explanatory, swaps whose turn it is
function tradePlayer(){
    if(currPlayer == 'o'){
        currPlayer = 'x';
    }
    else{
        currPlayer = 'o';
    }   
};

// Handles the availability and reset of the subGame information
function subWon(subPos){
    resetSubGame(subPos);
    subGames[subPos].classList.add('unavailable');
};

// Reset a sub-game in the case of a tic tac toe win/cat game or reset 
function resetSubGame(boxToReset){
    for(i = 0; i < 9; i++){
            overAllArray[boxToReset][i].classList.remove('x', 'o', 'c', 'unavailableBox');
    }
};

// Resets the game, resetting both boxes and subGames by removing their extra tags
function resetGame(){
    subGames.forEach(game =>
        game.classList.remove('x', 'o', 'c', 'unavailable', 'notHere')
    );

    // only doing this because this version of the game is locked in size
    for(j = 0; j<9; j++){    
        resetSubGame(j);
    }
    currPlayer = 'o';
};

// gives here/notHere functionality
function selectSub(clicked_box_pos){

    // start by seeing if the subgame isn't won, true if possible
    if(!singleContainsOr(subGames[clicked_box_pos], ['x', 'o', 'c'])){
        subGames.forEach(game =>
            game.classList.add('notHere')
        );        
        // can select only the one directed to, if the one directed to is allowed(reactivate the available spot)
        subGames[clicked_box_pos].classList.remove('notHere');
        currBox = clicked_box_pos;
    }
    // alternatively, ensures the player has access to all allowed squares
    else{
        // makes sure notHere isn't in any of the subGames since the player can choose any of them
        subGames.forEach(game =>
            game.classList.remove('notHere')
        );
        currBox = 9;        
    }
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

// Checks if the box has come out as a win, or if it has become a cat's game
// inArray is the array being checked, newThing is the newest play in its index
function checkWin(inArray, newThing, playerNow = currPlayer, lookingAhead = false){
    // a is row#, b is col#
    let a = Math.floor(newThing / ARRAYROWSIZE);
    let b = newThing % ARRAYROWSIZE;
    let wins = false;
    let rowStart = 3 * a;
    // use it as a multiplier/additive

    // use currPlayer to check who
    // needs to be checked as a 1d array, not 2d
    if(!lookingAhead){
        // check row
        if(inArray[rowStart].classList.contains(playerNow) && inArray[rowStart + 1].classList.contains(playerNow) && inArray[rowStart + 2].classList.contains(playerNow)){
            wins = true;
        }

        //check col
        else if(!wins && (inArray[b].classList.contains(playerNow) && inArray[b + 3].classList.contains(playerNow) && inArray[b + 6].classList.contains(playerNow))){
            wins = true;
        }

        // On diagonal if true
        else if(!wins && newThing % 2 == 0){
            var topLeftBottomRight = inArray[0].classList.contains(playerNow); 
            topLeftBottomRight &&= inArray[4].classList.contains(playerNow);
            topLeftBottomRight &&= inArray[8].classList.contains(playerNow);

            // a bit less efficient, but more readable by a little bit
            // top left to bottom right diagonal, checked in the second part of check
            if(topLeftBottomRight && newThing % 4 == 0){          
                wins = true;
            }
            // other diagonal, checked in the second part of check
            else if((newThing == 2 || newThing == 4 || newThing == 6) && (inArray[2].classList.contains(playerNow) && inArray[4] && inArray[6].classList.contains(playerNow))){
                wins = true;
            }
        }
    }
    else{
        // do the same stuff without checking the spots that are being checked for(seeing if it *can* give success)
        if((newThing == rowStart || inArray[rowStart].classList.contains(playerNow)) && (newThing == rowStart + 1 || inArray[rowStart + 1].classList.contains(playerNow)) && (newThing == rowStart + 2 || inArray[rowStart + 2].classList.contains(playerNow))){
            wins = true;
        }

        //check col, don't need !wins if else is used
        else if((newThing == b || inArray[b].classList.contains(playerNow)) && (newThing == b + 3 || inArray[b + 3].classList.contains(playerNow)) && (newThing == b + 6 || inArray[b + 6].classList.contains(playerNow))){
            wins = true;
        }

        // On diagonal if true and no others are used
        else if(newThing % 2 == 0){
            var topLeftBottomRight = (newThing == 0 || inArray[0].classList.contains(playerNow)); 
            topLeftBottomRight &&= (newThing == 4 || inArray[4].classList.contains(playerNow));
            topLeftBottomRight &&= (newThing == 8 || inArray[8].classList.contains(playerNow));

            // a bit less efficient, but more readable by a little bit
            // top left to bottom right diagonal, checked in the second part of check
            if(newThing % 4 == 0 && topLeftBottomRight){          
                wins = true;
            }
            // other diagonal, checked in the second part of check
            else if((newThing == 2 || inArray[2].classList.contains(playerNow)) && (newThing == 4 || inArray[4].classList.contains(playerNow)) && (newThing == 6 || inArray[6].classList.contains(playerNow))){
                wins = true;
            }
        }
    }
    return wins;
}; 

// To see if the array has become a cat's game
function isCat(arrayToCheck){
    var done = true;
    for(i = 0; done && i < 9; i++){
        // if it hits any position that hasn't been filled, the game isn't cat's
        done = arrayToCheck[i].classList.contains('unavailable') || arrayToCheck[i].classList.contains('unavailableBox');
    }
    return done;
};

// calls to check for win or cat in subGame, if won calls to check for win
function endTurn(currSubGame, positionIn){
    // check to see if the subGame is won
    var checkIsWin = checkWin(overAllArray[currSubGame], positionIn);
    var isACat = false;
    if(!checkIsWin){
        isACat = isCat(overAllArray[currSubGame]);
    }
    // if the subGame has been won, do this stuff
    if(checkIsWin || isACat){
        subWon(currSubGame);

        // this is in here to make sure the grid is cleared first
        if(checkIsWin){
            subGames[currSubGame].classList.add(currPlayer);
        }
        else{
            subGames[currSubGame].classList.add('c');
        }

        // SubGame has been won, is the full game won? if not leave it
        if(checkWin(subGames, currSubGame)){
            // Game is won
            alert(currPlayer + " has won!");
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
        tradePlayer();
    }
};

// The intelligence for the AI's turn
// not starting it with the ability to tell if it can win the game in a few moves
function aiTurn(){
    // start by looking at the square of choice- if 9, see what's available
    // use checkWin to see if either player can win
    // delegate that action to some other function(because of 9)
    var boxSelected = 0;
    var sub = 0;

    // will pick out particular box using the id generated
    if(currBox == 9){
        var willWin = false;
        var priority = 0;
        var blockEnemySub = 9;
        var blockEnemy = 9;
        var enemyCanWin = false;
        // can pick from any available square, prioritize a square if it'll give the win
        for(i = 0; !willWin && i < 9; i++){
            if(!subGames[i].classList.contains('unavailable')){   
                // only look at games that haven't been won as options
                // check for which one, if a particular square wins its box it gets a value of 1, 
                // if it wins the game after winning immediately exit
                // priority will pick randomly between the two, whichever random value gets picked in coinflip is chosen
                var winPossibility =canLeadToWin(overAllArray[i], 'x');
                var temp = canLeadToWin(overAllArray[i], 'o');
                if(winPossibility != 9){
                    // the value of winPossibility is the spot that will lead to a win
                    willWin = canLeadToWin(subGames, 'x') == i;
                    if(priority != 1){
                        priority = 1;
                        boxSelected = i;
                        sub = winPossibility;
                    }
                    else if (!willWin){
                        // random selection between the options, 0 makes it the new one while 1 leaves it alone
                        var selection = Math.floor(Math.random() * 2);
                        if(selection == 0){
                            boxSelected = i;
                        }
                    }
                    if(willWin){
                        boxSelected = i;
                        sub = winPossibility;
                    }
                }
                else if(!enemyCanWin && temp != 9){
                    // there's something that can be done to fend off the enemy here
                    enemyCanWin = canLeadToWin(subGames, 'o') == i;
                    
                    if(blockEnemySub == 9){
                        // hasn't been triggered
                        blockEnemySub = i;
                        blockEnemy = temp;
                    }
                    else if (!enemyCanWin){
                        // random selection between the options, 0 makes it the new one while 1 leaves it alone
                        var selection = Math.floor(Math.random() * 2);
                        if(selection == 0){
                            blockEnemySub = i;
                        }
                    }
                    if(enemyCanWin){
                        // found a spot where the user can win the whole game, so that's locked in as the selected blocking location
                        blockEnemySub = i;
                        blockEnemy = temp;
                    }
                }
            }
        }

        // if you can win everything, take that. If enemy can win, steal that. If you can win the box, do so. If enemy can win box, steal. Else get random

        // willWin has already selected a spot if it will
        if((!willWin && enemyCanWin) || (priority == 0 && blockEnemy != 9)){
            // you can't win the whole game, but you can keep an enemy away from it.
            boxSelected = blockEnemySub;
            sub = blockEnemy;
        }
        // if none of the above but the square can be won by the bot pick that(priority 1)

        // if the square can't be won, choose to block the enemy, second option in previous if statement
        
        // if none of the above, pick something at random
        else if(!willWin && priority == 0){
            //pick a spot at random, one hasn't already been picked by one person or another being able to win
            //generate a random array then generate a randomPosition, always generates a position that's available
            var random1 = randomPosition(subGames);
            var random2 = randomPosition(overAllArray[randomOne]);
            boxSelected = random1;
            sub = random2;
        }
    }
    else{
        // see if either player can win in one square, otherwise throw out random position
        boxSelected = currBox;
        sub = canLeadToWin(overAllArray[currBox], 'x');

        // if not 9, leave it there; if 9 pick something else
        if(sub == 9){
            //if something can lead to other player winning, block them
            sub = canLeadToWin(overAllArray[currBox], 'o');

            // otherwise, randomly select
            if(sub == 9){
                sub = randomPosition(overAllArray[currBox]);
            }
        }
    }

    var currSelection = document.getElementById(boxSelected + "-" + sub);
    currSelection.classList.add(currPlayer, 'unavailableBox');

    // end by ending turn
    endTurn(boxSelected, sub);
};

// asking what, if anything, can lead to win looking at the chosen player in the array
function canLeadToWin(checkArray, playerHere){
    // loop through available spots in array to see if something gives a win for playerHere
    var result = 9;
    var winFound = false;
    for(i = 0; !winFound && i < checkArray.length; i++){
        // see if the position in the array being checked is even available
        if(!(checkArray[i].classList.contains('unavailable') || checkArray[i].classList.contains('unavailableBox'))){
            winFound = checkWin(checkArray, i, playerHere, true);
            if(winFound){
                result = i;
            }
        }
    }
    return result;
};

function randomPosition(array){
    //get a valid position in the list
    var isOkay = false;
    var randomness = 0;
    while(!isOkay){
        randomness = Math.floor(Math.random() * 9);
        if(!(array[randomness].classList.contains('unavailable') || array[randomness].classList.contains('unavailableBox'))){
            // the value is available
            isOkay = true;
        }
    }
    return randomness;
};