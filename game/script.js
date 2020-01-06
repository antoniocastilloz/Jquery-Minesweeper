let assets = { Bomb: "&#x1F4A3;", Flag: "&#x1F6A9;", Explosion: "&#x1F4A5;" };
let boardGame;
let hits;
let expectedHits;

let modalLoseElement = document.querySelector('#modalLose');
let modalWinElement = document.querySelector('#modalWin');
let modalLose = M.Modal.init(modalLoseElement);
let modalWin = M.Modal.init(modalWinElement);

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
        createBoardGame(size, numMinesInput);
        renderGameBoardAccordingSize(size);
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
    console.log(boardGame)
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

function leftClick(size) {
    $("div[name='square']").click(function () {
        if ($(this).text() != "🚩" && !$(this).hasClass("squarePressed")) {
            let positionX = (Math.floor($(this).index() / parseInt(size)));
            let positionY = $(this).index() % parseInt(size);

            if (boardGame[positionX][positionY] != assets.Bomb) {
                showAllAroundSquaresAssets(positionX, positionY, size);
            } else {
                showAllBombs()
                explodeBombs()
                setTimeout(function () {
                    modalLose.open();
                    $(".modal-close,.modal-overlay").click(function () {
                    })
                }, 1500);
            }

            if (hits == expectedHits) {
                setTimeout(function () {
                    modalWin.open();
                    showAllBombs()
                    $(".modal-close,.modal-overlay").click(function () {
                    })
                }, 1000);
            }
        }

    })
}

function rightClick() {
    $("div[name='square']").contextmenu(function () {
        if ($(this).text() != "🚩" && !$(this).hasClass("squarePressed")) {
            $(this).append(assets.Flag);
        } else if ($(this).text() == "🚩") {
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
    positionXY = []
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            positionXY.push(x + "." + y)
        }
    }

    for (let i = 0; i < Math.pow(size, 2); i++) {
        $("#gameBoard").addClass("gameBoardWidth" + size + "x" + size);
        $("#gameBoard").append('<div id="square' + i + '" name="square" value="' + positionXY[i] + '" class="squareUnpressed"></div>');
    }
}

function showAllBombs() {
    $("div[name='square']").each(function () {
        let position = $(this).attr('value').split('.');
        let positionX = position[0];
        let positionY = position[1];
        if (boardGame[positionX][positionY] == assets.Bomb) {
            $(this).text('');
            $(this).removeClass("squareUnpressed").addClass("squarePressed");
            $(this).append(assets.Bomb);
        }
    })
}

function explodeBombs() {
    $("div[name='square']").each(function () {
        let position = $(this).attr('value').split('.');
        let positionX = position[0];
        let positionY = position[1];
        if (boardGame[positionX][positionY] == assets.Bomb) {
            setTimeout(function () { $(this).text(''); $(this).append(assets.Explosion); }.bind($(this)), 1500);
        }
    })
}

function showAllAroundSquaresAssets(positionX, positionY, size) {
    if (positionX >= 0 && positionX < size && positionY >= 0 && positionY < size) {
        let element = $("div[value='" + positionX + "." + positionY + "']")

        if (element.hasClass("squareUnpressed") && boardGame[positionX][positionY] != assets.Bomb) {
            element.text('');
            element.append(boardGame[positionX][positionY]);
            element.removeClass("squareUnpressed").addClass("squarePressed");
            hits++;

            if (boardGame[positionX][positionY] == 0) {
                showAllAroundSquaresAssets(positionX - 1, positionY - 1, size)
                showAllAroundSquaresAssets(positionX - 1, positionY, size)
                showAllAroundSquaresAssets(positionX - 1, positionY + 1, size)
                showAllAroundSquaresAssets(positionX, positionY - 1, size)
                showAllAroundSquaresAssets(positionX, positionY + 1, size)
                showAllAroundSquaresAssets(positionX + 1, positionY - 1, size)
                showAllAroundSquaresAssets(positionX + 1, positionY, size)
                showAllAroundSquaresAssets(positionX + 1, positionY + 1, size)
            }
        }
    }
}
