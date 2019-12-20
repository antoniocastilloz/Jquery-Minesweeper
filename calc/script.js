let assets = {Numbers: [1,2,3,4], Bomb: "&#x1F4A3;", Flag:"&#x1F6A9;", Explosion:"&#x1F4A5;"}

function startGame() {
    let boardSize = $('input[name="radio-box"]:checked').next().text();
    let numMines = $('#numMines').val();
    let size = boardSize.split(' x ')[0];

    if ((Math.pow(Number(size), 2) / 2) >= Number(numMines)) {
        // TODO: ações do game
    } else {
        M.toast({ html: 'Insira um número de minas menor ou igual a metade do tamnho do tabuleiro escolhido!', classes: 'rounded teal lighten-1' })
    }
}