console.log("Running");

var player = "O";
var computer = "X";

function setPlayer(player){
    player = player;
    if (player=== "X"){
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
        var context = { title: 'Singleplayer', 
        styles: ["board"], 
        js: ["/js/singleplayer.js", "/js/tictactoe.js"],
        board: board_set_up(),
        score: [0, 0]
        };

        // insert data into hbs 
        var board =  boardHbsFunction(context);

        // replace playerChoose content in main with board content
        console.log(board);
        console.log($(this));
        console.log($(this).parent());
        $(this).parent().text = board;   
    });
}