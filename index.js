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

// Note: has issues if the user accidentally taps between boxes or fatfingers two at once
// Adding event listeners to each box, ensuring the chosen box has functionality
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

// Simply swaps whose turn it is
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

// Gives here/notHere functionality, so the user can only select available spots
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

// Single item contains from array(basically .contains for multiple values, in an or gate form)
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
    // a is row#, b is col#
    let rowStart = (Math.floor(newThing / ARRAYROWSIZE)) * 3;
    let colStart = newThing % ARRAYROWSIZE;
    // use it as a multiplier/additive

    // use currPlayer to check who
    // needs to be checked as a 1d array, not 2d
    // check row
    let wins = inArray[rowStart].classList.contains(currPlayer) && inArray[rowStart + 1].classList.contains(currPlayer) && inArray[rowStart + 2].classList.contains(currPlayer);

    //check col
    wins ||= (inArray[colStart].classList.contains(currPlayer) && inArray[colStart + 3].classList.contains(currPlayer) && inArray[colStart + 6].classList.contains(currPlayer));

    // On diagonal if true, only check if it's not already a win
    if(!wins && newThing % 2 == 0){
        // top left to bottom right diagonal, checked in the second part of check
        wins = newThing % 4 == 0 && (inArray[0].classList.contains(currPlayer) && inArray[4].classList.contains(currPlayer) && inArray[8].classList.contains(currPlayer));
        
        // other diagonal, checked in the second part of check
        wins ||= (newThing == 2 || newThing == 4 || newThing == 6) && (inArray[2].classList.contains(currPlayer) && inArray[4].classList.contains(currPlayer) && inArray[6].classList.contains(currPlayer));
    }

    return wins;
}; 

