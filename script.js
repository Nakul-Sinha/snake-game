const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// Game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let score = 0;
let direction = 'right';
let gameInterval;
let gameSpeed = 150; // milliseconds between each frame

// Load assets
const foodImg = new Image();
foodImg.src = 'assets/food.png';
const snakeHeadImg = new Image();
snakeHeadImg.src = 'assets/snake_head.png';

// Function to generate random coordinates for the food
function generateFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / gridSize)),
        y: Math.floor(Math.random() * (canvas.height / gridSize))
    };

    // Prevent food from spawning on the snake
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === food.x && snake[i].y === food.y) {
            generateFood();
            return;
        }
    }
}

// Function to update the game state
function update() {
    moveSnake();
    if (checkCollision()) {
        gameOver();
        return;
    }
    if (eatFood()) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        generateFood();
        // Increase speed gradually
        if (gameSpeed > 50) {
            gameSpeed -= 2;
            clearInterval(gameInterval);
            gameInterval = setInterval(update, gameSpeed);
        }
    }
    draw();
}

// Function to move the snake
function moveSnake() {
    const head = { ...snake[0] }; // Copy the head

    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head); // Add the new head to the beginning

    if (!eatFood()) {
        snake.pop(); // Remove the tail if no food was eaten
    }
}

// Function to check for collisions with walls or itself
function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
        return true; // Wall collision
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true; // Self collision
        }
    }

    return false;
}

// Function to check if the snake ate the food
function eatFood() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        return true;
    }
    return false;
}

// Function to draw the game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the food
    ctx.drawImage(foodImg, food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Draw the snake
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Draw snake head
            ctx.drawImage(snakeHeadImg, segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        } else {
            ctx.fillStyle = 'green';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        }
    });
}

// Function to handle game over
function gameOver() {
    clearInterval(gameInterval);
    alert(`Game Over! Your score is ${score}`);
    snake = [{ x: 10, y: 10 }];
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    direction = 'right';
    gameSpeed = 150;
    generateFood();
    gameInterval = setInterval(update, gameSpeed);
}

// Event listener for keyboard input
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') {
                direction = 'up';
            }
            break;
        case 'ArrowDown':
            if (direction !== 'up') {
                direction = 'down';
            }
            break;
        case 'ArrowLeft':
            if (direction !== 'right') {
                direction = 'left';
            }
            break;
        case 'ArrowRight':
            if (direction !== 'left') {
                direction = 'right';
            }
            break;
    }
});

// Initialize the game
generateFood();
gameInterval = setInterval(update, gameSpeed);