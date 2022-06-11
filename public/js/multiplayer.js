var opponent;
var isTurn = false;
var numRooms = 0;
const socket = io(":3000/multiplayer");

var boardArray;


socket.emit("get_count");

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});

socket.on("update_count", (numRooms) => {
    numOpenRooms = numRooms;
    const roomsTracker = document.getElementById("numRooms");
    roomsTracker.textContent = `Open Rooms: ${numRooms}`;
});

socket.emit("get_count");

socket.on("assign_opponent", (oppId) => {
    opponent = oppId;
});
socket.on("start_game", (oppId) => {
    opponent = oppId;
    isTurn = true;
});

socket.on("your_turn", () => {
    isTurn = true;
});

socket.on("update_board", (clickedTile, symbol) => {
    update_board(clickedTile, symbol);
});

function makeChoice(choice){
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
        board: toLetters(boardArray),
        score: [0, 0]
        };

        // insert data into hbs 
        var board =  boardHbsFunction(context);

        // replace multiplayerChoose content in main with board content
        $(".card").html(board);

        // Once O joins room, player X can make a move
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

function tileClick(clickedTile){
    if (isTurn) {
        update_board(clickedTile, player);
        socket.emit("made_move", clickedTile, player, opponent, current_game_state(boardArray));
        isTurn = false;
    }

}

function update_board(clickedTile, symbol){
    boardArray[clickedTile[0]][clickedTile[1]] = symbol;
    const element = document.getElementById(`${clickedTile[0]}${clickedTile[1]}`);
    element.innerHTML = "<h1 class=\"fade-in\">" + symbol + "</h1>";
    element.style.animation = "fadeInOpacity .25s 1 ease-in";
}