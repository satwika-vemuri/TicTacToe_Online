var letterToNumber = {"X": 1, "O":2};

var player;
var computer;
var boardArray;
var score;
var turn;
var playerPause;

function setPlayer(choice, currentScore){
    player = choice;
    score = currentScore;
    if (choice == "X"){
        computer = "O";
    }
    else{
        computer = "X";
    }
    
    setupGame(currentScore);
}

function setupGame(currentScore){
    // get board hbs file from server and set to variable
    var boardHbs;
    boardArray = board_set_up();
    let turn;
    if (player == "X") {
        turn = "X (You)";
    } else {
        turn = "O (Opponent)";
    }
     $.get("/../views/board.hbs",function( boardHbsFile){
        boardHbs = boardHbsFile;

        // convert hbs file to function
        var boardHbsFunction = Handlebars.compile(boardHbs);

        // data to insert into hbs

        var scripts  = 
            {tictactoe: "/js/tictactoe.js",
            singleplayer: "/js/singleplayer.js"};
        
            if(player == "O"){
                boardArray = make_move(1, true, null, boardArray)[0];
            }

        var context = { title: 'Singleplayer', 
        styles: ["board"], 
        board: toLetters(boardArray),
        score: [score[0], score[1]],
        turn: turn
        };

        // insert data into hbs 
        var board =  boardHbsFunction(context);
        // replace singleplayerChoose content in main with board content
        $(".card").html(board);  
        playerPause = false;
    });
}

function tileClick(clickedTile){
    if (!playerPause){
        if(current_game_state(boardArray) == 0 // if game is unfinished
            && isMoveValid(clickedTile, boardArray)) // if clicked tile is empty
            { 
            playerPause = true;

            // PLAYER'S TURN
            
            //player makes move
            
            boardArray = make_move(letterToNumber[player], false, clickedTile, boardArray)[0];
            update_board(clickedTile, player);
    
            if (current_game_state(boardArray) == 0){ // if game is unfinished
                // AI'S TURN
                $("#turn").html("Turn: "+ computer + " (Opponent)");

                // delay ai's turn in order to simulate thinking
                var delayInMilliseconds = Math.floor(Math.random() * (500 - 300) + 300);
                setTimeout(function() {
                    
                    //ai makes move
                    let aiMove = make_move(letterToNumber[computer], true, null, boardArray);
                    boardArray = aiMove[0]
                    update_board(aiMove[1], computer);
                    
                    // wait for animation before inProgress false
                    var delayInMilliseconds =  250;
                    setTimeout(function() {
                        playerPause= false;
                    }, delayInMilliseconds);

                    if(current_game_state(boardArray) != 0){ 
                        game_over(current_game_state(boardArray))
                        $("#turn").html("Game over!");
                    } else {
                        setTimeout(function() {
                            $("#turn").html("Turn: "+ player + " (You)");
                        }, delayInMilliseconds);

                    }

                }, delayInMilliseconds);

            }
            else {
                game_over(current_game_state(boardArray));
            }
            
        }
    }
}

function game_over(status){
    playerPause = true;

    // wait 1 second to show player game is over
    var delayInMilliseconds = 1000; 
    setTimeout(function() {
        update_score();
    
        var gameOverHbs;
        $.get("/../views/gameOver.hbs",function(gameOverHbsFile){
            gameOverHbs = gameOverHbsFile;
    
            // convert hbs file to function
            var gameOverHbsFunction = Handlebars.compile(gameOverHbs);
    
            // data to insert into hbs
    
            var gameMessage;
            if (status==3){
                gameMessage= "Tie!";
            }
            else if (status ===  letterToNumber[player]){ 
                gameMessage =  "You win!";
            }
            else {
                gameMessage = "You lost!";
            }
    
            var context = {
                message: gameMessage,
            };
    
            // insert data into hbs 
            var gameOver =  gameOverHbsFunction(context);
    
            $("#popup").html(gameOver);  
        });
        }, delayInMilliseconds);
}

function update_score(){
    x_score = score[0];
    o_score = score[1];
    if(current_game_state(boardArray) == 1){
        x_score += 1;
        const xscore = document.getElementById("xscore");
        xscore.innerHTML = `X Wins: ${x_score}`;
    }
    else if(current_game_state(boardArray) == 2){
        o_score += 1;
        const oscore = document.getElementById("oscore");
        oscore.innerHTML = `O Wins: ${o_score}`;
    }
    score[0] = x_score;
    score[1] = o_score;
}

function closeGameOver(){
    $("#popup").html("");
}