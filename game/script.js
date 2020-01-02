let assets = { Bomb: "&#x1F4A3;", Flag: "&#x1F6A9;", Explosion: "&#x1F4A5;" };
let boardGame;
let hits;
let expectedHits;

onlyNumbersInInput("#numMines");

function startGame() {
    let boardSizeRadio = $('input[name="radio-box"]:checked').next().text();
    let numMinesInput = $('#numMines').val();
    let size = boardSizeRadio.split(' x ')[0];
    
    expectedHits = Math.pow(size, 2) - parseInt(numMinesInput);
    hits = 0;
    
    cleanGameBoard();
    configGame(numMinesInput, size);
    squareClick(size);
}

function configGame(numMinesInput, size) {
    if (numMinesInput == "") {
        M.toast({ html: 'O número de minas deve ser preenchido !', classes: 'rounded teal lighten-1' });
    } else if (Number(numMinesInput) == 0) {
        M.toast({ html: 'O número de minas deve maior que 0 !', classes: 'rounded teal lighten-1' });
    } else if ((Math.pow(Number(size), 2) / 2) >= Number(numMinesInput)) {
        verifyIfGameBoardExists();
        renderGameBoardAccordingSize(size);
        createBoardGame(size, numMinesInput);
    } else {
        M.toast({ html: 'Insira um número de minas menor ou igual a metade do tamanho do tabuleiro escolhido !', classes: 'rounded teal lighten-1' });
    }
}

function createBoardGame(size, numMinesInput) {
    boardGame = [];
    let tempArray = [];

    for (let i = 0; i < size; i++) { tempArray.push(0); }
    for (let i = 0; i < size; i++) { boardGame.push([...tempArray]); }

    let j;
    let k;
    for (let i = 0; i < parseInt(numMinesInput); i++) {
        do {
            j = Math.floor(Math.random() * size);
            k = Math.floor(Math.random() * size);
        } while (boardGame[j][k] != 0);

        boardGame[j][k] = assets.Bomb;
    }

    for (let j = 0; j < size; j++) {
        for (let k = 0; k < size; k++) {
            if (boardGame[j][k] != assets.Bomb) {
                let contMines = 0;

                for (let x = Math.max((j - 1), 0); x < Math.min((j + 2), size); x++) {
                    for (let y = Math.max((k - 1), 0); y < Math.min((k + 2), size); y++) {
                        if ((j != x || k != y) && (boardGame[x][y] == assets.Bomb)) {
                            contMines++;
                        }
                    }
                }
                
                boardGame[j][k] = contMines;
            }
        }
    }

    tempPrint();
}

//Todo: apagar após os testes
function tempPrint() {
    for (let j = 0; j < 5; j++) {
        console.log('\'' + boardGame[j][0] + '\' - \'' + boardGame[j][1] + '\' - \'' + boardGame[j][2] + '\' - \'' + boardGame[j][3] + '\' - \'' + boardGame[j][4] + '\'');
    }
}

function onlyNumbersInInput(input) {
    $(input).keypress(function (key) {
        if (key.charCode < 48 || key.charCode > 57) return false;
    });
}

function removeAdditionalWidthClassesInGameBoard() {
    for (let i = 5; i <= 15; i += 5) {
        if ($("#gameBoard").hasClass("gameBoardWidth" + i + "x" + i) == true) {
            $("#gameBoard").removeClass("gameBoardWidth" + i + "x" + i)
        }
    }
}

function cleanGameBoard() {
    $("#gameBoard").empty();
    removeAdditionalWidthClassesInGameBoard()
}

function squareClick(size) {
    leftClick(size)
    rightClick()
}

function leftClick(size){
    $("div[name='square']").click(function () {
        if($(this).text() != "🚩" && !$(this).hasClass("squarePressed")){
            let positionX = (Math.floor($(this).index() / parseInt(size)));
            let positionY = $(this).index() % parseInt(size);

            if (boardGame[positionX][positionY] != assets.Bomb) {
                $(this).append(boardGame[positionX][positionY]);
                $(this).removeClass("squareUnpressed").addClass("squarePressed");
                hits++;
            } else {
                //Todo: melhorar animação das minas e declarar fim de jogo
                $(this).append(assets.Bomb);
                setTimeout(function(){ $(this).text(''); $(this).append(assets.Explosion); }.bind($(this)), 2000);
                $(this).removeClass("squareUnpressed").addClass("squarePressed");
            }

            //Todo: declarar vitória
            if (hits == expectedHits) {
                console.log('Fim de jogo');
            }
        } 
    })
}

function rightClick(){
    $("div[name='square']").contextmenu(function () {
        if($(this).text() != "🚩" && !$(this).hasClass("squarePressed")) {
            $(this).append(assets.Flag);
        } else if($(this).text() == "🚩") {
            $(this).text('');
        }

        return false;
    });
}

function verifyIfGameBoardExists() {
    if ($("#gameBoard").length == 0) {
        $('#game').append('<div id="gameBoard" class="col s1"></div>');
    }
}

function renderGameBoardAccordingSize(size) {
    for (let i = 0; i < Math.pow(size, 2); i++) {
        $("#gameBoard").addClass("gameBoardWidth" + size + "x" + size);
        $("#gameBoard").append('<div id="square' + i + '" name="square" class="squareUnpressed"></div>');
    }
}
