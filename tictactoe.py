from random import randint

# BOARD LAYOUT
# 0 represents an empty space
# 1 represents an O
# 2 represents an X

def board_set_up():
    board = []
    for r in range(3):
        row = []
        for c in range(3):
            row.append(0)
        board.append(row)
        
    return board

def is_move_valid(choice, board):
    return board[choice[0]][choice[1]] == 0
        

# Player one represented by O
def get_player_one_choice():
    # Get player one input: always a user 
    # Set to random tempoarily
    return (randint(0, 2), randint(0, 2))

def get_player_two_choice():
    # Get player two input: user or AI generated
    # Set to random tempoarily
    return (randint(0, 2), randint(0, 2))

def make_move(turn, board):
    if turn == 1:
        choice = get_player_one_choice()
        

        while not is_move_valid(choice, board):
            choice = get_player_one_choice()
        board[choice[0]][choice[1]] = 1
    else:
        choice = get_player_two_choice()
        
        while not is_move_valid(choice, board):
            choice = get_player_two_choice()
        board[choice[0]][choice[1]] = 2
        

def current_game_state(board):
    # board is a 3x3 multi dimensional array
    # Returns 0 if game is unfinished
    # 1 if player 1 wins, 2 for player 2
    # 3 is tie

    ## Check for if there are any winners
    for row in board:
        if(row[0] == row[1] == row[2]):
            print("stage 1")
            winner = row[0]

    # check cols
    for col in range(0, 3):
        if(board[0][col] == board[1][col] == board[2][col]):
            print("stage 2")
            return board[0][col]
    
    # check left top diagonal
    if(board[0][0] == board[1][1] == board[2][2]):
        print("stage 3")
        return board[0][0]

    # check right top diagonal
    if(board[0][2] == board[1][1] == board[2][0]):
        print("stage 4")
        return board[0][2]

    ## If no winners, check if the game is unfinished
    for row in range(len(board)):
        for col in range(len(board)):
            if ((board[row][col] != 1) and (board[row][col] != 2)):
                print("stage 5")
                return 0
    return 3

def run_game():
    board = board_set_up()

    turn = 1
    state = 0
    while (state == 0):
        make_move(turn, board)
        print(board)

        # Change turns
        if turn == 1:
            turn = 2
        else:
            turn = 1
    
        state = current_game_state(board)
        print(state)
    
    if state == 1:
        print("Player 1 wins!")
    elif state == 2:
        print("Player 2 wins!")
    else:
        print("Tie!")
            
run_game()

    