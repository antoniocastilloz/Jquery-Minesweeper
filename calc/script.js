let assets = {Numbers: [1,2,3,4], Bomb: "&#x1F4A3;", Flag:"&#x1F6A9;", Explosion:"&#x1F4A5;"}

function startGame() {
    let boardSizeRadio = $('input[name="radio-box"]:checked').next().text();
    let numMinesInput = $('#numMines').val();
    let size = boardSizeRadio.split(' x ')[0];
    console.log(size)
    if ((Math.pow(Number(size), 2) / 2) >= Number(numMinesInput)) {
        switch(size){
            case "5":
                cleanGameBoard("gameBoardWidth10x10","gameBoardWidth15x15")
                for(var i = 0; i < 24; i++){
                    $("#gameBoard").addClass("gameBoardWidth5x5")
                    $("#gameBoard").append('<div class="defaultSquareBoard">&#x1F4A3;</div>')
                }
            break;
            case "10":
                cleanGameBoard("gameBoardWidth5x5","gameBoardWidth15x15")
                for(var i = 0; i < 99; i++){ 
                    $("#gameBoard").addClass("gameBoardWidth10x10")
                    $("#gameBoard").append('<div class="defaultSquareBoard">&#x1F4A3;</div>')
                }
            break;
            case "15":
                cleanGameBoard("gameBoardWidth10x10","gameBoardWidth5x5")
                for(var i = 0; i < 224; i++){
                    $("#gameBoard").addClass("gameBoardWidth15x15")
                    $("#gameBoard").append('<div class="defaultSquareBoard">&#x1F4A3;</div>')
                }
            break;
        }
    } else {
        M.toast({ html: 'Insira um número de minas menor ou igual a metade do tamnho do tabuleiro escolhido!', classes: 'rounded teal lighten-1' })
    }
}

function removeAdditionalWidthClassesInGameBoard(additionalClass1,additionalClass2){
    if($("#gameBoard").hasClass(additionalClass1) || $("#gameBoard").hasClass(additionalClass2) == true){
        $("#gameBoard").removeClass(additionalClass1)
        $("#gameBoard").removeClass(additionalClass2)
    }
}

function cleanGameBoard(additionalClass1,additionalClass2){
    $("#gameBoard").empty();
    removeAdditionalWidthClassesInGameBoard(additionalClass1,additionalClass2)
}
