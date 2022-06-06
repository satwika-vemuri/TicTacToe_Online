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
// player 1  is X
function get_player_choice(turn) {
    var arr = [];
    arr.push(getRandomInt(0, 3));
    arr.push(getRandomInt(0, 3));
    return arr;
}
function get_ai_choice(player, board) {
    if (player == 1) {
        return get_next_move(board, 1, 2);
    }
    else {
        return get_next_move(board, 2, 1);
    }
}
// player 1 is min (X) and player 2 is max (O)
function get_next_move(board, this_player, other_player) {
    var minimax_values = [];
    for (var i = 0; i < open_moves(board).length; i++) {
        var newBoard = add_to_board(board, open_moves(board)[i], this_player);
        var new_node = {
            board: newBoard,
            next_moves: open_moves(newBoard)
        };
        minimax_values.push(minimax(new_node, other_player));
    }
    if (this_player == 1) {
        return open_moves(board)[min_index(minimax_values)];
    }
    else { // player is 2
        return open_moves(board)[max_index(minimax_values)];
    }
}
// player 1 is min (X) and player 2 is max (O)
function minimax(state_node, player) {
    if (state_node.next_moves.length == 0) { // the board is full
        if (current_game_state(state_node.board) == 1) {
            return -1;
        }
        else if (current_game_state(state_node.board) == 2) {
            return 1;
        }
        return 0;
    }
    else if (player == 1) { //min's turn
        var vals = [];
        for (var i = 0; i < state_node.next_moves.length; i++) {
            var newBoard = add_to_board(state_node.board, state_node.next_moves[i], 1);
            var new_node = {
                board: newBoard,
                next_moves: open_moves(newBoard)
            };
            vals.push(minimax(new_node, 2));
        }
        return vals[min_index(vals)];
    }
    else if (player == 2) { //max's turn
        var vals = [];
        for (var i = 0; i < state_node.next_moves.length; i++) {
            var newBoard = add_to_board(state_node.board, state_node.next_moves[i], 2);
            var new_node = {
                board: newBoard,
                next_moves: open_moves(newBoard)
            };
            vals.push(minimax(new_node, 1));
        }
        return vals[max_index(vals)];
    }
}
function add_to_board(board, position, value) {
    var newBoard = deep_copy(board);
    newBoard[position[0]][position[1]] = value;
    return newBoard;
}
function min_index(vals) {
    var min = 0;
    for (var i = 0; i < vals.length; i++) {
        if (vals[i] < vals[min]) {
            min = i;
        }
    }
    return min;
}
function max_index(vals) {
    var max = 0;
    for (var i = 0; i < vals.length; i++) {
        if (vals[i] > vals[max]) {
            max = i;
        }
    }
    return max;
}
function deep_copy(board) {
    var newBoard = [[], [], []];
    for (var r = 0; r < board.length; r++) {
        for (var c = 0; c < board.length; c++) {
            newBoard[r][c] = board[r][c];
        }
    }
    return newBoard;
}
function open_moves(board) {
    // returns an array of all the open moves on the board
    // array is empty if the board is filled
    var arr = [];
    for (var r = 0; r < board.length; r++) {
        for (var c = 0; c < board[0].length; c++) {
            if (board[r][c] == 0) {
                var arr2 = [];
                arr2.push(r);
                arr2.push(c);
                arr.push(arr2);
            }
        }
    }
    return arr;
}
function make_move(turn, isAI, board) {
    var choice;
    if (isAI) {
        choice = get_ai_choice(turn, board);
    }
    else {
        choice = get_player_choice(turn);
        while (!(is_move_valid(choice, board))) {
            choice = get_player_choice(turn);
        }
    }
    board[choice[0]][choice[1]] = turn;
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
        if ((row[0] == row[1]) && (row[1] == row[2]) && (row[0] != 0)) {
            return row[0];
        }
    }
    // cols
    for (var c = 0; c < board[0].length; c++) {
        if ((board[0][c] == board[1][c]) && (board[1][c] == board[2][c]) && (board[0][c] != 0)) {
            return board[0][c];
        }
    }
    // left top diagonal 
    if ((board[0][0] == board[1][1]) && (board[1][1] == board[2][2]) && (board[0][0] != 0)) {
        return board[0][0];
    }
    // check right top diagonal
    if ((board[0][2] == board[1][1]) && (board[1][1] == board[2][0]) && (board[0][2] != 0)) {
        return board[0][2];
    }
    // If no winners, check if the game is unfinished
    for (var r = 0; r < board.length; r++) {
        for (var c = 0; c < board[0].length; c++) {
            if ((board[r][c] != 1) && (board[r][c] != 2)) {
                return 0;
            }
        }
    }
    return 3;
}
function run_game() {
    var board = board_set_up();
    var turn = 1;
    var isAI = false;
    var state = 0;
    while (state == 0) {
        board = make_move(turn, isAI, board);
        //Change turn
        if (turn == 1) {
            turn = 2;
            isAI = true;
        }
        else {
            turn = 1;
            isAI = false;
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
