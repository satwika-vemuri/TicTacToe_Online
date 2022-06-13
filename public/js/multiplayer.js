var letterToNumber = {"X": 1, "O":2};
var numberToLetter = {1 : "X", 2 : "O"};


var roomName;
var inGame = false;
var isTurn = false;
var numRooms = 0;
const socket = io(`:${window.location.port}/multiplayer`);
var openRoomNames = [];

var boardArray;

// 0 : hasn't made a choice
// 1 : quit
// 2 : replay
var opponentReplay = 0;
var playerReplay = 0;
score = [0, 0];


// document.getElementById("createRoomName").placeholder = socket.id;

socket.emit("get_count");

socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
});

socket.on("update_rooms", (roomsWaiting, private) => {
    if (!inGame) {
        numRooms = roomsWaiting.length;
        const roomsTracker = document.getElementById("numRooms");
        roomsTracker.textContent = `Open Rooms: ${numRooms}`;
        updateRoomTable(roomsWaiting, private);
        openRoomNames = roomsWaiting;
    }
});

socket.emit("get_rooms");

socket.on("assign_opponent", (oppId) => {
    $("#turn").html("Turn: X (You)");
    isTurn = true;
    socket.emit("assign_opponent", oppId);
});
socket.on("start_game", () => {
    isTurn = false;
});

socket.on("your_turn", () => {
    isTurn = true;
    $("#turn").html("Turn: "+ player + " (You)");
});

