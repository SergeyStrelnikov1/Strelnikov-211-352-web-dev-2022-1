let count = 0;
let gameOver = 0;
function showMessage(msg, category = 'success') {
    let div = document.createElement('div');
    div.classList.add('msg', category);
    div.innerHTML = msg;
    let messagesDiv = document.querySelector('.messages');
    messagesDiv.append(div);
    setTimeout(() => div.remove(), 2000);
}

function initBoard() {
    let board = document.getElementById("board");
    for (let i = 0; i < 9; i++) {
        let div = document.createElement("div");
        div.className = "cell";
        board.append(div);
    }
    return board;
}

function findWinner() {
    let cells = document.getElementsByClassName("cell");
    let row, column, diag, diag1, winner;
    diag = cells[0].innerHTML ? cells[0].innerHTML : null;
    diag1 = cells[2].innerHTML ? cells[2].innerHTML : null;

    for (let i = 0; i < 3; i++) {
        row = cells[i * 3].innerHTML ? cells[i * 3].innerHTML : null; 
        column = cells[i].innerHTML ? cells[i].innerHTML : null; 
        for (let j = 0; j < 3; j++) {
            if (!row && !column) break;

            if (row != cells[i * 3 + j].innerHTML) {
                row = null;
            }

            if (column != cells[j * 3 + i].innerHTML) {
                column = null;
            }

        }
        winner = row || column;
        if (winner) return winner; 

        if (diag != cells[i * 3 + i].innerHTML) {
            diag = null;
        }
        if (diag1 != cells[i * 3 + 2 - i].innerHTML) {
            diag1 = null;
        }
    }
    winner = diag || diag1;
    return winner;
}

function clickHandler(event) {
    if (event.target.className != "cell") {
        return;
    }

    if (gameOver == 1) {
        showMessage("Игра завершена", "danger");
        return;
    }

    if (event.target.innerHTML != "") {
        showMessage("Клетка занята", "danger");
        return;
    }

    event.target.innerHTML = count % 2 == 0 ? "X" : "O";
    count++;
    
    let winner = findWinner();
    if (winner || count == 9) {
        showMessage(winner ? winner + " Одержал победу" : "Ничья");
        gameOver = 1;
    }
}

function newGame() {
    let cells = document.getElementsByClassName("cell");
    for (let cell of cells) {
        cell.innerHTML = ""; 
    }
    count = gameOver = 0;
}

window.onload = function () {
    let board = initBoard();
    board.onclick = clickHandler;

    let newGameBtn = document.querySelector(".new-game-btn");
    newGameBtn.onclick = newGame;
};
