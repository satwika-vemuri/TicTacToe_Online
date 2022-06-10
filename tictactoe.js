function board_set_up(){
    const board = [];
    for(let i = 0; i < 3; i++){
        const row = [];
        for(let j = 0; j < 3; j++){
            row.push(0);
        }
        board.push(row);
    }
    return board;
}

function is_move_valid(choice, board){
    return (board[choice[0]][choice[1]] == 0);
}

function getRandomInt(min, max) {
    //min inclusive max exclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
}

function get_ai_choice(player, board){
    if(player == 1){
        return get_next_move(board, 1, 2);
    }
    else{
        return get_next_move(board, 2, 1);
    }
}

// player 1 is min (X) and player 2 is max (O)
function get_next_move(board, this_player, other_player){
    let minimax_values = [];
    for(let i = 0; i < open_moves(board).length; i++){
        let newBoard = add_to_board(board, open_moves(board)[i], this_player);
        const new_node = {
            board: newBoard,
            next_moves: open_moves(newBoard), 
        };
        minimax_values.push(minimax(new_node, other_player))
        
    }
    if(this_player == 1){
        return open_moves(board)[min_index(minimax_values)];
    } 
    else{ // player is 2
        return open_moves(board)[max_index(minimax_values)];
    }

}

// player 1 is min (X) and player 2 is max (O)
function minimax(state_node, player){

    if(state_node.next_moves.length == 0){ // the board is full
        if(current_game_state(state_node.board) == 1){
            return -1;
        }
        else if(current_game_state(state_node.board) == 2){
            return 1;
        }
        return 0;
    }

    else if(player == 1){ //min's turn
        let vals = [];
        for(let i = 0; i < state_node.next_moves.length; i++){
            let newBoard = add_to_board(state_node.board, state_node.next_moves[i], 1);
            const new_node = {
                board: newBoard,
                next_moves: open_moves(newBoard), 
            };
            vals.push(minimax(new_node, 2));
        }
        return vals[min_index(vals)];
    }

    else if (player == 2){ //max's turn
        let vals = [];
        for(let i = 0; i < state_node.next_moves.length; i++){
            let newBoard = add_to_board(state_node.board, state_node.next_moves[i], 2);
            const new_node = {
                board: newBoard,
                next_moves: open_moves(newBoard), 
            };
            vals.push(minimax(new_node, 1));
        }
        return vals[max_index(vals)];
    }
    

}

function add_to_board(board, position, value){
    let newBoard = deep_copy(board);
    newBoard[position[0]][position[1]] = value;
    return newBoard;

}

function min_index(vals){ // returns index of min
    let min = 0;
    for(let i = 0; i < vals.length; i++){
        if(vals[i] < vals[min]){
            min = i;
        }
    }
    return min;
}

function max_index(vals){ // returns index of max
    let max = 0;
    for(let i = 0; i < vals.length; i++){
        if(vals[i] > vals[max]){
            max = i;
        }
    }
    return max;
}


function deep_copy(board){
    let newBoard = [[], [], []]
    for(let r = 0; r < board.length; r++){
        for(let c = 0; c < board.length; c++){
            newBoard[r][c] = board[r][c];
        }
    }
    return newBoard;
}
function open_moves(board){
    // returns an array of all the open moves on the board
    // array is empty if the board is filled
    let arr = []
    for(let r = 0; r < board.length; r++){
        for(let c = 0; c < board[0].length; c++){
            if(board[r][c] == 0){
                let arr2 = [];
                arr2.push(r);
                arr2.push(c);
                arr.push(arr2);
            }
        }
    }
    return arr;
}


// givenChoice has a two value array if the player clicked a tile 
function make_move(turn, isAI, givenChoice, board){
    console.log(board);
    console.log("Trying to make move");
    let choice;
    if(isAI){
        choice = get_ai_choice(turn, board);
    }
    else{
        choice = givenChoice
        /*
        while(!(is_move_valid(choice, board))){
            choice = get_player_choice(turn);
        }
        */
    }
    console.log(board);
    console.log(choice);
    board[choice[0]][choice[1]] = turn;
    console.log(board);
    return [board, choice];
    
}

function current_game_state(board){
    // board is a 3x3 multi dimensional array
    // Returns 0 if game is unfinished
    // 1 if player 1 wins, 2 for player 2
    // 3 is tie

    // Check for if there are any winners

    // rows
    for(let r = 0; r < board.length; r++){
        const row = board[r]
        if((row[0] == row[1]) && (row[1] == row[2]) && (row[0] != 0)){
            return row[0];
        }
    }

    // cols
    for(let c = 0; c < board[0].length; c++){
        if((board[0][c] == board[1][c]) &&  (board[1][c] == board[2][c]) && (board[0][c] != 0)){
            return board[0][c];
        }
    }

    // left top diagonal 
    if((board[0][0] == board[1][1]) && (board[1][1] == board[2][2]) && (board[0][0] != 0)){ 
        return board[0][0];
    }

    // check right top diagonal
    if((board[0][2] == board[1][1]) && (board[1][1] == board[2][0]) && (board[0][2] != 0)){ 
        return board[0][2];
    }
    // If no winners, check if the game is unfinished
    for(let r = 0; r < board.length; r++){
        for(let c = 0; c < board[0].length; c++){
            if ((board[r][c] != 1) && (board[r][c] != 2)){ 
                return 0;
            }
        }
    }
    return 3;
}
