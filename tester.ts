function generateTree(board, tree, player){
    for(let i = 0; i < tree.next_moves.length; i++){
        const current = tree.next_moves[i]; // arr size two that contains the open space in the board that we're currently exploring
        let newBoard = board;
        newBoard[current[0]][current[1]] = player;

        if(current_game_state(newBoard) != 0){ // not a terminal state

            const newTree = {
                board: newBoard,
                next_moves: open_moves(newBoard),
                isTerminal: false
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
            const newTree = {
                board: newBoard,
                next_moves: open_moves(newBoard), // should be empty
                isTerminal: true
            };
            tree.next_moves[i] = newTree;
        }
    }

}

function minimax_values(board){
    // from player 2's perspective (so we want 2 to win)
    
    const tree = {
        board: board,
        next_moves: open_moves(board),
        isTerminal: false // because this is called by get_player_two_choice
      };
    generateTree(board, tree, 2)
    printTree(tree, 1);
 
}

function printTree(tree, level){
    console.log(tree.board);
    for(let i = 0; i < tree.open_moves.length; i++){
        printTree("\t" + tree.open_moves.get(i), level + 1);
    }
}
function open_moves(board){
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
function current_game_state(board){
    // board is a 3x3 multi dimensional array
    // Returns 0 if game is unfinished
    // 1 if player 1 wins, 2 for player 2
    // 3 is tie

    // Check for if there are any winners

    // rows
    for(let r = 0; r < board.length; r++){
        const row = board[r]
        if((row[0] == row[1]) && (row[1] == row[2])){
            console.log("stage 1");
            return row[0];
        }
    }

    // cols
    for(let c = 0; c < board[0].length; c++){
        if((board[0][c] == board[1][c]) &&  (board[1][c] == board[2][c])){
            console.log("stage 2");
            return board[0][c];
        }
    }

    // left top diagonal 
    if((board[0][0] == board[1][1]) && (board[1][1] == board[2][2])){ 
        console.log("stage 3");
        return board[0][0];
    }

    // check right top diagonal
    if((board[0][2] == board[1][1]) && (board[1][1] == board[2][0])){ 
        console.log("stage 4");
        return board[0][2];
    }
    // If no winners, check if the game is unfinished
    for(let r = 0; r < board.length; r++){
        for(let c = 0; c < board[0].length; c++){
            if ((board[r][c] != 1) && (board[r][c] != 2)){ 
                console.log("stage 5");
                return 0;
            }
        }
    }
    console.log("stage 6");
    return 3;
}
minimax_values([[1, 1, 0], [2, 2, 0], [1, 1, 2]]);