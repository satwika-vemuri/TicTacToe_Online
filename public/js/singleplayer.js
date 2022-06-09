console.log("Running");

var player;
var computer;
var boardArray;
var score;

function setPlayer(choice){
    boardArray = board_set_up();
    console.log(choice);
    console.log("setting player!")
    player = choice;
    score = [0, 0];
    if (choice == "X"){
        computer = "O";
    }
    
    setupGame();
}

function setupGame(){
    // get board hbs file from server and set to variable
    var boardHbs;
    $.get("/../views/board.hbs",function( boardHbsFile){
        boardHbs = boardHbsFile;

        // convert hbs file to function
        var boardHbsFunction = Handlebars.compile(boardHbs);

        // data to insert into hbs

        var scripts  = 
            {tictactoe: "/js/tictactoe.js",
            singleplayer: "/js/singleplayer.js"};
        
            if(player == "O"){
                boardArray = make_move(1, true, null, boardArray);
            }

        var context = { title: 'Singleplayer', 
        styles: ["board"], 
        js: scripts,
        board: toLetters(boardArray),
        score: [0, 0]
        };

        // insert data into hbs 
        var board =  boardHbsFunction(context);

        // replace playerChoose content in main with board content
        $("#singleplayer").parent().html(board);  
    });
}

function tileClick(clickedTile){
    console.log("Tile clicked! " + clickedTile);
    console.log(player);
    let thisPlayer;
    let otherPlayer;
    if(player == "X"){
        thisPlayer = 1;
        otherPlayer = 2;
    }
    else{
        thisPlayer = 2;
        otherPlayer = 1;
    }
    //player goes
    if(current_game_state(boardArray) == 0){
        boardArray = make_move(thisPlayer, false, clickedTile, boardArray);
        update_board(boardArray, score);
    }
    else{
        score = update_score(boardArray, score);
        update_board(boardArray, score);
        //setPlayer(player);
    }
    //ai goes
    if(current_game_state(boardArray) == 0){ 
        boardArray = make_move(otherPlayer, true, null, boardArray);
        update_board(boardArray, score);
    }
    else{
        score = update_score(boardArray, score);
        update_board(boardArray, score);
        //setPlayer(player);
    }
    if(current_game_state(boardArray) != 0){ 
        score = update_score(boardArray, score);
        update_board(boardArray, score);
        //setPlayer(player);
    }


}

function update_score(boardArray, score){
    x_score = score[0];
    o_score = score[1];
    if(current_game_state(boardArray) == 1){
        x_score += 1;
    }
    else if(current_game_state(boardArray) == 2){
        o_score += 1;
    }
    let arr1 = [];
    arr1.push(x_score);
    arr1.push(o_score);
    return arr1;
}

function update_board(boardArray, score){
    var boardHbs;
    $.get("/../views/board.hbs",function( boardHbsFile){
        boardHbs = boardHbsFile;

        // convert hbs file to function
        var boardHbsFunction = Handlebars.compile(boardHbs);

        // data to insert into hbs

        var scripts  = 
            {tictactoe: "/js/tictactoe.js",
            singleplayer: "/js/singleplayer.js"};

        var context = { title: 'Singleplayer', 
        styles: ["board"], 
        js: scripts,
        board: toLetters(boardArray),
        score: score
        };

        // insert data into hbs 
        var board =  boardHbsFunction(context);
        console.log(board);

        // replace playerChoose content in main with board content
        $("#singleplayer").parent().html(board);  
    });
}

function toLetters(boardArray){
    new_board = board_set_up();
    for(let r = 0; r < boardArray.length; r++){
        for(let c = 0; c < boardArray[0].length; c++){
            if(boardArray[r][c] == 0){
                new_board[r][c] = " ";
            }
            else if(boardArray[r][c] == 1){
                new_board[r][c] = "X";
            }
            else{
                new_board[r][c] == "O";
            }
        }
    }
    return new_board;
}
