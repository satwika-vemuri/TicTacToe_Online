var inGame = false;
var isTurn = false;
var numRooms = 0;
const socket = io(":3000/multiplayer");

var boardArray;


socket.emit("get_count");

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});

socket.on("update_count", (num) => {
    if (!inGame) {
        numRooms = num;
        const roomsTracker = document.getElementById("numRooms");
        roomsTracker.textContent = `Open Rooms: ${numRooms}`;
    }
});

socket.emit("get_count");

socket.on("assign_opponent", (oppId) => {
    inGame = true;
    socket.emit("assign_opponent", oppId);
});
socket.on("start_game", () => {
    inGame = true;
    isTurn = true;
});

socket.on("your_turn", () => {
    isTurn = true;
});

socket.on("update_board", (clickedTile, symbol) => {
    update_board(clickedTile, symbol);
});

socket.on("opponent_disconnected", () => {
    isTurn = false;
    var delayInMilliseconds = 1000; 
    setTimeout(function() {    
        var exitNoticeHbs;
        $.get("/../views/exitNotice.hbs", function(exitNoticeFile){
    
            $("#board").html(exitNoticeFile);  
        });
        }, delayInMilliseconds);
});

socket.on("game_over", (state) => {
    // Receives game state (1 for player 1 win, 2 for player 2, 3 for tie)
    // Menu pops up: ask for new game, 2 buttons to replay or quit
    // If at least one selects quit, both must leave 
    // Write socket.emit("quit"); if the player chooses to quit
    // Write socket.emit("replay"); if the player chooses to replay

});

socket.on("opponent_quit", () => {
    // Tell player that opponent quit, wait, and then quit
    quit();
});

socket.on("opponent_replay", () => {
    // The opponent chose to replay! (but did you?)
});

function quit() {
    // Write your code to quit (probably just refreshing page or redireting to home page)
    // Doing this will automatically disconnect the socket

}


function makeChoice(choice){
    if (!(numRooms == 0 && choice == "join")) {
        if (choice == "create") {
            player = "X";
        } else {
            player = "O";
        }
        socket.emit(choice);
        setupGame();
    }
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

function tileClick(clickedTile){
    if (isTurn) {
        update_board(clickedTile, player);
        socket.emit("made_move", clickedTile, player, current_game_state(boardArray));
        isTurn = false;
    }

}

