console.log("Running");

var player = "O";
var computer = "X";
var boardArray = board_set_up();

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

        var scripts  = 
            {tictactoe: "/js/tictactoe.js",
            singleplayer: "/js/singleplayer.js"};

        var context = { title: 'Singleplayer', 
        styles: ["board"], 
        js: scripts,
        board: boardArray,
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
}