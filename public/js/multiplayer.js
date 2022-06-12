
var inGame = false;
var isTurn = false;
var numRooms = 0;
const socket = io(`:${window.location.port}/multiplayer`);
var openRoomNames = [];

var boardArray;

var opponentReplay;
var playerReplay;
score = [0, 0];



socket.emit("get_count");

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});

socket.on("update_rooms", (socketsWaiting) => {
    if (!inGame) {
        console.log("here1");
        numRooms = socketsWaiting.length;
        const roomsTracker = document.getElementById("numRooms");
        roomsTracker.textContent = `Open Rooms: ${numRooms}`;
        var table = document.getElementById("openRooms");
        var rowCount = table.rows.length;

        let count = 0;
        while(numRooms > rowCount){
            var row = table.insertRow(rowCount);
            var cell = row.insertCell(0);
            var newRow = document.createElement("tr");
            console.log("name list size: " + openRoomNames.length);
            newRow.innerText = openRoomNames[count];
            cell.appendChild(newRow);

            rowCount = table.rows.length;
            count++;
        }
    }
    updateRoomTable();
});

socket.emit("get_rooms");

socket.on("assign_opponent", (oppId) => {
    $("#turn").html("Turn: X");
    isTurn = true;
    socket.emit("assign_opponent", oppId);
});
socket.on("start_game", () => {
    isTurn = false;
});

socket.on("your_turn", () => {
    isTurn = true;
    $("#turn").html("Turn: "+ player);
});

socket.on("update_board", (clickedTile, symbol) => {
    boardArray[clickedTile[0]][clickedTile[1]] = symbol;
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
                            location.reload();;
                        }, oneSecondDelay);      
                    }, oneSecondDelay);
                }, oneSecondDelay);
        });
        }, oneSecondDelay);
});

socket.on("game_over", (state) => {
    update_score(state);
    $("#turn").html("Game over!");
    isTurn = false;
    var delayInMilliseconds = 1000; 
    setTimeout(function() {
    
        var gameOverHbs;
        $.get("/../views/gameOverMulti.hbs",function(gameOverMultiFile){
            gameOverMultiHbs = gameOverMultiFile;
    
            // convert hbs file to function
            var gameOverMultiHbsFunction = Handlebars.compile(gameOverMultiHbs);
    
            // data to insert into hbs
            var gameMessage;
            if (state==3){
                gameMessage= "Tie!";
            }
            else if (state ===  letterToNumber[player]){ 

                gameMessage =  "You win!";
            }
            else {
                gameMessage = "You lost!";
            }
    
            var context = {
                message: gameMessage,
            };
    
            // insert data into hbs 
            var gameOverMulti =  gameOverMultiHbsFunction(context);
    
            $("#popup").html(gameOverMulti);  
        });
        }, delayInMilliseconds);

});

socket.on("opponent_quit", () => {
    if (playerReplay !== false ) {
    opponentReplay = false;
    $("#oppdecision").html("Opponent: Quit");  
    $("#oppdecision").css("color", "#d43d3d");  
    $("#bottom").html("<p>Quitting...<p>");  
    removePopup();
    }

});

socket.on("opponent_replay", () => {
    if (playerReplay !== false) {
        opponentReplay = true;
        $("#oppdecision").html("Opponent: Replay");  
        $("#oppdecision").css("color", "#2d8a5d");  
        if (playerReplay == true) {
            $("#bottom").html("<p>Restarting game...<p>");  
            removePopup();
            socket.emit("reset_game");
        }
    }

});

socket.on("reset_game", () => {
    $("#bottom").html("<p>Restarting game...<p>");  
    boardArray = board_set_up();


    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
            const element = document.getElementById(`${i}${j}`);
            element.innerHTML = "<h1 class=\"fade-in\"> </h1>";
        }
    }

    if (player == "X") {
        isTurn = true;
    } else {
        isTurn = false;
    }
    inGame = false;

    $("#turn").html("Turn: X");



});

function playAgain(replay) {
    if (opponentReplay !== false) {
        playerReplay = replay;
        if (replay) {
            $("#pdecision").html("You: Replay");
            $("#pdecision").css("color", "#2d8a5d");  
            if (opponentReplay) {
                removePopup();
                socket.emit("reset_game");
            }
            $("#bottom").html("<p>Waiting...<p>");  
            socket.emit("replay");
        } else {
            $("#pdecision").html("You: Quit");
            $("#pdecision").css("color", "#d43d3d");  
            $("#bottom").html("<p>Quitting...<p>");  

            removePopup();
            socket.emit("quit");
        }
    }


}

function removePopup() {
    var delayInMilliseconds = 3000; 
    setTimeout(function() {
    $("#popup").html("");
    }, delayInMilliseconds);

}


function makeChoice(choice){
    if (!(numRooms == 0 && choice == "join")) {
        if (choice == "create") {
            console.log("HERE");
            player = "X";
            const nameInput = document.getElementById("createRoomName").value;
            console.log("inner text: " + nameInput);
            openRoomNames.push(nameInput);
            console.log(openRoomNames);
        } else {
            player = "O";
        }
        socket.emit(choice);
        setupGame();
    }
}

function setupGame(){
    inGame = true;
    // get board hbs file from server and set to variable
    let t;
    if (player == "X") {
        t = "Waiting for opponent to join..."
    } else {
        t = "X";
    }
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
        score: [0, 0],
        turn: t
        };

        // insert data into hbs 
        var board =  boardHbsFunction(context);

        // replace multiplayerChoose content in main with board content
        $(".card").html(board);

        // Once O joins room, player X can make a move
    });
}

function tileClick(clickedTile){
    if (isTurn &&  is_move_valid(clickedTile, boardArray)){
        boardArray[clickedTile[0]][clickedTile[1]] = player;
        update_board(clickedTile, player);
        socket.emit("made_move", clickedTile, player, current_game_state(boardArray));
        if (player == "X") {
            $("#turn").html("Turn: O");
        } else {
            $("#turn").html("Turn: X");
        }
        isTurn = false;
    }

}

function updateRoomTable(socketsWaiting) {
    // Sockets waiting is a list of all the currently open room names
    // Use currentOpenRooms to represent the current rooms on the client side
    // Since it's a queue, if socketsWaiting[0] is in currentOpenRooms  delete the first row
    // If the last element of socketsWaiting is not in currentOpenRooms add a new row
}


function is_move_valid(choice, board){
    return (board[choice[0]][choice[1]] == 0);
}


function update_score(state){
    console.log("The one that one is " + state);
    x_score = score[0];
    o_score = score[1];
    if(state == "X"){
        x_score += 1;
        const xscore = document.getElementById("xscore");
        xscore.innerHTML = `X Wins: ${x_score}`;
    }
    else if(state =="O"){
        o_score += 1;
        const oscore = document.getElementById("oscore");
        oscore.innerHTML = `O Wins: ${o_score}`;
    }
    score[0] = x_score;
    score[1] = o_score;

    console.log(score);
}