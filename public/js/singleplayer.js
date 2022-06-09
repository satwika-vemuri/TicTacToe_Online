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
                boardArray = make_move(1, true, null, boardArray)[0];
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
        boardArray = make_move(thisPlayer, false, clickedTile, boardArray)[0];
        update_board(clickedTile, player);
    }
    else{
        update_score();
    }

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

function update_board(clickedTile, player){
    const element = document.getElementById(`${clickedTile[0]}${clickedTile[1]}`);
    element.textContent = player;
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
