let assets = { Bomb: "&#x1F4A3;", Flag: "&#x1F6A9;", Explosion: "&#x1F4A5;" };
let boardGame;
let hits;
let expectedHits;

let records = []

let nameRecord = ""

let time;
let seconds = 0;
let minutes = 0;
let hours = 0;

let modalLoseElement = document.querySelector('#modalLose');
let modalWinElement = document.querySelector('#modalWin');

let modalLose = M.Modal.init(modalLoseElement, { dismissible: false });
let modalWin = M.Modal.init(modalWinElement, { dismissible: false });

for (let x = 0; x < 5; x++) {
    if (localStorage.getItem("record" + x) != null) {
        records.push({ name: localStorage.getItem("names" + x), time: localStorage.getItem("record" + x) })
    }
}

console.log("Records Gravados: " + records)

onlyNumbersInInput("#numMines");

if ($("#gameBoard").length == 0) {
    $('#game').append('<div id="gameBoard" class="col s1"></div>');
}

$('#game').append("<div id='records' class='col s3'><label id='labelRecords' class='center'><h4>Records</h4></label><table id='tableRecords' class='centered grey-text'><thead><tr><th>Nome</th><th>Tempo</th></tr></thead><tbody><tr id='record0'><td id='name0'>-</td><td id='time0'>-</td></tr><tr id='record1'><td id='name1'>-</td><td id='time1'>-</td></tr><tr id='record2'><td id='name2'>-</td><td id='time2'>-</td></tr><tr id='record3'><td id='name3'>-</td><td id='time3'>-</td></tr><tr id='record4'><td id='name4'>-</td><td id='time4'>-</td></tr></tbody></table></div>");

populateRecordsTable();

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
        $("#gameBoard").css("display", "flex")
        clearTimeout(time);
        seconds = 0;
        minutes = 0;
        turned = 0;
        points = 0;
        hours = 0;
        document.querySelector('#time > h2').textContent = '00:00:00';
        timer()
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
    console.log("Novo Jogo")
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
                clearTimeout(time);
                $("div[name='square']").css("pointer-events", "none")
                showAllBombs()
                explodeBombs()
                setTimeout(function () {
                    modalLose.open();
                    $(".modal-close,.modal-overlay").click(function () {
                    })
                }, 1500);
            }
            if (hits == expectedHits) {
                clearTimeout(time);
                setTimeout(function () {
                    showAllBombs()
                    modalWin.open();
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

function addTime() {
    seconds++;

    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    document.querySelector('#time > h2').textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}

function timer() {
    time = setTimeout(function () { addTime() }, 1000);
}

function saveAndDisplayOrdenedRecords(nameRecord) {
    let timeRecord = document.querySelector('#time > h2').textContent;

    if (hits == expectedHits) {
        records.push({ name: nameRecord, time: timeRecord })
        console.log(records.length)
        if (records.length == 1) {
            localStorage.setItem('record0', timeRecord);
            localStorage.setItem('name0', nameRecord);
            populateRecordsTable()
            console.log(records)
        } else if (records.length < 5){
            console.log(records)
            localStorage.setItem('record' + records.indexOf(records[records.length - 1]), timeRecord);
            localStorage.setItem('name' + records.indexOf(records[records.length - 1]), nameRecord);
            records.sort(sortArrayOfObjectsByTime)
            updateLocalStorageRecordNamesAndTimes()
            populateRecordsTable()
            console.log(records)
        }
        if (records.length == 5) {
            console.log(records)
            let copyRecords = records;
            copyRecords.push({ name: nameRecord, time: timeRecord })
            copyRecords.sort(sortArrayOfObjectsByTime)
            copyRecords.splice(4, 1)
            records = copyRecords
            updateLocalStorageRecordNamesAndTimes()
            populateRecordsTable()
        }
    }

}

function isDifferentNull(position) {
    return position != null;
}

function verifyAllPositionsOfArrayIsDifferentUndefined(array) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].name == undefined && array[i].time == undefined) {
            return false;
        } else {
            return true;
        }
    }
}

function populateRecordsTable() {
    for (let i = 0; i < 5; i++) {
        if (records[i] != null) {
            $('#record' + i).css("display", "table-row");
            $('#name' + i).text(localStorage.getItem('name' + i))
            $('#time' + i).text(localStorage.getItem('record' + i))
        }
    }
}

function sendRecordName() {
    let nameRecord = $('#nameRecord').val();
    if (nameRecord == '') {
        M.toast({ html: 'Você precisa digitar o seu nome !', classes: 'rounded teal lighten-1' });
    } else {
        M.toast({ html: 'Você acabou de salvar seu nome entre os Records !', classes: 'rounded teal lighten-1' });
        $("#nameRecord").val('')
        modalWin.close()
        saveAndDisplayOrdenedRecords(nameRecord);
    }
}

function updateLocalStorageRecordNamesAndTimes() {
    for (let x = 0; x < records.length; x++) {

        localStorage.setItem('record' + x, records[x].time)
        localStorage.setItem('name' + x, records[x].name)
    }
}

function sortArrayOfObjectsByTime(a, b) {
    if (a.time < b.time) {
        return -1;
    }
    if (a.time > b.time) {
        return 1;
    }
    return 0;
}
