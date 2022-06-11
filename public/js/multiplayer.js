
var inGame = false;
var isTurn = false;
var numRooms = 0;
const socket = io(`:${window.location.port}/multiplayer`);
var currentOpenRooms = []

var boardArray;


socket.emit("get_count");

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});

socket.on("update_rooms", (socketsWaiting) => {
    if (!inGame) {
        numRooms = socketsWaiting.length;
        const roomsTracker = document.getElementById("numRooms");
        roomsTracker.textContent = `Open Rooms: ${numRooms}`;
        var table = document.getElementById("openRooms");
        var rowCount = table.rows.length;
        while(numRooms > (rowCount - 1)){
            var row = table.insertRow(rowCount);
            var cell1 = row.insertCell(0);
            var element1 = document.createElement("tr");
            element1.innerText = "room";
            cell1.appendChild(element1);
            rowCount = table.rows.length;
            console.log(rowCount);
        }
    }
    updateRoomTable();
});

socket.emit("get_rooms");

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
    var oneSecondDelay = 1000;  // one second
    setTimeout(function() {    
        $.get("/../views/exitNotice.html", function(exitNotice){
    
            $("#popup").html(exitNotice); // countdown originally says '3'
            setTimeout(function() {
                $("#countdown").text('2');  
                setTimeout(function() {
                    $("#countdown").text('1');  
                    setTimeout(function() {
                        $("#countdown").text('0');  
                                
                        }, oneSecondDelay);      
                    }, oneSecondDelay);
                }, oneSecondDelay);
        });
        }, oneSecondDelay);
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

function updateRoomTable(socketsWaiting) {
    console.log(socketsWaiting);
    // Sockets waiting is a list of all the currently open room names
    // Use currentOpenRooms to represent the current rooms on the client side
    // Since it's a queue, if socketsWaiting[0] is in currentOpenRooms  delete the first row
    // If the last element of socketsWaiting is not in currentOpenRooms add a new row
}