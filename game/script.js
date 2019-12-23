let assets = { Numbers: [1, 2, 3, 4], Bomb: "&#x1F4A3;", Flag: "&#x1F6A9;", Explosion: "&#x1F4A5;" }

onlyNumbersInInput("#numMines")

function startGame() {
    let boardSizeRadio = $('input[name="radio-box"]:checked').next().text();
    let numMinesInput = $('#numMines').val();
    let size = boardSizeRadio.split(' x ')[0];
    cleanGameBoard()
    configGame(numMinesInput, size)
    squareClick()
}

function configGame(numMinesInput, size) {
    if (numMinesInput == "") {
        M.toast({ html: 'O número de minas deve ser preenchido !', classes: 'rounded teal lighten-1' })
    } else if (Number(numMinesInput) == 0) {
        M.toast({ html: 'O número de minas deve maior que 0 !', classes: 'rounded teal lighten-1' })
    } else if ((Math.pow(Number(size), 2) / 2) >= Number(numMinesInput)) {
        verifyIfGameBoardExists()
        renderGameBoardAccordingSize(size)
    } else {
        M.toast({ html: 'Insira um número de minas menor ou igual a metade do tamanho do tabuleiro escolhido !', classes: 'rounded teal lighten-1' })
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

function squareClick() {
    leftClick()
    rightClick()
}

function leftClick(){
    $("div[name='square']").click(function () {
        if($(this).text() == "🚩"){
            $(this).text("")
        } 
        $(this).removeClass("squareUnpressed").addClass("squarePressed");
    })
}

function rightClick(){
    $("div[name='square']").contextmenu(function () {
        $(this).append(assets.Flag);
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