socket.on("update_board", (clickedTile, playerNumber) => {
    boardArray[clickedTile[0]][clickedTile[1]] = playerNumber;
    update_board(clickedTile, numberToLetter[playerNumber]);
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
                            location.reload();
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
            $.get("/../views/gameOverMulti.hbs",function(gameOverMultiFile){
            gameOverMultiHbs = gameOverMultiFile;
    
            // convert hbs file to function
            var gameOverMultiHbsFunction = Handlebars.compile(gameOverMultiHbs);
    
            // data to insert into hbs
            var gameMessage;
            if (state==3){
                gameMessage= "Tie!";
            }
            else if (letterToNumber[player] ==  state){ 

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
    if (playerReplay !== 1 ) {
    opponentReplay = 1;
    $("#oppdecision").html("Opponent: Quit");  
    $("#oppdecision").css("color", "#d43d3d");  
    $("#bottom").html("<p>Closing screen...<p>");  
    removePopup();
}

});

socket.on("opponent_replay", () => {
    if (playerReplay !== 1) {
        opponentReplay = 2;
        $("#oppdecision").html("Opponent: Replay");  
        $("#oppdecision").css("color", "#2d8a5d");  
        if (playerReplay == 2) {
            socket.emit("reset_game");
        }
    }

});

socket.on("reset_game", () => {
    $("#bottom").html("<p>Restarting game...<p>");  4
    removePopup();

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
    inGame = true;
    if (player == "O") {
        $("#turn").html("Turn: X (Opponent)");   
    } else {
        $("#turn").html("Turn: X (You)");   
    }

    playerReplay = 0;
    opponentReplay = 0;


});

function playAgain(replay) {
    if (opponentReplay !== 1) {
        playerReplay = replay;
        if (replay) {
            $("#pdecision").html("You: Replay");
            $("#pdecision").css("color", "#2d8a5d");  
            if (opponentReplay ==2) {
                removePopup();
                socket.emit("reset_game");
            }
            $("#bottom").html("<p>Waiting...<p>");  
            socket.emit("replay");
        } else {
            $("#pdecision").html("You: Quit");
            $("#pdecision").css("color", "#d43d3d");  
            $("#bottom").html("<p>Quitting...<p>");  

            socket.emit("quit");
            location.reload();
        }
    }


}

function removePopup() {
    var delayInMilliseconds = 1000; 
    setTimeout(function() {
    $("#popup").html("");
    }, delayInMilliseconds);

}


function makeChoice(choice){
    if (choice == "create") {
        player = "X";
        roomName = document.getElementById("createRoomName").value;
        checkBox = document.getElementById("private").checked;
        if (roomName == "") {
            $("#warning").html("Please provide the room name.");
        } else if (openRoomNames.includes(roomName)) {
            $("#warning").html("Room already exists!");
        } else {
            socket.emit("create", roomName, checkBox);
            setupGame();
        }
    } else {
        roomName = document.getElementById("joinRoomName").value;
        if (openRoomNames.includes(roomName)) {
            player = "O";
            socket.emit("join", roomName);
            setupGame();
        } else {
            $("#warning").html("Room does not exist.");
        }
    }

}

function setupGame(){
    $("#publicRooms").remove();

    inGame = true;
    // get board hbs file from server and set to variable
    let t;
    if (player == "X") {
        t = "Waiting for opponent to join..."
    } else {
        t = "X (Opponent)";
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
        turn: t,
        roomName: roomName
        };
        // insert data into hbs 
        var board =  boardHbsFunction(context);
        // replace multiplayerChoose content in main with board content
        $(".card").removeClass("leftcard");
        $(".card").removeClass("flex-child");


        $(".card").html(board);

        // Once O joins room, player X can make a move
    });

    //$(".roomname").html(roomName);  

}

function tileClick(clickedTile){
    if (isTurn &&  is_move_valid(clickedTile, boardArray)){
        boardArray[clickedTile[0]][clickedTile[1]] = letterToNumber[player];
        
        socket.emit("made_move", clickedTile, letterToNumber[player], current_game_state(boardArray));
        if (player == "X") {
            $("#turn").html("Turn: O (Opponent)");
        } else {
            $("#turn").html("Turn: X (Opponent)");
        }
        isTurn = false;
    }

}

function updateRoomTable(roomsWaiting, private) {
    var table = document.getElementById("openRooms");
    if (openRoomNames.length == 0) {
        for (let i = 0; i < roomsWaiting.length; i++ ){
            if(private[i] == false){
                var row = table.insertRow(-1);
                var cell = row.insertCell(0);
                var newRow = document.createElement("tr");
                row.id = "roomRow" + roomsWaiting[i];
                $(`#${row.id}`).attr('onClick', `pickPublicRoom("${roomsWaiting[i]}");`);
                $(`#${row.id}`).attr('class', 'roomRow');

                newRow.innerText = roomsWaiting[i];
                cell.appendChild(newRow);


            }
        }
    } else {
        for (let i = 0; i < openRoomNames.length; i++ ){
            if (!roomsWaiting.includes(openRoomNames[i])) {
                $("#roomRow" + openRoomNames[i]).remove();
                openRoomNames.splice(i, 1); 
                i--;
    
            }
        }
    
        if ((roomsWaiting.length > openRoomNames.length)  && (private[roomsWaiting.length - 1] == false)) {
            let latestRoom = roomsWaiting[roomsWaiting.length - 1];

            var row = table.insertRow(-1);
            var cell = row.insertCell(0);
            var newRow = document.createElement("tr");
            row.id = "roomRow" + latestRoom;
            $(`#${row.id}`).attr('onClick', `pickPublicRoom("${roomsWaiting[roomsWaiting.length - 1]}");`);
            $(`#${row.id}`).attr('class', 'roomRow');


            newRow.innerText = latestRoom;
            cell.appendChild(newRow);

        }
    }

}

function pickPublicRoom(room) {
    $("#joinRoomName").val(room);
}

function is_move_valid(choice, board){
    return (board[choice[0]][choice[1]] == 0);
}


function update_score(state){
    x_score = score[0];
    o_score = score[1];
    if(state == 1){
        x_score += 1;
        const xscore = document.getElementById("xscore");
        xscore.innerHTML = `X Wins: ${x_score}`;
    }
    else if(state == 2){
        o_score += 1;
        const oscore = document.getElementById("oscore");
        oscore.innerHTML = `O Wins: ${o_score}`;
    }
    score[0] = x_score;
    score[1] = o_score;

}