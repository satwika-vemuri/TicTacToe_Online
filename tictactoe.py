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
        
    print(board)
    
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
        board[choice[0]][choice[1]] = 1
    else:
        choice = get_player_two_choice()
        board[choice[0]][choice[1]] = 2
        

def current_game_state(board):
    # all you satwika :^)
    # Returns 0 if game is unfinished
    # 1 if player 1 wins, 2 for player 2
    # 3 is tie
    return None

def detect_winner(board):
    # If player 1/2 wins, or tie.. :^(
    return None

def run_game():
    board = board_set_up()
    turn = 1
    state = 0
    while (state == 0):
        make_move(turn, board)

        # Change turns
        if turn == 1:
            turn = 2
        else:
            turn = 1
    
        state = current_game_state(board)
    
    if state == 1:
        print("Player 1 wins!")
    elif state == 2:
        print("Player 2 wins!")
    else:
        print("Tie!")
            
run_game()
