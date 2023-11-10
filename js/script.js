let difficulty = "easy";

document.querySelectorAll(".difficulty-button").forEach((button) => {
	button.addEventListener("click", (e) => {
		difficulty = e.target.id;
		gameLogic.initGame();
	});
});



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

	function checkWin(testBoard = board) {
		if (testBoard[0] === testBoard[1] && testBoard[1] === testBoard[2] && testBoard[0] !== "") {
			return true;
		} else if (testBoard[3] === testBoard[4] && testBoard[4] === testBoard[5] && testBoard[3] !== "") {
			return true;
		} else if (testBoard[6] === testBoard[7] && testBoard[7] === testBoard[8] && testBoard[6] !== "") {
			return true;
		} else if (testBoard[0] === testBoard[3] && testBoard[3] === testBoard[6] && testBoard[0] !== "") {
			return true;
		} else if (testBoard[1] === testBoard[4] && testBoard[4] === testBoard[7] && testBoard[1] !== "") {
			return true;
		} else if (testBoard[2] === testBoard[5] && testBoard[5] === testBoard[8] && testBoard[2] !== "") {
			return true;
		} else if (testBoard[0] === testBoard[4] && testBoard[4] === testBoard[8] && testBoard[0] !== "") {
			return true;
		} else if (testBoard[2] === testBoard[4] && testBoard[4] === testBoard[6] && testBoard[2] !== "") {
			return true;
		} else {
			return false;
		}
	};

	return { getBoard, setBoard, resetBoard, createPlayer, checkWin };
})();

const IAPlayer = (() => {
	const playEasy = (freeCells) => {
		const randomIndex = Math.floor(Math.random() * freeCells.length);
		return randomIndex;
	};

	const playMedium = (board) => {
		// Check for a winning move
		for (let i = 0; i < board.length; i++) {
			if (board[i] === "") {
				// Simulate making the move and check for a win
				board[i] = "O"; // Assuming the computer is playing as "O"
				if (gameBoard.checkWin(board)) {
					board[i] = ""; // Reset the board
					return i; // Return the winning move
				}
				board[i] = ""; // Reset the board
			}
		}

		// Check for a blocking move (preventing the player from winning)
		for (let i = 0; i < board.length; i++) {
			if (board[i] === "") {
				// Simulate making the move and check for a block
				board[i] = "X"; // Assuming the player is "X"
				if (gameBoard.checkWin(board)) {
					board[i] = ""; // Reset the board
					console.log("block, playing ", i);
					return i; // Return the blocking move
				}
				board[i] = ""; // Reset the board
			}
		}

		// Play first free cell if no winning or blocking moves are available
		let index = board.indexOf("");
		return index;
		// const randomIndex = Math.floor(Math.random() * freeCells.length);
		// return randomIndex;
	};
	const playHard = (board) => {
		const randomIndex = Math.floor(Math.random() * freeCells.length);
		freeCells[randomIndex].click();
	};
	const playImpossible = (board) => {
		const randomIndex = Math.floor(Math.random() * freeCells.length);
		freeCells[randomIndex].click();
	};

	return { playEasy, playMedium, playHard, playImpossible };
})();

const gameLogic = (() => {
	const player1 = gameBoard.createPlayer("Player 1", "X");
	const player2 = gameBoard.createPlayer("Player 2", "O");
	let currentPlayer = player1;

	let freeCells = document.querySelectorAll(".cell:not(.occupied)");

	const cellClicked = (cell) => {
		cell.removeEventListener("click", playerClickOnCell);
		cell.textContent = currentPlayer.getMark();
		cell.classList.add("occupied");

		gameBoard.setBoard(cell.dataset.index, currentPlayer.getMark());
	};


	const playerClickOnCell = (e) => {
		const cell = e.target;
		cellClicked(cell);

		// Update freeCells
		freeCells = document.querySelectorAll(".cell:not(.occupied)");

		// Check for win or tie
		if (gameBoard.checkWin()) {
			setTimeout(() => {
				alert(`${currentPlayer.getName()} wins!`);
				initGame();
			}, 500);
		} else if (freeCells.length === 0) {
			setTimeout(() => {
				alert("It's a tie!");
				initGame();
			}, 500);
		} else {
			currentPlayer = currentPlayer === player1 ? player2 : player1;
			document.querySelector("#status").innerHTML = `Current player: ${currentPlayer.getName()}, difficulty: ${difficulty}`;
		}

		// IA Player
		if (currentPlayer === player2) {
			setTimeout(() => {
				if (difficulty == "easy") {
					freeCells[IAPlayer.playEasy(freeCells)].click();
				} else if (difficulty == "medium") {
					console.log("playing medium");
					let cells = document.querySelectorAll(".cell");
					let indexToPlay = IAPlayer.playMedium(gameBoard.getBoard());
					cells[indexToPlay].click();
				} else if (difficulty == "hard") {
					console.log("playing hard");
					let cells = document.querySelectorAll(".cell");
					let indexToPlay = IAPlayer.playMedium(gameBoard.getBoard());
					cells[indexToPlay].click();
				} else if (difficulty == "impossible") {
					console.log("playing impossible");
					let cells = document.querySelectorAll(".cell");
					let indexToPlay = IAPlayer.playImpossible(gameBoard.getBoard());
					cells[indexToPlay].click();
				}
			}, 500);
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
		document.querySelector("#status").innerHTML = `Current player: ${currentPlayer.getName()}, difficulty: ${difficulty}`;
	}

	return { initGame };
})();


gameLogic.initGame();