// Sees if the given player could win the given set if they placed at position newThing
function checkCouldWin(inArray, newThing, playerNow = currPlayer){
    // a is row#, b is col#
    let rowStart = (Math.floor(newThing / ARRAYROWSIZE)) * 3;
    let colStart = newThing % ARRAYROWSIZE;
    // use it as a multiplier/additive

    // use currPlayer to check who
    // needs to be checked as a 1d array, not 2d
    // check row
    let wins = (newThing == rowStart || inArray[rowStart].classList.contains(playerNow)) && (newThing == rowStart + 1 || inArray[rowStart + 1].classList.contains(playerNow)) && (newThing == rowStart + 2 || inArray[rowStart + 2].classList.contains(playerNow));

    //check col
    wins ||= (newThing == colStart || inArray[colStart].classList.contains(playerNow)) && (newThing == colStart + 3 || inArray[colStart + 3].classList.contains(playerNow)) && (newThing == colStart + 6 || inArray[colStart + 6].classList.contains(playerNow));

    // On diagonal if true, only check if it's not already a win
    if(!wins && newThing % 2 == 0){
        // top left to bottom right diagonal, checked in the second part of check
        wins = newThing % 4 == 0 && ((newThing == 0 || inArray[0].classList.contains(playerNow)) && (newThing == 4 || inArray[4].classList.contains(playerNow)) && (newThing == 8 || inArray[8].classList.contains(playerNow)));
        
        // other diagonal, checked in the second part of check
        wins ||= (newThing == 2 || inArray[2].classList.contains(playerNow)) && (newThing == 4 || inArray[4].classList.contains(playerNow)) && (newThing == 6 || inArray[6].classList.contains(playerNow));
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

// Calls to check for win or cat in subGame, if either happens calls to check for win
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
    // use checkCouldWin to see if either player can win
    // delegate that action to some other function(because of 9)
    var boxSelected = 9;
    var sub = 9;

    // will pick out particular box using the id generated
    if(currBox == 9){
        var willWin = false;
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
                    if(boxSelected == 9){
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
        if((!willWin && enemyCanWin) || (boxSelected == 9 && blockEnemy != 9)){
            // you can't win the whole game, but you can keep an enemy away from it.
            boxSelected = blockEnemySub;
            sub = blockEnemy;
        }
        // if none of the above but the square can be won by the bot pick that(priority 1)
        // if the square can't be won, choose to block the enemy, second option in previous if statement
        
        // if none of the above, pick something at random
        else if(!willWin){
            //pick a spot at random, one hasn't already been picked by one person or another being able to win
            //generate a random array then generate a randomPosition, always generates a position that's available
            var random1 = randomPosition(subGames);
            var random2 = randomPosition(overAllArray[random1]);
            boxSelected = random1;
            sub = random2;
        }
    }
    else{
        // see if ai can win in the chosen one square, otherwise throw out random position
        boxSelected = currBox;
        var canWinSub = canLeadToWin(overAllArray[currBox], 'x');

        var canWinGame = checkCouldWin(subGames, currBox, 'x');

        // see if winning this sub leads to a complete win, if true win game n choose that
        if(canWinGame && canWinSub[0] != 9){
            sub = canWinSub[0];
        }
        else{
            // see where, if anywhere, opponent can win the game
            var opponentCanWinGame = canLeadToWin(subGames,'o');

            // opponent cannot win full game
            if(opponentCanWinGame[0]==9){
                // for each of the spots in canWinSub, see if it'll send to user winning a box, if one is found use that
                if(canWinSub[0] !=9){
                    var lookAt = 9;
                    for(k=0; sub == 9 && k < canWinSub.length;k++){
                        if(canWinSub[k] == boxSelected){
                            sub = boxSelected;
                        }
                        else{
                            var tempArray = canLeadToWin(overAllArray[canWinSub[k]], 'o');
                            if(tempArray[0] ==9){
                                // user can't win the box, it's a successful selection
                                sub=canWinSub[k];
                            }
                        }
                    }

                    // if it must send to some spot where the user will win a box, just use a random win spot
                    if(sub==9){
                        if(lookAt == 9){
                            sub=canWinSub[Math.floor(Math.random() * canWinSub.length)];
                        }
                        else{
                            sub=lookAt;
                        }
                    }
                } 
                // if no spots can win the box for ai, run through all available spots to see if any will give user a sub win
                else{
                    var choiceOptions = [];
                    var k;
                    for(k == 0; k < 9; k++){
                        if(!overAllArray[boxSelected][k].classList.contains('unavailableBox')){
                            // available spot to place in
                            if(!subGames[k].classList.contains('unavailable')){
                                // available spot to work with
                                if(!opponentCanWinGame.includes(k)){
                                    // can be placed here
                                    choiceOptions.push(k);
                                }
                            }
                        }
                    }
                    if(choiceOptions.length == 0){
                        // choose any spot
                        sub = randomPosition(overAllArray[boxSelected]);
                    }
                    else{
                        // choose from choiceOptions
                        sub = randomPosition(choiceOptions);
                    }
                }
            }

            // opponent is capable of winning the full game, avoid sending them there if possible
            else{
                firstBranchNotSelected = true;
                if(canWinSub.length > 0){
                    var selectionOptions = [];
                    // see if there's a spot that'll let the ai win but user can't
                    for(k = 0; k< canWinSub.length; k++){
                        if(!opponentCanWinGame.includes(canWinSub[k]) && !subGames[canWinSub[k]].classList.contains('unavailable')){
                            selectionOptions.push(canWinSub[k]);
                        }
                    }
                    if(selectionOptions.length > 0){
                        sub = randomFromSafe(selectionOptions);
                        firstBranchNotSelected = false;
                    }
                } 
                if(firstBranchNotSelected){
                    // ai can't safely win the game, check any other point
                    var checkingAt = 0;
                    var safeList = []
                    for(k=0; k < 9; k++){
                        if(!boxSelected[k].classList.contains('unavailableBox') && !opponentCanWinGame.includes(k)){
                            // box is unavailable, not in opponentCanWinGame
                            // see about box being sent to 
                        }
                    }
                }
            }
        }
    }
    overAllArray[boxSelected][sub].classList.add(currPlayer, 'unavailableBox');

    // end by ending turn
    endTurn(boxSelected, sub);
};

// Asking what, if anything, can lead to win looking at the chosen player in the array
// Whatever spots are selected are in the array, otherwise the array just has 9
// Spots are in order from low to high
function canLeadToWin(checkArray, playerHere){
    // loop through available spots in array to see if something gives a win for playerHere
    var resultSet = [];
    var resultSetAt = 0;
    for(j = 0; j < 9; j++){
        // see if the position in the array being checked is even available
        var isUnavailable = checkArray[j].classList.contains("unavailableBox");
        isUnavailable ||= checkArray[j].classList.contains("unavailable");
        if(!isUnavailable){
            var winFound = checkCouldWin(checkArray, j, playerHere);
            if(winFound){
                resultSet[resultSetAt] = j;
                resultSetAt++;
            }
        }
    }
    if(resultSetAt == 0){
        resultSet[0] = 9;
    }
    return resultSet;
};

function randomFromSafe(safeArray){
    return Math.floor(Math.random() * (safeArray.length + 1));
}

// Gives a random valid position in the given array
function randomPosition(array){
    //get a valid position in the list
    var isOkay = false;
    var randomness = 0;
    while(!isOkay){
        randomness = Math.floor(Math.random() * (array.length + 1));
        if(!(array[randomness].classList.contains('unavailable') || array[randomness].classList.contains('unavailableBox'))){
            // the value is available
            isOkay = true;
        }
    }
    return randomness;
};