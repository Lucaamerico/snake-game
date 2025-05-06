const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');

const tileSize = 20;
const tileCount = canvas.width / tileSize;

let snake, food, velocity, score, gameOver, gameRunning;

function initGame() {
  snake = [ { x: 10, y: 10 } ];
  food = { x: 5, y: 5 };
  velocity = { x: 1, y: 0 };
  score = 0;
  gameOver = false;
  gameRunning = true;
  document.getElementById('score').textContent = 'Score: 0';
  document.getElementById('gameOver').style.display = 'none';
  placeFood();
  drawGame();
}

function drawRect(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}

function drawGame() {
  if (gameOver || !gameRunning) return;

  update();
  draw();
  setTimeout(drawGame, 100);
}

function update() {
  const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    return endGame();
  }

  for (let segment of snake) {
    if (segment.x === head.x && segment.y === head.y) {
      return endGame();
    }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').textContent = 'Score: ' + score;
    placeFood();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawRect(food.x, food.y, 'red');
  snake.forEach((seg, i) => drawRect(seg.x, seg.y, i === 0 ? 'green' : 'lime'));
}

function placeFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
  for (let segment of snake) {
    if (segment.x === food.x && segment.y === food.y) {
      return placeFood();
    }
  }
}

function endGame() {
  gameOver = true;
  gameRunning = false;
  document.getElementById('gameOver').style.display = 'block';
}

document.addEventListener('keydown', e => {
  if (gameOver && e.key.toLowerCase() === 'r') {
    initGame();
  }

  if (!gameRunning) return;

  if (e.key === 'ArrowUp' && velocity.y === 0) {
    velocity = { x: 0, y: -1 };
  } else if (e.key === 'ArrowDown' && velocity.y === 0) {
    velocity = { x: 0, y: 1 };
  } else if (e.key === 'ArrowLeft' && velocity.x === 0) {
    velocity = { x: -1, y: 0 };
  } else if (e.key === 'ArrowRight' && velocity.x === 0) {
    velocity = { x: 1, y: 0 };
  }
});

startBtn.addEventListener('click', () => {
  startBtn.style.display = 'none';
  initGame();
});
