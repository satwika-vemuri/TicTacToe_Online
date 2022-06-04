function board_set_up(){
    const board = [];
    for(let i = 0; i < 3; i++){
        const row = [];
        for(let j = 0; j < 3; j++){
            row.push(0);
        }
        board.push(row);
    }
    return board
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

// Player one represented by O
function get_player_one_choice(){
    // Get player one input: always a user 
    // Set to random tempoarily
    let arr = []
    arr.push(getRandomInt(0, 3))
    arr.push(getRandomInt(0, 3))
    return arr;
}

function get_player_two_choice(board){
    // AI generated
    /*
    will return a 3 by 3 array with the following values:
    X -- space unavailable
    1 -- choosing this probably lead to a victory
    -1 -- choosing this probably leads to a loss
    0 -- choosing this probably leads to a tie
    */
    minimax_values(board);
    /*
    let arr = []

    
    const values = minimax_values(board)
    // return the first 1
    for(let r = 0; r < board.length; r++){
        for(let c = 0; c < board[0].length; c++){
            if(board[r][c] == 1){
                arr.push(r);
                arr.push(c);
                return arr;
            }

        }
    }

    // return the first 0 if there are no 1s
    for(let r = 0; r < board.length; r++){
        for(let c = 0; c < board[0].length; c++){
            if(board[r][c] == 0){
                arr.push(r);
                arr.push(c);
                return arr;
            }

        }
    }

    // return the first -1 if there are no 0s
    for(let r = 0; r < board.length; r++){
        for(let c = 0; c < board[0].length; c++){
            if(board[r][c] == -1){
                arr.push(r);
                arr.push(c);
                return arr;
            }

        }
    }
    */
    
}

function minimax_values(board){
    // from player 2's perspective (so we want 2 to win)

    const tree = {
        board: board,
        next_moves: open_moves(board), 
        isTerminal: false, // because this is called by get_player_two_choice
        minimax_val: null
    };
    generateTree(board, tree, 2)
    console.log(tree);
}

function generateTree(board, tree, player){ // generates tree from root node
    for(let i = 0; i < tree.next_moves.length; i++){
        const current = tree.next_moves[i]; // arr size two that contains the open space in the board that we're currently exploring
        let newBoard = deep_copy(board);
        newBoard[current[0]][current[1]] = player; // update newBoard with the most recent move

        if(current_game_state(newBoard) == 0){ // not a terminal state (game can still continue)
            const newTree = {
                board: newBoard,
                next_moves: open_moves(newBoard), 
                isTerminal: false,
                minimax_value: null
            };
            if(player == 1){
                player = 2;
            }
            else{
                player = 1;
            }
            tree.next_moves[i] = generateTree(newBoard, newTree, player);

        }
        else{
            const winner = current_game_state(newBoard)
            let minimax_val;
            if(winner == 1){
                minimax_val = -1;
            }
            else if(winner == 2){
                minimax_val = 1;
            }
            else if(winner == 3){
                minimax_val = 0;
            }
            else{ // game is unfinished
                console.log("Your algorithm failed...")
            }
            console.log(minimax_val)
            const newTree = {
                board: newBoard,
                next_moves: open_moves(newBoard), // should be empty
                isTerminal: true,
                minimax_value: minimax_val
            };
            tree.next_moves[i] = newTree;
        }
    }

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


function make_move(turn, board){
    if(turn == 1){
        let choice = get_player_one_choice();
        while(!(is_move_valid(choice, board))){
            choice = get_player_one_choice();
        }

        board[choice[0]][choice[1]] = 1;
    }
    else{
        let choice = get_player_two_choice(board);
        while(!(is_move_valid(choice, board))){
            choice = get_player_two_choice(board);
        }
        board[choice[0]][choice[1]] = 2;

    }
    return board
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

function run_game(){
    let board = board_set_up();

    let turn = 1;
    let state = 0;
    while(state == 0){
        board = make_move(turn, board);
    
        //Change turn
        if(turn == 1){
            turn = 2;
        }
        else{
            turn = 1;
        }

        state = current_game_state(board)
        console.log(board);
    }

    if (state == 1){ 
        console.log("Player 1 wins!");
    }
    else if (state == 2){
        console.log("Player 2 wins!");
    }
    else{ 
        console.log("Tie!");
    }
}
            
run_game()
