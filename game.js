const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const restartButton = document.getElementById('restart-btn');

const snakeHead = new Image();
snakeHead.src = 'snake-head.svg';

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
    { x: 10, y: 10 }
];
let food = generateFood();
let dx = 0;
let dy = 0;
let score = 0;
let gameLoop;
let gameStarted = false;
const gameSpeed = 200; // Controls snake speed (milliseconds)

function generateFood() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
}

function drawSnake() {
    // Draw body segments with rounded rectangles
    for (let i = 1; i < snake.length; i++) {
        const x = snake[i].x * gridSize;
        const y = snake[i].y * gridSize;

        // Create gradient for snake body
        const gradient = ctx.createLinearGradient(x, y, x + gridSize, y + gridSize);
        gradient.addColorStop(0, '#6e8900');
        gradient.addColorStop(1, '#cdff00');

        // Draw rounded rectangle with shadow
        ctx.beginPath();
        ctx.roundRect(x, y, gridSize, gridSize, 5);
        ctx.fillStyle = gradient;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 3;
        ctx.fill();
    }
    
    // Draw head with enhanced rotation and scaling
    const head = snake[0];
    ctx.save();
    ctx.translate(head.x * gridSize + gridSize/2, head.y * gridSize + gridSize/2);
    
    // Set rotation based on movement direction
    if (dx === 1) ctx.rotate(0);
    else if (dx === -1) ctx.rotate(Math.PI);
    else if (dy === -1) ctx.rotate(-Math.PI/2);
    else if (dy === 1) ctx.rotate(Math.PI/2);
    
    // Add shadow to head
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;
    
    ctx.drawImage(snakeHead, -gridSize/2, -gridSize/2, gridSize, gridSize);
    ctx.restore();
}

function drawFood() {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = `Score: ${score}`;
        food = generateFood();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        return true;
    }

    // Self collision
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

function gameOver() {
    clearInterval(gameLoop);
    gameOverElement.style.display = 'block';
}

function update() {
    if (checkCollision()) {
        gameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    drawFood();
    drawSnake();
}

function startGame() {
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = 'Score: 0';
    gameOverElement.style.display = 'none';
    gameStarted = false;
}

document.addEventListener('keydown', (event) => {
    if (!gameStarted && (event.key === 'ArrowUp' || event.key === 'ArrowDown' || 
        event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        gameStarted = true;
        gameLoop = setInterval(update, gameSpeed);
    }

    switch (event.key) {
        case 'ArrowUp':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

restartButton.addEventListener('click', () => {
    startGame();
    gameLoop = setInterval(update, gameSpeed);
});

startGame();