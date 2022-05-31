function board_set_up() {
    var board = [];
    for (var i = 0; i < 3; i++) {
        var row = [];
        for (var j = 0; j < 3; j++) {
            row.push(0);
        }
        board.push(row);
    }
    return board;
}
function is_move_valid(choice, board) {
    return (board[choice[0]][choice[1]] == 0);
}
function getRandomInt(min, max) {
    //min inclusive max exclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
// Player one represented by O
function get_player_one_choice() {
    // Get player one input: always a user 
    // Set to random tempoarily
    var arr1 = [];
    arr1.push(getRandomInt(0, 3));
    arr1.push(getRandomInt(0, 3));
    return arr1;
}
function get_player_two_choice() {
    // Get player two input: user or AI generated
    // Set to random tempoarily
    var arr2 = [];
    arr2.push(getRandomInt(0, 3));
    arr2.push(getRandomInt(0, 3));
    return arr2;
}
function make_move(turn, board) {
    if (turn == 1) {
        var choice = get_player_one_choice();
        while (!(is_move_valid(choice, board))) {
            choice = get_player_one_choice();
        }
        board[choice[0]][choice[1]] = 1;
    }
    else {
        var choice = get_player_two_choice();
        while (!(is_move_valid(choice, board))) {
            choice = get_player_two_choice();
        }
        board[choice[0]][choice[1]] = 2;
    }
    return board;
}
function current_game_state(board) {
    // board is a 3x3 multi dimensional array
    // Returns 0 if game is unfinished
    // 1 if player 1 wins, 2 for player 2
    // 3 is tie
    // Check for if there are any winners
    // rows
    for (var r = 0; r < board.length; r++) {
        var row = board[r];
        if ((row[0] == row[1]) && (row[1] == row[2])) {
            console.log("stage 1");
            return row[0];
        }
    }
    // cols
    for (var c = 0; c < board[0].length; c++) {
        if ((board[0][c] == board[1][c]) && (board[1][c] == board[2][c])) {
            console.log("stage 2");
            return board[0][c];
        }
    }
    // left top diagonal 
    if ((board[0][0] == board[1][1]) && (board[1][1] == board[2][2])) {
        console.log("stage 3");
        return board[0][0];
    }
    // check right top diagonal
    if ((board[0][2] == board[1][1]) && (board[1][1] == board[2][0])) {
        console.log("stage 4");
        return board[0][2];
    }
    // If no winners, check if the game is unfinished
    for (var r = 0; r < board.length; r++) {
        for (var c = 0; c < board[0].length; c++) {
            if ((board[r][c] != 1) && (board[r][c] != 2)) {
                console.log("stage 5");
                return 0;
            }
        }
    }
    console.log("stage 6");
    return 3;
}
function run_game() {
    var board = board_set_up();
    var turn = 1;
    var state = 0;
    while (state == 0) {
        board = make_move(turn, board);
        //Change turn
        if (turn == 1) {
            turn = 2;
        }
        else {
            turn = 1;
        }
        state = current_game_state(board);
        console.log(board);
    }
    if (state == 1) {
        console.log("Player 1 wins!");
    }
    else if (state == 2) {
        console.log("Player 2 wins!");
    }
    else {
        console.log("Tie!");
    }
}
run_game();
