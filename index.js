// Initializer for small tic tac toes.
function makeToeSquare(){
    let rowCol = [[],[],[]]
    for( i = 0; i <3; i++){
        for(j=0; j<3; j++){
            rowCol[i][j]=0;
        }
    }
    return rowCol;
};

// Checks if the box has come out as a win, or if it has become a cat's game
// inArray is the array being checked, newThing is the newest play from 0-8
function checkWin(inArray, newThing){
    // a is row, b is col
    let a = newThing % 3;
    let b = newThing - (a * 3);

    //check row
    if(inArray[a][0] == inArray[a][1] == inArray[a][2]){
        return true;
    }

    //check col
    if(inArray[0][b] == inArray[1][b] == inArray[2][b]){
        return true;
    }

    if(newThing % 2 == 0){
        // Means it's on diagonal
        if(newThing % 4 == 0 && (inArray[0][0] == inArray[1][1] == inArray[2][2])){
            // top left to bottom right diagonal, checked in the second part
            return true;
        }
        if((newThing == 2 || newThing == 4 || newThing == 6) && (inArray[0][2] == inArray[1][1] == inArray[2][0])){
            // other diagonal, checked in the second part
            return true;
        }
    }
    return false;
};

// Delegating placement of X and O
function placeIt(arrayIn, pos, character = 'O'){
    let a = pos % 3;
    let b = pos - (a * 3);
    arrayIn[a][b] = character;
};

function isOccupied(arrayCheck, pos){
    let a = pos % 3;
    let b = pos - (a * 3);
    if(arrayCheck[a][b] == 0){
        return false;
    }
    return true;
}

// Actual game controller, may move to another file for length purposes.
function runTwoGame(){
    let topLeft = makeToeSquare();
    let topMid = makeToeSquare();
    let topRight = makeToeSquare();
    let midLeft = makeToeSquare();
    let trueMid = makeToeSquare();
    let midRight = makeToeSquare();
    let botLeft = makeToeSquare();
    let botMid = makeToeSquare();
    let botRight = makeToeSquare();
    console.log("You are the Os");
    // Using userPos as a temp variable number, will request from 0-8
    // If number is 9, will exit
    // If the user doesn't give a number, will try again
    let currBoxNo = 9;
    let gameWin = null;
    let currBox = topLeft;
    while(currBoxNo > 8 || currBoxNo < 0){
        currBoxNo = prompt("Which box to start with? 0-8 only");
    }
    let userPos = 0;
    while(!gameWin && userPos != 9){
        userPos = prompt("Your next play? 0-8, 9 exits.");

        //sets currBox correctly for the next turn
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

        
    }
};