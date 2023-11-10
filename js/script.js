const gameBoard = (() => {
	let board = ["", "", "", "", "", "", "", "", ""];

	const getBoard = () => board;
	const setBoard = (index, value) => {
		board[index] = value;
	};
	const resetBoard = () => {
		board = ["", "", "", "", "", "", "", "", ""];
	};

	function createPlayer(name, mark) {
		const getName = () => name;
		const getMark = () => mark;
		return { getName, getMark };
	};

	function checkWin() {
		if (board[0] === board[1] && board[1] === board[2] && board[0] !== "") {
			return true;
		} else if (board[3] === board[4] && board[4] === board[5] && board[3] !== "") {
			return true;
		} else if (board[6] === board[7] && board[7] === board[8] && board[6] !== "") {
			return true;
		} else if (board[0] === board[3] && board[3] === board[6] && board[0] !== "") {
			return true;
		} else if (board[1] === board[4] && board[4] === board[7] && board[1] !== "") {
			return true;
		} else if (board[2] === board[5] && board[5] === board[8] && board[2] !== "") {
			return true;
		} else if (board[0] === board[4] && board[4] === board[8] && board[0] !== "") {
			return true;
		} else if (board[2] === board[4] && board[4] === board[6] && board[2] !== "") {
			return true;
		} else {
			return false;
		}
	};

	return { getBoard, setBoard, resetBoard, createPlayer, checkWin };
})();

const displayController = (() => {
	const player1 = gameBoard.createPlayer("Player 1", "X");
	const player2 = gameBoard.createPlayer("Player 2", "O");
	let currentPlayer = player1;

	let freeCells = document.querySelectorAll(".cell:not(.occupied)");

	const playerClickOnCell = (e) => {
		const cell = e.target;

		cell.removeEventListener("click", playerClickOnCell);
		cell.textContent = currentPlayer.getMark();
		cell.classList.add("occupied");

		gameBoard.setBoard(cell.dataset.index, currentPlayer.getMark());

		// Update freeCells
		freeCells = document.querySelectorAll(".cell:not(.occupied)");

		if (gameBoard.checkWin()) {
			alert(`${currentPlayer.getName()} wins!`);
			initGame();
		} else if (freeCells.length === 0) {
			alert("It's a tie!");
			initGame();
		} else {
			currentPlayer = currentPlayer === player1 ? player2 : player1;
			freeCells.forEach(cell => {
				cell.addEventListener("click", playerClickOnCell);
			});
		}

	}

	const initGame = () => {
		const cells = document.querySelectorAll(".cell");
		cells.forEach(cell => {
			cell.textContent = "";
			cell.classList.remove("occupied");
			cell.addEventListener("click", playerClickOnCell);
		});
		gameBoard.resetBoard();
		currentPlayer = player1;
	}

	return { initGame };
})();


displayController.initGame();
