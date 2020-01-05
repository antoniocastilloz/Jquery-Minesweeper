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
        showGameBoardHideGameFilter()
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
    // for (let j = 0; j < 5; j++) {
    //     console.log('\'' + boardGame[j][0] + '\' - \'' + boardGame[j][1] + '\' - \'' + boardGame[j][2] + '\' - \'' + boardGame[j][3] + '\' - \'' + boardGame[j][4] + '\'');
    // }
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
                $(this).append(boardGame[positionX][positionY]);
                $(this).removeClass("squareUnpressed").addClass("squarePressed");
                hits++;
                showAllAroundSquaresAssets(boardGame, positionX, positionY)
            } else {
                //Todo: melhorar animação das minas e declarar fim de jogo

                showAllBombs()
                explodeBombs()
                setTimeout(function () {
                    modalLose.open();
                    $(".modal-close,.modal-overlay").click(function () {
                        hideGameBoardShowGameFilter()
                    })
                }, 1500);

            }

            if (hits == expectedHits) {
                setTimeout(function () {
                    modalWin.open();
                    showAllBombs()
                    $(".modal-close,.modal-overlay").click(function () {
                        hideGameBoardShowGameFilter()
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

function hideGameBoardShowGameFilter() {
    $('#gameBoard').addClass('visibilityHidden')
    $('#gameFilter').removeClass('visibilityHidden')
}

function showGameBoardHideGameFilter() {
    $('#gameBoard').removeClass('visibilityHidden')
    $('#gameFilter').addClass('visibilityHidden')
}

function showAllBombs() {
    $("div[name='square']").each(function () {
        if (boardGame[$(this).attr('value').slice(0, 1)][$(this).attr('value').slice(2)] == assets.Bomb) {
            $("div[name='square']").removeClass("squareUnpressed").addClass("squarePressed");
            $(this).append(assets.Bomb);
        }
    })
}

function explodeBombs() {
    $("div[name='square']").each(function () {
        if (boardGame[$(this).attr('value').slice(0, 1)][$(this).attr('value').slice(2)] == assets.Bomb) {
            setTimeout(function () { $(this).text(''); $(this).append(assets.Explosion); }.bind($(this)), 1500);
        }
    })
}

function showAllAroundSquaresAssets(boardGame, positionX, positionY) {
    if (boardGame[positionX][positionY] == 0) {
        let positionXLeft = positionX - 1
        let positionXRight = positionX + 1
        let positionYUp = positionY - 1
        let positionYDown = positionY + 1

        let northWestSquare = $("div[value='" + positionXLeft + "." + positionYUp + "']")
        let northSquare = $("div[value='" + positionXLeft + "." + positionY + "']")
        let northEastSquare = $("div[value='" + positionXLeft + "." + positionYDown + "']")
        let westSquare = $("div[value='" + positionX + "." + positionYUp + "']")
        let eastSquare = $("div[value='" + positionX + "." + positionYDown + "']")
        let southWestSquare = $("div[value='" + positionXRight + "." + positionYUp + "']")
        let southSquare = $("div[value='" + positionXRight + "." + positionY + "']")
        let southEastSquare = $("div[value='" + positionXRight + "." + positionYDown + "']")

        try {
            if (boardGame[positionXLeft][positionYUp] != assets.Bomb && northWestSquare.length == 1 && northWestSquare.text() == "") {
                northWestSquare.removeClass("squareUnpressed").addClass("squarePressed");
                northWestSquare.append(boardGame[positionXLeft][positionYUp]);
                hits++;
            }
        } catch (e) {
            console.log(e)
        }
        try {
            if (boardGame[positionXLeft][positionY] != assets.Bomb && northSquare.length == 1 && northSquare.text() == "") {
                northSquare.removeClass("squareUnpressed").addClass("squarePressed");
                northSquare.append(boardGame[positionXLeft][positionY]);
                hits++;
            }
        } catch (e) {
            console.log(e)
        }
        try {
            if (boardGame[positionXLeft][positionYDown] != assets.Bomb && northEastSquare.length == 1 && northEastSquare.text() == "") {
                northEastSquare.removeClass("squareUnpressed").addClass("squarePressed");
                northEastSquare.append(boardGame[positionXLeft][positionYDown]);
                hits++;
            }
        } catch (e) {
            console.log(e)
        }
        try {
            if (boardGame[positionX][positionYUp] != assets.Bomb && westSquare.length == 1 && westSquare.text() == "") {
                westSquare.removeClass("squareUnpressed").addClass("squarePressed");
                westSquare.append(boardGame[positionX][positionYUp]);
                hits++;
            }
        } catch (e) {
            console.log(e)
        }
        try {
            if (boardGame[positionX][positionYDown] != assets.Bomb && eastSquare.length == 1 && eastSquare.text() == "") {
                eastSquare.removeClass("squareUnpressed").addClass("squarePressed");
                eastSquare.append(boardGame[positionX][positionYDown]);
                hits++;
            }
        } catch (e) {
            console.log(e)
        }
        try {
            if (boardGame[positionXRight][positionYUp] != assets.Bomb && southWestSquare.length == 1 && southWestSquare.text() == "") {
                southWestSquare.removeClass("squareUnpressed").addClass("squarePressed");
                southWestSquare.append(boardGame[positionXRight][positionYUp]);
                hits++;
            }
        } catch (e) {
            console.log(e)
        }
        try {
            if (boardGame[positionXRight][positionY] != assets.Bomb && southSquare.length == 1 && southSquare.text() == "") {
                southSquare.removeClass("squareUnpressed").addClass("squarePressed");
                southSquare.append(boardGame[positionXRight][positionY]);
                hits++;
            }
        } catch (e) {
            console.log(e)
        }
        try {
            if (boardGame[positionXRight][positionYDown] != assets.Bomb && southEastSquare.length == 1 && southEastSquare.text() == "") {
                southEastSquare.removeClass("squareUnpressed").addClass("squarePressed");
                southEastSquare.append(boardGame[positionXRight][positionYDown]);
                hits++;
            }
        } catch (e) {
            console.log(e)
        }
    }
    console.log(hits)
}

function showOneSquareAround(boardGame,positionX,positionY){
    try {
        if (boardGame[positionXRight][positionYDown] != assets.Bomb && southEastSquare.length == 1 && southEastSquare.text() == "") {
            southEastSquare.removeClass("squareUnpressed").addClass("squarePressed");
            southEastSquare.append(boardGame[positionXRight][positionYDown]);
            hits++;
        }
    } catch (e) {
        console.log(e)
    }
}

