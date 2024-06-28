document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const restartBtn = document.getElementById('restartBtn');
    const startBtn = document.getElementById('startBtn');
    const inputSection = document.querySelector('.input-section');
    const gameElements = document.getElementById('gameElements');
    const player1Input = document.getElementById('player1');
    const player1NameDisplay = document.getElementById('player1Name');
    const player2NameDisplay = document.getElementById('player2Name');
    const player1ScoreDisplay = document.getElementById('player1Score');
    const player2ScoreDisplay = document.getElementById('player2Score');
    const totalGamesDisplay = document.getElementById('totalGames');

    let gameState = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'O';
    let gameActive = true;
    let player1Score = 0;
    let player2Score = 0;
    let totalGames = 0;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const handleCellPlayed = (clickedCell, clickedCellIndex) => {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
    };

    const handleResultValidation = () => {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            let a = gameState[winCondition[0]];
            let b = gameState[winCondition[1]];
            let c = gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            statusDisplay.innerHTML = `Player ${currentPlayer === 'O' ? player1Input.value : 'AI'} wins!`;
            gameActive = false;
            if (currentPlayer === 'O') {
                player1Score++;
                player1ScoreDisplay.innerHTML = player1Score;
            } else {
                player2Score++;
                player2ScoreDisplay.innerHTML = player2Score;
            }
            totalGames++;
            totalGamesDisplay.innerHTML = totalGames;
            return;
        }

        let roundDraw = !gameState.includes('');
        if (roundDraw) {
            statusDisplay.innerHTML = `It's a draw!`;
            gameActive = false;
            totalGames++;
            totalGamesDisplay.innerHTML = totalGames;
            return;
        }

        currentPlayer = currentPlayer === 'O' ? 'X' : 'O';
        statusDisplay.innerHTML = currentPlayer === 'O' ? `${player1Input.value}'s Turn` : `AI's Turn`;
        if (currentPlayer === 'X' && gameActive) {
            setTimeout(makeAIMove, 500);
        }
    };

    const handleCellClick = (clickedCellEvent) => {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== '' || !gameActive || currentPlayer === 'X') {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    };

    const handleRestartGame = () => {
        gameActive = true;
        currentPlayer = 'O';
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusDisplay.innerHTML = `${player1Input.value}'s Turn`;
        cells.forEach(cell => cell.innerHTML = '');
    };

    const makeAIMove = () => {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < 9; i++) {
            if (gameState[i] === '') {
                gameState[i] = 'X';
                let score = minimax(gameState, 0, false);
                gameState[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        gameState[move] = 'X';
        cells[move].innerHTML = 'X';
        handleResultValidation();
    };

    const minimax = (board, depth, isMaximizing) => {
        const scores = {
            X: 1,
            O: -1,
            tie: 0
        };

        let result = checkWinner();
        if (result !== null) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };
    const handleHomeRedirect = () => {
        window.location.href = 'home.html'; 
    };



    const checkWinner = () => {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return gameState[a];
            }
        }

        if (!gameState.includes('')) {
            return 'tie';
        }

        return null;
    };

    startBtn.addEventListener('click', () => {
        if (player1Input.value) {
            gameElements.style.display = 'block';
            inputSection.style.display = 'none';
            player1NameDisplay.innerHTML = player1Input.value + ' (O)';
            player2NameDisplay.innerHTML = 'AI (X)';
            statusDisplay.innerHTML = `${player1Input.value}'s Turn`;
        } else {
            alert('Please enter your name.');
        }
    });

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartBtn.addEventListener('click', handleRestartGame);
    homeBtn.addEventListener('click', handleHomeRedirect);
});
