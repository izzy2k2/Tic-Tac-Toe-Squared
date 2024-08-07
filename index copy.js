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
    var enemyGameWins = canLeadToWin(subGames, 'o');

    // will pick out particular box using the id generated
    if(currBox == 9){
        var aiWinHere = canLeadToWin(subGames, 'x');
        // loop to see about winning the game, if that can be fulfilled
        for(i = 0; sub == 9 && i < 9; i++){
            if(!subGames[i].classList.contains('unavailable')){
                var temp = canLeadToWin(overAllArray[i], 'x')
                if(temp.length > 0){
                    boxSelected = i;
                    sub = temp[0];
                }
            }
        }
        if(sub == 9){
            // game cannot be won, keep going
            winSet = [];
            for(i = 0; i < 9; i++){
                winSet[i] = aiIntelligenceAt(i, enemyGameWins);
            }
            // using the new winSet, find the best choice

            possibleSubs = selectValue(winSet);
            selection = Math.floor(Math.random() * (possibleSubs.length));
            boxSelected = possibleSubs[selection[0]];
            sub = possibleSubs[selection[1]];
        }
    }
    else{
        boxSelected = currBox;
        var canWinGame = checkCouldWin(subGames, currBox, 'x');
        var winsThisBox = canLeadToWin(overAllArray[currBox],'x');

        // Can the full game be won?
        if(canWinGame && winsThisBox.length > 0){
            boxSelected = winsThisBox[0];
        }
        else{
            // send to the sub-function, with this information
            sub = aiIntelligenceAt(boxSelected, enemyGameWins) % 9;
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
    for(j = 0; j < 9; j++){
        // see if the position in the array being checked is even available
        var isUnavailable = checkArray[j].classList.contains("unavailableBox");
        isUnavailable ||= checkArray[j].classList.contains("unavailable");
        if(!isUnavailable){
            var winFound = checkCouldWin(checkArray, j, playerHere);
            if(winFound){
                resultSet.push(j);
            }
        }
    }
    return resultSet;
};

function limitFirstToExclude(array1, array2){
    var y = 0;
    tempArray = array1.slice();
    while(y < tempArray.length){
        if(array2.includes(tempArray[y])){
            tempArray.splice(y,1);
        }
        else{
            y++;
        }
    }
    return tempArray;
};

// Delegation of enemy intelligence, 
// Accepts the number of the subGame it's looking at, the places the enemy could win the whole game with
function aiIntelligenceAt(subGameNo, enemyWinSpots, firstAttempt = true){
    // just move all the intelligence from ai at one spot into here
    // see if ai can win in the chosen one square, otherwise throw out random position

    var aiWinHere = canLeadToWin(overAllArray[subGameNo], 'x');
    var subHere = 10;

    if(firstAttempt){
        // loop through the boxes available to see what boxes the user can be sent to *and* win
        var userWinBoxes = [];
        for(z = 0; z < 9; z++){
            if(canLeadToWin(overAllArray[z], 'o').length > 0){
                userWinBoxes.push(z);
            }
        }

        if(enemyWinSpots.length > 0){
            // there are places we need to avoid
            if(userWinBoxes.length > 0){
                availableSpots = getAllAvailable(subGameNo);
                safeSpots = limitFirstToExclude(availableSpots, userWinBoxes);
                if(aiWinHere.length > 0){
                    // can ai win box s.t. it doesn't give opponent a box? If so, take it
                        // if not, is this box the only 1 box it can win? If so, take it(only in the 'else' ver)
                            // if not, will any win cases avoid giving 2 in a row to user? If so, take it
                                // Will any win states give a 2 in a row to ai if selected? If so, take it
                                    // Are there any spots that avoid sending to a spot where the user wins something? If so, do that
                                        // take a winning position if all else fails
                }
                else{
                    if(safeSpots.length > 0){
                        if(limitFirstToExclude(safeSpots,enemyWinSpots).length > 0){
                            // pick at random from safeSpots but avoiding enemyWinSpots
                        }
                    }
                    else{
                        if(limitFirstToExclude(safeSpots,enemyWinSpots).length > 0){
                            // pick something off of availableSpots + 9
                        }
                    }
                }
            }
            else{
                if(aiWinHere.length > 0){
                    // take the box except if it leads to an enemyWinSpots, then see if can do anything in box without giving player a win
                }
                else{
                    // pick something random that doesn't lead to unsafe spot + 9
                }
            }
        }
        else{
            // don't need to rewrite much for this, can copy previous section and remove enemyWinSpots section
        }
        if(subHere = 10){
            subHere = aiIntelligenceAt(subGameNo, enemyWinSpots, false) + 36;
        }
    }
    else{
        // ignore enemy win spots, already tried but can't find a good response without giving user subgame win
        
        // loop through the boxes available to see what boxes the user can be sent to *and* win
        var userWinBoxes = [];
        for(z = 0; z < 9; z++){
            if(canLeadToWin(overAllArray[z], 'o') > 0){
                userWinBoxes.push(z);
            }
        }

        if(userWinBoxes.length > 0){
            if(aiWinHere.length > 0){
                // 
            }
            else{
                //
            }
        }
        else{
            if(aiWinHere.length > 0){
                // 
            }
            else{
                //
            }
        }
    }

    return subHere;
};

function randomFromSafe(safeArray){
    return safeArray[Math.floor(Math.random() * (safeArray.length))];
};

// Returns the best values for the ai, as a set of points as [sub, box]
function selectValue(choices){
    var currBestTier = 100;
    var currBestVals = [];
    for(l = 0; l < 9; l++){
        var newTemp = Math.floor(choices[l]/9);
        if(newTemp < currBestTier){
            currBestVals = [[l,choices[l] % 9]];
        }
        else if(newTemp == currBestTier){
            currBestVals.push([l,choices[l] % 9]);
        }
    }

    returner = randomPosition(currBestVals);
    return returner;
};

// Gives a random valid position in the given array
function randomPosition(array){
    //get a valid position in the list
    var isOkay = false;
    var randomness = 0;
    while(!isOkay){
        randomness = Math.floor(Math.random() * (array.length));
        if(!(array[randomness].classList.contains('unavailable') || array[randomness].classList.contains('unavailableBox'))){
            // the value is available
            isOkay = true;
        }
    }
    return randomness;
};

function getAllAvailable(subGameChoice){
    toReturn = [];
    for(x = 0; x < 9;x++){
        if(!overAllArray[subGameChoice][x].classList.includes('unavailableBox')){
            toReturn.push(x);
        }
    }
    return toReturn;
};