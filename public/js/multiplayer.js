
var socket;
var connected;
var player;

function makeChoice(choice){
    console.log(choice);
    if (!connected) {
        connected = true;
        socket =  io(":3000/multiplayer");
    }

    if (choice == "create") {
        player = "X";
    } else {
        player = "O";
    }
    socket.emit(choice);
    setupGame();

}


function setupGame(){
    // get board hbs file from server and set to variable
    var boardHbs;
    $.get("/../views/board.hbs",function( boardHbsFile){
        boardHbs = boardHbsFile;

        // convert hbs file to function
        var boardHbsFunction = Handlebars.compile(boardHbs);

        // data to insert into hbs3
        var scripts  = 
            {tictactoe: "/js/tictactoe.js",
            multiplayer: "/js/multiplayer.js"};
        
            boardArray = board_set_up();

        var context = { title: 'Multiplayer', 
        styles: ["board"], 
        js: scripts,
        board: toLetters(boardArray),
        score: [0, 0]
        };

        // insert data into hbs 
        var board =  boardHbsFunction(context);

        // replace multiplayerChoose content in main with board content
        $("#multiplayer").parent().html(board);

        // Once O joins room, player X can make a move
        if (player == "O") {
            socket.emit("start");
        }
    });
}

// Since multi and single both have this, perhaps we can move it to tictactoe.js
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
        boardArray = make_move(thisPlayer, false, clickedTile, boardArray)[0];
        update_board(clickedTile, player);
    }
    else{
        update_score();
    }

    var delayInMilliseconds = Math.floor(Math.random() * (700 - 300) + 300);; //1 second

    setTimeout(function() {
        //ai goes
        if(current_game_state(boardArray) == 0){ 
            let aiMove = make_move(otherPlayer, true, null, boardArray);
            boardArray = aiMove[0]
            update_board(aiMove[1], computer);
        }
        else{
            update_score();
        }
    
        if(current_game_state(boardArray) != 0){ 
            update_score();
        }
    }, delayInMilliseconds);
}